import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
  currentPlayer: Player | null;
  timer: number;
  isTimerRunning: boolean;
  eliminatedPlayers: Player[];
  gameStarted: boolean;
  winner: string | null;
}

type GameAction =
  | { type: 'JOIN_AS_HOST'; payload: { name: string } }
  | { type: 'JOIN_AS_PLAYER'; payload: { name: string } }
  | { type: 'START_GAME' }
  | { type: 'ASSIGN_ROLES' }
  | { type: 'ELIMINATE_PLAYER'; payload: { playerId: string } }
  | { type: 'START_TIMER'; payload: { duration: number } }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'END_GAME'; payload: { winner: string } }
  | { type: 'RESET_GAME' }
  | { type: 'LEAVE_GAME' };

const roles = ['Mafia', 'Detective', 'Doctor', 'Villager'];

const initialState: GameState = {
  gamePhase: 'lobby',
  players: [],
  host: null,
  currentPlayer: null,
  timer: 0,
  isTimerRunning: false,
  eliminatedPlayers: [],
  gameStarted: false,
  winner: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'JOIN_AS_HOST':
      if (state.host) return state; // Host already exists
      const hostPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: action.payload.name,
        isAlive: true,
        isHost: true,
      };
      return {
        ...state,
        host: hostPlayer,
        currentPlayer: hostPlayer,
        players: [hostPlayer],
      };

    case 'JOIN_AS_PLAYER':
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: action.payload.name,
        isAlive: true,
        isHost: false,
      };
      return {
        ...state,
        players: [...state.players, newPlayer],
        currentPlayer: state.currentPlayer || newPlayer,
      };

    case 'START_GAME':
      if (state.players.length < 3) return state; // Need at least 3 players
      return {
        ...state,
        gamePhase: 'playing',
        gameStarted: true,
      };

    case 'ASSIGN_ROLES':
      const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
      const playersWithRoles = state.players.map((player, index) => ({
        ...player,
        role: shuffledRoles[index % roles.length],
      }));
      return {
        ...state,
        players: playersWithRoles,
      };

    case 'ELIMINATE_PLAYER':
      const eliminatedPlayer = state.players.find(p => p.id === action.payload.playerId);
      if (!eliminatedPlayer) return state;
      
      const updatedPlayers = state.players.map(p =>
        p.id === action.payload.playerId ? { ...p, isAlive: false } : p
      );
      
      return {
        ...state,
        players: updatedPlayers,
        eliminatedPlayers: [...state.eliminatedPlayers, { ...eliminatedPlayer, isAlive: false }],
      };

    case 'START_TIMER':
      return {
        ...state,
        timer: action.payload.duration,
        isTimerRunning: true,
      };

    case 'STOP_TIMER':
      return {
        ...state,
        isTimerRunning: false,
      };

    case 'TICK_TIMER':
      return {
        ...state,
        timer: Math.max(0, state.timer - 1),
        isTimerRunning: state.timer > 1,
      };

    case 'END_GAME':
      return {
        ...state,
        gamePhase: 'ended',
        winner: action.payload.winner,
        isTimerRunning: false,
      };

    case 'RESET_GAME':
      return initialState;

    case 'LEAVE_GAME':
      return initialState;

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
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