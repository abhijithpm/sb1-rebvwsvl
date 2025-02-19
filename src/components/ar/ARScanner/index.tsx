import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { Game } from '../../../types';
import { ARControls } from './ARControls';
import { ARScene } from './ARScene';
import { useARPlacement } from '../../../hooks/useARPlacement';

interface ARScannerProps {
  games: Game[];
  onExit: () => void;
}

export function ARScanner({ games, onExit }: ARScannerProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { placedGames, placeGame } = useARPlacement();

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <ARControls
          games={games}
          onSelectGame={setSelectedGame}
          onExit={onExit}
        />
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <ARButton 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        />
      </div>
      
      <Canvas>
        <XR>
          <ARScene
            selectedGame={selectedGame}
            placedGames={placedGames}
            onPlaceGame={placeGame}
          />
        </XR>
      </Canvas>
    </div>
  );
}