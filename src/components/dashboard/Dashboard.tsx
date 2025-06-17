import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { GameGrid } from '../games/GameGrid';
import { GameStatsPanel } from './GameStats';
import { WebXRViewer } from '../ar/WebXRViewer';
import { homeGames } from '../../utils/gameData';
import { GameSession, GameStats } from '../../types';
import { Scan, Sparkles, Zap } from 'lucide-react';

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
        <WebXRViewer 
          games={homeGames} 
          onExit={() => setShowARViewer(false)} 
        />
      ) : (
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-bold mb-4">
                    Welcome to Your Game Center
                  </h1>
                  <p className="text-indigo-100 text-lg mb-6">
                    Experience the future of game planning with WebXR technology. 
                    Visualize and place games in your actual space using advanced AR.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Zap className="w-4 h-4 mr-2" />
                      WebXR Powered
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Real-time Tracking
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowARViewer(true)}
                  className="flex items-center px-8 py-4 bg-white text-indigo-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-semibold"
                >
                  <Scan className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-lg">Launch AR</div>
                    <div className="text-sm opacity-75">Place games in your space</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WebXR Technology</h3>
              <p className="text-gray-600">Advanced web-based AR using WebXR standards for seamless cross-platform compatibility</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plane Detection</h3>
              <p className="text-gray-600">Intelligent surface detection to find the perfect spots for your games</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Interaction</h3>
              <p className="text-gray-600">Interactive placement with real-time scaling, rotation, and positioning controls</p>
            </div>
          </div>
          
          <GameStatsPanel stats={gameStats} />
          <GameGrid games={homeGames} onPlayGame={handlePlayGame} />
        </main>
      )}
    </div>
  );
}