import { useEffect, useRef, useState, useCallback } from 'react';
import { ARState, SurfaceDimensions, CameraPermissions } from '../types/ar';

declare global {
  interface Window {
    MINDAR: any;
  }
}

export function useMindAR() {
  const [arState, setARState] = useState<ARState>({
    isInitialized: false,
    isTracking: false,
    surfaceDetected: false,
    surfaceDimensions: null,
    selectedGame: null,
    gameScale: 1,
    placementConfirmed: false,
  });

  const [cameraPermissions, setCameraPermissions] = useState<CameraPermissions>({
    granted: false,
  });

  const mindARRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermissions({ granted: true });
      return stream;
    } catch (error) {
      setCameraPermissions({
        granted: false,
        error: 'Camera access denied. Please enable camera permissions.'
      });
      throw error;
    }
  }, []);

  const initializeMindAR = useCallback(async () => {
    try {
      if (!window.MINDAR) {
        throw new Error('MindAR library not loaded');
      }

      const stream = await requestCameraPermission();
      
      // Initialize MindAR for plane detection
      mindARRef.current = new window.MINDAR.IMAGE({
        container: canvasRef.current,
        imageTargetSrc: null, // We'll use plane detection instead
        maxTrack: 1,
        uiLoading: 'no',
        uiScanning: 'no',
        uiError: 'no'
      });

      await mindARRef.current.start();
      
      setARState(prev => ({
        ...prev,
        isInitialized: true,
        isTracking: true
      }));

      // Start surface detection
      startSurfaceDetection();
      
    } catch (error) {
      console.error('Failed to initialize MindAR:', error);
      setARState(prev => ({
        ...prev,
        isInitialized: false,
        isTracking: false
      }));
    }
  }, [requestCameraPermission]);

  const startSurfaceDetection = useCallback(() => {
    if (!mindARRef.current) return;

    // Simulate surface detection (in a real implementation, this would use actual plane detection)
    const detectSurface = () => {
      // Mock surface detection with realistic dimensions
      const mockSurface: SurfaceDimensions = {
        width: 2.5 + Math.random() * 2, // 2.5-4.5 meters
        height: 1.5 + Math.random() * 1, // 1.5-2.5 meters
        area: 0,
        confidence: 0.8 + Math.random() * 0.2 // 80-100% confidence
      };
      
      mockSurface.area = mockSurface.width * mockSurface.height;

      setARState(prev => ({
        ...prev,
        surfaceDetected: true,
        surfaceDimensions: mockSurface
      }));
    };

    // Simulate detection after 2 seconds
    setTimeout(detectSurface, 2000);
  }, []);

  const updateGameScale = useCallback((scale: number) => {
    setARState(prev => ({
      ...prev,
      gameScale: Math.max(0.1, Math.min(3, scale)) // Clamp between 0.1x and 3x
    }));
  }, []);

  const selectGame = useCallback((gameId: string) => {
    setARState(prev => ({
      ...prev,
      selectedGame: gameId,
      gameScale: 1,
      placementConfirmed: false
    }));
  }, []);

  const confirmPlacement = useCallback(() => {
    setARState(prev => ({
      ...prev,
      placementConfirmed: true
    }));
  }, []);

  const resetPlacement = useCallback(() => {
    setARState(prev => ({
      ...prev,
      selectedGame: null,
      gameScale: 1,
      placementConfirmed: false
    }));
  }, []);

  const stopAR = useCallback(() => {
    if (mindARRef.current) {
      mindARRef.current.stop();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }

    setARState({
      isInitialized: false,
      isTracking: false,
      surfaceDetected: false,
      surfaceDimensions: null,
      selectedGame: null,
      gameScale: 1,
      placementConfirmed: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      stopAR();
    };
  }, [stopAR]);

  return {
    arState,
    cameraPermissions,
    videoRef,
    canvasRef,
    initializeMindAR,
    updateGameScale,
    selectGame,
    confirmPlacement,
    resetPlacement,
    stopAR,
  };
}