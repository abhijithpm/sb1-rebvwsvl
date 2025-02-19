export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Game {
  id: string;
  title: string;
  platform: string;
  totalPlayTime: number;
  imageUrl: string;
  description: string;
  location: string;
  maxPlayers: number;
  equipment: string[];
  lastPlayed?: Date;
}

export interface GameSession {
  id: string;
  gameId: string;
  userId: string;
  players: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  score?: string;
}

export interface GameStats {
  totalSessions: number;
  averagePlayTime: number;
  lastPlayed?: Date;
  favoriteGame?: string;
}