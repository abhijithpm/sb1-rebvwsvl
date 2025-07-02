import React, { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Wifi, Clock } from 'lucide-react';

export function EndGameScreen() {
  const { gameState, players, eliminatedPlayers, resetGame } = useGame();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showResetMessage, setShowResetMessage] = useState(false);

  // Countdown timer for automatic reset
  useEffect(() => {
    if (gameState?.requiresCompleteReset) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowResetMessage(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState?.requiresCompleteReset]);

  // Show reset message when countdown reaches 0
  useEffect(() => {
    if (showResetMessage) {
      const timer = setTimeout(() => {
        navigate('/mafia-home');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showResetMessage, navigate]);

  const handlePlayAgain = async () => {
    try {
      await resetGame();
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/mafia-home');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading game results...</p>
        </div>
      </div>
    );
  }

  // Show reset message
  if (showResetMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              GAME RESET
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              All game data has been cleared. All players must rejoin to start a new game.
            </p>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300">
                🔄 Redirecting to home page in 3 seconds...
              </p>
            </div>
            
            <button
              onClick={handleGoHome}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors"
            >
              Go to Home Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
            GAME OVER
          </h1>
          <h2 className="text-4xl font-bold mb-6">
            {gameState.winner} Win!
          </h2>
          
          {/* Real-time indicator */}
          <div className="flex items-center justify-center text-green-400 mb-4">
            <Wifi className="w-5 h-5 mr-2" />
            <span className="text-sm">Synced across all devices</span>
          </div>
        </div>

        {/* Countdown Warning */}
        {gameState.requiresCompleteReset && countdown > 0 && (
          <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-red-400 mr-3 animate-pulse" />
              <h3 className="text-xl font-bold text-red-300">Database Reset Warning</h3>
            </div>
            <p className="text-red-200 mb-4">
              All game data will be permanently deleted in <span className="font-bold text-2xl text-red-100">{countdown}</span> seconds.
            </p>
            <p className="text-red-300 text-sm">
              🔄 All players will need to rejoin to start a new game session.
            </p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold mb-6">Final Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-bold text-green-300 mb-2">Survivors</h4>
              <div className="space-y-2">
                {players.filter(p => p.isAlive).map((player) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <span>{player.name}</span>
                    <span className="text-sm bg-green-600 px-2 py-1 rounded">
                      {player.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-bold text-red-300 mb-2">Eliminated</h4>
              <div className="space-y-2">
                {eliminatedPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <span>{player.name}</span>
                    <span className="text-sm bg-red-600 px-2 py-1 rounded">
                      {player.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold mb-2">Game Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Players</p>
                <p className="font-bold">{players.length}</p>
              </div>
              <div>
                <p className="text-gray-400">Survivors</p>
                <p className="font-bold">{players.filter(p => p.isAlive).length}</p>
              </div>
              <div>
                <p className="text-gray-400">Eliminated</p>
                <p className="font-bold">{eliminatedPlayers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show if reset hasn't been triggered */}
        {!gameState.requiresCompleteReset && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayAgain}
              className="flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
        )}

        {/* Go Home Button - Show when reset is triggered */}
        {gameState.requiresCompleteReset && countdown > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </button>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          🔄 All players will see this result in real-time
        </div>
      </div>
    </div>
  );
}