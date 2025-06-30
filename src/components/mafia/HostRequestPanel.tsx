import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import { Crown, Clock, Check, X, AlertCircle, Users } from 'lucide-react';

export function HostRequestPanel() {
  const { gameState, players, currentPlayer, hostRequests, requestHost, respondToHostRequest } = useGame();
  const [isRequesting, setIsRequesting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

  const isHost = currentPlayer?.isHost;
  const hasHost = !!gameState?.host;
  const pendingRequests = hostRequests.filter(req => req.status === 'pending');
  
  // Check if current player has a pending request
  const currentPlayerRequest = pendingRequests.find(req => req.playerId === currentPlayer?.id);

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: { [key: string]: number } = {};
      
      pendingRequests.forEach(request => {
        const remaining = Math.max(0, request.expiresAt - now);
        newTimeLeft[request.id] = Math.ceil(remaining / 1000);
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingRequests]);

  const handleRequestHost = async () => {
    if (!currentPlayer || currentPlayerRequest) return;
    
    setIsRequesting(true);
    try {
      await requestHost(currentPlayer.id, currentPlayer.name);
    } catch (error) {
      console.error('Failed to request host:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRespondToRequest = async (requestId: string, approved: boolean) => {
    if (!currentPlayer) return;
    
    try {
      await respondToHostRequest(requestId, approved, currentPlayer.id);
    } catch (error) {
      console.error('Failed to respond to host request:', error);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Don't show panel if game has started
  if (gameState?.gameStarted) return null;

  return (
    <div className="space-y-4">
      {/* Request Host Button (for non-host players) */}
      {!isHost && hasHost && currentPlayer && !currentPlayerRequest && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <h4 className="font-medium text-white">Want to be Host?</h4>
                <p className="text-sm text-gray-300">Request to take over hosting duties</p>
              </div>
            </div>
            <button
              onClick={handleRequestHost}
              disabled={isRequesting}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isRequesting ? 'Requesting...' : 'Request Host'}
            </button>
          </div>
        </div>
      )}

      {/* Current Player's Pending Request */}
      {currentPlayerRequest && (
        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-400 mr-3 animate-pulse" />
              <div>
                <h4 className="font-medium text-yellow-300">Host Request Pending</h4>
                <p className="text-sm text-yellow-200">
                  Waiting for current host to respond...
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-300">
                {formatTime(timeLeft[currentPlayerRequest.id] || 0)}
              </div>
              <div className="text-xs text-yellow-200">Auto-promote</div>
            </div>
          </div>
          <div className="mt-3 bg-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-100">
              💡 If the host doesn't respond within 30 seconds, you'll automatically become the host!
            </p>
          </div>
        </div>
      )}

      {/* Host Request Management (for current host) */}
      {isHost && pendingRequests.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-orange-400 mr-3" />
            <h4 className="font-medium text-white">
              Host Requests ({pendingRequests.length})
            </h4>
          </div>
          
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="font-medium text-white">{request.playerName}</span>
                    <span className="ml-2 text-sm text-gray-400">wants to be host</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-300">
                      {formatTime(timeLeft[request.id] || 0)}
                    </div>
                    <div className="text-xs text-gray-400">remaining</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRespondToRequest(request.id, true)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(request.id, false)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  ⚠️ If you don't respond, {request.playerName} will automatically become host
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Host Available (auto-promote available) */}
      {!hasHost && currentPlayer && (
        <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <h4 className="font-medium text-green-300">No Host Available</h4>
                <p className="text-sm text-green-200">You can become host immediately</p>
              </div>
            </div>
            <button
              onClick={handleRequestHost}
              disabled={isRequesting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isRequesting ? 'Joining...' : 'Become Host'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}