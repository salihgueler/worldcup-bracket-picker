import type { PickEvent, Team } from "../types";

interface LiveFeedProps {
  events: PickEvent[];
  teams: Map<string, Team>;
}

export function LiveFeed({ events, teams }: LiveFeedProps) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <h3 className="text-white/70 font-semibold text-xs uppercase tracking-wider">
          Live Feed
        </h3>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {events.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-white/30 text-xs">
              No picks yet — make a pick to get things going
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {events.map((e, i) => {
              const team = teams.get(e.predictedWinner);
              return (
                <div
                  key={i}
                  className="px-4 py-3 flex items-center gap-2.5 text-xs"
                >
                  <span className="text-gold-400/70 text-[10px]">●</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-white/70 font-medium">
                      {e.username}
                    </span>
                    <span className="text-white/30 mx-1">→</span>
                    <span className="text-white/90 font-semibold">
                      {team
                        ? `${team.flagEmoji} ${team.name}`
                        : e.predictedWinner}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
