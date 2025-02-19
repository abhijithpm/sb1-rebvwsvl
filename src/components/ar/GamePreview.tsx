import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Game } from '../../types';
import { getGameDimensions } from '../../utils/dimensions';

interface GamePreviewProps {
  game: Game;
}

export function GamePreview({ game }: GamePreviewProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const dimensions = getGameDimensions(game.title);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, dimensions.height / 2, 0]}
      >
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