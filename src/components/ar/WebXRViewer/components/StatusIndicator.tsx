import React from 'react';
import { useARStore } from '../../../../store/arStore';
import { Wifi, WifiOff, Eye, Scan, Target } from 'lucide-react';

export function StatusIndicator() {
  const {
    isSessionActive,
    detectedPlanes,
    placedObjects,
    placementMode,
    lastHitTest,
  } = useARStore();

  const getStatusInfo = () => {
    if (!isSessionActive) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        text: 'AR Inactive',
        color: 'bg-gray-500',
      };
    }

    switch (placementMode) {
      case 'select-plane':
        return {
          icon: <Scan className="w-4 h-4" />,
          text: `${detectedPlanes.length} surfaces found`,
          color: detectedPlanes.length > 0 ? 'bg-green-500' : 'bg-yellow-500',
        };
      case 'position-object':
        return {
          icon: <Target className="w-4 h-4" />,
          text: 'Positioning game',
          color: lastHitTest ? 'bg-blue-500' : 'bg-yellow-500',
        };
      default:
        return {
          icon: <Eye className="w-4 h-4" />,
          text: `AR Active • ${placedObjects.length} placed`,
          color: 'bg-green-500',
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="absolute top-4 left-4 z-30 pointer-events-none">
      <div className={`${status.color} text-white px-3 py-2 rounded-full flex items-center space-x-2 shadow-lg backdrop-blur-sm`}>
        {status.icon}
        <span className="text-sm font-medium">{status.text}</span>
      </div>
    </div>
  );
}