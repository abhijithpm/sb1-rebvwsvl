import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { gameService, FirebaseGameState, FirebasePlayer } from '../../firebase/gameService';

export interface Player {
  id: string;
  name: string;
  role?: string;
  isAlive: boolean;
  isHost: boolean;
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
}

type GameAction =
  | { type: 'SET_CURRENT_PLAYER_ID'; payload: { playerId: string } }
  | { type: 'UPDATE_GAME_STATE'; payload: { gameState: FirebaseGameState } }
  | { type: 'SET_CONNECTION_STATUS'; payload: { connected: boolean } }
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
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CURRENT_PLAYER_ID':
      const currentPlayerData = state.players.find(p => p.id === action.payload.playerId) || null;
      return {
        ...state,
        currentPlayerId: action.payload.playerId,
        currentPlayerData,
      };

    case 'UPDATE_GAME_STATE':
      const { gameState } = action.payload;
      if (!gameState) return { ...state, isConnected: false };

      const players = Object.values(gameState.players || {});
      const host = players.find(p => p.isHost) || null;
      const eliminatedPlayers = Object.values(gameState.eliminatedPlayers || {});
      const updatedCurrentPlayerData = state.currentPlayerId 
        ? players.find(p => p.id === state.currentPlayerId) || null
        : null;

      return {
        ...state,
        gamePhase: gameState.gamePhase,
        players,
        host,
        currentPlayerData: updatedCurrentPlayerData,
        timer: gameState.timer,
        isTimerRunning: gameState.isTimerRunning,
        eliminatedPlayers,
        gameStarted: gameState.gameStarted,
        winner: gameState.winner,
        isConnected: true,
        error: null,
      };

    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload.connected,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'RESET_LOCAL_STATE':
      return {
        ...initialState,
        currentPlayerId: state.currentPlayerId,
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
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize Firebase connection
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeGame = async () => {
      try {
        await gameService.initializeRoom();
        
        // Listen to game state changes
        unsubscribe = gameService.onGameStateChange((gameState) => {
          if (gameState) {
            dispatch({ type: 'UPDATE_GAME_STATE', payload: { gameState } });
          } else {
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: { connected: false } });
          }
        });

        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { connected: true } });
      } catch (error) {
        console.error('Failed to initialize game:', error);
        dispatch({ type: 'SET_ERROR', payload: { error: 'Failed to connect to game server' } });
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
      const playerId = await gameService.joinAsHost(name);
      if (playerId) {
        dispatch({ type: 'SET_CURRENT_PLAYER_ID', payload: { playerId } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
      throw error;
    }
  };

  const joinAsPlayer = async (name: string) => {
    try {
      const playerId = await gameService.joinAsPlayer(name);
      dispatch({ type: 'SET_CURRENT_PLAYER_ID', payload: { playerId } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
      throw error;
    }
  };

  const startGame = async () => {
    try {
      await gameService.startGame();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
      throw error;
    }
  };

  const eliminatePlayer = async (playerId: string) => {
    try {
      await gameService.eliminatePlayer(playerId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
      throw error;
    }
  };

  const updateTimer = async (timer: number, isRunning: boolean) => {
    try {
      await gameService.updateTimer(timer, isRunning);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
      throw error;
    }
  };

  const endGame = async (winner: string) => {
    try {
      await gameService.endGame(winner);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
      throw error;
    }
  };

  const resetGame = async () => {
    try {
      await gameService.resetGame();
      dispatch({ type: 'RESET_LOCAL_STATE' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
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
      dispatch({ type: 'SET_ERROR', payload: { error: (error as Error).message } });
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