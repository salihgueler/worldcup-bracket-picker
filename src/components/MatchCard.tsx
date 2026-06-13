import type { Team, Match } from "../types";
import { TeamBadge } from "./TeamBadge";

interface MatchCardProps {
  match: Match;
  teams: Map<string, Team>;
  currentPick?: string;
  onPick: (matchId: string, teamId: string) => void;
  onAskAI?: (team1: string, team2: string) => void;
}

export function MatchCard({ match, teams, currentPick, onPick, onAskAI }: MatchCardProps) {
  const team1 = teams.get(match.team1Id);
  const team2 = teams.get(match.team2Id);
  const isTBD = match.team1Id === "TBD" || match.team2Id === "TBD";

  const formatDate = (d: string) => {
    const date = new Date(d + "T12:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-navy-900/5 to-transparent">
        <span className="text-[11px] font-semibold text-navy-900/40 uppercase tracking-wide">{match.stage === "group" ? "Group Stage" : match.stage}</span>
        <span className="text-[11px] text-navy-900/40 font-medium">{formatDate(match.scheduledDate)}</span>
      </div>

      {/* Teams */}
      <div className="px-4 py-3 space-y-2">
        <button
          disabled={isTBD}
          onClick={() => !isTBD && onPick(match.matchId, match.team1Id)}
          className={`w-full p-3 rounded-xl transition-all duration-200 text-left ${
            currentPick === match.team1Id
              ? "bg-gold-400/15 ring-2 ring-gold-400 shadow-sm"
              : "hover:bg-navy-50 border border-transparent hover:border-navy-200"
          } ${isTBD ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"}`}
        >
          {team1 ? (
            <TeamBadge team={team1} selected={currentPick === match.team1Id} />
          ) : (
            <span className="text-navy-900/30 text-sm font-medium">To be determined</span>
          )}
          {currentPick === match.team1Id && (
            <span className="absolute top-2 right-2 text-gold-500 text-xs font-bold">✓ YOUR PICK</span>
          )}
        </button>

        <div className="flex items-center gap-3 px-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] font-bold text-navy-900/25 tracking-widest">VS</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          disabled={isTBD}
          onClick={() => !isTBD && onPick(match.matchId, match.team2Id)}
          className={`w-full p-3 rounded-xl transition-all duration-200 text-left ${
            currentPick === match.team2Id
              ? "bg-gold-400/15 ring-2 ring-gold-400 shadow-sm"
              : "hover:bg-navy-50 border border-transparent hover:border-navy-200"
          } ${isTBD ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"}`}
        >
          {team2 ? (
            <TeamBadge team={team2} selected={currentPick === match.team2Id} />
          ) : (
            <span className="text-navy-900/30 text-sm font-medium">To be determined</span>
          )}
        </button>
      </div>

      {/* AI Button */}
      {onAskAI && !isTBD && (
        <div className="px-4 pb-3">
          <button
            onClick={() => onAskAI(match.team1Id, match.team2Id)}
            className="w-full py-2 rounded-lg bg-navy-900/5 hover:bg-navy-900/10 text-navy-900/60 hover:text-navy-900 text-xs font-semibold transition-colors"
          >
            🤖 Ask AI to predict this match
          </button>
        </div>
      )}
    </div>
  );
}
