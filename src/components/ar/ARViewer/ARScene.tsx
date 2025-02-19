import React from 'react';
import { XR, Controllers, Interactive } from '@react-three/xr';
import { Game } from '../../../types';
import { Vector3 } from 'three';
import { ARGamePreview } from './components/ARGamePreview';
import { AREnvironment } from './components/AREnvironment';
import { useARInteraction } from './hooks/useARInteraction';

interface ARSceneProps {
  selectedGame: Game | null;
  placedGames: Map<string, Vector3>;
  onPlaceGame: (gameId: string, position: Vector3) => void;
}

export function ARScene({ selectedGame, placedGames, onPlaceGame }: ARSceneProps) {
  const { handleSelect } = useARInteraction({ selectedGame, onPlaceGame });

  return (
    <XR>
      <AREnvironment />
      <Controllers />
      
      {selectedGame && (
        <Interactive onSelect={handleSelect}>
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
    </XR>
  );
}