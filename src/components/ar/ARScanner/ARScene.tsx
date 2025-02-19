import React from 'react';
import { Interactive } from '@react-three/xr';
import { Vector3 } from 'three';
import { Game } from '../../../types';
import { ARGamePreview } from './ARGamePreview';
import { AREnvironment } from './AREnvironment';

interface ARSceneProps {
  selectedGame: Game | null;
  placedGames: Map<string, Vector3>;
  onPlaceGame: (gameId: string, position: Vector3) => void;
}

export function ARScene({ selectedGame, placedGames, onPlaceGame }: ARSceneProps) {
  return (
    <>
      <AREnvironment />
      
      {selectedGame && (
        <Interactive
          onSelect={(event) => {
            if (event.intersection?.point) {
              onPlaceGame(selectedGame.id, event.intersection.point);
            }
          }}
        >
          <ARGamePreview game={selectedGame} />
        </Interactive>
      )}
      
      {Array.from(placedGames).map(([gameId, position]) => {
        const game = selectedGame;
        if (!game) return null;
        return (
          <ARGamePreview
            key={gameId}
            game={game}
            position={position.toArray() as [number, number, number]}
          />
        );
      })}
    </>
  );
}