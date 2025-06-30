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

export interface HostRequest {
  id: string;
  playerId: string;
  playerName: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  expiresAt: number;
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
  hostRequests: { [key: string]: HostRequest };
  gameEndedAt?: number;
  requiresCompleteReset?: boolean;
  resetScheduledAt?: number;
}

const ROOM_ID = 'illam-gang';
const ROOM_REF = ref(database, `rooms/${ROOM_ID}`);
const HOST_REQUEST_TIMEOUT = 30000; // 30 seconds
const RESET_DELAY = 10000; // 10 seconds delay before complete reset

export class GameService {
  private listeners: { [key: string]: (data: any) => void } = {};
  private currentPlayerId: string | null = null;
  private hostRequestTimeouts: { [key: string]: NodeJS.Timeout } = {};
  private resetTimeout: NodeJS.Timeout | null = null;

  // Test connection with better error handling
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔄 Testing Firebase connection...');
      const testRef = ref(database, 'connectionTest');
      await set(testRef, { 
        status: 'connected', 
        timestamp: Date.now(),
        test: true,
        environment: window.location.hostname
      });
      
      const snapshot = await get(testRef);
      if (snapshot.exists()) {
        await remove(testRef); // Clean up test data
        console.log('✅ Firebase connection test successful');
        return true;
      }
      console.warn('⚠️ Firebase connection test: No data returned');
      return false;
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      
      // Check if it's a permission error
      if (error.code === 'PERMISSION_DENIED') {
        console.error('🚫 Permission denied - check Firebase security rules');
        throw new Error('Database access denied. Please check Firebase security rules.');
      }
      
      // Check if it's a network error
      if (error.code === 'NETWORK_ERROR' || error.message.includes('network')) {
        console.error('🌐 Network error - check internet connection');
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  // Initialize room if it doesn't exist
  async initializeRoom(): Promise<void> {
    try {
      console.log('🔄 Initializing room...');
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
          roomCreated: Date.now(),
          hostRequests: {},
          requiresCompleteReset: false
        };
        await set(ROOM_REF, initialState);
        console.log('✅ Room initialized successfully');
      } else {
        console.log('✅ Room already exists');
        
        // Check if complete reset is required
        const gameState = snapshot.val() as FirebaseGameState;
        if (gameState.requiresCompleteReset) {
          console.log('🔄 Complete reset required - clearing all data');
          await this.performCompleteReset();
        } else {
          // Clean up expired host requests on initialization
          await this.cleanupExpiredHostRequests();
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize room:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Please check Firebase security rules for write access.');
      }
      
      throw new Error(`Failed to initialize room: ${error.message}`);
    }
  }

  // Perform complete reset - clears all data and requires fresh login
  async performCompleteReset(): Promise<void> {
    try {
      console.log('🔄 Performing complete database reset...');
      
      // Clear all timeouts
      Object.values(this.hostRequestTimeouts).forEach(timeout => clearTimeout(timeout));
      this.hostRequestTimeouts = {};
      
      if (this.resetTimeout) {
        clearTimeout(this.resetTimeout);
        this.resetTimeout = null;
      }

      // Create completely fresh state
      const freshState: FirebaseGameState = {
        host: null,
        players: {},
        gameStarted: false,
        gamePhase: 'lobby',
        timer: 0,
        isTimerRunning: false,
        eliminatedPlayers: {},
        winner: null,
        lastUpdated: Date.now(),
        roomCreated: Date.now(),
        hostRequests: {},
        requiresCompleteReset: false
      };

      await set(ROOM_REF, freshState);
      this.currentPlayerId = null;
      
      console.log('✅ Complete database reset successful - all data cleared');
    } catch (error) {
      console.error('❌ Failed to perform complete reset:', error);
      throw error;
    }
  }

