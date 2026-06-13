import { useState, useMemo } from 'react';
import { TEAMS } from '../data/worldcup2026';
import { ROSTERS } from '../data/rosters';

export function TeamRosters() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TEAMS.filter(t =>
      t.name.toLowerCase().includes(q) || t.group.toLowerCase().includes(q) || t.teamId.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Teams & Rosters</h2>
        <span className="text-white/40 text-xs">{TEAMS.length} teams</span>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by team or group..."
        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/30 mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(team => {
          const isExpanded = expanded === team.teamId;
          const roster = ROSTERS.find(r => r.teamId === team.teamId);
          return (
            <div
              key={team.teamId}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : team.teamId)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition"
              >
                <span className="text-2xl">{team.flagEmoji}</span>
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-sm">{team.name}</div>
                  <div className="text-white/30 text-[10px]">Group {team.group} • #{team.fifaRanking} • {team.confederation}</div>
                </div>
                <span className="text-white/20 text-xs">{isExpanded ? '▼' : '▶'}</span>
              </button>

              {isExpanded && roster && (
                <div className="border-t border-white/[0.06] px-4 py-3 space-y-2">
                  {(['GK', 'DEF', 'MID', 'FWD'] as const).map(pos => {
                    const players = roster.players.filter(p => p.position === pos);
                    if (!players.length) return null;
                    return (
                      <div key={pos}>
                        <div className="text-[10px] text-white/30 font-semibold uppercase mb-1">{pos}</div>
                        {players.map(p => (
                          <div key={p.name} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-white/70">{p.name}</span>
                            <span className="text-white/30">{p.club}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
