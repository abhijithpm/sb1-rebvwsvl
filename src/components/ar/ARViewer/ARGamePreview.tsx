import React from 'react';
import { Text } from '@react-three/drei';
import { Game } from '../../../types';
import { useGameDimensions } from '../../../hooks/useGameDimensions';

interface ARGamePreviewProps {
  game: Game;
  position?: [number, number, number];
}

export function ARGamePreview({ game, position = [0, 0, 0] }: ARGamePreviewProps) {
  const dimensions = useGameDimensions(game.title);
  
  return (
    <group position={position}>
      <mesh position={[0, dimensions.height / 2, 0]}>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color="#4f46e5" opacity={0.5} transparent />
      </mesh>
      
      <Text
        position={[0, dimensions.height + 0.2, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {game.title}
      </Text>
    </group>
  );
}