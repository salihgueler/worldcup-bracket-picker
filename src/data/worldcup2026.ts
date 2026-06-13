import type { Team } from "../types";

export const TEAMS: Omit<Team, "type">[] = [
  // Group A — Mexico City / Guadalajara
  { teamId: "MEX", name: "Mexico", group: "A", fifaRanking: 15, confederation: "CONCACAF", flagEmoji: "🇲🇽" },
  { teamId: "RSA", name: "South Africa", group: "A", fifaRanking: 59, confederation: "CAF", flagEmoji: "🇿🇦" },
  { teamId: "KOR", name: "South Korea", group: "A", fifaRanking: 22, confederation: "AFC", flagEmoji: "🇰🇷" },
  { teamId: "CZE", name: "Czech Republic", group: "A", fifaRanking: 36, confederation: "UEFA", flagEmoji: "🇨🇿" },
  // Group B — Toronto / Vancouver / Santa Clara
  { teamId: "CAN", name: "Canada", group: "B", fifaRanking: 35, confederation: "CONCACAF", flagEmoji: "🇨🇦" },
  { teamId: "BIH", name: "Bosnia & Herzegovina", group: "B", fifaRanking: 56, confederation: "UEFA", flagEmoji: "🇧🇦" },
  { teamId: "QAT", name: "Qatar", group: "B", fifaRanking: 45, confederation: "AFC", flagEmoji: "🇶🇦" },
  { teamId: "SUI", name: "Switzerland", group: "B", fifaRanking: 16, confederation: "UEFA", flagEmoji: "🇨🇭" },
  // Group C — East Rutherford / Foxborough / Philadelphia / Miami
  { teamId: "BRA", name: "Brazil", group: "C", fifaRanking: 5, confederation: "CONMEBOL", flagEmoji: "🇧🇷" },
  { teamId: "MAR", name: "Morocco", group: "C", fifaRanking: 13, confederation: "CAF", flagEmoji: "🇲🇦" },
  { teamId: "HTI", name: "Haiti", group: "C", fifaRanking: 86, confederation: "CONCACAF", flagEmoji: "🇭🇹" },
  { teamId: "SCO", name: "Scotland", group: "C", fifaRanking: 52, confederation: "UEFA", flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  // Group D — Inglewood / Vancouver / Santa Clara / Seattle
  { teamId: "USA", name: "United States", group: "D", fifaRanking: 11, confederation: "CONCACAF", flagEmoji: "🇺🇸" },
  { teamId: "PAR", name: "Paraguay", group: "D", fifaRanking: 47, confederation: "CONMEBOL", flagEmoji: "🇵🇾" },
  { teamId: "AUS", name: "Australia", group: "D", fifaRanking: 24, confederation: "AFC", flagEmoji: "🇦🇺" },
  { teamId: "TUR", name: "Turkey", group: "D", fifaRanking: 26, confederation: "UEFA", flagEmoji: "🇹🇷" },
  // Group E — Houston / Philadelphia / Toronto / Kansas City
  { teamId: "GER", name: "Germany", group: "E", fifaRanking: 3, confederation: "UEFA", flagEmoji: "🇩🇪" },
  { teamId: "CUW", name: "Curaçao", group: "E", fifaRanking: 109, confederation: "CONCACAF", flagEmoji: "🇨🇼" },
  { teamId: "CIV", name: "Ivory Coast", group: "E", fifaRanking: 39, confederation: "CAF", flagEmoji: "🇨🇮" },
  { teamId: "ECU", name: "Ecuador", group: "E", fifaRanking: 30, confederation: "CONMEBOL", flagEmoji: "🇪🇨" },
  // Group F — Arlington / Guadalajara / Houston / Kansas City
  { teamId: "NED", name: "Netherlands", group: "F", fifaRanking: 8, confederation: "UEFA", flagEmoji: "🇳🇱" },
  { teamId: "JPN", name: "Japan", group: "F", fifaRanking: 14, confederation: "AFC", flagEmoji: "🇯🇵" },
  { teamId: "SWE", name: "Sweden", group: "F", fifaRanking: 31, confederation: "UEFA", flagEmoji: "🇸🇪" },
  { teamId: "TUN", name: "Tunisia", group: "F", fifaRanking: 42, confederation: "CAF", flagEmoji: "🇹🇳" },
  // Group G — Seattle / Inglewood / Vancouver
  { teamId: "BEL", name: "Belgium", group: "G", fifaRanking: 10, confederation: "UEFA", flagEmoji: "🇧🇪" },
  { teamId: "EGY", name: "Egypt", group: "G", fifaRanking: 34, confederation: "CAF", flagEmoji: "🇪🇬" },
  { teamId: "IRN", name: "Iran", group: "G", fifaRanking: 20, confederation: "AFC", flagEmoji: "🇮🇷" },
  { teamId: "NZL", name: "New Zealand", group: "G", fifaRanking: 93, confederation: "OFC", flagEmoji: "🇳🇿" },
  // Group H — Atlanta / Miami / Guadalajara
  { teamId: "ESP", name: "Spain", group: "H", fifaRanking: 1, confederation: "UEFA", flagEmoji: "🇪🇸" },
  { teamId: "CPV", name: "Cape Verde", group: "H", fifaRanking: 73, confederation: "CAF", flagEmoji: "🇨🇻" },
  { teamId: "KSA", name: "Saudi Arabia", group: "H", fifaRanking: 56, confederation: "AFC", flagEmoji: "🇸🇦" },
  { teamId: "URU", name: "Uruguay", group: "H", fifaRanking: 9, confederation: "CONMEBOL", flagEmoji: "🇺🇾" },
  // Group I — East Rutherford / Foxborough / Philadelphia / Toronto
  { teamId: "FRA", name: "France", group: "I", fifaRanking: 2, confederation: "UEFA", flagEmoji: "🇫🇷" },
  { teamId: "SEN", name: "Senegal", group: "I", fifaRanking: 17, confederation: "CAF", flagEmoji: "🇸🇳" },
  { teamId: "IRQ", name: "Iraq", group: "I", fifaRanking: 62, confederation: "AFC", flagEmoji: "🇮🇶" },
  { teamId: "NOR", name: "Norway", group: "I", fifaRanking: 44, confederation: "UEFA", flagEmoji: "🇳🇴" },
  // Group J — Kansas City / Arlington / Santa Clara
  { teamId: "ARG", name: "Argentina", group: "J", fifaRanking: 4, confederation: "CONMEBOL", flagEmoji: "🇦🇷" },
  { teamId: "ALG", name: "Algeria", group: "J", fifaRanking: 37, confederation: "CAF", flagEmoji: "🇩🇿" },
  { teamId: "AUT", name: "Austria", group: "J", fifaRanking: 23, confederation: "UEFA", flagEmoji: "🇦🇹" },
  { teamId: "JOR", name: "Jordan", group: "J", fifaRanking: 68, confederation: "AFC", flagEmoji: "🇯🇴" },
  // Group K — Houston / Mexico City / Miami / Atlanta / Guadalajara
  { teamId: "POR", name: "Portugal", group: "K", fifaRanking: 6, confederation: "UEFA", flagEmoji: "🇵🇹" },
  { teamId: "COD", name: "DR Congo", group: "K", fifaRanking: 61, confederation: "CAF", flagEmoji: "🇨🇩" },
  { teamId: "UZB", name: "Uzbekistan", group: "K", fifaRanking: 64, confederation: "AFC", flagEmoji: "🇺🇿" },
  { teamId: "COL", name: "Colombia", group: "K", fifaRanking: 12, confederation: "CONMEBOL", flagEmoji: "🇨🇴" },
  // Group L — Arlington / Toronto / Foxborough / Philadelphia / East Rutherford
  { teamId: "ENG", name: "England", group: "L", fifaRanking: 7, confederation: "UEFA", flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { teamId: "CRO", name: "Croatia", group: "L", fifaRanking: 18, confederation: "UEFA", flagEmoji: "🇭🇷" },
  { teamId: "GHA", name: "Ghana", group: "L", fifaRanking: 42, confederation: "CAF", flagEmoji: "🇬🇭" },
  { teamId: "PAN", name: "Panama", group: "L", fifaRanking: 43, confederation: "CONCACAF", flagEmoji: "🇵🇦" },
];

interface MatchSeed {
  matchId: string;
  stage: string;
  team1Id: string;
  team2Id: string;
  scheduledDate: string;
  venue?: string;
}

export const GROUP_MATCHES: MatchSeed[] = [
  // Day 1 — June 11
  { matchId: "GA-1", stage: "group", team1Id: "MEX", team2Id: "RSA", scheduledDate: "2026-06-11", venue: "Mexico City" },
  { matchId: "GA-2", stage: "group", team1Id: "KOR", team2Id: "CZE", scheduledDate: "2026-06-11", venue: "Guadalajara" },
  // Day 2 — June 12
  { matchId: "GB-1", stage: "group", team1Id: "CAN", team2Id: "BIH", scheduledDate: "2026-06-12", venue: "Toronto" },
  { matchId: "GD-1", stage: "group", team1Id: "USA", team2Id: "PAR", scheduledDate: "2026-06-12", venue: "Los Angeles" },
  // Day 3 — June 13
  { matchId: "GB-2", stage: "group", team1Id: "QAT", team2Id: "SUI", scheduledDate: "2026-06-13", venue: "Santa Clara" },
  { matchId: "GC-1", stage: "group", team1Id: "BRA", team2Id: "MAR", scheduledDate: "2026-06-13", venue: "East Rutherford" },
  { matchId: "GC-2", stage: "group", team1Id: "HTI", team2Id: "SCO", scheduledDate: "2026-06-13", venue: "Foxborough" },
  { matchId: "GD-2", stage: "group", team1Id: "AUS", team2Id: "TUR", scheduledDate: "2026-06-13", venue: "Vancouver" },
  // Day 4 — June 14
  { matchId: "GE-1", stage: "group", team1Id: "GER", team2Id: "CUW", scheduledDate: "2026-06-14", venue: "Houston" },
  { matchId: "GF-1", stage: "group", team1Id: "NED", team2Id: "JPN", scheduledDate: "2026-06-14", venue: "Arlington" },
  { matchId: "GE-2", stage: "group", team1Id: "CIV", team2Id: "ECU", scheduledDate: "2026-06-14", venue: "Philadelphia" },
  { matchId: "GF-2", stage: "group", team1Id: "SWE", team2Id: "TUN", scheduledDate: "2026-06-14", venue: "Guadalajara" },
  // Day 5 — June 15
  { matchId: "GH-1", stage: "group", team1Id: "ESP", team2Id: "CPV", scheduledDate: "2026-06-15", venue: "Atlanta" },
  { matchId: "GG-1", stage: "group", team1Id: "BEL", team2Id: "EGY", scheduledDate: "2026-06-15", venue: "Seattle" },
  { matchId: "GH-2", stage: "group", team1Id: "KSA", team2Id: "URU", scheduledDate: "2026-06-15", venue: "Miami" },
  { matchId: "GG-2", stage: "group", team1Id: "IRN", team2Id: "NZL", scheduledDate: "2026-06-15", venue: "Los Angeles" },
  // Day 6 — June 16
  { matchId: "GI-1", stage: "group", team1Id: "FRA", team2Id: "SEN", scheduledDate: "2026-06-16", venue: "East Rutherford" },
  { matchId: "GI-2", stage: "group", team1Id: "IRQ", team2Id: "NOR", scheduledDate: "2026-06-16", venue: "Foxborough" },
  { matchId: "GJ-1", stage: "group", team1Id: "ARG", team2Id: "ALG", scheduledDate: "2026-06-16", venue: "Kansas City" },
  { matchId: "GJ-2", stage: "group", team1Id: "AUT", team2Id: "JOR", scheduledDate: "2026-06-16", venue: "Santa Clara" },
  // Day 7 — June 17
  { matchId: "GK-1", stage: "group", team1Id: "POR", team2Id: "COD", scheduledDate: "2026-06-17", venue: "Houston" },
  { matchId: "GL-1", stage: "group", team1Id: "ENG", team2Id: "CRO", scheduledDate: "2026-06-17", venue: "Arlington" },
  { matchId: "GL-2", stage: "group", team1Id: "GHA", team2Id: "PAN", scheduledDate: "2026-06-17", venue: "Toronto" },
  { matchId: "GK-2", stage: "group", team1Id: "UZB", team2Id: "COL", scheduledDate: "2026-06-17", venue: "Mexico City" },
  // Day 8 — June 18 (Matchday 2 starts)
  { matchId: "GA-3", stage: "group", team1Id: "CZE", team2Id: "RSA", scheduledDate: "2026-06-18", venue: "Atlanta" },
  { matchId: "GB-3", stage: "group", team1Id: "SUI", team2Id: "BIH", scheduledDate: "2026-06-18", venue: "Los Angeles" },
  { matchId: "GB-4", stage: "group", team1Id: "CAN", team2Id: "QAT", scheduledDate: "2026-06-18", venue: "Vancouver" },
  { matchId: "GA-4", stage: "group", team1Id: "MEX", team2Id: "KOR", scheduledDate: "2026-06-18", venue: "Guadalajara" },
  // Day 9 — June 19
  { matchId: "GD-3", stage: "group", team1Id: "USA", team2Id: "AUS", scheduledDate: "2026-06-19", venue: "Seattle" },
  { matchId: "GC-3", stage: "group", team1Id: "SCO", team2Id: "MAR", scheduledDate: "2026-06-19", venue: "Foxborough" },
  { matchId: "GC-4", stage: "group", team1Id: "BRA", team2Id: "HTI", scheduledDate: "2026-06-19", venue: "Philadelphia" },
  { matchId: "GD-4", stage: "group", team1Id: "TUR", team2Id: "PAR", scheduledDate: "2026-06-19", venue: "Santa Clara" },
  // Day 10 — June 20
  { matchId: "GF-3", stage: "group", team1Id: "NED", team2Id: "SWE", scheduledDate: "2026-06-20", venue: "Houston" },
  { matchId: "GE-3", stage: "group", team1Id: "GER", team2Id: "CIV", scheduledDate: "2026-06-20", venue: "Toronto" },
  { matchId: "GE-4", stage: "group", team1Id: "ECU", team2Id: "CUW", scheduledDate: "2026-06-20", venue: "Kansas City" },
  { matchId: "GF-4", stage: "group", team1Id: "TUN", team2Id: "JPN", scheduledDate: "2026-06-20", venue: "Guadalajara" },
  // Day 11 — June 21
  { matchId: "GH-3", stage: "group", team1Id: "ESP", team2Id: "KSA", scheduledDate: "2026-06-21", venue: "Atlanta" },
  { matchId: "GG-3", stage: "group", team1Id: "BEL", team2Id: "IRN", scheduledDate: "2026-06-21", venue: "Los Angeles" },
  { matchId: "GH-4", stage: "group", team1Id: "URU", team2Id: "CPV", scheduledDate: "2026-06-21", venue: "Miami" },
  { matchId: "GG-4", stage: "group", team1Id: "NZL", team2Id: "EGY", scheduledDate: "2026-06-21", venue: "Vancouver" },
  // Day 12 — June 22
  { matchId: "GJ-3", stage: "group", team1Id: "ARG", team2Id: "AUT", scheduledDate: "2026-06-22", venue: "Arlington" },
  { matchId: "GI-3", stage: "group", team1Id: "FRA", team2Id: "IRQ", scheduledDate: "2026-06-22", venue: "Philadelphia" },
  { matchId: "GI-4", stage: "group", team1Id: "NOR", team2Id: "SEN", scheduledDate: "2026-06-22", venue: "East Rutherford" },
  { matchId: "GJ-4", stage: "group", team1Id: "JOR", team2Id: "ALG", scheduledDate: "2026-06-22", venue: "Santa Clara" },
  // Day 13 — June 23
  { matchId: "GK-3", stage: "group", team1Id: "POR", team2Id: "UZB", scheduledDate: "2026-06-23", venue: "Houston" },
  { matchId: "GL-3", stage: "group", team1Id: "ENG", team2Id: "GHA", scheduledDate: "2026-06-23", venue: "Foxborough" },
  { matchId: "GL-4", stage: "group", team1Id: "PAN", team2Id: "CRO", scheduledDate: "2026-06-23", venue: "Toronto" },
  { matchId: "GK-4", stage: "group", team1Id: "COL", team2Id: "COD", scheduledDate: "2026-06-23", venue: "Guadalajara" },
  // Day 14 — June 24 (Matchday 3 — simultaneous kickoffs)
  { matchId: "GB-5", stage: "group", team1Id: "SUI", team2Id: "CAN", scheduledDate: "2026-06-24", venue: "Vancouver" },
  { matchId: "GB-6", stage: "group", team1Id: "BIH", team2Id: "QAT", scheduledDate: "2026-06-24", venue: "Seattle" },
  { matchId: "GC-5", stage: "group", team1Id: "SCO", team2Id: "BRA", scheduledDate: "2026-06-24", venue: "Miami" },
  { matchId: "GC-6", stage: "group", team1Id: "MAR", team2Id: "HTI", scheduledDate: "2026-06-24", venue: "Atlanta" },
  { matchId: "GA-5", stage: "group", team1Id: "CZE", team2Id: "MEX", scheduledDate: "2026-06-24", venue: "Mexico City" },
  { matchId: "GA-6", stage: "group", team1Id: "RSA", team2Id: "KOR", scheduledDate: "2026-06-24", venue: "Guadalajara" },
  // Day 15 — June 25
  { matchId: "GE-5", stage: "group", team1Id: "ECU", team2Id: "GER", scheduledDate: "2026-06-25", venue: "East Rutherford" },
  { matchId: "GE-6", stage: "group", team1Id: "CUW", team2Id: "CIV", scheduledDate: "2026-06-25", venue: "Philadelphia" },
  { matchId: "GF-5", stage: "group", team1Id: "JPN", team2Id: "SWE", scheduledDate: "2026-06-25", venue: "Arlington" },
  { matchId: "GF-6", stage: "group", team1Id: "TUN", team2Id: "NED", scheduledDate: "2026-06-25", venue: "Kansas City" },
  { matchId: "GD-5", stage: "group", team1Id: "TUR", team2Id: "USA", scheduledDate: "2026-06-25", venue: "Los Angeles" },
  { matchId: "GD-6", stage: "group", team1Id: "PAR", team2Id: "AUS", scheduledDate: "2026-06-25", venue: "Santa Clara" },
  // Day 16 — June 26
  { matchId: "GI-5", stage: "group", team1Id: "NOR", team2Id: "FRA", scheduledDate: "2026-06-26", venue: "Foxborough" },
  { matchId: "GI-6", stage: "group", team1Id: "SEN", team2Id: "IRQ", scheduledDate: "2026-06-26", venue: "Toronto" },
  { matchId: "GH-5", stage: "group", team1Id: "CPV", team2Id: "KSA", scheduledDate: "2026-06-26", venue: "Houston" },
  { matchId: "GH-6", stage: "group", team1Id: "URU", team2Id: "ESP", scheduledDate: "2026-06-26", venue: "Guadalajara" },
  { matchId: "GG-5", stage: "group", team1Id: "EGY", team2Id: "IRN", scheduledDate: "2026-06-26", venue: "Seattle" },
  { matchId: "GG-6", stage: "group", team1Id: "NZL", team2Id: "BEL", scheduledDate: "2026-06-26", venue: "Vancouver" },
  // Day 17 — June 27
  { matchId: "GL-5", stage: "group", team1Id: "PAN", team2Id: "ENG", scheduledDate: "2026-06-27", venue: "East Rutherford" },
  { matchId: "GL-6", stage: "group", team1Id: "CRO", team2Id: "GHA", scheduledDate: "2026-06-27", venue: "Philadelphia" },
  { matchId: "GK-5", stage: "group", team1Id: "COL", team2Id: "POR", scheduledDate: "2026-06-27", venue: "Miami" },
  { matchId: "GK-6", stage: "group", team1Id: "COD", team2Id: "UZB", scheduledDate: "2026-06-27", venue: "Atlanta" },
  { matchId: "GJ-5", stage: "group", team1Id: "ALG", team2Id: "AUT", scheduledDate: "2026-06-27", venue: "Kansas City" },
  { matchId: "GJ-6", stage: "group", team1Id: "JOR", team2Id: "ARG", scheduledDate: "2026-06-27", venue: "Arlington" },
];

export const KNOCKOUT_MATCHES: MatchSeed[] = [
  // Round of 32 — July 1-4
  { matchId: "R32-1", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-01" },
  { matchId: "R32-2", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-01" },
  { matchId: "R32-3", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-02" },
  { matchId: "R32-4", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-02" },
  { matchId: "R32-5", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-03" },
  { matchId: "R32-6", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-03" },
  { matchId: "R32-7", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-04" },
  { matchId: "R32-8", stage: "round32", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-04" },
  // Round of 16 — July 5-8
  { matchId: "R16-1", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-05" },
  { matchId: "R16-2", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-05" },
  { matchId: "R16-3", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-06" },
  { matchId: "R16-4", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-06" },
  { matchId: "R16-5", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-07" },
  { matchId: "R16-6", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-07" },
  { matchId: "R16-7", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-08" },
  { matchId: "R16-8", stage: "round16", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-08" },
  // Quarter Finals — July 11-12
  { matchId: "QF-1", stage: "quarter", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-11" },
  { matchId: "QF-2", stage: "quarter", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-11" },
  { matchId: "QF-3", stage: "quarter", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-12" },
  { matchId: "QF-4", stage: "quarter", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-12" },
  // Semi Finals — July 15-16
  { matchId: "SF-1", stage: "semi", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-15" },
  { matchId: "SF-2", stage: "semi", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-16" },
  // Third Place — July 18
  { matchId: "3RD", stage: "third", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-18" },
  // Final — July 19
  { matchId: "FINAL", stage: "final", team1Id: "TBD", team2Id: "TBD", scheduledDate: "2026-07-19", venue: "MetLife Stadium, NJ" },
];

export const ALL_MATCHES = [...GROUP_MATCHES, ...KNOCKOUT_MATCHES];
