import React, { useState } from 'react';
import { Game } from '../../../types';
import { GamePreview } from './GamePreview';
import { DimensionGuide } from './DimensionGuide';
import { PlacementInstructions } from './PlacementInstructions';
import { ArrowLeft, Ruler, Eye, Info } from 'lucide-react';

interface FallbackViewerProps {
  games: Game[];
  onExit: () => void;
}

export function FallbackViewer({ games, onExit }: FallbackViewerProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'dimensions' | 'instructions'>('preview');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onExit}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Game Placement Guide</h1>
                <p className="text-sm text-gray-600">2D preview and measurement tools</p>
              </div>
            </div>
            
            {selectedGame && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'preview' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-1 inline" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('dimensions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'dimensions' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Ruler className="w-4 h-4 mr-1 inline" />
                  Dimensions
                </button>
                <button
                  onClick={() => setViewMode('instructions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'instructions' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Info className="w-4 h-4 mr-1 inline" />
                  Setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedGame ? (
          /* Game Selection */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Game to Preview</h2>
              <p className="text-gray-600">
                Since WebXR isn't available on your device, use this 2D preview to plan your game placement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all text-left group"
                >
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{game.location}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Max {game.maxPlayers} players</span>
                    <span>{game.totalPlayTime}h played</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Game Details View */
          <div>
            {viewMode === 'preview' && <GamePreview game={selectedGame} />}
            {viewMode === 'dimensions' && <DimensionGuide game={selectedGame} />}
            {viewMode === 'instructions' && <PlacementInstructions game={selectedGame} />}
          </div>
        )}
      </div>
    </div>
  );
}