import React from 'react';

export function ARLighting() {
  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Directional light to simulate sunlight */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Point light for additional illumination */}
      <pointLight position={[0, 5, 0]} intensity={0.3} />
      
      {/* Hemisphere light for realistic outdoor lighting */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#8B4513"
        intensity={0.4}
      />
    </>
  );
}