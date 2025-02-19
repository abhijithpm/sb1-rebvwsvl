import { useState } from 'react';
import { Vector3 } from 'three';
import { Game } from '../types';

export function useARPlacement() {
  const [placedGames, setPlacedGames] = useState<Map<string, Vector3>>(new Map());

  const placeGame = (gameId: string, position: Vector3) => {
    setPlacedGames(prev => new Map(prev).set(gameId, position));
  };

  const removeGame = (gameId: string) => {
    setPlacedGames(prev => {
      const newMap = new Map(prev);
      newMap.delete(gameId);
      return newMap;
    });
  };

  const getGamePosition = (gameId: string) => {
    return placedGames.get(gameId);
  };

  return {
    placedGames,
    placeGame,
    removeGame,
    getGamePosition,
  };
}