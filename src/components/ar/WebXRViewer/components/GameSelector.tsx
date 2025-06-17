import React from 'react';
import { Game } from '../../../../types';
import { useARStore } from '../../../../store/arStore';
import { Gamepad2 } from 'lucide-react';

interface GameSelectorProps {
  games: Game[];
}

export function GameSelector({ games }: GameSelectorProps) {
  const { setSelectedGame } = useARStore();

  return (
    <div className="absolute top-20 left-4 right-4 z-20 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center mb-4">
          <Gamepad2 className="w-6 h-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Select Game to Place</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-200 group"
            >
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-16 h-16 rounded-lg object-cover mr-4 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {game.title}
                </h4>
                <p className="text-sm text-gray-600 mb-1">{game.location}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-3">Max {game.maxPlayers} players</span>
                  <span>{game.totalPlayTime}h played</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}