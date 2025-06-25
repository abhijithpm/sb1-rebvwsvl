import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { gameService, FirebaseGameState, FirebasePlayer, HostRequest } from '../../firebase/gameService';

export interface Player {
  id: string;
  name: string;
  role?: string;
  isAlive: boolean;
  isHost: boolean;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface GameState {
  gamePhase: 'lobby' | 'playing' | 'ended';
  players: Player[];
  host: Player | null;
  currentPlayerData: Player | null;
  currentPlayerId: string | null;
  timer: number;
  isTimerRunning: boolean;
  eliminatedPlayers: Player[];
  gameStarted: boolean;
  winner: string | null;
  isConnected: boolean;
  error: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  hostRequests: HostRequest[];
}

type GameAction =
  | { type: 'SET_CURRENT_PLAYER_ID'; payload: { playerId: string } }
  | { type: 'UPDATE_GAME_STATE'; payload: { gameState: FirebaseGameState } }
  | { type: 'SET_CONNECTION_STATUS'; payload: { status: 'connecting' | 'connected' | 'disconnected' | 'error' } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'RESET_LOCAL_STATE' };

const initialState: GameState = {
  gamePhase: 'lobby',
  players: [],
  host: null,
  currentPlayerData: null,
  currentPlayerId: null,
  timer: 0,
  isTimerRunning: false,
  eliminatedPlayers: [],
  gameStarted: false,
  winner: null,
  isConnected: false,
  error: null,
  connectionStatus: 'connecting',
  hostRequests: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CURRENT_PLAYER_ID':
      const currentPlayer = state.players.find(p => p.id === action.payload.playerId) || null;
      return {
        ...state,
        currentPlayerId: action.payload.playerId,
        currentPlayerData: currentPlayer,
      };

    case 'UPDATE_GAME_STATE':
      const { gameState } = action.payload;
      if (!gameState) return { 
        ...state, 
        isConnected: false, 
        connectionStatus: 'disconnected' 
      };

      const players = Object.values(gameState.players || {});
      const host = players.find(p => p.isHost) || null;
      const eliminatedPlayers = Object.values(gameState.eliminatedPlayers || {});
      const hostRequests = Object.values(gameState.hostRequests || {});
      const updatedCurrentPlayer = state.currentPlayerId 
        ? players.find(p => p.id === state.currentPlayerId) || null
        : null;

      return {
        ...state,
        gamePhase: gameState.gamePhase,
        players,
        host,
        currentPlayerData: updatedCurrentPlayer,
        timer: gameState.timer,
        isTimerRunning: gameState.isTimerRunning,
        eliminatedPlayers,
        gameStarted: gameState.gameStarted,
        winner: gameState.winner,
        isConnected: true,
        connectionStatus: 'connected',
        error: null,
        hostRequests,
      };

    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: action.payload.status,
        isConnected: action.payload.status === 'connected',
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
        connectionStatus: action.payload.error ? 'error' : state.connectionStatus,
      };

    case 'RESET_LOCAL_STATE':
      return {
        ...initialState,
        currentPlayerId: state.currentPlayerId,
        connectionStatus: 'connecting',
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Firebase actions
  joinAsHost: (name: string) => Promise<void>;
  joinAsPlayer: (name: string) => Promise<void>;
  startGame: () => Promise<void>;
  eliminatePlayer: (playerId: string) => Promise<void>;
  updateTimer: (timer: number, isRunning: boolean) => Promise<void>;
  endGame: (winner: string) => Promise<void>;
  resetGame: () => Promise<void>;
  leaveGame: () => Promise<void>;
  testConnection: () => Promise<void>;
  // Host request actions
  requestHost: () => Promise<void>;
  respondToHostRequest: (requestId: string, approved: boolean) => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize Firebase connection
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeGame = async () => {
      try {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'connecting' } });
        
        // Test connection first
        const isConnected = await gameService.testConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to Firebase');
        }

        await gameService.initializeRoom();
        
        // Listen to game state changes
        unsubscribe = gameService.onGameStateChange((gameState) => {
          if (gameState) {
            dispatch({ type: 'UPDATE_GAME_STATE', payload: { gameState } });
          } else {
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'disconnected' } });
          }
        });

        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'connected' } });
        console.log('✅ Game initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        dispatch({ type: 'SET_ERROR', payload: { error: `Connection failed: ${error.message}` } });
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'error' } });
      }
    };

    initializeGame();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Firebase action handlers
  const joinAsHost = async (name: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      const playerId = await gameService.joinAsHost(name);
      if (playerId) {
        dispatch({ type: 'SET_CURRENT_PLAYER_ID', payload: { playerId } });
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to join as host';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const joinAsPlayer = async (name: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      const playerId = await gameService.joinAsPlayer(name);
      dispatch({ type: 'SET_CURRENT_PLAYER_ID', payload: { playerId } });
    } catch (error) {
      const errorMessage = error.message || 'Failed to join as player';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const startGame = async () => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      await gameService.startGame();
    } catch (error) {
      const errorMessage = error.message || 'Failed to start game';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const eliminatePlayer = async (playerId: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      await gameService.eliminatePlayer(playerId);
    } catch (error) {
      const errorMessage = error.message || 'Failed to eliminate player';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const updateTimer = async (timer: number, isRunning: boolean) => {
    try {
      await gameService.updateTimer(timer, isRunning);
    } catch (error) {
      console.error('Failed to update timer:', error);
      // Don't show error for timer updates as they happen frequently
    }
  };

  const endGame = async (winner: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      await gameService.endGame(winner);
    } catch (error) {
      const errorMessage = error.message || 'Failed to end game';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const resetGame = async () => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      await gameService.resetGame();
      dispatch({ type: 'RESET_LOCAL_STATE' });
    } catch (error) {
      const errorMessage = error.message || 'Failed to reset game';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const leaveGame = async () => {
    try {
      if (state.currentPlayerId) {
        await gameService.leaveGame(state.currentPlayerId);
      }
      dispatch({ type: 'RESET_LOCAL_STATE' });
    } catch (error) {
      console.error('Failed to leave game:', error);
      dispatch({ type: 'RESET_LOCAL_STATE' });
    }
  };

  const testConnection = async () => {
    try {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'connecting' } });
      const isConnected = await gameService.testConnection();
      if (isConnected) {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'connected' } });
        dispatch({ type: 'SET_ERROR', payload: { error: null } });
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: 'Connection test failed' } });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: { status: 'error' } });
    }
  };

  // Host request actions
  const requestHost = async () => {
    try {
      if (!state.currentPlayerData) {
        throw new Error('You must be logged in to request host');
      }
      
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      await gameService.requestHost(state.currentPlayerData.id, state.currentPlayerData.name);
    } catch (error) {
      const errorMessage = error.message || 'Failed to request host';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  const respondToHostRequest = async (requestId: string, approved: boolean) => {
    try {
      if (!state.currentPlayerData?.isHost) {
        throw new Error('Only the host can respond to host requests');
      }
      
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      await gameService.respondToHostRequest(requestId, approved, state.currentPlayerData.id);
    } catch (error) {
      const errorMessage = error.message || 'Failed to respond to host request';
      dispatch({ type: 'SET_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      joinAsHost,
      joinAsPlayer,
      startGame,
      eliminatePlayer,
      updateTimer,
      endGame,
      resetGame,
      leaveGame,
      testConnection,
      requestHost,
      respondToHostRequest,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}