import React from 'react';
import { useGame } from './GameContext';
import { Skull, Eye, Square, AlertTriangle } from 'lucide-react';

export function EliminatedView() {
  const { players, eliminatedPlayers, endGame } = useGame();

  const handleStopGame = async () => {
    if (confirm('Are you sure you want to request to stop the current game? This will end the game for all players.')) {
      try {
        await endGame('Game Stopped by Eliminated Player');
      } catch (error) {
        console.error('Failed to stop game:', error);
        alert('Failed to stop game. Only the host can stop the game.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Skull className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-gray-500 bg-clip-text text-transparent mb-4">
            ELIMINATED
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            You have been eliminated from the game, but you can still watch the action unfold.
          </p>
          
          {/* Stop Game Button for Eliminated Players */}
          <div className="mb-8">
            <button
              onClick={handleStopGame}
              className="flex items-center px-6 py-3 bg-red-600/80 hover:bg-red-700 rounded-xl font-bold transition-colors shadow-lg mx-auto"
            >
              <Square className="w-5 h-5 mr-2" />
              Request Stop Game
            </button>
            <div className="mt-2 text-xs text-gray-400">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              This will end the game for all players
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold">Spectator Mode</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Watch the remaining players as they continue the game. You can see all the action but cannot participate.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="font-bold text-green-300 mb-2">Alive Players</h3>
              <p className="text-2xl font-bold text-green-400">
                {players.filter(p => p.isAlive).length}
              </p>
            </div>
            
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
              <h3 className="font-bold text-red-300 mb-2">Eliminated</h3>
              <p className="text-2xl font-bold text-red-400">
                {eliminatedPlayers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Remaining Players</h3>
          <div className="space-y-2">
            {players.filter(p => p.isAlive).map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <span className="font-medium">{player.name}</span>
                <div className="flex items-center space-x-2">
                  {player.isHost && (
                    <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                      HOST
                    </span>
                  )}
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}