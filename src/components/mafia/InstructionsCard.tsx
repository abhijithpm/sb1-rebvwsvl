import React from 'react';
import { Info, Skull, Shield, Search, Heart } from 'lucide-react';

export function InstructionsCard() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center mb-4">
        <Info className="w-6 h-6 text-green-400 mr-3" />
        <h3 className="text-xl font-bold text-white">How to Play</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-bold text-white mb-2">Roles</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Skull className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-300"><strong>Mafia:</strong> Eliminate villagers</span>
            </div>
            <div className="flex items-center">
              <Search className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-blue-300"><strong>Detective:</strong> Investigate players</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-green-300"><strong>Doctor:</strong> Protect players</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-300"><strong>Villager:</strong> Find the mafia</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-bold text-white mb-2">Game Flow</h4>
          <ol className="text-sm text-gray-300 space-y-1">
            <li>1. Players receive secret roles</li>
            <li>2. Discussion phase begins</li>
            <li>3. Host manages eliminations</li>
            <li>4. Continue until one side wins</li>
          </ol>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-bold text-white mb-2">Win Conditions</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Mafia wins:</strong> Eliminate all villagers</p>
            <p><strong>Villagers win:</strong> Eliminate all mafia</p>
          </div>
        </div>
      </div>
    </div>
  );
}