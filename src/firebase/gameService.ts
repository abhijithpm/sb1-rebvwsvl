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
}

const ROOM_ID = 'illam-gang';
const ROOM_REF = ref(database, `rooms/${ROOM_ID}`);
const HOST_REQUEST_TIMEOUT = 30000; // 30 seconds

export class GameService {
  private listeners: { [key: string]: (data: any) => void } = {};
  private currentPlayerId: string | null = null;
  private hostRequestTimeouts: { [key: string]: NodeJS.Timeout } = {};

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
          roomCreated: Date.now(),
          hostRequests: {}
        };
        await set(ROOM_REF, initialState);
        console.log('✅ Room initialized successfully');
      } else {
        console.log('✅ Room already exists');
        // Clean up expired host requests on initialization
        await this.cleanupExpiredHostRequests();
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
        lastUpdated: Date.now(),
        hostRequests: {} // Clear all host requests when game starts
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

  // Reset game (Start New Game)
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
        hostRequests: {}
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
          hostRequests: Object.keys(data.hostRequests || {}).length
        });

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