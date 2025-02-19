import React from 'react';
import { Game } from '../../../types';
import { X, Gamepad2 } from 'lucide-react';

interface ARControlsProps {
  games: Game[];
  onSelectGame: (game: Game | null) => void;
  onExit: () => void;
}

export function ARControls({ games, onSelectGame, onExit }: ARControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <select
        className="flex-1 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-white/20"
        onChange={(e) => {
          const game = games.find(g => g.id === e.target.value);
          onSelectGame(game || null);
        }}
      >
        <option value="">Select a game to place</option>
        {games.map(game => (
          <option key={game.id} value={game.id}>
            {game.title} ({game.dimensions?.width}m x {game.dimensions?.depth}m)
          </option>
        ))}
      </select>
      
      <button
        onClick={onExit}
        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/100 transition-colors"
        aria-label="Exit AR Mode"
      >
        <X className="w-6 h-6 text-gray-900" />
      </button>
    </div>
  );
}