import { 
  ref, 
  set, 
  push, 
  onValue, 
  off, 
  update, 
  remove,
  serverTimestamp,
  get
} from 'firebase/database';
import { database } from './config';

export interface FirebasePlayer {
  id: string;
  name: string;
  role?: string;
  isAlive: boolean;
  isHost: boolean;
  joinedAt: number;
}

export interface FirebaseGameState {
  host: string | null;
  players: { [key: string]: FirebasePlayer };
  gameStarted: boolean;
  gamePhase: 'lobby' | 'playing' | 'ended';
  timer: number;
  isTimerRunning: boolean;
  eliminatedPlayers: { [key: string]: FirebasePlayer };
  winner: string | null;
  lastUpdated: number;
}

const ROOM_ID = 'illam-gang';
const ROOM_REF = ref(database, `rooms/${ROOM_ID}`);

export class GameService {
  private listeners: { [key: string]: (data: any) => void } = {};

  // Initialize room if it doesn't exist
  async initializeRoom(): Promise<void> {
    const snapshot = await get(ROOM_REF);
    if (!snapshot.exists()) {
      const initialState: FirebaseGameState = {
        host: null,
        players: {},
        gameStarted: false,
        gamePhase: 'lobby',
        timer: 0,
        isTimerRunning: false,
        eliminatedPlayers: {},
        winner: null,
        lastUpdated: Date.now()
      };
      await set(ROOM_REF, initialState);
    }
  }

  // Join as host
  async joinAsHost(playerName: string): Promise<string | null> {
    const snapshot = await get(ROOM_REF);
    const gameState = snapshot.val() as FirebaseGameState;
    
    if (gameState?.host) {
      throw new Error('Host position is already taken');
    }

    const playerId = push(ref(database, 'temp')).key!;
    const player: FirebasePlayer = {
      id: playerId,
      name: playerName,
      isAlive: true,
      isHost: true,
      joinedAt: Date.now()
    };

    await update(ROOM_REF, {
      host: playerId,
      [`players/${playerId}`]: player,
      lastUpdated: Date.now()
    });

    return playerId;
  }

  // Join as player
  async joinAsPlayer(playerName: string): Promise<string> {
    const playerId = push(ref(database, 'temp')).key!;
    const player: FirebasePlayer = {
      id: playerId,
      name: playerName,
      isAlive: true,
      isHost: false,
      joinedAt: Date.now()
    };

    await update(ROOM_REF, {
      [`players/${playerId}`]: player,
      lastUpdated: Date.now()
    });

    return playerId;
  }

  // Start game and assign roles
  async startGame(): Promise<void> {
    const snapshot = await get(ROOM_REF);
    const gameState = snapshot.val() as FirebaseGameState;
    
    if (!gameState?.players || Object.keys(gameState.players).length < 3) {
      throw new Error('Need at least 3 players to start the game');
    }

    const players = Object.values(gameState.players);
    const roles = ['Mafia', 'Detective', 'Doctor', 'Villager'];
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

    const updates: any = {
      gameStarted: true,
      gamePhase: 'playing',
      lastUpdated: Date.now()
    };

    // Assign roles to players
    players.forEach((player, index) => {
      updates[`players/${player.id}/role`] = shuffledRoles[index % roles.length];
    });

    await update(ROOM_REF, updates);
  }

  // Eliminate player
  async eliminatePlayer(playerId: string): Promise<void> {
    const snapshot = await get(ref(database, `rooms/${ROOM_ID}/players/${playerId}`));
    const player = snapshot.val() as FirebasePlayer;
    
    if (!player) return;

    await update(ROOM_REF, {
      [`players/${playerId}/isAlive`]: false,
      [`eliminatedPlayers/${playerId}`]: { ...player, isAlive: false },
      lastUpdated: Date.now()
    });
  }

  // Update timer
  async updateTimer(timer: number, isRunning: boolean): Promise<void> {
    await update(ROOM_REF, {
      timer,
      isTimerRunning: isRunning,
      lastUpdated: Date.now()
    });
  }

  // End game
  async endGame(winner: string): Promise<void> {
    await update(ROOM_REF, {
      gamePhase: 'ended',
      winner,
      isTimerRunning: false,
      lastUpdated: Date.now()
    });
  }

  // Reset game
  async resetGame(): Promise<void> {
    const initialState: FirebaseGameState = {
      host: null,
      players: {},
      gameStarted: false,
      gamePhase: 'lobby',
      timer: 0,
      isTimerRunning: false,
      eliminatedPlayers: {},
      winner: null,
      lastUpdated: Date.now()
    };
    await set(ROOM_REF, initialState);
  }

  // Leave game
  async leaveGame(playerId: string): Promise<void> {
    const snapshot = await get(ROOM_REF);
    const gameState = snapshot.val() as FirebaseGameState;
    
    if (gameState?.host === playerId) {
      // If host leaves, reset the entire game
      await this.resetGame();
    } else {
      // Remove player
      await remove(ref(database, `rooms/${ROOM_ID}/players/${playerId}`));
      await update(ROOM_REF, {
        lastUpdated: Date.now()
      });
    }
  }

  // Listen to game state changes
  onGameStateChange(callback: (gameState: FirebaseGameState | null) => void): () => void {
    const listener = (snapshot: any) => {
      callback(snapshot.val());
    };
    
    onValue(ROOM_REF, listener);
    
    return () => off(ROOM_REF, 'value', listener);
  }

  // Listen to player list changes
  onPlayersChange(callback: (players: FirebasePlayer[]) => void): () => void {
    const playersRef = ref(database, `rooms/${ROOM_ID}/players`);
    const listener = (snapshot: any) => {
      const data = snapshot.val();
      callback(data ? Object.values(data) : []);
    };
    
    onValue(playersRef, listener);
    
    return () => off(playersRef, 'value', listener);
  }

  // Get current game state
  async getCurrentGameState(): Promise<FirebaseGameState | null> {
    const snapshot = await get(ROOM_REF);
    return snapshot.val();
  }
}

export const gameService = new GameService();