import { TEAMS } from '../data/worldcup2026';
import { GROUPS } from '../data/bracketConstants';

interface GroupPickerProps {
  groupPicks: Record<string, { first: string; second: string; third: string }>;
  thirdPlacePicks: string[];
  locked: boolean;
  onPick: (group: string, first: string, second: string, third: string) => void;
  onThirdPlacePick: (picks: string[]) => void;
}

const teamMap = new Map(TEAMS.map(t => [t.teamId, t]));

export function GroupPicker({ groupPicks, thirdPlacePicks, locked, onPick, onThirdPlacePick }: GroupPickerProps) {
  const filledGroups = GROUPS.filter(g => {
    const p = groupPicks[g];
    return p?.first && p?.second && p?.third;
  });
  const allGroupsFilled = filledGroups.length === 12;

  const toggle3rd = (teamId: string) => {
    if (locked) return;
    if (thirdPlacePicks.includes(teamId)) {
      onThirdPlacePick(thirdPlacePicks.filter(id => id !== teamId));
    } else if (thirdPlacePicks.length < 8) {
      onThirdPlacePick([...thirdPlacePicks, teamId]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Group Stage Picks</h2>
        <span className="text-gold-400 text-sm font-semibold">{filledGroups.length}/12 groups complete</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map(group => (
          <GroupCard key={group} group={group} pick={groupPicks[group]} locked={locked} onPick={onPick} />
        ))}
      </div>

      {allGroupsFilled && (
        <div className="mt-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Which 8 third-place teams advance?</h3>
            <span className={`text-sm font-semibold ${thirdPlacePicks.length === 8 ? 'text-green-400' : 'text-gold-400'}`}>
              {thirdPlacePicks.length}/8 selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {GROUPS.map(g => {
              const teamId = groupPicks[g]?.third;
              if (!teamId) return null;
              const team = teamMap.get(teamId);
              if (!team) return null;
              const selected = thirdPlacePicks.includes(teamId);
              const disabled = !selected && thirdPlacePicks.length >= 8;
              return (
                <button
                  key={teamId}
                  onClick={() => toggle3rd(teamId)}
                  disabled={locked || disabled}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${
                    selected
                      ? 'bg-gold-400/20 border border-gold-400/50 text-gold-400'
                      : disabled
                        ? 'bg-white/[0.02] border border-white/[0.04] text-white/20 cursor-not-allowed'
                        : 'bg-white/[0.04] border border-white/[0.06] text-white/60 hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{team.flagEmoji}</span>
                  <span className="font-medium truncate">{team.name}</span>
                  <span className="text-[10px] text-white/30 ml-auto">{g}</span>
                  {selected && <span className="text-green-400 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
          <div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-400 rounded-full transition-all duration-300"
              style={{ width: `${(thirdPlacePicks.length / 8) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, pick, locked, onPick }: {
  group: string;
  pick?: { first: string; second: string; third: string };
  locked: boolean;
  onPick: (group: string, first: string, second: string, third: string) => void;
}) {
  const teams = TEAMS.filter(t => t.group === group).sort((a, b) => a.fifaRanking - b.fifaRanking);

  const handleClick = (teamId: string) => {
    if (locked) return;
    const first = pick?.first || '';
    const second = pick?.second || '';
    const third = pick?.third || '';

    if (first === teamId) {
      onPick(group, second, third, '');
    } else if (second === teamId) {
      onPick(group, first, third, '');
    } else if (third === teamId) {
      onPick(group, first, second, '');
    } else if (!first) {
      onPick(group, teamId, second, third);
    } else if (!second) {
      onPick(group, first, teamId, third);
    } else if (!third) {
      onPick(group, first, second, teamId);
    } else {
      onPick(group, first, second, teamId);
    }
  };

  const isComplete = pick?.first && pick?.second && pick?.third;

  return (
    <div className={`bg-white/[0.03] border rounded-2xl p-4 ${isComplete ? 'border-gold-400/30' : 'border-white/[0.06]'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Group {group}</h3>
        {isComplete && <span className="text-green-400 text-xs">✓</span>}
      </div>
      <div className="space-y-2">
        {teams.map(team => {
          const isFirst = pick?.first === team.teamId;
          const isSecond = pick?.second === team.teamId;
          const isThird = pick?.third === team.teamId;
          const isEliminated = isComplete && !isFirst && !isSecond && !isThird;

          let cls = 'flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm w-full ';
          if (isFirst) cls += 'bg-gold-400/20 border border-gold-400/50 text-gold-400';
          else if (isSecond) cls += 'bg-white/[0.06] border border-white/20 text-white/90';
          else if (isThird) cls += 'bg-amber-600/10 border border-amber-600/30 text-amber-500';
          else if (isEliminated) cls += 'bg-white/[0.01] border border-white/[0.04] text-white/25';
          else cls += 'hover:bg-white/[0.04] text-white/60';

          return (
            <button key={team.teamId} className={cls} onClick={() => handleClick(team.teamId)} disabled={locked}>
              <span className="text-lg">{team.flagEmoji}</span>
              <span className="flex-1 text-left font-medium">{team.name}</span>
              <span className="text-[10px] text-white/30">#{team.fifaRanking}</span>
              {isFirst && <span className="text-[10px] font-bold text-gold-400">🥇 1st</span>}
              {isSecond && <span className="text-[10px] font-bold text-white/50">🥈 2nd</span>}
              {isThird && <span className="text-[10px] font-bold text-amber-500">🥉 3rd</span>}
              {isEliminated && <span className="text-[10px] font-bold text-white/20">❌</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
