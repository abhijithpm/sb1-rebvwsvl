import React from 'react';
import { FirebasePlayer } from '../../firebase/gameService';
import { Crown, Users, User, Wifi } from 'lucide-react';

interface PlayerListProps {
  players: FirebasePlayer[];
  host: string | null;
}

export function PlayerList({ players, host }: PlayerListProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Players ({players.length})</h3>
        </div>
        <div className="flex items-center text-green-400">
          <Wifi className="w-4 h-4 mr-1" />
          <span className="text-xs">Live</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {players.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">No players yet</p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Waiting for players to join...</p>
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                player.isHost 
                  ? 'bg-yellow-600/20 border border-yellow-500/30 animate-pulse' 
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
                  player.isAlive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {players.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-sm text-gray-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Minimum players:</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className={`font-medium ${
                players.length >= 3 ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {players.length >= 3 ? '✅ Ready to start' : '⏳ Need more players'}
              </span>
            </div>
            <div className="flex items-center justify-center mt-2 text-xs">
              <Wifi className="w-3 h-3 mr-1" />
              <span>Real-time updates active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}