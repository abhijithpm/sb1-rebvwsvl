import React from 'react';
import { Player } from './GameContext';
import { Crown, Users, User } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  host: Player | null;
}

export function PlayerList({ players, host }: PlayerListProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center mb-4">
        <Users className="w-6 h-6 text-blue-400 mr-3" />
        <h3 className="text-xl font-bold text-white">Players ({players.length})</h3>
      </div>
      
      <div className="space-y-3">
        {players.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No players yet</p>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center p-3 rounded-lg ${
                player.isHost 
                  ? 'bg-yellow-600/20 border border-yellow-500/30' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center flex-1">
                {player.isHost ? (
                  <Crown className="w-5 h-5 text-yellow-500 mr-3" />
                ) : (
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                )}
                <span className="font-medium text-white">{player.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {player.isHost && (
                  <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full font-medium">
                    HOST
                  </span>
                )}
                <div className={`w-3 h-3 rounded-full ${
                  player.isAlive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {players.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-sm text-gray-400">
            <p>Minimum players: 3</p>
            <p>Status: {players.length >= 3 ? '✅ Ready to start' : '⏳ Waiting for more players'}</p>
          </div>
        </div>
      )}
    </div>
  );
}