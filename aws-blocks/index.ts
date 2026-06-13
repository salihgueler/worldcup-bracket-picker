/**
 * Backend — aws-blocks/index.ts
 *
 * This file defines your API, auth, data model, and real-time channels.
 * The frontend imports these exports directly via `import { ... } from 'aws-blocks'`.
 *
 * ─── IMPORTANT ───────────────────────────────────────────────────────────────
 * Do NOT use local files, in-memory arrays, or local databases for persistence.
 * Use Building Blocks for cloud persistence and other common cloud abstractions.
 * They work locally with automatic mocks and deploy to AWS with zero configuration.
 *
 * For the full list of blocks and how to use them, see:
 *   node_modules/@aws-blocks/blocks/README.md
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  ApiNamespace,
  Scope,
  AuthBasic,
  DistributedTable,
  KVStore,
  Realtime,
  Agent,
  BedrockModels,
  OllamaModels,
  CronJob,
} from "@aws-blocks/blocks";
import { z } from "zod";
import { SEED_TEAMS, SEED_MATCHES } from "./seed-data.js";
import { POINTS } from "../src/data/bracketConstants.js";

const scope = new Scope("my-app");

// ─── Auth ────────────────────────────────────────────────────────────────────
const auth = new AuthBasic(scope, "auth", {
  passwordPolicy: { minLength: 8 },
  crossDomain: process.env.BLOCKS_SANDBOX === "true",
});
export const authApi = auth.createApi();

// ─── Data ────────────────────────────────────────────────────────────────────
// Teams — shared tournament reference data. Partition key `type` keeps all
// teams in one logical collection; `byGroup` enables per-group lookups.
const teamSchema = z.object({
  teamId: z.string(),
  type: z.string(),
  name: z.string(),
  group: z.string(),
  fifaRanking: z.number(),
  confederation: z.string(),
  flagEmoji: z.string(),
  roster: z.string().optional(), // optional JSON-encoded roster
});

const teams = new DistributedTable(scope, "teams", {
  schema: teamSchema,
  key: { partitionKey: "type", sortKey: "teamId" },
  indexes: {
    byGroup: { partitionKey: "group", sortKey: "teamId" },
  },
});

// Matches — group-stage + knockout fixtures. Partition key `matchType`;
// `byStage` enables querying a single round (group, round32, …, final).
const matchSchema = z.object({
  matchId: z.string(),
  matchType: z.string(),
  stage: z.string(),
  team1Id: z.string(),
  team2Id: z.string(),
  scheduledDate: z.string(),
  result: z.string().optional(),
  score: z.string().optional(),
});

const matches = new DistributedTable(scope, "matches", {
  schema: matchSchema,
  key: { partitionKey: "matchType", sortKey: "matchId" },
  indexes: {
    byStage: { partitionKey: "stage", sortKey: "matchId" },
  },
});

// Picks — a user's predicted winner for a given match. Partition key
// `oddsType` (constant "PICK") keeps all picks in one logical collection;
// `oddsId` = `${userId}#${matchId}` makes each user/match pick unique so
// re-picking the same match overwrites in place. The two secondary indexes
// support the two read patterns: a user's whole bracket, and every pick for
// a single match.
const PICK_TYPE = "PICK";
const pickSchema = z.object({
  oddsType: z.string(), // partition key — constant "PICK"
  oddsId: z.string(), // sort key — `${userId}#${matchId}`
  userId: z.string(),
  matchId: z.string(),
  predictedWinner: z.string(),
  confidence: z.number().optional(),
  createdAt: z.number(),
});

const picks = new DistributedTable(scope, "picks", {
  schema: pickSchema,
  key: { partitionKey: "oddsType", sortKey: "oddsId" },
  indexes: {
    // All of a user's picks, sorted by match.
    byUser: { partitionKey: "userId", sortKey: "matchId" },
    // Everyone's picks for a single match (used for live odds / leaderboard).
    byMatch: { partitionKey: "matchId", sortKey: "userId" },
  },
});

// ─── Key-Value State ───────────────────────────────────────────────────────
// Per-user bracket lock flag. Once locked, picks can no longer change.
const lockStore = new KVStore<boolean>(scope, "bracket-lock");

// Cached leaderboard standings. Computing standings scans every pick, so the
// result is cached here and served until invalidated by a new pick.
const leaderboardSchema = z.array(
  z.object({
    userId: z.string(),
    score: z.number(),
    picks: z.number(),
  }),
);
const leaderboardCache = new KVStore(scope, "leaderboard-cache", {
  schema: leaderboardSchema,
});
const LEADERBOARD_KEY = "standings";

// One persistent predictor conversation per user, so the AI chat keeps
// multi-turn context across messages. Maps username → conversationId.
const predictorConversations = new KVStore<string>(scope, "predictor-chat");

const lockKey = (userId: string) => `lock:${userId}`;
const pickId = (userId: string, matchId: string) => `${userId}#${matchId}`;
const chatKey = (userId: string) => `chat:${userId}`;

/** Write items in DynamoDB-sized batches (25 per request). */
async function seedInBatches<I>(
  put: (items: I[]) => Promise<void>,
  items: I[],
) {
  const BATCH = 25;
  for (let i = 0; i < items.length; i += BATCH) {
    await put(items.slice(i, i + BATCH));
  }
}

