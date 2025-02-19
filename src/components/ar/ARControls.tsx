import React from 'react';
import { Game } from '../../types';

interface ARControlsProps {
  games: Game[];
  onSelectGame: (game: Game | null) => void;
  onExit: () => void;
}

export function ARControls({ games, onSelectGame, onExit }: ARControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 space-y-4">
      <select
        className="w-full bg-white px-4 py-2 rounded-lg shadow-md"
        onChange={(e) => onSelectGame(games.find(g => g.id === e.target.value) || null)}
      >
        <option value="">Select a game to place</option>
        {games.map(game => (
          <option key={game.id} value={game.id}>{game.title}</option>
        ))}
      </select>
      
      <button
        onClick={onExit}
        className="w-full bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        Exit AR Mode
      </button>
    </div>
  );
}
const customTooltip = ({ payload, label, active }) => {
  if (active && payload && payload.length) {
    console.log('Payload:', payload); // Debugging: Log payload to console

    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p>{`Year: ${label}`}</p>
        {payload.map((item, index) => {
          if (!item.dataKey) return null; // Ensure dataKey exists

          const dataKey = item.dataKey.split('.')[0]; // Extract customer key
          const data = item.payload[dataKey]; // Access customer data

          if (!data) return null; // Ensure valid data

          const { value, bookedBy, dateTime } = data;

          return (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: item.color, width: 10, height: 10, marginRight: 5 }}></div>
                <p>{`${dataKey.replace('cust', 'Customer ')}: ${item.name}`}</p>
              </div>
              <p>{`Capacity: ${value}%`}</p>
              <p>{`Booked By: ${bookedBy}`}</p>
              <p>{`Date & Time: ${dateTime}`}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
