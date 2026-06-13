import { useState } from 'react';
import { TEAMS } from '../data/worldcup2026';
import { R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES, THIRD_MATCH, FINAL_MATCH, ROUNDS } from '../data/bracketConstants';
import type { KnockoutRound } from '../data/bracketConstants';

interface KnockoutPickerProps {
  groupPicks: Record<string, { first: string; second: string; third: string }>;
  knockoutPicks: Record<string, { winner: string; score?: string }>;
  locked: boolean;
  groupsComplete: number;
  r32Complete: boolean;
  r16Complete: boolean;
  qfComplete: boolean;
  sfComplete: boolean;
  resolveTeamForSeed: (seed: string) => string | undefined;
  onPick: (matchId: string, winner: string, score?: string) => void;
}

const teamMap = new Map(TEAMS.map(t => [t.teamId, t]));

function getMatchesForRound(round: KnockoutRound) {
  switch (round) {
    case 'R32': return R32_MATCHES;
    case 'R16': return R16_MATCHES;
    case 'QF': return QF_MATCHES;
    case 'SF': return SF_MATCHES;
    case '3RD': return [THIRD_MATCH];
    case 'FINAL': return [FINAL_MATCH];
  }
}

function isRoundUnlocked(round: KnockoutRound, props: KnockoutPickerProps): boolean {
  switch (round) {
    case 'R32': return props.groupsComplete === 12;
    case 'R16': return props.r32Complete;
    case 'QF': return props.r16Complete;
    case 'SF': return props.qfComplete;
    case '3RD': return props.sfComplete;
    case 'FINAL': return props.sfComplete;
  }
}

export function KnockoutPicker(props: KnockoutPickerProps) {
  const { knockoutPicks, locked, resolveTeamForSeed, onPick } = props;
  const [activeRound, setActiveRound] = useState<KnockoutRound>('R32');

  const matches = getMatchesForRound(activeRound);
  const unlocked = isRoundUnlocked(activeRound, props);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {ROUNDS.map(r => {
          const isUnlocked = isRoundUnlocked(r.id, props);
          return (
            <button
              key={r.id}
              onClick={() => setActiveRound(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeRound === r.id
                  ? 'bg-gold-400 text-navy-900'
                  : isUnlocked
                    ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]'
                    : 'bg-white/[0.02] text-white/20 cursor-not-allowed'
              }`}
              disabled={!isUnlocked}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {!unlocked ? (
        <div className="text-center py-12 text-white/30 text-sm">
          Complete the previous round to unlock this stage.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matches.map(match => {
            const t1Id = resolveTeamForSeed(match.team1Seed);
            const t2Id = resolveTeamForSeed(match.team2Seed);
            const t1 = t1Id ? teamMap.get(t1Id) : undefined;
            const t2 = t2Id ? teamMap.get(t2Id) : undefined;
            const pick = knockoutPicks[match.id];

            return (
              <MatchPickCard
                key={match.id}
                matchId={match.id}
                team1={t1 ? { id: t1.teamId, name: t1.name, flag: t1.flagEmoji } : undefined}
                team2={t2 ? { id: t2.teamId, name: t2.name, flag: t2.flagEmoji } : undefined}
                winner={pick?.winner}
                score={pick?.score}
                locked={locked}
                onPick={onPick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function MatchPickCard({ matchId, team1, team2, winner, score, locked, onPick }: {
  matchId: string;
  team1?: { id: string; name: string; flag: string };
  team2?: { id: string; name: string; flag: string };
  winner?: string;
  score?: string;
  locked: boolean;
  onPick: (matchId: string, winner: string, score?: string) => void;
}) {
  const [showScore, setShowScore] = useState(false);
  const [scoreInput, setScoreInput] = useState(score || '');

  const handlePick = (teamId: string) => {
    if (locked || !team1 || !team2) return;
    onPick(matchId, winner === teamId ? '' : teamId, scoreInput || undefined);
  };

  const handleScoreChange = (val: string) => {
    setScoreInput(val);
    if (winner) onPick(matchId, winner, val || undefined);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3">
      <div className="text-[10px] text-white/30 font-semibold mb-2">{matchId}</div>
      <div className="flex items-center gap-2">
        <TeamSlot team={team1} selected={winner === team1?.id} onClick={() => team1 && handlePick(team1.id)} />
        <span className="text-white/20 text-xs font-bold">vs</span>
        <TeamSlot team={team2} selected={winner === team2?.id} onClick={() => team2 && handlePick(team2.id)} />
      </div>
      {winner && (
        <div className="mt-2">
          <button onClick={() => setShowScore(!showScore)} className="text-[10px] text-white/30 hover:text-white/50">
            {showScore ? 'Hide score' : '+ Score (bonus)'}
          </button>
          {showScore && (
            <input
              value={scoreInput}
              onChange={e => handleScoreChange(e.target.value)}
              placeholder="e.g. 2-1"
              className="mt-1 w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-2 py-1 text-xs text-white/70 placeholder:text-white/20"
              disabled={locked}
            />
          )}
        </div>
      )}
    </div>
  );
}

function TeamSlot({ team, selected, onClick }: {
  team?: { id: string; name: string; flag: string };
  selected: boolean;
  onClick: () => void;
}) {
  if (!team) {
    return <div className="flex-1 px-3 py-2 rounded-xl bg-white/[0.02] text-white/20 text-xs text-center">TBD</div>;
  }
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-xs font-medium ${
        selected
          ? 'bg-gold-400/20 border border-gold-400/50 text-gold-400'
          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70'
      }`}
    >
      <span>{team.flag}</span>
      <span className="truncate">{team.name}</span>
    </button>
  );
}
