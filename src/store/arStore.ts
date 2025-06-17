import { create } from 'zustand';
import { Vector3, Quaternion } from 'three';

export interface PlacedObject {
  id: string;
  gameId: string;
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
  timestamp: number;
}

export interface DetectedPlane {
  id: string;
  center: Vector3;
  normal: Vector3;
  size: { width: number; height: number };
  confidence: number;
  type: 'horizontal' | 'vertical';
}

export interface ARState {
  // Session state
  isXRSupported: boolean;
  isSessionActive: boolean;
  sessionType: 'immersive-ar' | null;
  
  // Plane detection
  detectedPlanes: DetectedPlane[];
  selectedPlane: DetectedPlane | null;
  
  // Object placement
  placedObjects: PlacedObject[];
  selectedGameId: string | null;
  previewObject: PlacedObject | null;
  
  // UI state
  showPlaneVisualization: boolean;
  placementMode: 'select-plane' | 'position-object' | 'confirm' | 'idle';
  
  // Interaction
  hitTestResults: Vector3[];
  lastHitTest: Vector3 | null;
  
  // Error handling
  error: string | null;
  warnings: string[];
}

export interface ARActions {
  // Session management
  setXRSupported: (supported: boolean) => void;
  setSessionActive: (active: boolean) => void;
  setError: (error: string | null) => void;
  addWarning: (warning: string) => void;
  clearWarnings: () => void;
  
  // Plane detection
  updateDetectedPlanes: (planes: DetectedPlane[]) => void;
  selectPlane: (plane: DetectedPlane | null) => void;
  
  // Object placement
  setSelectedGame: (gameId: string | null) => void;
  updatePreviewObject: (object: PlacedObject | null) => void;
  confirmPlacement: () => void;
  removeObject: (id: string) => void;
  clearAllObjects: () => void;
  
  // UI state
  setPlacementMode: (mode: ARState['placementMode']) => void;
  togglePlaneVisualization: () => void;
  
  // Hit testing
  updateHitTestResults: (results: Vector3[]) => void;
  setLastHitTest: (position: Vector3 | null) => void;
  
  // Reset
  resetSession: () => void;
}

const initialState: ARState = {
  isXRSupported: false,
  isSessionActive: false,
  sessionType: null,
  detectedPlanes: [],
  selectedPlane: null,
  placedObjects: [],
  selectedGameId: null,
  previewObject: null,
  showPlaneVisualization: true,
  placementMode: 'idle',
  hitTestResults: [],
  lastHitTest: null,
  error: null,
  warnings: [],
};

export const useARStore = create<ARState & ARActions>((set, get) => ({
  ...initialState,
  
  setXRSupported: (supported) => set({ isXRSupported: supported }),
  setSessionActive: (active) => set({ isSessionActive: active }),
  setError: (error) => set({ error }),
  addWarning: (warning) => set((state) => ({ 
    warnings: [...state.warnings, warning] 
  })),
  clearWarnings: () => set({ warnings: [] }),
  
  updateDetectedPlanes: (planes) => set({ detectedPlanes: planes }),
  selectPlane: (plane) => set({ 
    selectedPlane: plane,
    placementMode: plane ? 'position-object' : 'select-plane'
  }),
  
  setSelectedGame: (gameId) => set({ 
    selectedGameId: gameId,
    placementMode: gameId ? 'select-plane' : 'idle'
  }),
  
  updatePreviewObject: (object) => set({ previewObject: object }),
  
  confirmPlacement: () => {
    const { previewObject, placedObjects } = get();
    if (previewObject) {
      set({
        placedObjects: [...placedObjects, previewObject],
        previewObject: null,
        placementMode: 'idle',
        selectedGameId: null,
        selectedPlane: null,
      });
    }
  },
  
  removeObject: (id) => set((state) => ({
    placedObjects: state.placedObjects.filter(obj => obj.id !== id)
  })),
  
  clearAllObjects: () => set({ placedObjects: [] }),
  
  setPlacementMode: (mode) => set({ placementMode: mode }),
  togglePlaneVisualization: () => set((state) => ({ 
    showPlaneVisualization: !state.showPlaneVisualization 
  })),
  
  updateHitTestResults: (results) => set({ hitTestResults: results }),
  setLastHitTest: (position) => set({ lastHitTest: position }),
  
  resetSession: () => set({
    ...initialState,
    isXRSupported: get().isXRSupported,
  }),
}));