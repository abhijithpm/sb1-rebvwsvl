import React, { useState } from 'react';
import { useGame } from './GameContext';
import { Skull, AlertTriangle } from 'lucide-react';

export function KillSelector() {
  const { players, eliminatePlayer, isConnected } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEliminating, setIsEliminating] = useState(false);

  const alivePlayers = players.filter(p => p.isAlive && !p.isHost);

  const handleEliminate = async () => {
    if (selectedPlayer) {
      setIsEliminating(true);
      try {
        await eliminatePlayer(selectedPlayer);
        setSelectedPlayer('');
        setShowConfirm(false);
      } catch (error) {
        console.error('Failed to eliminate player:', error);
      } finally {
        setIsEliminating(false);
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center mb-4">
        <Skull className="w-6 h-6 text-red-400 mr-3" />
        <h3 className="text-xl font-bold text-white">Eliminate Player</h3>
      </div>

      {alivePlayers.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No players available to eliminate</p>
      ) : (
        <div className="space-y-4">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            disabled={isEliminating}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            <option value="">Select player to eliminate...</option>
            {alivePlayers.map((player) => (
              <option key={player.id} value={player.id} className="bg-gray-800">
                {player.name} ({player.role})
              </option>
            ))}
          </select>

          {selectedPlayer && !showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isEliminating}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              Eliminate Selected Player
            </button>
          )}

          {showConfirm && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                <span className="font-bold text-red-300">Confirm Elimination</span>
              </div>
              <p className="text-red-200 mb-4">
                Are you sure you want to eliminate{' '}
                <strong>
                  {alivePlayers.find(p => p.id === selectedPlayer)?.name}
                </strong>
                ? This action will be synced to all players immediately.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isEliminating}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEliminate}
                  disabled={isEliminating}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {isEliminating ? 'Eliminating...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}

          {/* Real-time sync indicator */}
          {isConnected && (
            <div className="text-xs text-gray-400 text-center">
              🔄 Changes sync instantly to all players
            </div>
          )}
        </div>
      )}
    </div>
  );
}