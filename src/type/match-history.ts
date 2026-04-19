export interface MatchData {
  id: number;
  roomType: string;
  betToken: number;
  startTime: string;
  endTime: string;
  winners: string;
}

export interface MatchParticipant {
  id: number;
  userId: number;
  name: string;
  rank: number;
  tokenChange: number;
  match: MatchData;
}
