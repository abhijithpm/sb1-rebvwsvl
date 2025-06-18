import React from 'react';
import { useGame } from './GameContext';
import { PlayerView } from './PlayerView';
import { HostDashboard } from './HostDashboard';
import { EliminatedView } from './EliminatedView';

export function GameScreen() {
  const { state } = useGame();

  if (!state.currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Game Error</h2>
          <p>No player found. Please rejoin the game.</p>
        </div>
      </div>
    );
  }

  if (!state.currentPlayer.isAlive) {
    return <EliminatedView />;
  }

  if (state.currentPlayer.isHost) {
    return <HostDashboard />;
  }

  return <PlayerView />;
}