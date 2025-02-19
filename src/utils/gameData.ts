import { Game } from '../types';

export const homeGames: Game[] = [
  {
    id: '1',
    title: 'Darts',
    platform: 'Indoor Sport',
    totalPlayTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1642078873520-829d9fda1c4b?auto=format&fit=crop&w=300&q=80',
    description: 'Professional dartboard with steel-tip darts',
    location: 'Game Room',
    maxPlayers: 4,
    equipment: ['Dartboard', '6 Steel-tip Darts', 'Scoreboard']
  },
  {
    id: '2',
    title: 'Table Tennis',
    platform: 'Indoor Sport',
    totalPlayTime: 24,
    imageUrl: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=300&q=80',
    description: 'Professional table tennis setup',
    location: 'Game Room',
    maxPlayers: 4,
    equipment: ['Table Tennis Table', '4 Paddles', 'Balls', 'Net']
  },
  {
    id: '3',
    title: 'Chess',
    platform: 'Board Game',
    totalPlayTime: 18,
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=300&q=80',
    description: 'Classic wooden chess set',
    location: 'Living Room',
    maxPlayers: 2,
    equipment: ['Chess Board', '32 Chess Pieces', 'Timer']
  }
];