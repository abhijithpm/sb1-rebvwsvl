import React from 'react';

export function WebXRLoadingScreen() {
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[2, 1]} />
      <meshBasicMaterial color="#4f46e5" opacity={0.8} transparent />
    </mesh>
  );
}