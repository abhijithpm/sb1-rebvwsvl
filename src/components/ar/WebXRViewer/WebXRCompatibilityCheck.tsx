import React, { useEffect, useState } from 'react';
import { Smartphone, AlertTriangle, ArrowLeft, ExternalLink, Chrome, Variable as Safari, Download, CheckCircle, XCircle } from 'lucide-react';
import { useARStore } from '../../../store/arStore';

interface WebXRCompatibilityCheckProps {
  onExit: () => void;
}

interface CompatibilityInfo {
  hasWebXR: boolean;
  hasImmersiveAR: boolean;
  userAgent: string;
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  recommendations: string[];
  alternativeSolutions: string[];
  supportLevel: 'full' | 'partial' | 'none';
}

export function WebXRCompatibilityCheck({ onExit }: WebXRCompatibilityCheckProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [compatibilityInfo, setCompatibilityInfo] = useState<CompatibilityInfo | null>(null);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  const { setXRSupported, setError } = useARStore();

  useEffect(() => {
    checkWebXRSupport();
  }, []);

  const checkWebXRSupport = async () => {
    try {
      const userAgent = navigator.userAgent;
      const hasWebXR = 'xr' in navigator;
      let hasImmersiveAR = false;
      
      // Detect browser and version
      const browserInfo = detectBrowser(userAgent);
      const osInfo = detectOS(userAgent);
      const deviceInfo = detectDevice(userAgent);

      if (hasWebXR && navigator.xr) {
        try {
          hasImmersiveAR = await navigator.xr.isSessionSupported('immersive-ar');
        } catch (error) {
          console.warn('Error checking AR session support:', error);
        }
      }

      const recommendations: string[] = [];
      const alternativeSolutions: string[] = [];
      let supportLevel: 'full' | 'partial' | 'none' = 'none';

      // Generate specific recommendations based on browser/OS combination
      if (browserInfo.name === 'Safari') {
        if (osInfo === 'iOS') {
          if (parseFloat(browserInfo.version) >= 14.5) {
            recommendations.push('Enable WebXR in Safari Settings > Advanced > Experimental Features');
            recommendations.push('Ensure iOS 14.5+ is installed');
            supportLevel = 'partial';
          } else {
            recommendations.push('Update to Safari 14.5+ and iOS 14.5+');
            recommendations.push('WebXR support is limited on older iOS versions');
          }
        } else if (osInfo === 'macOS') {
          recommendations.push('Safari on macOS has limited WebXR support');
          recommendations.push('Try Chrome or Firefox for better WebXR compatibility');
          alternativeSolutions.push('Use Chrome 89+ for full WebXR support');
          alternativeSolutions.push('Consider using the mobile version on iPhone/iPad');
        }
      } else if (browserInfo.name === 'Chrome') {
        if (osInfo === 'Android') {
          if (parseFloat(browserInfo.version) >= 81) {
            recommendations.push('Ensure ARCore is installed and updated');
            recommendations.push('Enable WebXR flags in chrome://flags');
            supportLevel = hasImmersiveAR ? 'full' : 'partial';
          } else {
            recommendations.push('Update Chrome to version 81 or higher');
          }
        } else if (osInfo === 'iOS') {
          recommendations.push('Chrome on iOS uses Safari engine - limited WebXR support');
          alternativeSolutions.push('Use Safari instead for better iOS WebXR support');
        } else {
          recommendations.push('WebXR requires a mobile device with camera for AR features');
          alternativeSolutions.push('Try on an Android device with ARCore support');
          alternativeSolutions.push('Try on an iPhone/iPad with iOS 14.5+');
        }
      } else if (browserInfo.name === 'Firefox') {
        recommendations.push('Firefox has experimental WebXR support');
        recommendations.push('Enable WebXR in about:config');
        supportLevel = 'partial';
      } else {
        recommendations.push('Use a WebXR-compatible browser');
        alternativeSolutions.push('Chrome 81+ on Android with ARCore');
        alternativeSolutions.push('Safari 14.5+ on iOS 14.5+');
      }

      // Add device-specific recommendations
      if (deviceInfo === 'desktop') {
        alternativeSolutions.push('WebXR AR requires a mobile device with camera');
        alternativeSolutions.push('Try accessing from your smartphone or tablet');
      }

      // Add general fallback solutions
      alternativeSolutions.push('Use the 2D preview mode (coming soon)');
      alternativeSolutions.push('View game dimensions and placement guides');

      setCompatibilityInfo({
        hasWebXR,
        hasImmersiveAR,
        userAgent,
        browser: `${browserInfo.name} ${browserInfo.version}`,
        browserVersion: browserInfo.version,
        os: osInfo,
        device: deviceInfo,
        recommendations,
        alternativeSolutions,
        supportLevel,
      });

      setXRSupported(hasWebXR && hasImmersiveAR);
      
      if (!hasWebXR) {
        setError('WebXR is not supported on this browser');
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

  const detectBrowser = (userAgent: string) => {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      return { name: 'Chrome', version: match ? match[1] : 'Unknown' };
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      return { name: 'Safari', version: match ? match[1] : 'Unknown' };
    } else if (userAgent.includes('Firefox')) {
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      return { name: 'Firefox', version: match ? match[1] : 'Unknown' };
    } else if (userAgent.includes('Edg')) {
      const match = userAgent.match(/Edg\/(\d+\.\d+)/);
      return { name: 'Edge', version: match ? match[1] : 'Unknown' };
    }
    return { name: 'Unknown', version: 'Unknown' };
  };

  const detectOS = (userAgent: string): string => {
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  };

  const detectDevice = (userAgent: string): string => {
    if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
      return 'mobile';
    }
    if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
      return 'tablet';
    }
    return 'desktop';
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'none': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSupportLevelIcon = (level: string) => {
    switch (level) {
      case 'full': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <AlertTriangle className="w-4 h-4" />;
      case 'none': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
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
          <p className="text-gray-600">Analyzing your device and browser capabilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">WebXR Not Available</h2>
          <p className="text-gray-600">
            Your current setup doesn't support the required AR features, but we have solutions for you.
          </p>
        </div>

        {compatibilityInfo && (
          <div className="space-y-6">
            {/* Quick Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Current Setup</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getSupportLevelColor(compatibilityInfo.supportLevel)}`}>
                  {getSupportLevelIcon(compatibilityInfo.supportLevel)}
                  <span className="ml-1 capitalize">{compatibilityInfo.supportLevel} Support</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Browser:</span>
                  <p className="font-medium">{compatibilityInfo.browser}</p>
                </div>
                <div>
                  <span className="text-gray-600">Device:</span>
                  <p className="font-medium">{compatibilityInfo.os} {compatibilityInfo.device}</p>
                </div>
              </div>
            </div>

            {/* Recommended Solutions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                Recommended Solutions
              </h3>
              <div className="space-y-3">
                {compatibilityInfo.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Solutions */}
            {compatibilityInfo.alternativeSolutions.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Alternative Options</h3>
                <div className="space-y-2">
                  {compatibilityInfo.alternativeSolutions.map((alt, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <p className="text-gray-700 text-sm">{alt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Browser-specific download links */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Get Compatible Browser</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.android.chrome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <Chrome className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Chrome for Android</p>
                    <p className="text-xs text-gray-600">Best WebXR support</p>
                  </div>
                </a>
                <a
                  href="https://apps.apple.com/app/safari/id1146562112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <Safari className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Safari for iOS</p>
                    <p className="text-xs text-gray-600">iOS 14.5+ required</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Technical Details Toggle */}
            <button
              onClick={() => setShowDetailedInfo(!showDetailedInfo)}
              className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Technical Details</span>
                <span className="text-gray-500">
                  {showDetailedInfo ? '−' : '+'}
                </span>
              </div>
            </button>

            {showDetailedInfo && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Compatibility Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">WebXR API</span>
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

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">User Agent</h4>
                  <p className="text-xs text-gray-500 font-mono break-all bg-white p-2 rounded">
                    {compatibilityInfo.userAgent}
                  </p>
                </div>
              </div>
            )}

            {/* Helpful Links */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Learn More</h3>
              <div className="space-y-2">
                <a
                  href="https://immersiveweb.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WebXR Device Support Database
                </a>
                <a
                  href="https://developers.google.com/ar/devices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ARCore Supported Devices
                </a>
                <a
                  href="https://webkit.org/blog/11827/introducing-webxr-in-safari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  WebXR in Safari Documentation
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onExit}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}