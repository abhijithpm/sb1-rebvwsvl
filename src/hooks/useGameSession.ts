import { useState } from 'react';
import { GameSession } from '../types';

export function useGameSession() {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  const startSession = (gameId: string, players: number = 2): GameSession => {
    const session: GameSession = {
      id: Math.random().toString(36).substr(2, 9),
      gameId,
      userId: '1', // In a real app, this would come from auth context
      players,
      startTime: new Date(),
    };
    setCurrentSession(session);
    return session;
  };

  const endSession = (score?: string) => {
    if (currentSession) {
      const endTime = new Date();
      const duration = (endTime.getTime() - currentSession.startTime.getTime()) / (1000 * 60 * 60); // in hours
      
      const endedSession = {
        ...currentSession,
        endTime,
        duration,
        score,
      };
      
      setCurrentSession(null);
      return endedSession;
    }
  };

  return {
    currentSession,
    startSession,
    endSession,
  };
}