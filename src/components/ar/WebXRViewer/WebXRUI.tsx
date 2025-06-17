import React from 'react';
import { XRStore } from '@react-three/xr';
import { Game } from '../../../types';
import { useARStore } from '../../../store/arStore';
import { ARSessionControls } from './components/ARSessionControls';
import { GameSelector } from './components/GameSelector';
import { PlacementControls } from './components/PlacementControls';
import { PlaneSelector } from './components/PlaneSelector';
import { StatusIndicator } from './components/StatusIndicator';
import { ErrorBoundary } from './components/ErrorBoundary';

interface WebXRUIProps {
  games: Game[];
  onExit: () => void;
  xrStore: XRStore;
}

export function WebXRUI({ games, onExit, xrStore }: WebXRUIProps) {
  const {
    isSessionActive,
    placementMode,
    selectedGameId,
    detectedPlanes,
    selectedPlane,
    previewObject,
    warnings,
  } = useARStore();

  return (
    <ErrorBoundary>
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Status Indicator */}
        <StatusIndicator />
        
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="absolute top-20 left-4 right-4 pointer-events-auto">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="bg-amber-500/90 backdrop-blur-sm text-white p-3 rounded-lg mb-2 shadow-lg"
              >
                {warning}
              </div>
            ))}
          </div>
        )}

        {/* Session Controls */}
        <ARSessionControls
          xrStore={xrStore}
          onExit={onExit}
          isSessionActive={isSessionActive}
        />

        {/* Game Selection */}
        {isSessionActive && placementMode === 'idle' && (
          <GameSelector games={games} />
        )}

        {/* Plane Selection */}
        {isSessionActive && placementMode === 'select-plane' && selectedGameId && (
          <PlaneSelector
            planes={detectedPlanes}
            selectedPlane={selectedPlane}
          />
        )}

        {/* Placement Controls */}
        {isSessionActive && placementMode === 'position-object' && previewObject && (
          <PlacementControls
            game={games.find(g => g.id === selectedGameId)!}
            previewObject={previewObject}
          />
        )}

        {/* Instructions */}
        <div className="absolute bottom-8 left-4 right-4 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-xl text-center">
            {getInstructionText(placementMode, selectedGameId, detectedPlanes.length)}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

function getInstructionText(
  mode: string,
  selectedGameId: string | null,
  planeCount: number
): string {
  switch (mode) {
    case 'idle':
      return 'Select a game to place in your space';
    case 'select-plane':
      if (planeCount === 0) {
        return 'Move your device to scan for flat surfaces';
      }
      return `Found ${planeCount} surface${planeCount !== 1 ? 's' : ''}. Tap one to place your game`;
    case 'position-object':
      return 'Move your device to position the game, then tap to confirm';
    case 'confirm':
      return 'Tap confirm to place the game permanently';
    default:
      return 'Point your camera at the environment to begin';
  }
}