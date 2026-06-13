export const POINTS = {
  GROUP_QUALIFIER: 5,
  GROUP_POSITION_BONUS: 3,
  R32_WINNER: 5,
  R16_WINNER: 8,
  QF_WINNER: 12,
  SF_WINNER: 15,
  THIRD_PLACE: 10,
  FINAL_WINNER: 20,
  CORRECT_SCORE_BONUS: 5,
} as const;

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'] as const;

/**
 * 2026 FIFA World Cup knockout format:
 * - 24 teams (top 2 from 12 groups) + 8 best 3rd-place teams = 32
 * - Round of 32 (16 matches) → R16 (8) → QF (4) → SF (2) → 3rd + Final
 *
 * For the bracket picker, users pick 1st and 2nd from each group (24 teams).
 * The 8 third-place qualifiers are shown as "3rd" placeholders.
 * Bracket seeding follows FIFA's published bracket paths.
 */

/** Round of 32: 16 matches. Seeds use "1X" = winner of group X, "2X" = runner-up, "3XX" = best 3rd from groups XX */
export const R32_MATCHES = [
  { id: 'R32-1', team1Seed: '1A', team2Seed: '3CDI' },
  { id: 'R32-2', team1Seed: '1B', team2Seed: '3EFJ' },
  { id: 'R32-3', team1Seed: '1C', team2Seed: '2D' },
  { id: 'R32-4', team1Seed: '1D', team2Seed: '2C' },
  { id: 'R32-5', team1Seed: '1E', team2Seed: '3ABK' },
  { id: 'R32-6', team1Seed: '1F', team2Seed: '2I' },
  { id: 'R32-7', team1Seed: '1G', team2Seed: '2H' },
  { id: 'R32-8', team1Seed: '1H', team2Seed: '2G' },
  { id: 'R32-9', team1Seed: '1I', team2Seed: '2F' },
  { id: 'R32-10', team1Seed: '1J', team2Seed: '3GHL' },
  { id: 'R32-11', team1Seed: '1K', team2Seed: '2L' },
  { id: 'R32-12', team1Seed: '1L', team2Seed: '2K' },
  { id: 'R32-13', team1Seed: '2A', team2Seed: '2B' },
  { id: 'R32-14', team1Seed: '2E', team2Seed: '2J' },
  { id: 'R32-15', team1Seed: '2F', team2Seed: '3CDI' },
  { id: 'R32-16', team1Seed: '2H', team2Seed: '3EFL' },
] as const;

export const R16_MATCHES = [
  { id: 'R16-1', team1Seed: 'W:R32-1', team2Seed: 'W:R32-2' },
  { id: 'R16-2', team1Seed: 'W:R32-3', team2Seed: 'W:R32-4' },
  { id: 'R16-3', team1Seed: 'W:R32-5', team2Seed: 'W:R32-6' },
  { id: 'R16-4', team1Seed: 'W:R32-7', team2Seed: 'W:R32-8' },
  { id: 'R16-5', team1Seed: 'W:R32-9', team2Seed: 'W:R32-10' },
  { id: 'R16-6', team1Seed: 'W:R32-11', team2Seed: 'W:R32-12' },
  { id: 'R16-7', team1Seed: 'W:R32-13', team2Seed: 'W:R32-14' },
  { id: 'R16-8', team1Seed: 'W:R32-15', team2Seed: 'W:R32-16' },
] as const;

export const QF_MATCHES = [
  { id: 'QF-1', team1Seed: 'W:R16-1', team2Seed: 'W:R16-2' },
  { id: 'QF-2', team1Seed: 'W:R16-3', team2Seed: 'W:R16-4' },
  { id: 'QF-3', team1Seed: 'W:R16-5', team2Seed: 'W:R16-6' },
  { id: 'QF-4', team1Seed: 'W:R16-7', team2Seed: 'W:R16-8' },
] as const;

export const SF_MATCHES = [
  { id: 'SF-1', team1Seed: 'W:QF-1', team2Seed: 'W:QF-2' },
  { id: 'SF-2', team1Seed: 'W:QF-3', team2Seed: 'W:QF-4' },
] as const;

export const THIRD_MATCH = { id: '3RD', team1Seed: 'L:SF-1', team2Seed: 'L:SF-2' } as const;
export const FINAL_MATCH = { id: 'FINAL', team1Seed: 'W:SF-1', team2Seed: 'W:SF-2' } as const;

export type KnockoutRound = 'R32' | 'R16' | 'QF' | 'SF' | '3RD' | 'FINAL';

export const ROUNDS: { id: KnockoutRound; label: string; matchCount: number }[] = [
  { id: 'R32', label: 'Round of 32', matchCount: 16 },
  { id: 'R16', label: 'Round of 16', matchCount: 8 },
  { id: 'QF', label: 'Quarter Finals', matchCount: 4 },
  { id: 'SF', label: 'Semi Finals', matchCount: 2 },
  { id: '3RD', label: '3rd Place', matchCount: 1 },
  { id: 'FINAL', label: 'Final', matchCount: 1 },
];
