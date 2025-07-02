import React from 'react';
import { useGame } from './hooks/useGame';
import { LobbyScreen } from './LobbyScreen';
import { GameScreen } from './GameScreen';
import { EndGameScreen } from './EndGameScreen';

export function MafiaGame() {
  const { gameState, isConnected, currentPlayer } = useGame();

  // Show loading state if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
          <p className="text-gray-300">Establishing connection to Illam Gang room</p>
        </div>
      </div>
    );
  }

  // Show loading state if gameState is not yet loaded
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Game...</h2>
          <p className="text-gray-300">Syncing game state...</p>
        </div>
      </div>
    );
  }

  // Handle game phase routing
  switch (gameState.gamePhase) {
    case 'lobby':
      return <LobbyScreen />;
    case 'playing':
      // If game is playing but user hasn't joined, show lobby to join
      if (!currentPlayer) {
        return <LobbyScreen />;
      }
      return <GameScreen />;
    case 'ended':
      return <EndGameScreen />;
    default:
      return <LobbyScreen />;
  }
}