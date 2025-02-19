import React from 'react';
import { Clock, Trophy, Calendar } from 'lucide-react';
import { GameStats } from '../../types';

interface GameStatsProps {
  stats: GameStats;
}

export function GameStatsPanel({ stats }: GameStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        icon={<Clock className="w-6 h-6 text-indigo-600" />}
        title="Average Play Time"
        value={`${stats.averagePlayTime.toFixed(1)}h`}
      />
      <StatCard
        icon={<Trophy className="w-6 h-6 text-indigo-600" />}
        title="Total Sessions"
        value={stats.totalSessions.toString()}
      />
      <StatCard
        icon={<Calendar className="w-6 h-6 text-indigo-600" />}
        title="Favorite Game"
        value={stats.favoriteGame || 'Not enough data'}
      />
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}