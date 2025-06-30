import React from 'react';
import { useGame } from './GameContext';
import { PlayerView } from './PlayerView';
import { HostDashboard } from './HostDashboard';
import { EliminatedView } from './EliminatedView';

export function GameScreen() {
  const { currentPlayer, gameState, isConnected } = useGame();

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

  // If no current player, this should not happen as MafiaGame handles this case
  // But we'll add a fallback just in case
  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Syncing Player Data...</h2>
          <p className="text-gray-300">Please wait while we sync your player information...</p>
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