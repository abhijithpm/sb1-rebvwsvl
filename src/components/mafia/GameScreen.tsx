import React from 'react';
import { useGame } from './GameContext';
import { PlayerView } from './PlayerView';
import { HostDashboard } from './HostDashboard';
import { EliminatedView } from './EliminatedView';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export function GameScreen() {
  const { currentPlayer, gameState, isConnected } = useGame();
  const navigate = useNavigate();

  // Show loading if not connected or game state not loaded
  if (!isConnected || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Game...</h2>
          <p className="text-gray-300">Connecting to game server...</p>
        </div>
      </div>
    );
  }

  // If no current player, show join prompt instead of error
  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Join Required</h2>
            <p className="text-gray-300 mb-6">
              You need to join the game first to participate. Please go back to the lobby and join as a player or host.
            </p>
            <button
              onClick={() => navigate('/mafia')}
              className="w-full flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlayer.isAlive) {
    return <EliminatedView />;
  }

  if (currentPlayer.isHost) {
    return <HostDashboard />;
  }

  return <PlayerView />;
}