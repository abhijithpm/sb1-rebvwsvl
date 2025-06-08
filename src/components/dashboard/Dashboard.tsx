import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { GameGrid } from '../games/GameGrid';
import { GameStatsPanel } from './GameStats';
import { ARViewer } from '../ar/ARViewer';
import { homeGames } from '../../utils/gameData';
import { GameSession, GameStats } from '../../types';
import { Scan, Sparkles } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [showARViewer, setShowARViewer] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={onLogout} />
      
      {showARViewer ? (
        <ARViewer 
          games={homeGames} 
          onExit={() => setShowARViewer(false)} 
        />
      ) : (
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome to Your Game Center</h1>
                <p className="text-indigo-100 text-lg">
                  Visualize and plan your perfect game setup with AR technology
                </p>
              </div>
              <button
                onClick={() => setShowARViewer(true)}
                className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Scan className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">AR Placement</div>
                  <div className="text-sm opacity-90">Visualize in your space</div>
                </div>
                <Sparkles className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Scan className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AR Visualization</h3>
              <p className="text-gray-600">See how games fit in your actual space before setting them up</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Scaling</h3>
              <p className="text-gray-600">Adjust game sizes to perfectly match your available space</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Space Analytics</h3>
              <p className="text-gray-600">Get detailed measurements and recommendations for optimal placement</p>
            </div>
          </div>
          
          <GameStatsPanel stats={gameStats} />
          <GameGrid games={homeGames} onPlayGame={handlePlayGame} />
        </main>
      )}
    </div>
  );
}