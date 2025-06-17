import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { Vector3, Quaternion } from 'three';
import { Game } from '../../../../types';
import { useGameDimensions } from '../../../../hooks/useGameDimensions';

interface GameModelProps {
  game: Game;
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
  isPreview: boolean;
}

export function GameModel({ game, position, rotation, scale, isPreview }: GameModelProps) {
  const dimensions = useGameDimensions(game.title);
  
  const modelColor = useMemo(() => {
    switch (game.title.toLowerCase()) {
      case 'table tennis':
        return '#059669'; // Green
      case 'darts':
        return '#dc2626'; // Red
      case 'chess':
        return '#7c2d12'; // Brown
      default:
        return '#4f46e5'; // Indigo
    }
  }, [game.title]);

  const opacity = isPreview ? 0.7 : 1.0;

  return (
    <group
      position={[position.x, position.y, position.z]}
      quaternion={[rotation.x, rotation.y, rotation.z, rotation.w]}
      scale={[scale.x, scale.y, scale.z]}
    >
      {/* Main game object */}
      <mesh position={[0, dimensions.height / 2, 0]}>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={modelColor}
          opacity={opacity}
          transparent={isPreview}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Game title label */}
      <Text
        position={[0, dimensions.height + 0.3, 0]}
        fontSize={0.15}
        color={isPreview ? '#ffffff' : '#000000'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor={isPreview ? '#000000' : '#ffffff'}
      >
        {game.title}
      </Text>

      {/* Preview indicator */}
      {isPreview && (
        <mesh position={[0, dimensions.height + 0.1, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      )}

      {/* Placement outline for preview */}
      {isPreview && (
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[Math.max(dimensions.width, dimensions.depth) / 2, Math.max(dimensions.width, dimensions.depth) / 2 + 0.05]} />
          <meshBasicMaterial color="#ffffff" opacity={0.5} transparent side={2} />
        </mesh>
      )}
    </group>
  );
}