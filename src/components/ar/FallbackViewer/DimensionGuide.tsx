import React from 'react';
import { Game } from '../../../types';
import { useGameDimensions } from '../../../hooks/useGameDimensions';
import { Ruler, AlertTriangle, CheckCircle } from 'lucide-react';

interface DimensionGuideProps {
  game: Game;
}

export function DimensionGuide({ game }: DimensionGuideProps) {
  const dimensions = useGameDimensions(game.title);

  const getSpaceCategory = (area: number) => {
    if (area < 4) return { label: 'Small Space', color: 'green', icon: CheckCircle };
    if (area < 8) return { label: 'Medium Space', color: 'yellow', icon: AlertTriangle };
    return { label: 'Large Space', color: 'red', icon: AlertTriangle };
  };

  const totalArea = dimensions.width * dimensions.depth;
  const spaceCategory = getSpaceCategory(totalArea);

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{game.title}</h2>
            <p className="text-gray-600">Detailed measurements and space requirements</p>
          </div>
        </div>
      </div>

      {/* Primary Dimensions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Ruler className="w-5 h-5 mr-2" />
          Game Dimensions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{dimensions.width.toFixed(1)}m</div>
            <div className="text-gray-600">Width</div>
            <div className="text-sm text-gray-500 mt-1">{(dimensions.width * 3.28084).toFixed(1)} feet</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{dimensions.depth.toFixed(1)}m</div>
            <div className="text-gray-600">Depth</div>
            <div className="text-sm text-gray-500 mt-1">{(dimensions.depth * 3.28084).toFixed(1)} feet</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{dimensions.height.toFixed(1)}m</div>
            <div className="text-gray-600">Height</div>
            <div className="text-sm text-gray-500 mt-1">{(dimensions.height * 3.28084).toFixed(1)} feet</div>
          </div>
        </div>
      </div>

      {/* Space Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Space Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <spaceCategory.icon className={`w-5 h-5 mr-2 ${
                spaceCategory.color === 'green' ? 'text-green-600' :
                spaceCategory.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                spaceCategory.color === 'green' ? 'bg-green-100 text-green-800' :
                spaceCategory.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {spaceCategory.label}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Game footprint:</span>
                <span className="font-medium">{totalArea.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">With clearance:</span>
                <span className="font-medium">{((dimensions.width + 1) * (dimensions.depth + 1)).toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recommended room:</span>
                <span className="font-medium">{((dimensions.width + 2) * (dimensions.depth + 2)).toFixed(1)} m²</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Room Compatibility</h4>
            <div className="space-y-2">
              {[
                { room: 'Small bedroom', size: '3×3m', compatible: totalArea <= 6 },
                { room: 'Living room', size: '4×5m', compatible: totalArea <= 15 },
                { room: 'Garage', size: '6×6m', compatible: totalArea <= 30 },
                { room: 'Basement', size: '5×8m', compatible: totalArea <= 35 },
              ].map((room, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{room.room} ({room.size})</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    room.compatible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {room.compatible ? 'Compatible' : 'Too small'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Guide */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure Your Space</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Step-by-Step Guide</h4>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                <span>Clear the area where you want to place the game</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                <span>Measure the length and width of the available space</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                <span>Check ceiling height (especially important for active games)</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
                <span>Ensure 0.5m clearance on all sides for safety</span>
              </li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tools You'll Need</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span>Measuring tape (at least 5m long)</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span>Smartphone with measuring app (alternative)</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span>Pencil and paper for notes</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span>Helper for accurate measurements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Equipment Requirements */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment & Setup</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Required Equipment</h4>
            <ul className="space-y-2">
              {game.equipment.map((item, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Setup Considerations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Level floor surface required</li>
              <li>• Good lighting recommended</li>
              <li>• Adequate ventilation for active play</li>
              <li>• Storage space for equipment when not in use</li>
              <li>• Easy access for setup and takedown</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}