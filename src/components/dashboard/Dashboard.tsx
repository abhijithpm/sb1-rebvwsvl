import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { GameGrid } from '../games/GameGrid';
import { GameStatsPanel } from './GameStats';
import { ARScanner } from '../ar/ARScanner';
import { homeGames } from '../../utils/gameData';
import { GameSession, GameStats } from '../../types';
import { Scan } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [showARScanner, setShowARScanner] = useState(false);
  const [gameStats] = useState<GameStats>({
    totalSessions: 24,
    averagePlayTime: 1.5,
    favoriteGame: 'Table Tennis',
  });

  const handlePlayGame = (gameId: string) => {
    const game = homeGames.find(g => g.id === gameId);
    if (game) {
      const session: GameSession = {
        id: Math.random().toString(36).substr(2, 9),
        gameId,
        userId: '1',
        players: 2,
        startTime: new Date(),
      };
      console.log('Starting game session:', session);
    }
  };

  const handleGameLocation = (gameId: string, position: THREE.Vector3) => {
    console.log(`Placing game ${gameId} at position:`, position);
    // In a real app, this would update the game's location in the backend
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={onLogout} />
      
      {showARScanner ? (
        <div className="relative">
          <ARScanner games={homeGames} onSelectLocation={handleGameLocation} />
          <button
            onClick={() => setShowARScanner(false)}
            className="absolute top-4 left-4 z-20 bg-white px-4 py-2 rounded-lg shadow-md"
          >
            Exit AR Mode
          </button>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Game Center</h2>
            <button
              onClick={() => setShowARScanner(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Scan className="w-5 h-5 mr-2" />
              AR Scanner
            </button>
          </div>
          
          <GameStatsPanel stats={gameStats} />
          <GameGrid games={homeGames} onPlayGame={handlePlayGame} />
        </main>
      )}
    </div>
  );
}