import type { Team, Match } from "../types";
import { MatchCard } from "./MatchCard";

interface KnockoutBracketProps {
  matches: Match[];
  teams: Map<string, Team>;
  picks: Map<string, string>;
  onPick: (matchId: string, teamId: string) => void;
  onAskAI: (team1: string, team2: string) => void;
}

const STAGES = [
  { id: "round32", label: "Round of 32", cols: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" },
  { id: "round16", label: "Round of 16", cols: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" },
  { id: "quarter", label: "Quarter Finals", cols: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" },
  { id: "semi", label: "Semi Finals", cols: "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto" },
  { id: "third", label: "Third Place", cols: "grid-cols-1 max-w-md mx-auto" },
  { id: "final", label: "🏆 Final", cols: "grid-cols-1 max-w-md mx-auto" },
];

export function KnockoutBracket({ matches, teams, picks, onPick, onAskAI }: KnockoutBracketProps) {
  return (
    <div className="space-y-10 overflow-x-auto">
      {STAGES.map((stage) => {
        const stageMatches = matches.filter((m) => m.stage === stage.id);
        if (stageMatches.length === 0) return null;
        return (
          <section key={stage.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-gold-400/30 to-transparent" />
              <h3 className="text-gold-400 font-bold text-sm tracking-wide whitespace-nowrap">{stage.label}</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-gold-400/30 to-transparent" />
            </div>
            <div className={`grid gap-4 ${stage.cols}`}>
              {stageMatches.map((m) => (
                <MatchCard
                  key={m.matchId}
                  match={m}
                  teams={teams}
                  currentPick={picks.get(m.matchId)}
                  onPick={onPick}
                  onAskAI={onAskAI}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