// ─── Result Sync + Leaderboard Scoring ───────────────────────────────────────
// Public feed of FIFA World Cup 2026 fixtures and results (openfootball).
// Scores appear on a match once it's played; unplayed matches omit `score`.
const WORLDCUP_JSON_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/refs/heads/master/2026/worldcup.json";

// Shape of the bits of the feed we read. The feed has more fields; we only
// need the two team names, the date, and the full-time score.
interface FeedMatch {
  date?: string;
  team1?: string;
  team2?: string;
  score?: { ft?: [number, number]; ht?: [number, number] };
}

/** Unordered key for matching a fixture: `date|sortedTeamIds`. */
const matchKey = (date: string, a: string, b: string) =>
  `${date}|${[a, b].sort().join("-")}`;

/**
 * Turn a full-time score into our stored `{ result, score }`. `result` is the
 * winning teamId, or "DRAW" when level. `score` is `"home-away"`.
 */
function deriveResult(team1Id: string, team2Id: string, ft: [number, number]) {
  const [a, b] = ft;
  const result = a > b ? team1Id : b > a ? team2Id : "DRAW";
  return { result, score: `${a}-${b}` };
}

interface FinishedFeedMatch {
  id1: string;
  id2: string;
  ft: [number, number];
  date: string;
}

/**
 * Fetch the public results feed and return every finished fixture mapped to our
 * teamIds. Team names in the feed are resolved via the teams table; the feed
 * mostly uses full names ("Mexico") but occasionally a code ("USA"), so we
 * index both the name and the teamId (teamIds are unique, so this can't
 * collide). Network/HTTP failures are logged and yield an empty list rather
 * than throwing, so callers degrade gracefully.
 */
async function fetchFinishedFeedMatches(): Promise<FinishedFeedMatch[]> {
  const allTeams = await Array.fromAsync(
    teams.query({ where: { type: { equals: "TEAM" } } }),
  );
  const idByName = new Map<string, string>();
  for (const t of allTeams) {
    idByName.set(t.name.trim().toLowerCase(), t.teamId);
    idByName.set(t.teamId.trim().toLowerCase(), t.teamId);
  }

  const out: FinishedFeedMatch[] = [];
  try {
    const res = await fetch(WORLDCUP_JSON_URL);
    if (!res.ok) {
      console.warn(`[results-sync] feed fetch failed: HTTP ${res.status}`);
      return out;
    }
    const feed = (await res.json()) as { matches?: FeedMatch[] };
    for (const m of feed.matches ?? []) {
      const ft = m.score?.ft;
      if (!ft || !m.date || !m.team1 || !m.team2) continue;
      const id1 = idByName.get(m.team1.trim().toLowerCase());
      const id2 = idByName.get(m.team2.trim().toLowerCase());
      if (!id1 || !id2) continue;
      out.push({ id1, id2, ft, date: m.date });
    }
  } catch (err) {
    // Network failures shouldn't crash callers — return what we have.
    console.warn(`[results-sync] could not load feed:`, err);
  }
  return out;
}

