import React from 'react';
import { XR, Controllers, Interactive } from '@react-three/xr';
import { Game } from '../../types';
import { GamePreview } from './GamePreview';
import { Vector3 } from 'three';

interface ARSceneProps {
  selectedGame: Game | null;
  placedGames: Map<string, Vector3>;
  onPlaceGame: (gameId: string, position: Vector3) => void;
}

export function ARScene({ selectedGame, placedGames, onPlaceGame }: ARSceneProps) {
  return (
    <XR>
      <Controllers />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {selectedGame && (
        <Interactive
          onSelect={(event) => {
            const position = event.intersection?.point;
            if (position) {
              onPlaceGame(selectedGame.id, position);
            }
          }}
        >
          <GamePreview game={selectedGame} />
        </Interactive>
      )}
      
      {/* Render placed games */}
      {Array.from(placedGames).map(([gameId, position]) => (
        <group key={gameId} position={position.toArray()}>
          <GamePreview game={selectedGame!} />
        </group>
      ))}
    </XR>
  );
}