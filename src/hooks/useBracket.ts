import { useState, useCallback, useMemo } from 'react';
import type { BracketState } from '../types';
import { GROUPS, R32_MATCHES, R16_MATCHES, QF_MATCHES, SF_MATCHES } from '../data/bracketConstants';
import { TEAMS } from '../data/worldcup2026';

const STORAGE_KEY = 'wc2026_bracket';

function loadFromStorage(): BracketState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as BracketState;
      if (!parsed.thirdPlacePicks) parsed.thirdPlacePicks = [];
      return parsed;
    }
  } catch { /* ignore */ }
  return { groupPicks: {}, thirdPlacePicks: [], knockoutPicks: {}, locked: false };
}

function saveToStorage(state: BracketState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useBracket() {
  const [state, setState] = useState<BracketState>(loadFromStorage);

  const setGroupPick = useCallback((group: string, first: string, second: string, third: string) => {
    setState(prev => {
      if (prev.locked) return prev;
      const next = { ...prev, groupPicks: { ...prev.groupPicks, [group]: { first, second, third } } };
      saveToStorage(next);
      return next;
    });
  }, []);

  const setThirdPlacePicks = useCallback((picks: string[]) => {
    setState(prev => {
      if (prev.locked) return prev;
      const next = { ...prev, thirdPlacePicks: picks };
      saveToStorage(next);
      return next;
    });
  }, []);

  const setKnockoutPick = useCallback((matchId: string, winner: string, score?: string) => {
    setState(prev => {
      if (prev.locked) return prev;
      const next = { ...prev, knockoutPicks: { ...prev.knockoutPicks, [matchId]: { winner, score } } };
      saveToStorage(next);
      return next;
    });
  }, []);

  const lockBracket = useCallback(() => {
    setState(prev => {
      const next = { ...prev, locked: true };
      saveToStorage(next);
      return next;
    });
  }, []);

  const persist = useCallback((next: BracketState) => {
    setState(next);
    saveToStorage(next);
  }, []);

  const groupsComplete = useMemo(() =>
    GROUPS.filter(g => {
      const p = state.groupPicks[g];
      return p?.first && p?.second && p?.third;
    }).length
  , [state.groupPicks]);

  const thirdPlaceComplete = state.thirdPlacePicks.length === 8;

  /** The 12 third-place candidates: the team the user explicitly picked as 3rd in each group */
  const thirdPlaceCandidates = useMemo(() => {
    const candidates: { group: string; teamId: string }[] = [];
    for (const g of GROUPS) {
      const pick = state.groupPicks[g];
      if (pick?.third) candidates.push({ group: g, teamId: pick.third });
    }
    return candidates;
  }, [state.groupPicks]);

  /**
   * Resolve a 3rd-place seed like "3CDI" to a team.
   * The seed groups are the letters after "3". Find which user's third-place pick
   * belongs to one of those groups.
   */
  const resolveThirdPlaceSeed = useCallback((seed: string): string | undefined => {
    const groups = seed.slice(1).split('');
    for (const teamId of state.thirdPlacePicks) {
      const team = TEAMS.find(t => t.teamId === teamId);
      if (team && groups.includes(team.group)) return teamId;
    }
    return undefined;
  }, [state.thirdPlacePicks]);

  const resolveTeamForSeed = useCallback((seed: string): string | undefined => {
    if (seed.startsWith('3')) return resolveThirdPlaceSeed(seed);
    if (seed.startsWith('1') || seed.startsWith('2')) {
      const pos = seed[0] === '1' ? 'first' : 'second';
      const group = seed.slice(1);
      return state.groupPicks[group]?.[pos];
    }
    if (seed.startsWith('W:')) {
      const matchId = seed.slice(2);
      return state.knockoutPicks[matchId]?.winner;
    }
    if (seed.startsWith('L:')) {
      const matchId = seed.slice(2);
      const pick = state.knockoutPicks[matchId];
      if (!pick?.winner) return undefined;
      const match = [...R32_MATCHES, ...R16_MATCHES, ...QF_MATCHES, ...SF_MATCHES]
        .find(m => m.id === matchId);
      if (!match) return undefined;
      const t1 = resolveTeamForSeed(match.team1Seed);
      const t2 = resolveTeamForSeed(match.team2Seed);
      return pick.winner === t1 ? t2 : t1;
    }
    return undefined;
  }, [state.groupPicks, state.knockoutPicks, resolveThirdPlaceSeed]);

  const roundComplete = useCallback((matchIds: string[]) =>
    matchIds.every(id => state.knockoutPicks[id]?.winner)
  , [state.knockoutPicks]);

  const r32Complete = roundComplete(R32_MATCHES.map(m => m.id));
  const r16Complete = roundComplete(R16_MATCHES.map(m => m.id));
  const qfComplete = roundComplete(QF_MATCHES.map(m => m.id));
  const sfComplete = roundComplete(SF_MATCHES.map(m => m.id));
  const thirdComplete = !!state.knockoutPicks['3RD']?.winner;
  const finalComplete = !!state.knockoutPicks['FINAL']?.winner;

  const allComplete = groupsComplete === 12 && thirdPlaceComplete && r32Complete && r16Complete && qfComplete && sfComplete && thirdComplete && finalComplete;

  const totalKnockoutPicks = Object.keys(state.knockoutPicks).length;

  return {
    ...state,
    setGroupPick,
    setThirdPlacePicks,
    setKnockoutPick,
    lockBracket,
    persist,
    groupsComplete,
    thirdPlaceComplete,
    thirdPlaceCandidates,
    r32Complete,
    r16Complete,
    qfComplete,
    sfComplete,
    thirdComplete,
    finalComplete,
    allComplete,
    totalKnockoutPicks,
    resolveTeamForSeed,
  };
}
