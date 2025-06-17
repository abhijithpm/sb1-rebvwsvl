import React from 'react';
import { Game } from '../../../../types';
import { PlacedObject, useARStore } from '../../../../store/arStore';
import { Check, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface PlacementControlsProps {
  game: Game;
  previewObject: PlacedObject;
}

export function PlacementControls({ game, previewObject }: PlacementControlsProps) {
  const { 
    confirmPlacement, 
    resetSession, 
    updatePreviewObject,
    setPlacementMode 
  } = useARStore();

  const handleScaleChange = (delta: number) => {
    const newScale = previewObject.scale.clone();
    const scaleFactor = Math.max(0.5, Math.min(3, newScale.x + delta));
    newScale.setScalar(scaleFactor);
    
    updatePreviewObject({
      ...previewObject,
      scale: newScale,
    });
  };

  const handleRotate = () => {
    const newRotation = previewObject.rotation.clone();
    newRotation.setFromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI / 4);
    
    updatePreviewObject({
      ...previewObject,
      rotation: newRotation,
    });
  };

  return (
    <div className="absolute bottom-8 left-4 right-4 z-20 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        {/* Game Info */}
        <div className="flex items-center mb-6">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-12 h-12 rounded-lg object-cover mr-4"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{game.title}</h3>
            <p className="text-sm text-gray-600">
              Scale: {(previewObject.scale.x * 100).toFixed(0)}% • Position with device movement
            </p>
          </div>
        </div>

        {/* Scale Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Size Adjustment</label>
            <span className="text-sm text-gray-500">
              {(previewObject.scale.x * 100).toFixed(0)}%
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleScaleChange(-0.1)}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={previewObject.scale.x <= 0.5}
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={previewObject.scale.x}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value) - previewObject.scale.x)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <button
              onClick={() => handleScaleChange(0.1)}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={previewObject.scale.x >= 3}
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Position Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Move className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">Positioning</span>
          </div>
          <p className="text-sm text-blue-800">
            Move your device to position the game on the surface. The game will follow your movement.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              resetSession();
              setPlacementMode('idle');
            }}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Cancel
          </button>
          
          <button
            onClick={confirmPlacement}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Place Game
          </button>
        </div>
      </div>
    </div>
  );
}