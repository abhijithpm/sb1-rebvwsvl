import React from 'react';
import { useGame } from './GameContext';
import { Timer } from './Timer';
import { KillSelector } from './KillSelector';
import { Crown, Users, Skull, Trophy, Wifi } from 'lucide-react';

export function HostDashboard() {
  const { state, endGame } = useGame();

  const handleEndGame = async (winner: string) => {
    try {
      await endGame(winner);
    } catch (error) {
      console.error('Failed to end game:', error);
    }
  };

  const alivePlayers = state.players.filter(p => p.isAlive);
  const mafiaCount = alivePlayers.filter(p => p.role === 'Mafia').length;
  const villagerCount = alivePlayers.filter(p => p.role !== 'Mafia').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              HOST DASHBOARD
            </h1>
            <div className="ml-4 flex items-center text-green-400">
              <Wifi className="w-5 h-5 mr-1" />
              <span className="text-sm">Live</span>
            </div>
          </div>
          <p className="text-gray-300">Control the game and manage players • Real-time sync active</p>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <Timer />
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Total Alive</h3>
            <p className="text-2xl font-bold text-blue-400">{alivePlayers.length}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Skull className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Mafia Left</h3>
            <p className="text-2xl font-bold text-red-400">{mafiaCount}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Villagers</h3>
            <p className="text-2xl font-bold text-green-400">{villagerCount}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Eliminated</h3>
            <p className="text-2xl font-bold text-purple-400">{state.eliminatedPlayers.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Management */}
          <div className="space-y-6">
            <KillSelector />
            
            {/* Win Condition Buttons */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">End Game</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleEndGame('Mafia')}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                >
                  Mafia Wins
                </button>
                <button
                  onClick={() => handleEndGame('Villagers')}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
                >
                  Villagers Win
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-400 text-center">
                🔄 Game end will sync to all players
              </div>
            </div>
          </div>

          {/* Full Role List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4">Player Roles (Live)</h3>
            <div className="space-y-3">
              {state.players.map((player) => (
                <div
                  key={player.id}
                  className={`p-4 rounded-lg border ${
                    player.isAlive
                      ? 'bg-white/5 border-white/20'
                      : 'bg-red-600/20 border-red-500/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">{player.name}</span>
                      {player.isHost && (
                        <span className="ml-2 px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                          HOST
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        player.role === 'Mafia' ? 'bg-red-600 text-white' :
                        player.role === 'Detective' ? 'bg-blue-600 text-white' :
                        player.role === 'Doctor' ? 'bg-green-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {player.role}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        player.isAlive ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Connection indicator */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-center text-sm text-gray-400">
                <Wifi className="w-4 h-4 mr-2" />
                Real-time updates • {state.players.length} players connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}