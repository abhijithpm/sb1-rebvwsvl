import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../layout/Header';
import { GameGrid } from '../games/GameGrid';
import { GameStatsPanel } from './GameStats';
import { WebXRViewer } from '../ar/WebXRViewer';
import { FallbackViewer } from '../ar/FallbackViewer';
import { homeGames } from '../../utils/gameData';
import { GameSession, GameStats } from '../../types';
import { Scan, Sparkles, Zap, Eye, Ruler, Skull } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [showARViewer, setShowARViewer] = useState(false);
  const [showFallbackViewer, setShowFallbackViewer] = useState(false);
  const navigate = useNavigate();
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

  const handleARLaunch = () => {
    if ('xr' in navigator) {
      setShowARViewer(true);
    } else {
      setShowFallbackViewer(true);
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
      ) : showFallbackViewer ? (
        <FallbackViewer
          games={homeGames}
          onExit={() => setShowFallbackViewer(false)}
        />
      ) : (
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Mafia Game Banner */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-red-500/20 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-16 sm:translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-24 sm:h-24 bg-red-400/20 rounded-full translate-y-6 -translate-x-6 sm:translate-y-12 sm:-translate-x-12"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                <div className="relative">
                  <Skull className="w-12 h-12 sm:w-16 sm:h-16 text-red-200 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-red-800">!</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">ILLAM MAFIA</h2>
                  <p className="text-red-100 text-base sm:text-lg mb-3">
                    Enter the shadows of deception. Trust no one. Survive the night.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                      <Skull className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Multiplayer
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Real-time
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/mafia-home')}
                className="group relative px-4 sm:px-8 py-3 sm:py-4 bg-white text-red-600 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-base sm:text-lg w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <Skull className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                  PLAY MAFIA
                </span>
              </button>
            </div>
          </div>

          {/* AR Game Center Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl text-center lg:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Welcome to Your Game Center
                  </h1>
                  <p className="text-indigo-100 text-base sm:text-lg mb-6">
                    Experience the future of game planning with WebXR technology. 
                    Visualize and place games in your actual space using advanced AR.
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      WebXR Powered
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Real-time Tracking
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 w-full lg:w-auto">
                  <button
                    onClick={handleARLaunch}
                    className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-semibold w-full lg:w-auto"
                  >
                    <Scan className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    <div className="text-left">
                      <div className="text-base sm:text-lg">Launch AR</div>
                      <div className="text-xs sm:text-sm opacity-75">Place games in your space</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowFallbackViewer(true)}
                    className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 font-medium w-full lg:w-auto"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <div className="text-left">
                      <div className="text-sm">2D Preview</div>
                      <div className="text-xs opacity-75">Works on any device</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">WebXR Technology</h3>
              <p className="text-sm sm:text-base text-gray-600">Advanced web-based AR using WebXR standards for seamless cross-platform compatibility</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Plane Detection</h3>
              <p className="text-sm sm:text-base text-gray-600">Intelligent surface detection to find the perfect spots for your games</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Universal Compatibility</h3>
              <p className="text-sm sm:text-base text-gray-600">2D preview mode ensures everyone can plan their game space, regardless of device support</p>
            </div>
          </div>
          
          <GameStatsPanel stats={gameStats} />
          <GameGrid games={homeGames} onPlayGame={handlePlayGame} />
        </main>
      )}
    </div>
  );
}