import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Vector3 } from 'three';
import { useARStore } from '../../../../store/arStore';

export function HitTestManager() {
  const { session, isPresenting } = useXR();
  const { gl } = useThree();
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const frameCount = useRef(0);
  
  const { setLastHitTest, updateHitTestResults } = useARStore();

  useFrame(async () => {
    if (!session || !isPresenting) return;
    
    frameCount.current++;
    
    // Initialize hit test source
    if (!hitTestSourceRef.current && session.requestHitTestSource) {
      try {
        hitTestSourceRef.current = await session.requestHitTestSource({ space: 'viewer' });
      } catch (error) {
        console.warn('Failed to create hit test source:', error);
      }
    }

    // Perform hit testing every few frames for performance
    if (frameCount.current % 2 === 0 && hitTestSourceRef.current) {
      try {
        const frame = gl.xr.getFrame();
        if (!frame) return;

        const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
        
        if (hitTestResults.length > 0) {
          const results: Vector3[] = [];
          
          hitTestResults.forEach(result => {
            const pose = result.getPose(gl.xr.getReferenceSpace());
            if (pose) {
              const position = new Vector3(
                pose.transform.position.x,
                pose.transform.position.y,
                pose.transform.position.z
              );
              results.push(position);
            }
          });
          
          updateHitTestResults(results);
          
          // Update the primary hit test result
          if (results.length > 0) {
            setLastHitTest(results[0]);
          }
        }
      } catch (error) {
        console.warn('Hit test failed:', error);
      }
    }
  });

  return null;
}