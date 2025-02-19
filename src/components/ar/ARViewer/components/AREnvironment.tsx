import React from 'react';
import { Environment } from '@react-three/drei';

export function AREnvironment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="sunset" />
    </>
  );
}