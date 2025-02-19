export interface GameDimensions {
  width: number;   // in meters
  height: number;  // in meters
  depth: number;   // in meters
}

export interface ARPlacement {
  gameId: string;
  position: [number, number, number];
  rotation: [number, number, number];
}