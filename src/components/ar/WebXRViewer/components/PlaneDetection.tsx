import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';
import { useARStore } from '../../../../store/arStore';

export function PlaneDetection() {
  const meshRefs = useRef<Mesh[]>([]);
  const { detectedPlanes, showPlaneVisualization, selectedPlane } = useARStore();

  useFrame(() => {
    // Update plane visualizations
    meshRefs.current.forEach((mesh, index) => {
      if (mesh && detectedPlanes[index]) {
        const plane = detectedPlanes[index];
        mesh.position.copy(plane.center);
        mesh.lookAt(plane.center.clone().add(plane.normal));
        
        // Update material based on selection state
        const material = mesh.material as MeshBasicMaterial;
        const isSelected = selectedPlane?.id === plane.id;
        
        material.color.setHex(isSelected ? 0x4f46e5 : 0x10b981);
        material.opacity = isSelected ? 0.4 : 0.2;
      }
    });
  });

  if (!showPlaneVisualization) return null;

  return (
    <>
      {detectedPlanes.map((plane, index) => (
        <mesh
          key={plane.id}
          ref={(ref) => {
            if (ref) meshRefs.current[index] = ref;
          }}
          position={[plane.center.x, plane.center.y, plane.center.z]}
        >
          <planeGeometry args={[plane.size.width, plane.size.height]} />
          <meshBasicMaterial
            color={selectedPlane?.id === plane.id ? 0x4f46e5 : 0x10b981}
            opacity={selectedPlane?.id === plane.id ? 0.4 : 0.2}
            transparent
            side={DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}