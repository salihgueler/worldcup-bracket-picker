import { TEAMS } from '../data/worldcup2026';
import { GROUPS, R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES, THIRD_MATCH, FINAL_MATCH } from '../data/bracketConstants';

interface MyBracketProps {
  groupPicks: Record<string, { first: string; second: string; third: string }>;
  knockoutPicks: Record<string, { winner: string; score?: string }>;
  locked: boolean;
  groupsComplete: number;
  totalKnockoutPicks: number;
  resolveTeamForSeed: (seed: string) => string | undefined;
}

const teamMap = new Map(TEAMS.map(t => [t.teamId, t]));

export function MyBracket({ groupPicks, knockoutPicks, locked, groupsComplete, totalKnockoutPicks, resolveTeamForSeed }: MyBracketProps) {
  const allRounds = [
    { label: 'Round of 32', matches: R32_MATCHES },
    { label: 'Round of 16', matches: R16_MATCHES },
    { label: 'Quarter Finals', matches: QF_MATCHES },
    { label: 'Semi Finals', matches: SF_MATCHES },
    { label: '3rd Place', matches: [THIRD_MATCH] },
    { label: 'Final', matches: [FINAL_MATCH] },
  ];

  return (
    <div className="space-y-6">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">My Bracket</h2>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          locked ? 'bg-green-400/20 text-green-400' : 'bg-white/[0.06] text-white/50'
        }`}>
          {locked ? '🔒 Locked' : '✏️ In Progress'}
        </span>
      </div>

      {/* Progress */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-gold-400 font-bold text-xl">{groupsComplete}/12</div>
            <div className="text-white/30 text-[10px]">Groups</div>
          </div>
          <div>
            <div className="text-gold-400 font-bold text-xl">{totalKnockoutPicks}/24</div>
            <div className="text-white/30 text-[10px]">Knockout</div>
          </div>
          <div>
            <div className="text-gold-400 font-bold text-xl">0</div>
            <div className="text-white/30 text-[10px]">Points Earned</div>
          </div>
          <div>
            <div className="text-gold-400 font-bold text-xl">—</div>
            <div className="text-white/30 text-[10px]">Rank</div>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Group Stage</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {GROUPS.map(g => {
            const pick = groupPicks[g];
            const first = pick?.first ? teamMap.get(pick.first) : undefined;
            const second = pick?.second ? teamMap.get(pick.second) : undefined;
            return (
              <div key={g} className="bg-white/[0.02] rounded-xl p-2">
                <div className="text-white/30 text-[10px] font-semibold mb-1">Group {g}</div>
                <div className="text-xs text-gold-400">{first ? `${first.flagEmoji} ${first.name}` : '—'}</div>
                <div className="text-xs text-white/50">{second ? `${second.flagEmoji} ${second.name}` : '—'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Knockout bracket */}
      {allRounds.map(round => (
        <div key={round.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <h3 className="text-white font-semibold text-sm mb-3">{round.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {round.matches.map(match => {
              const t1Id = resolveTeamForSeed(match.team1Seed);
              const t2Id = resolveTeamForSeed(match.team2Seed);
              const t1 = t1Id ? teamMap.get(t1Id) : undefined;
              const t2 = t2Id ? teamMap.get(t2Id) : undefined;
              const pick = knockoutPicks[match.id];
              const winnerTeam = pick?.winner ? teamMap.get(pick.winner) : undefined;

              return (
                <div key={match.id} className="flex items-center gap-2 bg-white/[0.02] rounded-xl px-3 py-2 text-xs">
                  <span className="text-white/20 w-12 font-semibold">{match.id}</span>
                  <span className="text-white/50">{t1?.flagEmoji || '?'} vs {t2?.flagEmoji || '?'}</span>
                  {winnerTeam && (
                    <span className="ml-auto text-gold-400 font-medium">→ {winnerTeam.flagEmoji} {winnerTeam.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
