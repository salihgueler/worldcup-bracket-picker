export interface Team {
  teamId: string;
  type: string;
  name: string;
  group: string;
  fifaRanking: number;
  confederation: string;
  flagEmoji: string;
}

export interface Match {
  matchType: string;
  matchId: string;
  stage: string;
  team1Id: string;
  team2Id: string;
  scheduledDate: string;
  result?: string;
  score?: string;
}

export interface Pick {
  oddsType: string;
  oddsId: string;
  userId: string;
  matchId: string;
  predictedWinner: string;
  confidence?: number;
  createdAt: number;
}

export interface PickEvent {
  userId: string;
  username: string;
  matchId: string;
  predictedWinner: string;
}

export interface BracketState {
  groupPicks: Record<string, { first: string; second: string; third: string }>;
  thirdPlacePicks: string[]; // Which 8 of the 12 third-place teams advance
  knockoutPicks: Record<string, { winner: string; score?: string }>;
  locked: boolean;
}

export interface Player {
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  club: string;
  number?: number;
}

export interface TeamRoster {
  teamId: string;
  teamName: string;
  players: Player[];
}
