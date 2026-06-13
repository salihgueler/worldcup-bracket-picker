import { useState } from 'react';
import { GroupPicker } from './GroupPicker';
import { KnockoutPicker } from './KnockoutPicker';
import { LockInSummary } from './LockInSummary';

type Step = 'groups' | 'knockout' | 'lockin';

interface BracketFlowProps {
  groupPicks: Record<string, { first: string; second: string; third: string }>;
  thirdPlacePicks: string[];
  knockoutPicks: Record<string, { winner: string; score?: string }>;
  locked: boolean;
  groupsComplete: number;
  thirdPlaceComplete: boolean;
  r32Complete: boolean;
  r16Complete: boolean;
  qfComplete: boolean;
  sfComplete: boolean;
  thirdComplete: boolean;
  finalComplete: boolean;
  allComplete: boolean;
  resolveTeamForSeed: (seed: string) => string | undefined;
  onGroupPick: (group: string, first: string, second: string, third: string) => void;
  onThirdPlacePick: (picks: string[]) => void;
  onKnockoutPick: (matchId: string, winner: string, score?: string) => void;
  onLock: () => void;
}

export function BracketFlow(props: BracketFlowProps) {
  const { groupsComplete, thirdPlaceComplete, allComplete, locked } = props;
  const [step, setStep] = useState<Step>(locked ? 'lockin' : 'groups');

  const groupStageComplete = groupsComplete === 12 && thirdPlaceComplete;
  const knockoutTotal = 32;
  const knockoutDone = Object.keys(props.knockoutPicks).filter(k => props.knockoutPicks[k]?.winner).length;
  const progress = locked ? 100 : Math.round(
    ((groupsComplete / 12) * 25) +
    ((props.thirdPlacePicks.length / 8) * 15) +
    ((knockoutDone / knockoutTotal) * 60)
  );

  const steps: { id: Step; label: string; disabled: boolean }[] = [
    { id: 'groups', label: '🏟️ Groups', disabled: false },
    { id: 'knockout', label: '⚔️ Knockout', disabled: !groupStageComplete },
    { id: 'lockin', label: '🔒 Lock In', disabled: !allComplete && !locked },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs font-semibold">Bracket Progress</span>
          <span className="text-gold-400 text-xs font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-gold-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {steps.map(s => (
          <button
            key={s.id}
            onClick={() => !s.disabled && setStep(s.id)}
            disabled={s.disabled}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              step === s.id
                ? 'bg-gold-400 text-navy-900'
                : s.disabled
                  ? 'bg-white/[0.02] text-white/20 cursor-not-allowed'
                  : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {step === 'groups' && (
        <GroupPicker
          groupPicks={props.groupPicks}
          thirdPlacePicks={props.thirdPlacePicks}
          locked={props.locked}
          onPick={props.onGroupPick}
          onThirdPlacePick={props.onThirdPlacePick}
        />
      )}
      {step === 'knockout' && (
        <KnockoutPicker
          groupPicks={props.groupPicks}
          knockoutPicks={props.knockoutPicks}
          locked={props.locked}
          groupsComplete={props.groupsComplete}
          r32Complete={props.r32Complete}
          r16Complete={props.r16Complete}
          qfComplete={props.qfComplete}
          sfComplete={props.sfComplete}
          resolveTeamForSeed={props.resolveTeamForSeed}
          onPick={props.onKnockoutPick}
        />
      )}
      {step === 'lockin' && (
        <LockInSummary
          groupPicks={props.groupPicks}
          thirdPlacePicks={props.thirdPlacePicks}
          knockoutPicks={props.knockoutPicks}
          locked={props.locked}
          resolveTeamForSeed={props.resolveTeamForSeed}
          onLock={props.onLock}
        />
      )}
    </div>
  );
}
