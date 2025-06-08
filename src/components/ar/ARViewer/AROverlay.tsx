import React from 'react';
import { CheckCircle, AlertTriangle, Scan } from 'lucide-react';
import { ARState } from '../../../types/ar';
import { Game } from '../../../types';

interface AROverlayProps {
  arState: ARState;
  games: Game[];
}

export function AROverlay({ arState, games }: AROverlayProps) {
  const selectedGame = games.find(g => g.id === arState.selectedGame);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Surface Detection Status */}
      {!arState.surfaceDetected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-center text-white max-w-sm mx-4">
            <Scan className="w-12 h-12 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Scanning Surface</h3>
            <p className="text-gray-300">
              Point your camera at a flat surface where you want to place the game
            </p>
          </div>
        </div>
      )}

      {/* Surface Detected Indicator */}
      {arState.surfaceDetected && !arState.selectedGame && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-green-600/90 backdrop-blur-sm rounded-full p-4 text-white">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Surface Dimensions Display */}
      {arState.surfaceDimensions && (
        <div className="absolute top-24 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Surface Info</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Width: {arState.surfaceDimensions.width.toFixed(1)}m</p>
              <p>Height: {arState.surfaceDimensions.height.toFixed(1)}m</p>
              <p>Area: {arState.surfaceDimensions.area.toFixed(1)}m²</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Confidence: {(arState.surfaceDimensions.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Preview Overlay */}
      {selectedGame && arState.surfaceDetected && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Virtual Game Representation */}
          <div 
            className="border-4 border-indigo-500 border-dashed rounded-lg bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center"
            style={{
              width: `${200 * arState.gameScale}px`,
              height: `${150 * arState.gameScale}px`,
              transform: 'perspective(1000px) rotateX(45deg)',
            }}
          >
            <div className="text-center text-white">
              <img
                src={selectedGame.imageUrl}
                alt={selectedGame.title}
                className="w-16 h-16 rounded-lg mx-auto mb-2 opacity-80"
              />
              <h4 className="font-semibold">{selectedGame.title}</h4>
              <p className="text-sm opacity-80">Scale: {(arState.gameScale * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Placement Confirmation */}
      {arState.placementConfirmed && selectedGame && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-green-600/95 backdrop-blur-sm rounded-xl p-6 text-center text-white max-w-sm mx-4">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Placement Confirmed!</h3>
            <p className="text-green-100">
              {selectedGame.title} has been virtually placed in your space
            </p>
          </div>
        </div>
      )}

      {/* Space Warning */}
      {selectedGame && arState.surfaceDimensions && arState.gameScale > 2 && (
        <div className="absolute bottom-48 left-4 right-4">
          <div className="bg-amber-600/95 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="text-sm">
                Game might be too large for the detected surface
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}