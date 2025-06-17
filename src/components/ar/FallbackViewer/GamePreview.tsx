import React, { useState } from 'react';
import { Game } from '../../../types';
import { useGameDimensions } from '../../../hooks/useGameDimensions';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface GamePreviewProps {
  game: Game;
}

export function GamePreview({ game }: GamePreviewProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const dimensions = useGameDimensions(game.title);

  const handleScaleChange = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 45) % 360);
  };

  return (
    <div className="space-y-6">
      {/* Game Info Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{game.title}</h2>
            <p className="text-gray-600">{game.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Location: {game.location}</span>
              <span>Max {game.maxPlayers} players</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scale Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Size Scale</label>
              <span className="text-sm text-gray-500">{(scale * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleScaleChange(-0.1)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={() => handleScaleChange(0.1)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={scale >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rotation Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Rotation</label>
              <span className="text-sm text-gray-500">{rotation}°</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRotate}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rotate 45°
              </button>
              <input
                type="range"
                min="0"
                max="360"
                step="45"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2D Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top-Down View</h3>
        
        <div className="relative bg-gray-50 rounded-lg p-8 min-h-96 flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Game Representation */}
          <div
            className="relative bg-indigo-500 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300"
            style={{
              width: `${dimensions.width * 50 * scale}px`,
              height: `${dimensions.depth * 50 * scale}px`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <div className="text-white text-center">
              <div className="font-semibold text-sm">{game.title}</div>
              <div className="text-xs opacity-80">
                {(dimensions.width * scale).toFixed(1)}m × {(dimensions.depth * scale).toFixed(1)}m
              </div>
            </div>
          </div>

          {/* Scale Reference */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-10 h-0.5 bg-gray-400"></div>
              <span>1 meter</span>
            </div>
          </div>
        </div>

        {/* Dimensions Display */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Width</div>
            <div className="text-lg font-semibold text-gray-900">
              {(dimensions.width * scale).toFixed(1)}m
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Depth</div>
            <div className="text-lg font-semibold text-gray-900">
              {(dimensions.depth * scale).toFixed(1)}m
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Height</div>
            <div className="text-lg font-semibold text-gray-900">
              {(dimensions.height * scale).toFixed(1)}m
            </div>
          </div>
        </div>
      </div>

      {/* Space Requirements */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <Move className="w-5 h-5 mr-2" />
          Space Requirements
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>• Minimum room size: {(dimensions.width * scale + 1).toFixed(1)}m × {(dimensions.depth * scale + 1).toFixed(1)}m</p>
          <p>• Clearance needed: 0.5m on all sides for player movement</p>
          <p>• Ceiling height: Minimum {(dimensions.height + 0.5).toFixed(1)}m recommended</p>
          <p>• Floor type: Level, non-slip surface preferred</p>
        </div>
      </div>
    </div>
  );
}