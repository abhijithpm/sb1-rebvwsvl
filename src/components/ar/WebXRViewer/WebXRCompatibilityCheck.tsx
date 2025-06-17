import React, { useEffect, useState } from 'react';
import { Smartphone, AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useARStore } from '../../../store/arStore';

interface WebXRCompatibilityCheckProps {
  onExit: () => void;
}

export function WebXRCompatibilityCheck({ onExit }: WebXRCompatibilityCheckProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [compatibilityInfo, setCompatibilityInfo] = useState<{
    hasWebXR: boolean;
    hasImmersiveAR: boolean;
    userAgent: string;
    recommendations: string[];
  } | null>(null);

  const { setXRSupported, setError } = useARStore();

  useEffect(() => {
    checkWebXRSupport();
  }, []);

  const checkWebXRSupport = async () => {
    try {
      const hasWebXR = 'xr' in navigator;
      let hasImmersiveAR = false;
      const userAgent = navigator.userAgent;
      const recommendations: string[] = [];

      if (hasWebXR) {
        try {
          const isSupported = await navigator.xr?.isSessionSupported('immersive-ar');
          hasImmersiveAR = isSupported || false;
        } catch (error) {
          console.warn('Error checking AR session support:', error);
        }
      }

      // Generate recommendations based on device/browser
      if (!hasWebXR) {
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
          recommendations.push('Use Safari 14.5+ or Chrome 89+ on iOS');
          recommendations.push('Ensure iOS 14.5+ is installed');
        } else if (userAgent.includes('Android')) {
          recommendations.push('Use Chrome 81+ or Samsung Internet 13+');
          recommendations.push('Ensure ARCore is installed and updated');
        } else {
          recommendations.push('Use a WebXR-compatible mobile browser');
          recommendations.push('AR features require a mobile device with camera');
        }
      } else if (!hasImmersiveAR) {
        recommendations.push('Enable WebXR flags in browser settings');
        recommendations.push('Ensure device has AR capabilities');
        recommendations.push('Check if ARCore (Android) or ARKit (iOS) is available');
      }

      setCompatibilityInfo({
        hasWebXR,
        hasImmersiveAR,
        userAgent,
        recommendations,
      });

      setXRSupported(hasWebXR && hasImmersiveAR);
      
      if (!hasWebXR) {
        setError('WebXR is not supported on this device or browser');
      } else if (!hasImmersiveAR) {
        setError('Immersive AR is not available on this device');
      }

    } catch (error) {
      console.error('WebXR compatibility check failed:', error);
      setError('Failed to check WebXR compatibility');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Checking AR Support</h2>
          <p className="text-gray-600">Verifying WebXR capabilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AR Not Available</h2>
          <p className="text-gray-600">
            Your device or browser doesn't support the required AR features.
          </p>
        </div>

        {compatibilityInfo && (
          <div className="space-y-6">
            {/* Compatibility Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Compatibility Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">WebXR Support</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    compatibilityInfo.hasWebXR 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {compatibilityInfo.hasWebXR ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Immersive AR</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    compatibilityInfo.hasImmersiveAR 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {compatibilityInfo.hasImmersiveAR ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {compatibilityInfo.recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {compatibilityInfo.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Device Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Device Information</h3>
              <p className="text-xs text-gray-500 font-mono break-all">
                {compatibilityInfo.userAgent}
              </p>
            </div>

            {/* Helpful Links */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <div className="space-y-2">
                <a
                  href="https://immersiveweb.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WebXR Device Support
                </a>
                <a
                  href="https://developers.google.com/ar/devices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ARCore Supported Devices
                </a>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onExit}
          className="w-full mt-6 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </button>
      </div>
    </div>
  );
}