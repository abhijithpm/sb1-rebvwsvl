import React from 'react';
import { Game } from '../../../../types';
import { useARStore } from '../../../../store/arStore';
import { GameModel } from './GameModel';

interface PlacedGameObjectsProps {
  games: Game[];
}

export function PlacedGameObjects({ games }: PlacedGameObjectsProps) {
  const { placedObjects } = useARStore();

  return (
    <>
      {placedObjects.map((placedObject) => {
        const game = games.find(g => g.id === placedObject.gameId);
        if (!game) return null;

        return (
          <GameModel
            key={placedObject.id}
            game={game}
            position={placedObject.position}
            rotation={placedObject.rotation}
            scale={placedObject.scale}
            isPreview={false}
          />
        );
      })}
    </>
  );
}