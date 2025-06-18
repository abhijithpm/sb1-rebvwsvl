import React from 'react';
import { Skull, Search, Heart, Shield } from 'lucide-react';

interface RoleCardProps {
  role?: string;
  playerName: string;
}

export function RoleCard({ role, playerName }: RoleCardProps) {
  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'Mafia':
        return {
          icon: <Skull className="w-12 h-12" />,
          color: 'from-red-600 to-red-800',
          borderColor: 'border-red-500',
          description: 'Eliminate villagers during the night. Work with other mafia members to win.',
          objective: 'Eliminate all villagers'
        };
      case 'Detective':
        return {
          icon: <Search className="w-12 h-12" />,
          color: 'from-blue-600 to-blue-800',
          borderColor: 'border-blue-500',
          description: 'Investigate players to discover their roles. Help villagers find the mafia.',
          objective: 'Find and eliminate all mafia'
        };
      case 'Doctor':
        return {
          icon: <Heart className="w-12 h-12" />,
          color: 'from-green-600 to-green-800',
          borderColor: 'border-green-500',
          description: 'Protect players from elimination. You can save someone each night.',
          objective: 'Keep villagers alive'
        };
      case 'Villager':
        return {
          icon: <Shield className="w-12 h-12" />,
          color: 'from-gray-600 to-gray-800',
          borderColor: 'border-gray-500',
          description: 'Use discussion and voting to identify and eliminate mafia members.',
          objective: 'Find and eliminate all mafia'
        };
      default:
        return {
          icon: <Shield className="w-12 h-12" />,
          color: 'from-gray-600 to-gray-800',
          borderColor: 'border-gray-500',
          description: 'Your role will be assigned when the game starts.',
          objective: 'Wait for role assignment'
        };
    }
  };

  if (!role) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Waiting for Game to Start</h2>
        <p className="text-gray-300">Your role will be revealed when the host starts the game.</p>
      </div>
    );
  }

  const roleInfo = getRoleInfo(role);

  return (
    <div className={`bg-gradient-to-r ${roleInfo.color} rounded-2xl p-8 border-2 ${roleInfo.borderColor} shadow-2xl`}>
      <div className="text-center text-white">
        <div className="mb-6">
          {roleInfo.icon}
        </div>
        
        <h2 className="text-3xl font-bold mb-2">Your Role</h2>
        <h3 className="text-4xl font-bold mb-4">{role.toUpperCase()}</h3>
        
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <p className="text-lg mb-3">{roleInfo.description}</p>
          <div className="border-t border-white/20 pt-3">
            <p className="font-bold">Objective: {roleInfo.objective}</p>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-3">
          <p className="font-medium">Playing as: {playerName}</p>
        </div>
      </div>
    </div>
  );
}