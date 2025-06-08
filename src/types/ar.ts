export interface GameDimensions {
  width: number;   // in meters
  height: number;  // in meters
  depth: number;   // in meters
}

export interface ARPlacement {
  gameId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface SurfaceDimensions {
  width: number;
  height: number;
  area: number;
  confidence: number;
}

export interface ARState {
  isInitialized: boolean;
  isTracking: boolean;
  surfaceDetected: boolean;
  surfaceDimensions: SurfaceDimensions | null;
  selectedGame: string | null;
  gameScale: number;
  placementConfirmed: boolean;
}

export interface CameraPermissions {
  granted: boolean;
  error?: string;
}