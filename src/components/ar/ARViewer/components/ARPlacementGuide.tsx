import React from 'react';
import { Text } from '@react-three/drei';

interface ARPlacementGuideProps {
  title: string;
  height: number;
}

export function ARPlacementGuide({ title, height }: ARPlacementGuideProps) {
  return (
    <Text
      position={[0, height + 0.2, 0]}
      fontSize={0.2}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {title}
    </Text>
  );
}