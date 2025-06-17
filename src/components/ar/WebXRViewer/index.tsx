import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { Game } from '../../../types';
import { WebXRScene } from './WebXRScene';
import { WebXRUI } from './WebXRUI';
import { WebXRCompatibilityCheck } from './WebXRCompatibilityCheck';
import { WebXRLoadingScreen } from './WebXRLoadingScreen';
import { useARStore } from '../../../store/arStore';

interface WebXRViewerProps {
  games: Game[];
  onExit: () => void;
}

const store = createXRStore();

export function WebXRViewer({ games, onExit }: WebXRViewerProps) {
  const { isXRSupported, isSessionActive, error } = useARStore();

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">AR Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onExit}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  if (!isXRSupported) {
    return <WebXRCompatibilityCheck onExit={onExit} />;
  }

  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <XR store={store}>
          <Suspense fallback={<WebXRLoadingScreen />}>
            <WebXRScene games={games} />
          </Suspense>
        </XR>
      </Canvas>
      
      <WebXRUI 
        games={games} 
        onExit={onExit}
        xrStore={store}
      />
    </div>
  );
}