/**
 * Fetch the public results feed and update any of our matches that are past
 * their scheduledDate but still have no result. Matches that are past with no
 * result are logged. Returns a summary of what was checked/updated.
 */
async function syncMatchResultsFromFeed() {
  // Lookup of finished fixtures from the feed, keyed by date + teams.
  const feedResults = new Map<string, FinishedFeedMatch>();
  for (const m of await fetchFinishedFeedMatches()) {
    feedResults.set(matchKey(m.date, m.id1, m.id2), m);
  }

  const allMatches = await Array.fromAsync(
    matches.query({ where: { matchType: { equals: "MATCH" } } }),
  );
  const now = Date.now();
  const pending: string[] = [];
  let updated = 0;

  for (const match of allMatches) {
    if (match.result) continue; // already resolved
    const scheduled = Date.parse(match.scheduledDate);
    const isPast = !Number.isNaN(scheduled) && scheduled < now;
    if (!isPast) continue;

    // Past its scheduled date with no result yet — flag it.
    pending.push(match.matchId);
    console.log(
      `[results-sync] pending: ${match.matchId} (${match.team1Id} vs ${match.team2Id}) ` +
        `scheduled ${match.scheduledDate} has no result`,
    );

    const feedMatch = feedResults.get(
      matchKey(match.scheduledDate, match.team1Id, match.team2Id),
    );
    if (!feedMatch) continue;

    const { result, score } = deriveResult(
      match.team1Id,
      match.team2Id,
      feedMatch.ft,
    );
    await matches.put({ ...match, result, score });
    updated++;
    console.log(
      `[results-sync] resolved ${match.matchId} → ${result} (${score})`,
    );
  }

  return { checked: allMatches.length, pending: pending.length, updated };
}

/**
 * Points awarded for correctly predicting the winner of a match at a given
 * stage. Mirrors the published Points System (see README + the frontend
 * `POINTS` table) so backend standings match what users see in the UI.
 */
function pointsForStage(stage: string): number {
  switch (stage) {
    case "group":
      return POINTS.GROUP_QUALIFIER;
    case "round32":
      return POINTS.R32_WINNER;
    case "round16":
      return POINTS.R16_WINNER;
    case "quarter":
      return POINTS.QF_WINNER;
    case "semi":
      return POINTS.SF_WINNER;
    case "third":
      return POINTS.THIRD_PLACE;
    case "final":
      return POINTS.FINAL_WINNER;
    default:
      return 0;
  }
}

/**
 * Score every user's picks against the actual match results currently stored
 * in the matches table. A correctly predicted winner earns stage-weighted
 * points (see {@link pointsForStage}). Returns standings sorted by score
 * (highest first), tie-broken by number of picks.
 */
async function computeLeaderboard() {
  const allMatches = await Array.fromAsync(
    matches.query({ where: { matchType: { equals: "MATCH" } } }),
  );
  const resolved = new Map<string, { result: string; stage: string }>();
  for (const m of allMatches) {
    if (m.result) resolved.set(m.matchId, { result: m.result, stage: m.stage });
  }

  const allPicks = await Array.fromAsync(
    picks.query({ where: { oddsType: { equals: PICK_TYPE } } }),
  );
  const byUser = new Map<string, { score: number; picks: number }>();
  for (const p of allPicks) {
    const entry = byUser.get(p.userId) ?? { score: 0, picks: 0 };
    entry.picks += 1;
    const actual = resolved.get(p.matchId);
    if (actual && actual.result === p.predictedWinner) {
      entry.score += pointsForStage(actual.stage);
    }
    byUser.set(p.userId, entry);
  }

  return [...byUser.entries()]
    .map(([userId, v]) => ({ userId, score: v.score, picks: v.picks }))
    .sort((a, b) => b.score - a.score || b.picks - a.picks);
}

