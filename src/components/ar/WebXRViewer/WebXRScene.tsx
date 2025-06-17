import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Vector3, Quaternion, Matrix4, Raycaster } from 'three';
import { Game } from '../../../types';
import { useARStore } from '../../../store/arStore';
import { PlaneDetection } from './components/PlaneDetection';
import { PlacedGameObjects } from './components/PlacedGameObjects';
import { PreviewObject } from './components/PreviewObject';
import { ARLighting } from './components/ARLighting';
import { HitTestManager } from './components/HitTestManager';

interface WebXRSceneProps {
  games: Game[];
}

export function WebXRScene({ games }: WebXRSceneProps) {
  const { session, isPresenting } = useXR();
  const { camera, gl } = useThree();
  const frameRef = useRef<number>(0);
  
  const {
    setSessionActive,
    updateDetectedPlanes,
    setLastHitTest,
    updatePreviewObject,
    selectedGameId,
    selectedPlane,
    placementMode,
    lastHitTest,
  } = useARStore();

  // Session management
  useEffect(() => {
    setSessionActive(isPresenting);
  }, [isPresenting, setSessionActive]);

  // Hit testing and plane detection
  useFrame(() => {
    if (!session || !isPresenting) return;
    
    frameRef.current++;
    
    // Perform hit testing every few frames for performance
    if (frameRef.current % 3 === 0) {
      performHitTest();
    }
    
    // Update plane detection
    if (frameRef.current % 10 === 0) {
      updatePlaneDetection();
    }
  });

  const performHitTest = async () => {
    if (!session || !session.requestHitTestSource) return;

    try {
      const hitTestSource = await session.requestHitTestSource({ space: 'viewer' });
      if (!hitTestSource) return;

      const frame = gl.xr.getFrame();
      if (!frame) return;

      const hitTestResults = frame.getHitTestResults(hitTestSource);
      
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(gl.xr.getReferenceSpace());
        
        if (pose) {
          const position = new Vector3(
            pose.transform.position.x,
            pose.transform.position.y,
            pose.transform.position.z
          );
          
          setLastHitTest(position);
          
          // Update preview object position if in placement mode
          if (selectedGameId && selectedPlane && placementMode === 'position-object') {
            updatePreviewPosition(position);
          }
        }
      }
    } catch (error) {
      console.warn('Hit test failed:', error);
    }
  };

  const updatePlaneDetection = () => {
    if (!session || !session.detectedPlanes) return;

    const planes = Array.from(session.detectedPlanes).map((plane, index) => {
      const pose = plane.planeSpace;
      const polygon = plane.polygon;
      
      // Calculate plane center and size
      let minX = Infinity, maxX = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      
      polygon.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minZ = Math.min(minZ, point.z);
        maxZ = Math.max(maxZ, point.z);
      });
      
      const width = maxX - minX;
      const height = maxZ - minZ;
      const center = new Vector3((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
      
      // Determine plane orientation
      const normal = new Vector3(0, 1, 0); // Simplified - in real implementation, calculate from pose
      const isHorizontal = Math.abs(normal.y) > 0.8;
      
      return {
        id: `plane-${index}`,
        center,
        normal,
        size: { width, height },
        confidence: 0.8, // WebXR doesn't provide confidence directly
        type: isHorizontal ? 'horizontal' as const : 'vertical' as const,
      };
    });

    updateDetectedPlanes(planes);
  };

  const updatePreviewPosition = (position: Vector3) => {
    if (!selectedGameId) return;

    const game = games.find(g => g.id === selectedGameId);
    if (!game) return;

    const previewObject = {
      id: `preview-${selectedGameId}`,
      gameId: selectedGameId,
      position: position.clone(),
      rotation: new Quaternion(),
      scale: new Vector3(1, 1, 1),
      timestamp: Date.now(),
    };

    updatePreviewObject(previewObject);
  };

  return (
    <>
      <ARLighting />
      <HitTestManager />
      <PlaneDetection />
      <PlacedGameObjects games={games} />
      <PreviewObject games={games} />
    </>
  );
}