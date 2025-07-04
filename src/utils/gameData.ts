import { Game } from '../types';

export const homeGames: Game[] = [
  {
    id: '1',
    title: 'Darts',
    platform: 'Indoor Sport',
    totalPlayTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&h=300&fit=crop&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop&auto=format',
    description: 'Classic wooden chess set',
    location: 'Living Room',
    maxPlayers: 2,
    equipment: ['Chess Board', '32 Chess Pieces', 'Timer']
  }
];