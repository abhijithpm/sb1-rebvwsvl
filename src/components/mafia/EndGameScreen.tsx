import React from 'react';
import { useGame } from './GameContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Wifi } from 'lucide-react';

export function EndGameScreen() {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
            GAME OVER
          </h1>
          <h2 className="text-4xl font-bold mb-6">
            {state.winner} Win!
          </h2>
          
          {/* Real-time indicator */}
          <div className="flex items-center justify-center text-green-400 mb-4">
            <Wifi className="w-5 h-5 mr-2" />
            <span className="text-sm">Synced across all devices</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold mb-6">Final Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-bold text-green-300 mb-2">Survivors</h4>
              <div className="space-y-2">
                {state.players.filter(p => p.isAlive).map((player) => (
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
                {state.eliminatedPlayers.map((player) => (
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
                <p className="font-bold">{state.players.length}</p>
              </div>
              <div>
                <p className="text-gray-400">Survivors</p>
                <p className="font-bold">{state.players.filter(p => p.isAlive).length}</p>
              </div>
              <div>
                <p className="text-gray-400">Eliminated</p>
                <p className="font-bold">{state.eliminatedPlayers.length}</p>
              </div>
            </div>
          </div>
        </div>

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

        <div className="mt-6 text-sm text-gray-400">
          🔄 All players will see this result in real-time
        </div>
      </div>
    </div>
  );
}