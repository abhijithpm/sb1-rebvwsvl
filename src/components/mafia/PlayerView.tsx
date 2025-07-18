import React from 'react';
import { useGame } from './hooks/useGame';
import { Timer } from './Timer';
import { RoleCard } from './RoleCard';
import { Skull, Users, Clock, Square, AlertTriangle } from 'lucide-react';

export function PlayerView() {
  const { currentPlayer, players, eliminatedPlayers, endGame } = useGame();

  const handleStopGame = async () => {
    if (confirm('Are you sure you want to request to stop the current game? This will end the game for all players.')) {
      try {
        await endGame('Game Stopped by Player');
      } catch (error) {
        console.error('Failed to stop game:', error);
        alert('Failed to stop game. Only the host can stop the game.');
      }
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            ILLAM MAFIA
          </h1>
          <p className="text-gray-300">Game in Progress</p>
          
          {/* Stop Game Button for Players */}
          <div className="mt-4">
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

        {/* Timer */}
        <div className="mb-8">
          <Timer />
        </div>

        {/* Player Role */}
        <div className="mb-8">
          <RoleCard role={currentPlayer.role} playerName={currentPlayer.name} />
        </div>

        {/* Game Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Alive Players</h3>
            <p className="text-2xl font-bold text-blue-400">
              {players.filter(p => p.isAlive).length}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Skull className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Eliminated</h3>
            <p className="text-2xl font-bold text-red-400">
              {eliminatedPlayers.length}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Your Status</h3>
            <p className="text-lg font-bold text-green-400">
              {currentPlayer.isAlive ? 'ALIVE' : 'ELIMINATED'}
            </p>
          </div>
        </div>

        {/* Player List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">All Players</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border ${
                  player.isAlive
                    ? 'bg-green-600/20 border-green-500/30'
                    : 'bg-red-600/20 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{player.name}</span>
                  <div className="flex items-center space-x-2">
                    {player.isHost && (
                      <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                        HOST
                      </span>
                    )}
                    <div className={`w-3 h-3 rounded-full ${
                      player.isAlive ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}