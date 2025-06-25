import { 
  ref, 
  set, 
  push, 
  onValue, 
  off, 
  update, 
  remove,
  serverTimestamp,
  get,
  onDisconnect
} from 'firebase/database';
import { database } from './config';

export interface FirebasePlayer {
  id: string;
  name: string;
  role?: string;
  isAlive: boolean;
  isHost: boolean;
  joinedAt: number;
  lastSeen: number;
  isOnline: boolean;
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
  roomCreated: number;
}

const ROOM_ID = 'illam-gang';
const ROOM_REF = ref(database, `rooms/${ROOM_ID}`);

export class GameService {
  private listeners: { [key: string]: (data: any) => void } = {};
  private currentPlayerId: string | null = null;

  // Initialize room if it doesn't exist
  async initializeRoom(): Promise<void> {
    try {
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
          lastUpdated: Date.now(),
          roomCreated: Date.now()
        };
        await set(ROOM_REF, initialState);
        console.log('✅ Room initialized successfully');
      } else {
        console.log('✅ Room already exists');
      }
    } catch (error) {
      console.error('❌ Failed to initialize room:', error);
      throw new Error(`Failed to initialize room: ${error.message}`);
    }
  }

  // Set up presence system for a player
  private async setupPresence(playerId: string): Promise<void> {
    try {
      const playerRef = ref(database, `rooms/${ROOM_ID}/players/${playerId}`);
      const presenceRef = ref(database, `rooms/${ROOM_ID}/players/${playerId}/isOnline`);
      const lastSeenRef = ref(database, `rooms/${ROOM_ID}/players/${playerId}/lastSeen`);
      
      // Set player as online
      await update(playerRef, {
        isOnline: true,
        lastSeen: Date.now()
      });

      // Set up disconnect handler
      const disconnectRef = onDisconnect(presenceRef);
      await disconnectRef.set(false);
      
      const disconnectLastSeenRef = onDisconnect(lastSeenRef);
      await disconnectLastSeenRef.set(Date.now());

      console.log(`✅ Presence setup for player ${playerId}`);
    } catch (error) {
      console.error('❌ Failed to setup presence:', error);
    }
  }

  // Join as host
  async joinAsHost(playerName: string): Promise<string | null> {
    try {
      const snapshot = await get(ROOM_REF);
      const gameState = snapshot.val() as FirebaseGameState;
      
      if (gameState?.host) {
        throw new Error('Host position is already taken');
      }

      const playerId = push(ref(database, 'temp')).key!;
      this.currentPlayerId = playerId;
      
      const player: FirebasePlayer = {
        id: playerId,
        name: playerName,
        isAlive: true,
        isHost: true,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        isOnline: true
      };

      await update(ROOM_REF, {
        host: playerId,
        [`players/${playerId}`]: player,
        lastUpdated: Date.now()
      });

      await this.setupPresence(playerId);
      console.log(`✅ Host joined: ${playerName} (${playerId})`);
      return playerId;
    } catch (error) {
      console.error('❌ Failed to join as host:', error);
      throw error;
    }
  }

  // Join as player
  async joinAsPlayer(playerName: string): Promise<string> {
    try {
      const playerId = push(ref(database, 'temp')).key!;
      this.currentPlayerId = playerId;
      
      const player: FirebasePlayer = {
        id: playerId,
        name: playerName,
        isAlive: true,
        isHost: false,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        isOnline: true
      };

      await update(ROOM_REF, {
        [`players/${playerId}`]: player,
        lastUpdated: Date.now()
      });

      await this.setupPresence(playerId);
      console.log(`✅ Player joined: ${playerName} (${playerId})`);
      return playerId;
    } catch (error) {
      console.error('❌ Failed to join as player:', error);
      throw error;
    }
  }

  // Start game and assign roles
  async startGame(): Promise<void> {
    try {
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
      console.log('✅ Game started with roles assigned');
    } catch (error) {
      console.error('❌ Failed to start game:', error);
      throw error;
    }
  }

  // Eliminate player
  async eliminatePlayer(playerId: string): Promise<void> {
    try {
      const snapshot = await get(ref(database, `rooms/${ROOM_ID}/players/${playerId}`));
      const player = snapshot.val() as FirebasePlayer;
      
      if (!player) {
        throw new Error('Player not found');
      }

      await update(ROOM_REF, {
        [`players/${playerId}/isAlive`]: false,
        [`eliminatedPlayers/${playerId}`]: { ...player, isAlive: false },
        lastUpdated: Date.now()
      });

      console.log(`✅ Player eliminated: ${player.name}`);
    } catch (error) {
      console.error('❌ Failed to eliminate player:', error);
      throw error;
    }
  }

  // Update timer
  async updateTimer(timer: number, isRunning: boolean): Promise<void> {
    try {
      await update(ROOM_REF, {
        timer,
        isTimerRunning: isRunning,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('❌ Failed to update timer:', error);
      throw error;
    }
  }

  // End game
  async endGame(winner: string): Promise<void> {
    try {
      await update(ROOM_REF, {
        gamePhase: 'ended',
        winner,
        isTimerRunning: false,
        lastUpdated: Date.now()
      });
      console.log(`✅ Game ended. Winner: ${winner}`);
    } catch (error) {
      console.error('❌ Failed to end game:', error);
      throw error;
    }
  }

  // Reset game
  async resetGame(): Promise<void> {
    try {
      const initialState: FirebaseGameState = {
        host: null,
        players: {},
        gameStarted: false,
        gamePhase: 'lobby',
        timer: 0,
        isTimerRunning: false,
        eliminatedPlayers: {},
        winner: null,
        lastUpdated: Date.now(),
        roomCreated: Date.now()
      };
      await set(ROOM_REF, initialState);
      this.currentPlayerId = null;
      console.log('✅ Game reset successfully');
    } catch (error) {
      console.error('❌ Failed to reset game:', error);
      throw error;
    }
  }

  // Leave game
  async leaveGame(playerId: string): Promise<void> {
    try {
      const snapshot = await get(ROOM_REF);
      const gameState = snapshot.val() as FirebaseGameState;
      
      if (gameState?.host === playerId) {
        // If host leaves, reset the entire game
        await this.resetGame();
        console.log('✅ Host left - game reset');
      } else {
        // Remove player
        await remove(ref(database, `rooms/${ROOM_ID}/players/${playerId}`));
        await update(ROOM_REF, {
          lastUpdated: Date.now()
        });
        console.log(`✅ Player ${playerId} left the game`);
      }
      
      if (this.currentPlayerId === playerId) {
        this.currentPlayerId = null;
      }
    } catch (error) {
      console.error('❌ Failed to leave game:', error);
      throw error;
    }
  }

  // Listen to game state changes
  onGameStateChange(callback: (gameState: FirebaseGameState | null) => void): () => void {
    const listener = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        console.log('🔄 Game state updated:', {
          players: Object.keys(data.players || {}).length,
          phase: data.gamePhase,
          host: data.host ? 'present' : 'none'
        });
      }
      callback(data);
    };
    
    onValue(ROOM_REF, listener, (error) => {
      console.error('❌ Firebase listener error:', error);
      callback(null);
    });
    
    return () => {
      off(ROOM_REF, 'value', listener);
      console.log('🔌 Game state listener disconnected');
    };
  }

  // Listen to player list changes
  onPlayersChange(callback: (players: FirebasePlayer[]) => void): () => void {
    const playersRef = ref(database, `rooms/${ROOM_ID}/players`);
    const listener = (snapshot: any) => {
      const data = snapshot.val();
      const players = data ? Object.values(data) : [];
      console.log('👥 Players updated:', players.map((p: any) => p.name));
      callback(players);
    };
    
    onValue(playersRef, listener, (error) => {
      console.error('❌ Players listener error:', error);
      callback([]);
    });
    
    return () => {
      off(playersRef, 'value', listener);
      console.log('🔌 Players listener disconnected');
    };
  }

  // Get current game state
  async getCurrentGameState(): Promise<FirebaseGameState | null> {
    try {
      const snapshot = await get(ROOM_REF);
      return snapshot.val();
    } catch (error) {
      console.error('❌ Failed to get current game state:', error);
      return null;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const testRef = ref(database, 'connectionTest');
      await set(testRef, { 
        status: 'connected', 
        timestamp: Date.now(),
        test: true 
      });
      
      const snapshot = await get(testRef);
      if (snapshot.exists()) {
        await remove(testRef); // Clean up test data
        console.log('✅ Firebase connection test successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return false;
    }
  }
}

export const gameService = new GameService();