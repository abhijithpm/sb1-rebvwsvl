import React, { useState } from 'react';
import { useGame } from './GameContext';
import { Users, Crown, Play, ArrowLeft, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlayerList } from './PlayerList';
import { InstructionsCard } from './InstructionsCard';

export function LobbyScreen() {
  const { state, joinAsHost, joinAsPlayer, startGame, leaveGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const handleJoinAsHost = () => {
    if (state.host) return;
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
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartGame = async () => {
    if (state.players.length < 3) {
      alert('Need at least 3 players to start the game!');
      return;
    }
    
    try {
      await startGame();
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleLeaveGame = async () => {
    try {
      await leaveGame();
      navigate('/mafia-home');
    } catch (error) {
      console.error('Failed to leave game:', error);
      navigate('/mafia-home');
    }
  };

  const isCurrentPlayerHost = state.currentPlayer?.isHost;
  const canStartGame = isCurrentPlayerHost && state.players.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleLeaveGame}
            className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              ILLAM GANG
            </h1>
            <p className="text-gray-300 mt-2">Exclusive Mafia Room</p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {state.isConnected ? (
              <div className="flex items-center text-green-400">
                <Wifi className="w-5 h-5 mr-1" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <WifiOff className="w-5 h-5 mr-1" />
                <span className="text-sm">Connecting...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mb-6 bg-red-600/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-300">{state.error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name Input Modal */}
            {showNameInput && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    {isHost ? 'Join as Host' : 'Join as Player'}
                  </h3>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
                    onKeyPress={(e) => e.key === 'Enter' && !isJoining && handleSubmitName()}
                    autoFocus
                    disabled={isJoining}
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowNameInput(false)}
                      disabled={isJoining}
                      className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitName}
                      disabled={!playerName.trim() || isJoining}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isJoining ? 'Joining...' : 'Join Game'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Join Options */}
            {!state.currentPlayer && state.isConnected && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 text-center">Join the Game</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={handleJoinAsHost}
                    disabled={!!state.host}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      state.host
                        ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'
                        : 'border-yellow-500 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-500/30 hover:to-orange-500/30 hover:scale-105'
                    }`}
                  >
                    <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Join as Host</h3>
                    <p className="text-gray-300 text-sm">
                      {state.host ? 'Host position taken' : 'Control the game, manage players, and oversee rounds'}
                    </p>
                    {state.host && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        Taken
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleJoinAsPlayer}
                    className="relative p-6 rounded-xl border-2 border-blue-500 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 transition-all duration-300"
                  >
                    <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Join as Player</h3>
                    <p className="text-gray-300 text-sm">
                      Enter the game and receive a secret role to play
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Game Controls */}
            {state.currentPlayer && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Game Lobby</h2>
                  {isCurrentPlayerHost && (
                    <button
                      onClick={handleStartGame}
                      disabled={!canStartGame}
                      className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                        canStartGame
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Game
                    </button>
                  )}
                </div>
                
                <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-300">
                    ✅ You joined as: <span className="font-bold text-white">
                      {state.currentPlayer.name} {state.currentPlayer.isHost ? '(Host)' : '(Player)'}
                    </span>
                  </p>
                </div>

                {!canStartGame && state.players.length < 3 && (
                  <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <p className="text-yellow-300">
                      ⚠️ Need at least 3 players to start the game. Currently: {state.players.length}
                    </p>
                  </div>
                )}

                {/* Real-time Player Count */}
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300">
                    🔄 Real-time sync active • {state.players.length} player{state.players.length !== 1 ? 's' : ''} online
                  </p>
                </div>
              </div>
            )}

            {/* Connection Status */}
            {!state.isConnected && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Connecting to Game Server...</h2>
                <p className="text-gray-300">
                  Please wait while we establish a connection to the Illam Gang room.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlayerList players={state.players} host={state.host} />
            <InstructionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}