/** Recompute standings and refresh the cache. Returns the fresh standings. */
async function refreshLeaderboard() {
  await leaderboardCache.delete(LEADERBOARD_KEY);
  const standings = await computeLeaderboard();
  await leaderboardCache.put(LEADERBOARD_KEY, standings);
  return standings;
}

// ─── AI Predictor Agent ──────────────────────────────────────────────────────
// Conversational agent that answers questions about teams and predicts match
// outcomes. Deployed it runs on Bedrock Claude Sonnet; locally it uses Ollama
// (llama3.1:8b), falling back to the canned provider when Ollama isn't running.
// Tools give it read access to the tournament tables so answers are grounded in
// real data rather than the model's training set.
const predictor = new Agent(scope, "predictor", {
  model: {
    deployed: BedrockModels.BALANCED, // Claude Sonnet on Amazon Bedrock
    local: OllamaModels.SMALL, // llama3.1:8b via local Ollama
  },
  systemPrompt: [
    "You are the official AI predictor for FIFA World Cup 2026, the tournament",
    "co-hosted by the USA, Canada, and Mexico with 48 teams.",
    "",
    "You help fans understand the teams and forecast match outcomes. Always",
    "ground your answers in real data by calling your tools:",
    "- lookupTeam to fetch a team's group, FIFA ranking, and confederation",
    "- getTeamSquad to inspect a team's player roster",
    "- getMatchConsensus to see how the community has picked a given match",
    "- getUserBracket to review the current user's own predictions",
    "- getMatchResult to fetch the ACTUAL outcome of a match that has been played",
    "",
    "When the user asks what happened or who won a specific match, call",
    "getMatchResult and report the real result. Treat its result as fact — if",
    "it says a match was played, do NOT claim the match hasn't happened. Only",
    "say a match hasn't been played when getMatchResult reports played: false.",
    "",
    "When predicting a match, weigh FIFA rankings, squad strength, and the",
    "community consensus. State a predicted winner, a plausible scoreline, and a",
    "concise rationale. Be confident but honest about uncertainty — these are",
    "predictions, not guarantees. Keep responses friendly and focused on the",
    "World Cup.",
  ].join("\n"),
  // Carry the authenticated username into tools so getUserBracket can scope to
  // the caller. Validated on every stream() call.
  toolContextSchema: z.object({ userId: z.string() }),
  tools: (tool) => ({
    lookupTeam: tool({
      description:
        "Look up a single team's details (group, FIFA ranking, confederation, " +
        "flag) by its teamId. If no team matches the id, falls back to a " +
        "case-insensitive search by team name.",
      parameters: z.object({
        teamId: z
          .string()
          .describe(
            "The team's id (e.g. 'BRA') or its full name (e.g. 'Brazil')",
          ),
      }),
      needsApproval: false,
      handler: async ({ input }) => {
        const toJson = (t: {
          teamId: string;
          name: string;
          group: string;
          fifaRanking: number;
          confederation: string;
          flagEmoji: string;
        }) => ({
          teamId: t.teamId,
          name: t.name,
          group: t.group,
          fifaRanking: t.fifaRanking,
          confederation: t.confederation,
          flagEmoji: t.flagEmoji,
        });
        const direct = await teams.get({ type: "TEAM", teamId: input.teamId });
        if (direct) return toJson(direct);
        const all = await Array.fromAsync(
          teams.query({ where: { type: { equals: "TEAM" } } }),
        );
        const needle = input.teamId.trim().toLowerCase();
        const match = all.find(
          (t) =>
            t.name.toLowerCase() === needle ||
            t.name.toLowerCase().includes(needle) ||
            t.teamId.toLowerCase() === needle,
        );
        return match
          ? toJson(match)
          : { error: `No team found matching "${input.teamId}"` };
      },
    }),

    getTeamSquad: tool({
      description:
        "Get a team's player squad/roster. Looks up the team and parses its " +
        "roster JSON field. Use this to answer questions about specific players.",
      parameters: z.object({
        teamId: z.string().describe("The team's id (e.g. 'ARG')"),
      }),
      needsApproval: false,
      handler: async ({ input }) => {
        const team = await teams.get({ type: "TEAM", teamId: input.teamId });
        if (!team) {
          return {
            teamId: input.teamId,
            name: null,
            players: [] as any[],
            note: `No team found with id "${input.teamId}".`,
          };
        }
        // JSON.parse yields `any`, which the agent serializes as-is.
        let players: any[] = [];
        let note = "";
        if (!team.roster) {
          note = "No roster data is available for this team yet.";
        } else {
          try {
            players = JSON.parse(team.roster);
          } catch {
            note = "Roster data is present but could not be parsed.";
          }
        }
        return { teamId: team.teamId, name: team.name, players, note };
      },
    }),

    getMatchConsensus: tool({
      description:
        "Show how the community has predicted a given match: the distribution " +
        "of predicted winners across all users' picks for that matchId.",
      parameters: z.object({
        matchId: z.string().describe("The match id to summarize picks for"),
      }),
      needsApproval: false,
      handler: async ({ input }) => {
        const matchPicks = await Array.fromAsync(
          picks.query({
            index: "byMatch",
            where: { matchId: { equals: input.matchId } },
          }),
        );
        const counts: Record<string, number> = {};
        for (const p of matchPicks) {
          counts[p.predictedWinner] = (counts[p.predictedWinner] ?? 0) + 1;
        }
        const total = matchPicks.length;
        const distribution = Object.entries(counts)
          .map(([teamId, count]) => ({
            teamId,
            count,
            percentage: total ? Math.round((count / total) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count);
        return { matchId: input.matchId, totalPicks: total, distribution };
      },
    }),

    getUserBracket: tool({
      description:
        "Get the current user's own bracket — all of the picks they have made " +
        "so far, with their predicted winner for each match.",
      parameters: z.object({}),
      needsApproval: false,
      handler: async ({ context: toolContext }) => {
        const myPicks = await Array.fromAsync(
          picks.query({
            index: "byUser",
            where: { userId: { equals: toolContext.userId } },
          }),
        );
        return {
          userId: toolContext.userId,
          totalPicks: myPicks.length,
          picks: myPicks.map((p) => ({
            matchId: p.matchId,
            predictedWinner: p.predictedWinner,
            confidence: p.confidence ?? null,
          })),
        };
      },
    }),

    getMatchResult: tool({
      description:
        "Get the ACTUAL result (winner and final score) of a match that has " +
        "already been played. Provide the two teams by id or name (e.g. 'TUR' " +
        "and 'AUS', or 'Turkey' and 'Australia'). Use this whenever the user " +
        "asks what happened or who won a specific match — these are real " +
        "results, not predictions. Returns the stored result, falling back to " +
        "the live results feed if the match hasn't been synced yet.",
      parameters: z.object({
        team1: z
          .string()
          .describe("First team — id (e.g. 'TUR') or name (e.g. 'Turkey')"),
        team2: z
          .string()
          .describe("Second team — id (e.g. 'AUS') or name (e.g. 'Australia')"),
      }),
      needsApproval: false,
      handler: async ({
        input,
      }): Promise<
        | { error: string }
        | {
            team1: { teamId: string; name: string };
            team2: { teamId: string; name: string };
            played: boolean;
            score?: string;
            outcome?: "draw" | { winnerId: string; winnerName: string };
            note?: string;
          }
      > => {
        const allTeams = await Array.fromAsync(
          teams.query({ where: { type: { equals: "TEAM" } } }),
        );
        const nameById = new Map(allTeams.map((t) => [t.teamId, t.name]));
        const resolve = (q: string) => {
          const needle = q.trim().toLowerCase();
          return allTeams.find(
            (t) =>
              t.teamId.toLowerCase() === needle ||
              t.name.toLowerCase() === needle ||
              t.name.toLowerCase().includes(needle),
          );
        };
        const t1 = resolve(input.team1);
        const t2 = resolve(input.team2);
        if (!t1 || !t2) {
          return {
            error: `Could not identify ${!t1 ? `"${input.team1}"` : `"${input.team2}"`} as a team.`,
          };
        }

        const pairKey = [t1.teamId, t2.teamId].sort().join("-");
        const describe = (result: string, score: string) => ({
          team1: { teamId: t1.teamId, name: t1.name },
          team2: { teamId: t2.teamId, name: t2.name },
          played: true,
          score,
          outcome:
            result === "DRAW"
              ? ("draw" as const)
              : {
                  winnerId: result,
                  winnerName: nameById.get(result) ?? result,
                },
        });

        // Prefer a result already stored on the match.
        const allMatches = await Array.fromAsync(
          matches.query({ where: { matchType: { equals: "MATCH" } } }),
        );
        const stored = allMatches.find(
          (m) =>
            m.result &&
            m.score &&
            [m.team1Id, m.team2Id].sort().join("-") === pairKey,
        );
        if (stored?.result && stored.score) {
          return describe(stored.result, stored.score);
        }

        // Not synced yet — check the live feed directly.
        const feedMatch = (await fetchFinishedFeedMatches()).find(
          (f) => [f.id1, f.id2].sort().join("-") === pairKey,
        );
        if (feedMatch) {
          const { result, score } = deriveResult(
            feedMatch.id1,
            feedMatch.id2,
            feedMatch.ft,
          );
          return describe(result, score);
        }

        return {
          team1: { teamId: t1.teamId, name: t1.name },
          team2: { teamId: t2.teamId, name: t2.name },
          played: false,
          note: `No result is available yet for ${t1.name} vs ${t2.name}.`,
        };
      },
    }),
  }),
});

// ─── Realtime ────────────────────────────────────────────────────────────────
// A single global "all" channel carries every user's picks so the live feed
// shows the whole tournament's activity in real time.
const PICKS_CHANNEL = "all";
const rt = new Realtime(scope, "live", {
  namespaces: {
    // Broadcast each pick as it happens: who picked which winner for which match.
    picks: Realtime.namespace(
      z.object({
        userId: z.string(),
        username: z.string(),
        matchId: z.string(),
        predictedWinner: z.string(),
      }),
    ),
  },
});

// ─── Scheduled Result Sync ─────────────────────────────────────────────────
// Every hour, pull the public results feed, fill in results for any match that
// has kicked off, then invalidate and rebuild the cached leaderboard so
// standings reflect the latest outcomes. Idempotent: matches that already have
// a result are skipped, and a fresh standings snapshot is always recomputed.
new CronJob(scope, "results-sync", {
  schedule: "rate(1 hour)",
  description:
    "Check the World Cup results feed for finished matches, update match " +
    "results, and refresh the leaderboard.",
  handler: async (event) => {
    console.log(`[results-sync] triggered at ${event.scheduledTime}`);
    const summary = await syncMatchResultsFromFeed();
    const standings = await refreshLeaderboard();
    console.log(
      `[results-sync] done — checked ${summary.checked}, pending ${summary.pending}, ` +
        `updated ${summary.updated}; leaderboard has ${standings.length} entries`,
    );
  },
});

// ─── API ─────────────────────────────────────────────────────────────────────
export const api = new ApiNamespace(scope, "api", (context) => ({
  /**
   * Idempotently seed tournament reference data. On first run (no teams
   * present) it writes all 48 teams and every match from the static
   * seed-data. Subsequent calls are no-ops. Call once after login.
   */
  async ensureSeeded() {
    await auth.requireAuth(context);
    const existing = await Array.fromAsync(
      teams.query({ where: { type: { equals: "TEAM" } }, limit: 1 }),
    );
    if (existing.length > 0) {
      // Teams already seeded. An earlier version seeded them without squads,
      // so backfill rosters if they're missing (putBatch upserts in place).
      if (!existing[0].roster) {
        await seedInBatches((items) => teams.putBatch(items), SEED_TEAMS);
        return { seeded: false, teams: SEED_TEAMS.length, matches: 0 };
      }
      return { seeded: false, teams: 0, matches: 0 };
    }
    await seedInBatches((items) => teams.putBatch(items), SEED_TEAMS);
    await seedInBatches((items) => matches.putBatch(items), SEED_MATCHES);
    return {
      seeded: true,
      teams: SEED_TEAMS.length,
      matches: SEED_MATCHES.length,
    };
  },

  /** List all teams, or just one group via the `byGroup` index. */
  async listTeams(group?: string) {
    await auth.requireAuth(context);
    if (group) {
      return await Array.fromAsync(
        teams.query({ index: "byGroup", where: { group: { equals: group } } }),
      );
    }
    return await Array.fromAsync(
      teams.query({ where: { type: { equals: "TEAM" } } }),
    );
  },

  /** List all matches, or just one stage via the `byStage` index. */
  async listMatches(stage?: string) {
    await auth.requireAuth(context);
    if (stage) {
      return await Array.fromAsync(
        matches.query({
          index: "byStage",
          where: { stage: { equals: stage } },
        }),
      );
    }
    return await Array.fromAsync(
      matches.query({ where: { matchType: { equals: "MATCH" } } }),
    );
  },

  // ─── AI Predictor ──────────────────────────────────────────────────────────

  /**
   * Chat with the AI predictor. Keeps one persistent conversation per user so
   * follow-up questions retain context. The agent may call its tools to ground
   * answers in real team/pick data. Returns the assistant's full reply.
   */
  async chatWithPredictor(message: string) {
    const user = await auth.requireAuth(context);
    let conversationId = await predictorConversations.get(
      chatKey(user.username),
    );
    if (!conversationId) {
      conversationId = await predictor.createConversationId(user.username);
      await predictorConversations.put(chatKey(user.username), conversationId);
    }
    const result = await predictor.stream(message, {
      conversationId,
      userId: user.username,
      context: { userId: user.username },
    });
    const done = await result.complete();
    return { conversationId, reply: done.text ?? "" };
  },

  /**
   * One-shot match prediction between two teams. Runs in its own throwaway
   * conversation so it doesn't pollute the user's ongoing chat history. The
   * agent looks up both teams and the community consensus before answering.
   */
  async predictMatch(team1Id: string, team2Id: string) {
    const user = await auth.requireAuth(context);
    const conversationId = await predictor.createConversationId(user.username);
    const prompt =
      `Predict the outcome of a FIFA World Cup 2026 match between team ` +
      `"${team1Id}" and team "${team2Id}". Look up both teams (and the ` +
      `community consensus if picks exist) before answering. Provide a ` +
      `predicted winner, a likely scoreline, and a short rationale.`;
    const result = await predictor.stream(prompt, {
      conversationId,
      userId: user.username,
      context: { userId: user.username },
    });
    const done = await result.complete();
    return { team1Id, team2Id, prediction: done.text ?? "" };
  },

  /**
   * Save the current user's predicted winner for a match. Upserts: re-picking
   * the same match overwrites the previous choice. Rejected once the user's
   * bracket is locked. Invalidates the cached leaderboard.
   */
  async makePick(
    matchId: string,
    predictedWinner: string,
    confidence?: number,
  ) {
    const user = await auth.requireAuth(context);
    if (await lockStore.get(lockKey(user.username))) {
      throw new Error("Bracket is locked — picks can no longer be changed");
    }
    const existing = await picks.get({
      oddsType: PICK_TYPE,
      oddsId: pickId(user.username, matchId),
    });
    const pick = {
      oddsType: PICK_TYPE,
      oddsId: pickId(user.username, matchId),
      userId: user.username,
      matchId,
      predictedWinner,
      confidence,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    await picks.put(pick);
    await leaderboardCache.delete(LEADERBOARD_KEY);
    // Broadcast to the live feed so other connected users see this pick instantly.
    await rt.publish("picks", PICKS_CHANNEL, {
      userId: user.userId,
      username: user.username,
      matchId,
      predictedWinner,
    });
    return pick;
  },

  /**
   * Channel handle for the global picks live feed. Returned to the frontend so
   * it can subscribe and render picks as they happen across all users.
   */
  async getPicksChannel() {
    await auth.requireAuth(context);
    return rt.getChannel("picks", PICKS_CHANNEL);
  },

  /** All of the current user's picks, sorted by match. */
  async getMyPicks() {
    const user = await auth.requireAuth(context);
    return await Array.fromAsync(
      picks.query({
        index: "byUser",
        where: { userId: { equals: user.username } },
      }),
    );
  },

  /** Every user's pick for a single match (for live odds / standings). */
  async getPicksForMatch(matchId: string) {
    await auth.requireAuth(context);
    return await Array.fromAsync(
      picks.query({
        index: "byMatch",
        where: { matchId: { equals: matchId } },
      }),
    );
  },

  // ─── Bracket Lock ──────────────────────────────────────────────────────────

  /** Lock the current user's bracket so picks can no longer be changed. */
  async lockBracket() {
    const user = await auth.requireAuth(context);
    await lockStore.put(lockKey(user.username), true);
    return { locked: true };
  },

  /** Whether the current user's bracket is locked. */
  async isLocked() {
    const user = await auth.requireAuth(context);
    return { locked: (await lockStore.get(lockKey(user.username))) === true };
  },

  // ─── Leaderboard Cache ─────────────────────────────────────────────────────

  /** Read the cached leaderboard standings, or null if not yet computed. */
  async getCachedLeaderboard() {
    await auth.requireAuth(context);
    return await leaderboardCache.get(LEADERBOARD_KEY);
  },

  /** Store computed leaderboard standings in the cache. */
  async cacheLeaderboard(
    standings: { userId: string; score: number; picks: number }[],
  ) {
    await auth.requireAuth(context);
    await leaderboardCache.put(LEADERBOARD_KEY, standings);
    return { cached: standings.length };
  },

  /**
   * Scored leaderboard: every user's picks measured against the actual match
   * results, one point per correctly predicted winner. Served from cache when
   * available; otherwise computed and cached. Sorted highest score first.
   */
  async getLeaderboard() {
    await auth.requireAuth(context);
    const cached = await leaderboardCache.get(LEADERBOARD_KEY);
    if (cached) return cached;
    const standings = await computeLeaderboard();
    await leaderboardCache.put(LEADERBOARD_KEY, standings);
    return standings;
  },

  /**
   * Manually record a match result. `result` is the winning teamId (or "DRAW")
   * and `score` is a `"home-away"` string. Updates the match in place and
   * refreshes the cached leaderboard so standings reflect the new result.
   */
  async updateMatchResult(matchId: string, result: string, score: string) {
    await auth.requireAuth(context);
    const match = await matches.get({ matchType: "MATCH", matchId });
    if (!match) throw new Error(`Match not found: ${matchId}`);
    await matches.put({ ...match, result, score });
    const standings = await refreshLeaderboard();
    return { matchId, result, score, leaderboard: standings.length };
  },

  /**
   * Run the results sync on demand — the same work the hourly CronJob does:
   * pull the public feed, fill in results for matches that have kicked off,
   * then rebuild the leaderboard. Returns a summary plus the fresh standings
   * so the caller can refresh its view immediately.
   */
  async syncResultsNow() {
    await auth.requireAuth(context);
    const summary = await syncMatchResultsFromFeed();
    const standings = await refreshLeaderboard();
    return { ...summary, leaderboard: standings };
  },
}));
