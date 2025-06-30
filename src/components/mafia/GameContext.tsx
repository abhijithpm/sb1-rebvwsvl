import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { gameService, FirebaseGameState, FirebasePlayer } from '../../firebase/gameService';

interface GameContextType {
  gameState: FirebaseGameState | null;
  players: FirebasePlayer[];
  currentPlayerId: string | null;
  currentPlayer: FirebasePlayer | null;
  eliminatedPlayers: FirebasePlayer[];
  hostRequests: any[];
  isHost: boolean;
  isConnected: boolean;
  error: string | null;
  joinAsHost: (playerName: string) => Promise<string | null>;
  joinAsPlayer: (playerName: string) => Promise<string>;
  startGame: () => Promise<void>;
  eliminatePlayer: (playerId: string) => Promise<void>;
  updateTimer: (timer: number, isRunning: boolean) => Promise<void>;
  endGame: (winner: string) => Promise<void>;
  resetGame: () => Promise<void>;
  leaveGame: (playerId: string) => Promise<void>;
  requestHost: (playerId: string, playerName: string) => Promise<string>;
  respondToHostRequest: (requestId: string, approved: boolean, currentHostId: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, setGameState] = useState<FirebaseGameState | null>(null);
  const [players, setPlayers] = useState<FirebasePlayer[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived states
  const currentPlayer = currentPlayerId && players.length > 0 
    ? players.find(p => p.id === currentPlayerId) || null 
    : null;
  const eliminatedPlayers = players.filter(p => !p.isAlive);
  const hostRequests: any[] = gameState?.hostRequests ? Object.values(gameState.hostRequests) : [];
  const isHost = gameState?.host === currentPlayerId;

  useEffect(() => {
    let gameStateUnsubscribe: (() => void) | null = null;
    let playersUnsubscribe: (() => void) | null = null;

    const initializeGame = async () => {
      try {
        setError(null);
        console.log('🔄 Initializing game connection...');
        
        // Test connection first
        const connected = await gameService.testConnection();
        setIsConnected(connected);

        if (connected) {
          console.log('✅ Connection successful, initializing room...');
          // Initialize room
          await gameService.initializeRoom();

          // Set up listeners
          gameStateUnsubscribe = gameService.onGameStateChange((state) => {
            setGameState(state);
            if (state) {
              setError(null);
            }
          });

          playersUnsubscribe = gameService.onPlayersChange((playerList) => {
            setPlayers(playerList);
          });

          console.log('✅ Game initialized successfully');
        } else {
          setError('Failed to connect to game server');
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setIsConnected(false);
        setError(error.message || 'Failed to connect to game server');
      }
    };

    initializeGame();

    return () => {
      if (gameStateUnsubscribe) gameStateUnsubscribe();
      if (playersUnsubscribe) playersUnsubscribe();
    };
  }, []);

  const joinAsHost = async (playerName: string): Promise<string | null> => {
    try {
      setError(null);
      const playerId = await gameService.joinAsHost(playerName);
      setCurrentPlayerId(playerId);
      return playerId;
    } catch (error) {
      console.error('Failed to join as host:', error);
      setError(error.message || 'Failed to join as host');
      throw error;
    }
  };

  const joinAsPlayer = async (playerName: string): Promise<string> => {
    try {
      setError(null);
      const playerId = await gameService.joinAsPlayer(playerName);
      setCurrentPlayerId(playerId);
      return playerId;
    } catch (error) {
      console.error('Failed to join as player:', error);
      setError(error.message || 'Failed to join as player');
      throw error;
    }
  };

  const startGame = async (): Promise<void> => {
    try {
      setError(null);
      await gameService.startGame();
    } catch (error) {
      console.error('Failed to start game:', error);
      setError(error.message || 'Failed to start game');
      throw error;
    }
  };

  const eliminatePlayer = async (playerId: string): Promise<void> => {
    try {
      setError(null);
      await gameService.eliminatePlayer(playerId);
    } catch (error) {
      console.error('Failed to eliminate player:', error);
      setError(error.message || 'Failed to eliminate player');
      throw error;
    }
  };

  const updateTimer = async (timer: number, isRunning: boolean): Promise<void> => {
    try {
      setError(null);
      await gameService.updateTimer(timer, isRunning);
    } catch (error) {
      console.error('Failed to update timer:', error);
      setError(error.message || 'Failed to update timer');
      throw error;
    }
  };

  const endGame = async (winner: string): Promise<void> => {
    try {
      setError(null);
      await gameService.endGame(winner);
    } catch (error) {
      console.error('Failed to end game:', error);
      setError(error.message || 'Failed to end game');
      throw error;
    }
  };

  const resetGame = async (): Promise<void> => {
    try {
      setError(null);
      await gameService.resetGame();
      setCurrentPlayerId(null);
    } catch (error) {
      console.error('Failed to reset game:', error);
      setError(error.message || 'Failed to reset game');
      throw error;
    }
  };

  const leaveGame = async (playerId: string): Promise<void> => {
    try {
      setError(null);
      await gameService.leaveGame(playerId);
      if (playerId === currentPlayerId) {
        setCurrentPlayerId(null);
      }
    } catch (error) {
      console.error('Failed to leave game:', error);
      setError(error.message || 'Failed to leave game');
      throw error;
    }
  };

  const requestHost = async (playerId: string, playerName: string): Promise<string> => {
    try {
      setError(null);
      return await gameService.requestHost(playerId, playerName);
    } catch (error) {
      console.error('Failed to request host:', error);
      setError(error.message || 'Failed to request host');
      throw error;
    }
  };

  const respondToHostRequest = async (requestId: string, approved: boolean, currentHostId: string): Promise<void> => {
    try {
      setError(null);
      await gameService.respondToHostRequest(requestId, approved, currentHostId);
    } catch (error) {
      console.error('Failed to respond to host request:', error);
      setError(error.message || 'Failed to respond to host request');
      throw error;
    }
  };

  const contextValue: GameContextType = {
    gameState,
    players,
    currentPlayerId,
    currentPlayer,
    eliminatedPlayers,
    hostRequests,
    isHost,
    isConnected,
    error,
    joinAsHost,
    joinAsPlayer,
    startGame,
    eliminatePlayer,
    updateTimer,
    endGame,
    resetGame,
    leaveGame,
    requestHost,
    respondToHostRequest,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}