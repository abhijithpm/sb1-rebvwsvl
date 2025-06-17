import React from 'react';
import { XRStore } from '@react-three/xr';
import { X, Play, Square, Eye, EyeOff } from 'lucide-react';
import { useARStore } from '../../../../store/arStore';

interface ARSessionControlsProps {
  xrStore: XRStore;
  onExit: () => void;
  isSessionActive: boolean;
}

export function ARSessionControls({ xrStore, onExit, isSessionActive }: ARSessionControlsProps) {
  const { 
    showPlaneVisualization, 
    togglePlaneVisualization,
    resetSession,
    placedObjects 
  } = useARStore();

  const handleStartAR = async () => {
    try {
      await xrStore.enterAR();
    } catch (error) {
      console.error('Failed to start AR session:', error);
    }
  };

  const handleStopAR = async () => {
    try {
      await xrStore.exitXR();
      resetSession();
    } catch (error) {
      console.error('Failed to stop AR session:', error);
    }
  };

  const handleExit = () => {
    if (isSessionActive) {
      handleStopAR();
    }
    onExit();
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-white text-lg font-semibold">
            {isSessionActive ? 'AR Active' : 'AR Ready'}
          </h1>
          {placedObjects.length > 0 && (
            <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm">
              {placedObjects.length} placed
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isSessionActive && (
            <>
              <button
                onClick={togglePlaneVisualization}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                title={showPlaneVisualization ? 'Hide planes' : 'Show planes'}
              >
                {showPlaneVisualization ? (
                  <EyeOff className="w-5 h-5 text-white" />
                ) : (
                  <Eye className="w-5 h-5 text-white" />
                )}
              </button>
              
              <button
                onClick={handleStopAR}
                className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full hover:bg-red-600/80 transition-colors"
                title="Stop AR"
              >
                <Square className="w-5 h-5 text-white" />
              </button>
            </>
          )}
          
          {!isSessionActive && (
            <button
              onClick={handleStartAR}
              className="flex items-center px-4 py-2 bg-indigo-600/80 backdrop-blur-sm text-white rounded-full hover:bg-indigo-700/80 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Start AR
            </button>
          )}
          
          <button
            onClick={handleExit}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}