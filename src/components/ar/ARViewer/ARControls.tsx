import React from 'react';
import { X, ZoomIn, ZoomOut, Check, RotateCcw, Camera } from 'lucide-react';
import { Game } from '../../../types';
import { ARState } from '../../../types/ar';

interface ARControlsProps {
  games: Game[];
  arState: ARState;
  onSelectGame: (gameId: string) => void;
  onUpdateScale: (scale: number) => void;
  onConfirmPlacement: () => void;
  onResetPlacement: () => void;
  onExit: () => void;
}

export function ARControls({
  games,
  arState,
  onSelectGame,
  onUpdateScale,
  onConfirmPlacement,
  onResetPlacement,
  onExit,
}: ARControlsProps) {
  const selectedGameData = games.find(g => g.id === arState.selectedGame);

  return (
    <>
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-white" />
            <h1 className="text-white text-lg font-semibold">AR Game Placement</h1>
          </div>
          <button
            onClick={onExit}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Game Selection */}
      {!arState.selectedGame && arState.surfaceDetected && (
        <div className="absolute top-20 left-4 right-4 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Select a Game</h3>
            <div className="grid grid-cols-1 gap-3">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{game.title}</h4>
                    <p className="text-sm text-gray-600">{game.location}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scale Controls */}
      {arState.selectedGame && !arState.placementConfirmed && (
        <div className="absolute bottom-32 left-4 right-4 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Adjust Size</h3>
              <span className="text-sm text-gray-600">
                Scale: {(arState.gameScale * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onUpdateScale(arState.gameScale - 0.1)}
                className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                disabled={arState.gameScale <= 0.1}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={arState.gameScale}
                  onChange={(e) => onUpdateScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <button
                onClick={() => onUpdateScale(arState.gameScale + 0.1)}
                className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                disabled={arState.gameScale >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {selectedGameData && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedGameData.title}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Required space: {selectedGameData.location}</p>
                  <p>Max players: {selectedGameData.maxPlayers}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-4 right-4 z-20">
        <div className="flex justify-center space-x-4">
          {arState.selectedGame && !arState.placementConfirmed && (
            <>
              <button
                onClick={onResetPlacement}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </button>
              <button
                onClick={onConfirmPlacement}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm Placement
              </button>
            </>
          )}
          
          {arState.placementConfirmed && (
            <button
              onClick={onResetPlacement}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Place Another Game
            </button>
          )}
        </div>
      </div>
    </>
  );
}