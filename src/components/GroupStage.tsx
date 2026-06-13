import type { Team, Match } from "../types";
import { MatchCard } from "./MatchCard";

interface GroupStageProps {
  teams: Team[];
  matches: Match[];
  picks: Map<string, string>;
  onPick: (matchId: string, teamId: string) => void;
  onAskAI: (team1: string, team2: string) => void;
}

export function GroupStage({ teams, matches, picks, onPick, onAskAI }: GroupStageProps) {
  const teamMap = new Map(teams.map((t) => [t.teamId, t]));
  const groups = [...new Set(teams.map((t) => t.group))].sort();
  const groupMatches = matches.filter((m) => m.stage === "group");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {groups.map((group) => {
        const groupTeams = teams.filter((t) => t.group === group);
        const gMatches = groupMatches.filter(
          (m) => groupTeams.some((t) => t.teamId === m.team1Id || t.teamId === m.team2Id)
        );
        return (
          <div key={group} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
            {/* Group Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-gold-400/10 to-transparent">
              <h3 className="text-gold-400 font-bold text-sm tracking-wide">GROUP {group}</h3>
            </div>

            {/* Team List */}
            <div className="px-5 py-3 space-y-2 border-b border-white/[0.06]">
              {groupTeams
                .sort((a, b) => a.fifaRanking - b.fifaRanking)
                .map((t) => (
                  <div key={t.teamId} className="flex items-center gap-3 py-1.5">
                    <span className="text-xl">{t.flagEmoji}</span>
                    <span className="text-sm font-medium text-white/90 flex-1">{t.name}</span>
                    <span className="text-[11px] text-white/30 font-semibold tabular-nums">#{t.fifaRanking}</span>
                  </div>
                ))}
            </div>

            {/* Matches */}
            <div className="p-4 space-y-3">
              <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2">Matches</h4>
              {gMatches.slice(0, 6).map((m) => (
                <MatchCard
                  key={m.matchId}
                  match={m}
                  teams={teamMap}
                  currentPick={picks.get(m.matchId)}
                  onPick={onPick}
                  onAskAI={onAskAI}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
