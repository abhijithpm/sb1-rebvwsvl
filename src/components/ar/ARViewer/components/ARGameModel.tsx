import React from 'react';
import { GameDimensions } from '../../../../types';

interface ARGameModelProps {
  dimensions: GameDimensions;
}

export function ARGameModel({ dimensions }: ARGameModelProps) {
  return (
    <mesh position={[0, dimensions.height / 2, 0]}>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial color="#4f46e5" opacity={0.5} transparent />
    </mesh>
  );
}