  // Schedule complete reset after game ends
  private scheduleCompleteReset(): void {
    console.log('⏰ Scheduling complete reset in 10 seconds...');
    
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    
    this.resetTimeout = setTimeout(async () => {
      try {
        await this.performCompleteReset();
        console.log('✅ Scheduled complete reset executed');
      } catch (error) {
        console.error('❌ Failed to execute scheduled reset:', error);
      }
    }, RESET_DELAY);
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
      // Don't throw here as presence is not critical for basic functionality
    }
  }

  // Clean up expired host requests
  private async cleanupExpiredHostRequests(): Promise<void> {
    try {
      const snapshot = await get(ref(database, `rooms/${ROOM_ID}/hostRequests`));
      if (!snapshot.exists()) return;

      const hostRequests = snapshot.val() as { [key: string]: HostRequest };
      const now = Date.now();
      const updates: any = {};

      Object.entries(hostRequests).forEach(([requestId, request]) => {
        if (request.status === 'pending' && now > request.expiresAt) {
          updates[`hostRequests/${requestId}`] = null;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ROOM_REF, updates);
        console.log('✅ Cleaned up expired host requests');
      }
    } catch (error) {
      console.error('❌ Failed to cleanup expired host requests:', error);
    }
  }

  // Request to become host
  async requestHost(playerId: string, playerName: string): Promise<string> {
    try {
      const snapshot = await get(ROOM_REF);
      const gameState = snapshot.val() as FirebaseGameState;
      
      if (gameState?.host) {
        // Check if there's already a pending request from this player
        const existingRequest = Object.values(gameState.hostRequests || {})
          .find(req => req.playerId === playerId && req.status === 'pending');
        
        if (existingRequest) {
          throw new Error('You already have a pending host request');
        }

        const requestId = push(ref(database, 'temp')).key!;
        const expiresAt = Date.now() + HOST_REQUEST_TIMEOUT;
        
        const hostRequest: HostRequest = {
          id: requestId,
          playerId,
          playerName,
          requestedAt: Date.now(),
          status: 'pending',
          expiresAt
        };

        await update(ROOM_REF, {
          [`hostRequests/${requestId}`]: hostRequest,
          lastUpdated: Date.now()
        });

        // Set up auto-promotion timeout
        this.hostRequestTimeouts[requestId] = setTimeout(async () => {
          await this.autoPromoteToHost(requestId, playerId);
        }, HOST_REQUEST_TIMEOUT);

        console.log(`✅ Host request created: ${playerName} (${requestId})`);
        return requestId;
      } else {
        // No host exists, promote immediately
        await this.promoteToHost(playerId);
        return 'immediate';
      }
    } catch (error) {
      console.error('❌ Failed to request host:', error);
      throw error;
    }
  }

  // Respond to host request (approve/reject)
  async respondToHostRequest(requestId: string, approved: boolean, currentHostId: string): Promise<void> {
    try {
      const snapshot = await get(ref(database, `rooms/${ROOM_ID}/hostRequests/${requestId}`));
      if (!snapshot.exists()) {
        throw new Error('Host request not found');
      }

      const request = snapshot.val() as HostRequest;
      
      // Verify the current user is the host
      const gameSnapshot = await get(ROOM_REF);
      const gameState = gameSnapshot.val() as FirebaseGameState;
      
      if (gameState?.host !== currentHostId) {
        throw new Error('Only the current host can respond to host requests');
      }

      if (approved) {
        // Transfer host role
        await this.transferHost(currentHostId, request.playerId);
      }

      // Update request status and remove it
      await update(ROOM_REF, {
        [`hostRequests/${requestId}`]: null,
        lastUpdated: Date.now()
      });

      // Clear timeout
      if (this.hostRequestTimeouts[requestId]) {
        clearTimeout(this.hostRequestTimeouts[requestId]);
        delete this.hostRequestTimeouts[requestId];
      }

      console.log(`✅ Host request ${approved ? 'approved' : 'rejected'}: ${request.playerName}`);
    } catch (error) {
      console.error('❌ Failed to respond to host request:', error);
      throw error;
    }
  }

  // Auto-promote to host if request times out
  private async autoPromoteToHost(requestId: string, playerId: string): Promise<void> {
    try {
      const snapshot = await get(ref(database, `rooms/${ROOM_ID}/hostRequests/${requestId}`));
      if (!snapshot.exists()) return;

      const request = snapshot.val() as HostRequest;
      if (request.status !== 'pending') return;

      // Check if the requesting player is still online
      const playerSnapshot = await get(ref(database, `rooms/${ROOM_ID}/players/${playerId}`));
      if (!playerSnapshot.exists()) {
        // Player left, remove the request
        await update(ROOM_REF, {
          [`hostRequests/${requestId}`]: null
        });
        return;
      }

      const player = playerSnapshot.val() as FirebasePlayer;
      if (!player.isOnline) {
        // Player is offline, remove the request
        await update(ROOM_REF, {
          [`hostRequests/${requestId}`]: null
        });
        return;
      }

      // Get current host
      const gameSnapshot = await get(ROOM_REF);
      const gameState = gameSnapshot.val() as FirebaseGameState;
      
      if (gameState?.host) {
        // Transfer host role due to timeout
        await this.transferHost(gameState.host, playerId);
      } else {
        // No host exists, promote directly
        await this.promoteToHost(playerId);
      }

      // Remove the request
      await update(ROOM_REF, {
        [`hostRequests/${requestId}`]: null,
        lastUpdated: Date.now()
      });

      console.log(`✅ Auto-promoted to host due to timeout: ${request.playerName}`);
    } catch (error) {
      console.error('❌ Failed to auto-promote to host:', error);
    }
  }

  // Transfer host role from one player to another
  private async transferHost(fromPlayerId: string, toPlayerId: string): Promise<void> {
    try {
      const updates: any = {
        host: toPlayerId,
        [`players/${fromPlayerId}/isHost`]: false,
        [`players/${toPlayerId}/isHost`]: true,
        lastUpdated: Date.now()
      };

      await update(ROOM_REF, updates);
      console.log(`✅ Host transferred from ${fromPlayerId} to ${toPlayerId}`);
    } catch (error) {
      console.error('❌ Failed to transfer host:', error);
      throw error;
    }
  }

  // Promote player to host
  private async promoteToHost(playerId: string): Promise<void> {
    try {
      const updates: any = {
        host: playerId,
        [`players/${playerId}/isHost`]: true,
        lastUpdated: Date.now()
      };

      await update(ROOM_REF, updates);
      console.log(`✅ Player promoted to host: ${playerId}`);
    } catch (error) {
      console.error('❌ Failed to promote to host:', error);
      throw error;
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
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to join as host.');
      }
      
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
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to join as player.');
      }
      
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
        lastUpdated: Date.now(),
        hostRequests: {}, // Clear all host requests when game starts
        requiresCompleteReset: false // Reset flag when starting new game
      };

      // Clear all host request timeouts
      Object.values(this.hostRequestTimeouts).forEach(timeout => clearTimeout(timeout));
      this.hostRequestTimeouts = {};

      // Assign roles to players
      players.forEach((player, index) => {
        updates[`players/${player.id}/role`] = shuffledRoles[index % roles.length];
      });

      await update(ROOM_REF, updates);
      console.log('✅ Game started with roles assigned');
    } catch (error) {
      console.error('❌ Failed to start game:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to start game.');
      }
      
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
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to eliminate player.');
      }
      
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
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to update timer.');
      }
      
      throw error;
    }
  }

  // End game and schedule complete reset
  async endGame(winner: string): Promise<void> {
    try {
      await update(ROOM_REF, {
        gamePhase: 'ended',
        winner,
        isTimerRunning: false,
        gameEndedAt: Date.now(),
        requiresCompleteReset: true, // Mark for complete reset
        resetScheduledAt: Date.now() + RESET_DELAY,
        lastUpdated: Date.now()
      });

      // Schedule complete reset
      this.scheduleCompleteReset();
      
      console.log(`✅ Game ended. Winner: ${winner}. Complete reset scheduled in ${RESET_DELAY/1000} seconds.`);
    } catch (error) {
      console.error('❌ Failed to end game:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to end game.');
      }
      
      throw error;
    }
  }

  // Reset game (Start New Game) - preserves current session
  async resetGame(): Promise<void> {
    try {
      // Clear all host request timeouts
      Object.values(this.hostRequestTimeouts).forEach(timeout => clearTimeout(timeout));
      this.hostRequestTimeouts = {};

      // Get current game state to preserve host and players
      const snapshot = await get(ROOM_REF);
      const currentState = snapshot.val() as FirebaseGameState;
      
      if (!currentState) {
        throw new Error('No current game state found');
      }

      // Reset game state but keep players and host
      const resetState: Partial<FirebaseGameState> = {
        gameStarted: false,
        gamePhase: 'lobby',
        timer: 0,
        isTimerRunning: false,
        eliminatedPlayers: {},
        winner: null,
        lastUpdated: Date.now(),
        hostRequests: {},
        requiresCompleteReset: false
      };

      // Reset all players to alive and remove roles
      const playerUpdates: any = {};
      if (currentState.players) {
        Object.keys(currentState.players).forEach(playerId => {
          playerUpdates[`players/${playerId}/isAlive`] = true;
          playerUpdates[`players/${playerId}/role`] = null;
        });
      }

      await update(ROOM_REF, {
        ...resetState,
        ...playerUpdates
      });

      console.log('✅ Game reset successfully - players and host preserved');
    } catch (error) {
      console.error('❌ Failed to reset game:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to reset game.');
      }
      
      throw error;
    }
  }

  // Leave game
  async leaveGame(playerId: string): Promise<void> {
    try {
      const snapshot = await get(ROOM_REF);
      const gameState = snapshot.val() as FirebaseGameState;
      
      if (gameState?.host === playerId) {
        // If host leaves, schedule complete reset
        await update(ROOM_REF, {
          requiresCompleteReset: true,
          resetScheduledAt: Date.now() + RESET_DELAY,
          lastUpdated: Date.now()
        });
        
        this.scheduleCompleteReset();
        console.log('✅ Host left - complete reset scheduled');
      } else {
        // Remove player and any pending host requests from them
        const updates: any = {
          [`players/${playerId}`]: null,
          lastUpdated: Date.now()
        };

        // Remove any host requests from this player
        if (gameState?.hostRequests) {
          Object.entries(gameState.hostRequests).forEach(([requestId, request]) => {
            if (request.playerId === playerId) {
              updates[`hostRequests/${requestId}`] = null;
              // Clear timeout
              if (this.hostRequestTimeouts[requestId]) {
                clearTimeout(this.hostRequestTimeouts[requestId]);
                delete this.hostRequestTimeouts[requestId];
              }
            }
          });
        }

        await update(ROOM_REF, updates);
        console.log(`✅ Player ${playerId} left the game`);
      }
      
      if (this.currentPlayerId === playerId) {
        this.currentPlayerId = null;
      }
    } catch (error) {
      console.error('❌ Failed to leave game:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to leave game.');
      }
      
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
          host: data.host ? 'present' : 'none',
          hostRequests: Object.keys(data.hostRequests || {}).length,
          requiresCompleteReset: data.requiresCompleteReset || false
        });

        // Check if complete reset is required
        if (data.requiresCompleteReset && !this.resetTimeout) {
          console.log('🔄 Complete reset required - scheduling reset');
          this.scheduleCompleteReset();
        }

        // Set up timeouts for any pending host requests
        if (data.hostRequests) {
          Object.entries(data.hostRequests).forEach(([requestId, request]: [string, any]) => {
            if (request.status === 'pending' && !this.hostRequestTimeouts[requestId]) {
              const timeLeft = request.expiresAt - Date.now();
              if (timeLeft > 0) {
                this.hostRequestTimeouts[requestId] = setTimeout(async () => {
                  await this.autoPromoteToHost(requestId, request.playerId);
                }, timeLeft);
              }
            }
          });
        }
      }
      callback(data);
    };
    
    const errorHandler = (error: any) => {
      console.error('❌ Firebase listener error:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        console.error('🚫 Permission denied - check Firebase security rules');
      }
      
      callback(null);
    };
    
    onValue(ROOM_REF, listener, errorHandler);
    
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
    
    const errorHandler = (error: any) => {
      console.error('❌ Players listener error:', error);
      
      if (error.code === 'PERMISSION_DENIED') {
        console.error('🚫 Permission denied - check Firebase security rules');
      }
      
      callback([]);
    };
    
    onValue(playersRef, listener, errorHandler);
    
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
      
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Unable to read game state.');
      }
      
      return null;
    }
  }
}

export const gameService = new GameService();