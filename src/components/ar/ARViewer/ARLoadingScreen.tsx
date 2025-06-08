import React from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';

interface ARLoadingScreenProps {
  onExit: () => void;
}

export function ARLoadingScreen({ onExit }: ARLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Initializing AR
          </h2>
          
          <p className="text-gray-600 mb-6">
            Setting up your camera and AR environment. This may take a few moments...
          </p>

          <div className="space-y-2 mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-500">Loading AR engine...</p>
          </div>

          <button
            onClick={onExit}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}