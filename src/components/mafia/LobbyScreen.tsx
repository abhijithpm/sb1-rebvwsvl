import React, { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { Users, Crown, Play, ArrowLeft, Wifi, WifiOff, AlertCircle, Triangle as ExclamationTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlayerList } from './PlayerList';
import { InstructionsCard } from './InstructionsCard';
import { HostRequestPanel } from './HostRequestPanel';

export function LobbyScreen() {
  const { gameState, players, currentPlayer, isConnected, error, joinAsHost, joinAsPlayer, startGame, leaveGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  // If game is playing and user has joined, they should be in the game screen
  // This is handled by MafiaGame component, but we add this as extra safety
  useEffect(() => {
    if (gameState?.gamePhase === 'playing' && currentPlayer) {
      // The MafiaGame component should handle this transition
      console.log('Game is playing and player has joined - should be in game screen');
    }
  }, [gameState?.gamePhase, currentPlayer]);

  // Check if complete reset is required
  useEffect(() => {
    if (gameState?.requiresCompleteReset) {
      console.log('Complete reset detected - redirecting to home');
      navigate('/mafia-home');
    }
  }, [gameState?.requiresCompleteReset, navigate]);

  const handleJoinAsHost = () => {
    if (gameState?.host) return;
    setIsHost(true);
    setShowNameInput(true);
  };

  const handleJoinAsPlayer = () => {
    setIsHost(false);
    setShowNameInput(true);
  };

  const handleSubmitName = async () => {
    if (!playerName.trim()) return;
    
    setIsJoining(true);
    try {
      if (isHost) {
        await joinAsHost(playerName);
      } else {
        await joinAsPlayer(playerName);
      }
      
      setPlayerName('');
      setShowNameInput(false);
    } catch (error) {
      console.error('Failed to join game:', error);
      // Error is already handled in GameContext
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartGame = async () => {
    if (players.length < 3) {
      alert('Need at least 3 players to start the game!');
      return;
    }
    
    try {
      await startGame();
      // Game state will change to 'playing' and MafiaGame will handle the transition
    } catch (error) {
      console.error('Failed to start game:', error);
      // Error is already handled in GameContext
    }
  };

  const handleLeaveGame = async () => {
    try {
      if (currentPlayer) {
        await leaveGame(currentPlayer.id);
      }
      navigate('/mafia-home');
    } catch (error) {
      console.error('Failed to leave game:', error);
      navigate('/mafia-home');
    }
  };

  const isCurrentPlayerHost = currentPlayer?.isHost;
  const canStartGame = isCurrentPlayerHost && players.length >= 3;

  // Show message if game is playing but user hasn't joined
  const showJoinPrompt = gameState?.gamePhase === 'playing' && !currentPlayer;

  // Show reset message if complete reset is required
  if (gameState?.requiresCompleteReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              GAME RESET IN PROGRESS
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6">
              The game has ended and all data is being cleared. Please wait while we reset the room.
            </p>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-blue-300 text-sm sm:text-base">
                🔄 All players must rejoin after the reset is complete.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/mafia-home')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors w-full sm:w-auto"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <button
            onClick={handleLeaveGame}
            className="flex items-center px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors order-1 sm:order-none"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>
          
          <div className="text-center order-2 sm:order-none">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              ILLAM GANG
            </h1>
            <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">Exclusive Mafia Room</p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2 order-3 sm:order-none">
            {isConnected ? (
              <div className="flex items-center text-green-400">
                <Wifi className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                <span className="text-xs sm:text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                <span className="text-xs sm:text-sm">Connecting...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-600/20 border border-red-500/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <ExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2" />
              <span className="text-red-300 text-sm sm:text-base">{error}</span>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-red-200">
              {error.includes('Permission denied') && (
                <p>🔧 This might be due to Firebase security rules. Please check the database configuration.</p>
              )}
              {error.includes('Network error') && (
                <p>🌐 Please check your internet connection and try again.</p>
              )}
            </div>
          </div>
        )}

        {/* Game In Progress Alert */}
        {showJoinPrompt && (
          <div className="mb-4 sm:mb-6 bg-orange-600/20 border border-orange-500/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mr-2" />
              <span className="text-orange-300 text-sm sm:text-base">
                🎮 Game is currently in progress! Join now to participate in the next round.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Name Input Modal */}
            {showNameInput && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 max-w-md w-full">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                    {isHost ? 'Join as Host' : 'Join as Player'}
                  </h3>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 sm:px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 sm:mb-6 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && !isJoining && handleSubmitName()}
                    autoFocus
                    disabled={isJoining}
                  />
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setShowNameInput(false)}
                      disabled={isJoining}
                      className="flex-1 px-3 sm:px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitName}
                      disabled={!playerName.trim() || isJoining}
                      className="flex-1 px-3 sm:px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isJoining ? 'Joining...' : 'Join Game'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Join Options */}
            {!currentPlayer && isConnected && !error && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                  {showJoinPrompt ? 'Join the Game in Progress' : 'Join the Game'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <button
                    onClick={handleJoinAsHost}
                    disabled={!!gameState?.host}
                    className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                      gameState?.host
                        ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'
                        : 'border-yellow-500 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-500/30 hover:to-orange-500/30 hover:scale-105'
                    }`}
                  >
                    <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Join as Host</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {gameState?.host ? 'Host position taken' : 'Control the game, manage players, and oversee rounds'}
                    </p>
                    {gameState?.host && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        Taken
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleJoinAsPlayer}
                    className="relative p-4 sm:p-6 rounded-xl border-2 border-blue-500 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 transition-all duration-300"
                  >
                    <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Join as Player</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {showJoinPrompt 
                        ? 'Join the ongoing game and get your role' 
                        : 'Enter the game and receive a secret role to play'
                      }
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Host Request Panel */}
            {currentPlayer && !showJoinPrompt && !error && (
              <HostRequestPanel />
            )}

            {/* Game Controls */}
            {currentPlayer && !showJoinPrompt && !error && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Game Lobby</h2>
                  {isCurrentPlayerHost && (
                    <button
                      onClick={handleStartGame}
                      disabled={!canStartGame}
                      className={`flex items-center px-4 sm:px-6 py-3 rounded-lg font-bold transition-all duration-300 w-full sm:w-auto justify-center ${
                        canStartGame
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Start Game
                    </button>
                  )}
                </div>
                
                <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-green-300 text-sm sm:text-base">
                    ✅ You joined as: <span className="font-bold text-white">
                      {currentPlayer.name} {currentPlayer.isHost ? '(Host)' : '(Player)'}
                    </span>
                  </p>
                </div>

                {!canStartGame && players.length < 3 && (
                  <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-yellow-300 text-sm sm:text-base">
                      ⚠️ Need at least 3 players to start the game. Currently: {players.length}
                    </p>
                  </div>
                )}

                {/* Real-time Player Count */}
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-blue-300 text-sm sm:text-base">
                    🔄 Real-time sync active • {players.length} player{players.length !== 1 ? 's' : ''} online
                  </p>
                </div>
              </div>
            )}

            {/* Connection Status */}
            {(!isConnected || error) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 text-center">
                <WifiOff className="w-8 h-8 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {error ? 'Connection Error' : 'Connecting to Game Server...'}
                </h2>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  {error 
                    ? 'Unable to connect to the Illam Gang room. Please try refreshing the page.'
                    : 'Please wait while we establish a connection to the Illam Gang room.'
                  }
                </p>
                {error && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Refresh Page
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <PlayerList players={players} host={gameState?.host} />
            <InstructionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}