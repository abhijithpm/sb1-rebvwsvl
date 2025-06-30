import React, { useEffect } from 'react';
import { useGame } from './GameContext';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export function Timer() {
  const { gameState, currentPlayer, updateTimer, isConnected } = useGame();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState?.isTimerRunning && gameState.timer > 0) {
      interval = setInterval(async () => {
        const newTimer = Math.max(0, gameState.timer - 1);
        const isRunning = newTimer > 0;
        await updateTimer(newTimer, isRunning);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState?.isTimerRunning, gameState?.timer, updateTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = async (duration: number) => {
    await updateTimer(duration, true);
  };

  const handleStopTimer = async () => {
    if (gameState) {
      await updateTimer(gameState.timer, false);
    }
  };

  const isHost = currentPlayer?.isHost;
  const timer = gameState?.timer || 0;
  const isTimerRunning = gameState?.isTimerRunning || false;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-blue-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Timer</h3>
        </div>
        {isHost && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStartTimer(300)} // 5 minutes
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
            >
              5m
            </button>
            <button
              onClick={() => handleStartTimer(180)} // 3 minutes
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
            >
              3m
            </button>
            <button
              onClick={() => handleStartTimer(60)} // 1 minute
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium transition-colors"
            >
              1m
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <div className={`text-6xl font-bold mb-4 ${
          timer <= 30 && timer > 0 ? 'text-red-400 animate-pulse' : 'text-white'
        }`}>
          {formatTime(timer)}
        </div>

        {isHost && (
          <div className="flex justify-center space-x-4">
            {isTimerRunning ? (
              <button
                onClick={handleStopTimer}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </button>
            ) : (
              <button
                onClick={() => handleStartTimer(timer || 180)}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </button>
            )}
            
            <button
              onClick={() => handleStartTimer(180)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        )}

        {/* Real-time sync indicator */}
        {isConnected && (
          <div className="mt-4 text-xs text-gray-400">
            🔄 Synced across all devices
          </div>
        )}
      </div>

      {timer === 0 && (
        <div className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-center">
          <p className="text-red-300 font-bold">⏰ TIME'S UP!</p>
        </div>
      )}
    </div>
  );
}