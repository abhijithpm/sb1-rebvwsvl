import { useMemo } from 'react';
import { GameDimensions } from '../types';

export function useGameDimensions(gameType: string): GameDimensions {
  return useMemo(() => {
    switch (gameType.toLowerCase()) {
      case 'table tennis':
        return {
          width: 2.74,  // Length in meters
          height: 0.76, // Height in meters
          depth: 1.525, // Width in meters
        };
      case 'darts':
        return {
          width: 0.45,  // Diameter in meters
          height: 0.45, // Height in meters
          depth: 0.05,  // Depth in meters
        };
      case 'chess':
        return {
          width: 0.5,   // Board width in meters
          height: 0.05, // Height in meters
          depth: 0.5,   // Board depth in meters
        };
      default:
        return {
          width: 1,
          height: 1,
          depth: 1,
        };
    }
  }, [gameType]);
}