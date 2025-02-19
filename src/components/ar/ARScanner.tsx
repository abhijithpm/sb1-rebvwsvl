import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton } from '@react-three/xr';
import { Game } from '../../types';
import { ARControls } from './ARControls';
import { ARScene } from './ARScene';
import { useARPlacement } from '../../hooks/useARPlacement';

interface ARScannerProps {
  games: Game[];
  onSelectLocation: (gameId: string, position: THREE.Vector3) => void;
  onExit: () => void;
}

export function ARScanner({ games, onSelectLocation, onExit }: ARScannerProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { placedGames, placeGame } = useARPlacement();

  return (
    <div className="w-full h-screen relative">
      <ARControls
        games={games}
        onSelectGame={setSelectedGame}
        onExit={onExit}
      />
      
      <ARButton className="absolute top-4 right-4 z-10" />
      
      <Canvas>
        <ARScene
          selectedGame={selectedGame}
          placedGames={placedGames}
          onPlaceGame={(gameId, position) => {
            placeGame(gameId, position);
            onSelectLocation(gameId, position);
          }}
        />
      </Canvas>
    </div>
  );
}