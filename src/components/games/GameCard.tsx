import React, { useState } from 'react';
import { Game } from '../../types';
import { Play, Clock, Users, MapPin, Info } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={game.imageUrl}
        alt={game.title}
        className="w-full h-36 sm:h-48 object-cover"
      />
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold truncate flex-1 mr-2">{game.title}</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">{game.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span>Up to {game.maxPlayers} players</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span>{game.totalPlayTime}h played</span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700 mb-3 text-sm sm:text-base">{game.description}</p>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Equipment:</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {game.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={() => onPlay(game.id)}
          className="mt-3 sm:mt-4 w-full flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Start Game
        </button>
      </div>
    </div>
  );
}