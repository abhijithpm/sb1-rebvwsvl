import React from 'react';
import { Camera, AlertCircle, ArrowLeft } from 'lucide-react';

interface ARPermissionScreenProps {
  onRequestPermission: () => void;
  onExit: () => void;
  error?: string;
}

export function ARPermissionScreen({ onRequestPermission, onExit, error }: ARPermissionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Camera Access Required
            </h2>
            
            <p className="text-gray-600 mb-6">
              To place games in your space using AR, we need access to your camera. 
              This allows us to detect surfaces and show you how games will fit in your room.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={onRequestPermission}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Enable Camera Access
              </button>
              
              <button
                onClick={onExit}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Your privacy is important to us. Camera access is only used for AR features and no data is stored or transmitted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}