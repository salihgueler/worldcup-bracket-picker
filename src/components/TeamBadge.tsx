import type { Team } from "../types";

interface TeamBadgeProps {
  team: Team;
  compact?: boolean;
  selected?: boolean;
}

export function TeamBadge({ team, compact, selected }: TeamBadgeProps) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-base">{team.flagEmoji}</span>
        <span className="font-semibold text-xs text-navy-900">{team.teamId}</span>
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-3 transition-all ${selected ? "scale-[1.02]" : ""}`}>
      <span className="text-3xl drop-shadow-sm">{team.flagEmoji}</span>
      <div className="min-w-0">
        <div className="font-semibold text-sm text-navy-900 truncate">{team.name}</div>
        <div className="text-[11px] text-navy-900/50 font-medium">
          FIFA #{team.fifaRanking} • {team.confederation}
        </div>
      </div>
    </div>
  );
}
