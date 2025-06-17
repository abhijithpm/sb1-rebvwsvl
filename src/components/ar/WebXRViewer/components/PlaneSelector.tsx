import React from 'react';
import { DetectedPlane, useARStore } from '../../../../store/arStore';
import { Grid3X3, CheckCircle } from 'lucide-react';

interface PlaneSelectorProps {
  planes: DetectedPlane[];
  selectedPlane: DetectedPlane | null;
}

export function PlaneSelector({ planes, selectedPlane }: PlaneSelectorProps) {
  const { selectPlane } = useARStore();

  if (planes.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 text-center text-white max-w-sm mx-4">
          <Grid3X3 className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold mb-3">Scanning for Surfaces</h3>
          <p className="text-gray-300 mb-4">
            Move your device slowly to detect flat surfaces where you can place games
          </p>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-20 left-4 right-4 z-20 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center mb-4">
          <Grid3X3 className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">
            Select Surface ({planes.length} found)
          </h3>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {planes.map((plane, index) => (
            <button
              key={plane.id}
              onClick={() => selectPlane(plane)}
              className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                selectedPlane?.id === plane.id
                  ? 'bg-indigo-100 border-2 border-indigo-500'
                  : 'bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                plane.type === 'horizontal' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {plane.type === 'horizontal' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {plane.type} Surface {index + 1}
                  </h4>
                  {selectedPlane?.id === plane.id && (
                    <CheckCircle className="w-5 h-5 text-indigo-600 ml-2" />
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Size: {plane.size.width.toFixed(1)}m × {plane.size.height.toFixed(1)}m</p>
                  <p>Area: {(plane.size.width * plane.size.height).toFixed(1)}m²</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Confidence: {(plane.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Choose a surface with enough space for your game. Horizontal surfaces work best for most games.
          </p>
        </div>
      </div>
    </div>
  );
}