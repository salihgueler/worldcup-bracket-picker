import { TEAMS } from '../data/worldcup2026';
import { GROUPS, POINTS } from '../data/bracketConstants';

interface LockInSummaryProps {
  groupPicks: Record<string, { first: string; second: string; third: string }>;
  thirdPlacePicks: string[];
  knockoutPicks: Record<string, { winner: string; score?: string }>;
  locked: boolean;
  resolveTeamForSeed: (seed: string) => string | undefined;
  onLock: () => void;
}

const teamMap = new Map(TEAMS.map(t => [t.teamId, t]));

export function LockInSummary({ groupPicks, thirdPlacePicks, knockoutPicks, locked, onLock }: LockInSummaryProps) {
  const maxPoints =
    (12 * 2 * POINTS.GROUP_QUALIFIER) + (12 * 2 * POINTS.GROUP_POSITION_BONUS) +
    (8 * POINTS.R32_WINNER) + (8 * POINTS.R16_WINNER) + (4 * POINTS.QF_WINNER) +
    (2 * POINTS.SF_WINNER) + POINTS.THIRD_PLACE + POINTS.FINAL_WINNER;

  const finalist = knockoutPicks['FINAL']?.winner;
  const finalistTeam = finalist ? teamMap.get(finalist) : undefined;

  return (
    <div className="space-y-6">
      {locked && (
        <div className="bg-green-400/10 border border-green-400/30 rounded-2xl p-4 text-center">
          <span className="text-green-400 font-semibold text-sm">🔒 Bracket Locked</span>
          <p className="text-white/40 text-xs mt-1">Your picks are final.</p>
        </div>
      )}

      {/* Groups summary */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Group Picks</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GROUPS.map(g => {
            const pick = groupPicks[g];
            const first = pick?.first ? teamMap.get(pick.first) : undefined;
            const second = pick?.second ? teamMap.get(pick.second) : undefined;
            const third = pick?.third ? teamMap.get(pick.third) : undefined;
            return (
              <div key={g} className="text-xs">
                <span className="text-white/30 font-semibold">Group {g}: </span>
                <span className="text-gold-400">{first?.flagEmoji} {first?.name || '—'}</span>
                <span className="text-white/20"> / </span>
                <span className="text-white/60">{second?.flagEmoji} {second?.name || '—'}</span>
                <span className="text-white/20"> / </span>
                <span className="text-amber-500">{third?.flagEmoji} {third?.name || '—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Third place summary */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Best 3rd Place ({thirdPlacePicks.length}/8)</h3>
        <div className="flex flex-wrap gap-2">
          {thirdPlacePicks.map(id => {
            const team = teamMap.get(id);
            return team ? (
              <span key={id} className="text-xs text-gold-400">{team.flagEmoji} {team.name}</span>
            ) : null;
          })}
        </div>
      </div>

      {/* Knockout summary */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Knockout Picks</h3>
        <div className="space-y-1">
          {Object.entries(knockoutPicks).filter(([, v]) => v.winner).map(([id, pick]) => {
            const team = teamMap.get(pick.winner);
            return (
              <div key={id} className="flex items-center gap-2 text-xs">
                <span className="text-white/30 w-16 font-semibold">{id}</span>
                <span className="text-white/70">{team?.flagEmoji} {team?.name}</span>
                {pick.score && <span className="text-white/30">({pick.score})</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Winner */}
      {finalistTeam && (
        <div className="bg-gold-400/10 border border-gold-400/30 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">{finalistTeam.flagEmoji}</div>
          <div className="text-gold-400 font-bold text-lg">🏆 {finalistTeam.name}</div>
          <div className="text-white/40 text-xs mt-1">Your predicted World Cup winner</div>
        </div>
      )}

      {/* Points potential */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
        <div className="text-gold-400 font-bold text-2xl">{maxPoints}</div>
        <div className="text-white/40 text-xs mt-1">Maximum possible points</div>
      </div>

      {!locked && (
        <button
          onClick={onLock}
          className="w-full bg-gold-400 text-navy-900 font-bold py-3 rounded-2xl hover:bg-gold-300 transition-all text-sm"
        >
          🔒 Lock In My Bracket
        </button>
      )}
    </div>
  );
}
