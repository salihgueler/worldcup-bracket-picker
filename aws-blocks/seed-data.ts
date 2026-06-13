/**
 * Static seed data for the teams and matches tables.
 *
 * Shapes the canonical World Cup 2026 data (single source of truth in
 * `src/data/worldcup2026.ts`) into the record format expected by the
 * `teams` and `matches` DistributedTables. Used by `api.ensureSeeded()`
 * to populate the tables on first run.
 */
import { TEAMS, ALL_MATCHES } from "../src/data/worldcup2026.js";
import { ROSTERS } from "../src/data/rosters.js";

export interface SeedTeam {
  teamId: string;
  type: string;
  name: string;
  group: string;
  fifaRanking: number;
  confederation: string;
  flagEmoji: string;
  roster?: string;
}

export interface SeedMatch {
  matchId: string;
  matchType: string;
  stage: string;
  team1Id: string;
  team2Id: string;
  scheduledDate: string;
  result?: string;
  score?: string;
}

// teamId → JSON-encoded player array, so each team row carries its squad and
// the agent's getTeamSquad tool can parse it back out of the teams table.
const ROSTER_BY_TEAM = new Map(
  ROSTERS.map((r) => [r.teamId, JSON.stringify(r.players)]),
);

// 48 teams — partition key `type` groups them as one logical collection.
export const SEED_TEAMS: SeedTeam[] = TEAMS.map((t) => ({
  teamId: t.teamId,
  type: "TEAM",
  name: t.name,
  group: t.group,
  fifaRanking: t.fifaRanking,
  confederation: t.confederation,
  flagEmoji: t.flagEmoji,
  roster: ROSTER_BY_TEAM.get(t.teamId),
}));

// Group-stage + knockout matches — partition key `matchType`.
export const SEED_MATCHES: SeedMatch[] = ALL_MATCHES.map((m) => ({
  matchId: m.matchId,
  matchType: "MATCH",
  stage: m.stage,
  team1Id: m.team1Id,
  team2Id: m.team2Id,
  scheduledDate: m.scheduledDate,
}));
