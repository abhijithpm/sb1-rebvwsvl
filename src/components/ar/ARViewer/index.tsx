import React, { useEffect } from 'react';
import { useMindAR } from '../../../hooks/useMindAR';
import { Game } from '../../../types';
import { ARControls } from './ARControls';
import { ARCamera } from './ARCamera';
import { AROverlay } from './AROverlay';
import { ARPermissionScreen } from './ARPermissionScreen';
import { ARLoadingScreen } from './ARLoadingScreen';

interface ARViewerProps {
  games: Game[];
  onExit: () => void;
}

export function ARViewer({ games, onExit }: ARViewerProps) {
  const {
    arState,
    cameraPermissions,
    videoRef,
    canvasRef,
    initializeMindAR,
    updateGameScale,
    selectGame,
    confirmPlacement,
    resetPlacement,
    stopAR,
  } = useMindAR();

  useEffect(() => {
    // Load MindAR script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js';
    script.onload = () => {
      console.log('MindAR loaded successfully');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      stopAR();
    };
  }, [stopAR]);

  const handleExit = () => {
    stopAR();
    onExit();
  };

  if (!cameraPermissions.granted) {
    return (
      <ARPermissionScreen
        onRequestPermission={initializeMindAR}
        onExit={handleExit}
        error={cameraPermissions.error}
      />
    );
  }

  if (!arState.isInitialized) {
    return <ARLoadingScreen onExit={handleExit} />;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Camera Feed */}
      <ARCamera videoRef={videoRef} canvasRef={canvasRef} />
      
      {/* AR Controls */}
      <ARControls
        games={games}
        arState={arState}
        onSelectGame={selectGame}
        onUpdateScale={updateGameScale}
        onConfirmPlacement={confirmPlacement}
        onResetPlacement={resetPlacement}
        onExit={handleExit}
      />
      
      {/* AR Overlay */}
      <AROverlay
        arState={arState}
        games={games}
      />
    </div>
  );
}