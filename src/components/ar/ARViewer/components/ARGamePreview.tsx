import React from 'react';
import { Game } from '../../../../types';
import { useGameDimensions } from '../../../../hooks/useGameDimensions';
import { ARGameModel } from './ARGameModel';
import { ARPlacementGuide } from './ARPlacementGuide';

interface ARGamePreviewProps {
  game: Game;
  position?: [number, number, number];
}

export function ARGamePreview({ game, position = [0, 0, 0] }: ARGamePreviewProps) {
  const dimensions = useGameDimensions(game.title);
  
  return (
    <group position={position}>
      <ARGameModel dimensions={dimensions} />
      <ARPlacementGuide title={game.title} height={dimensions.height} />
    </group>
  );
}