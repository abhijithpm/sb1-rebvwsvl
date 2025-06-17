import React from 'react';
import { Game } from '../../../types';
import { useGameDimensions } from '../../../hooks/useGameDimensions';
import { MapPin, Users, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PlacementInstructionsProps {
  game: Game;
}

export function PlacementInstructions({ game }: PlacementInstructionsProps) {
  const dimensions = useGameDimensions(game.title);

  const getGameSpecificInstructions = (gameTitle: string) => {
    switch (gameTitle.toLowerCase()) {
      case 'table tennis':
        return {
          setup: [
            'Ensure 2m clearance on all sides for player movement',
            'Check that ceiling height is at least 3m',
            'Place on level surface - use adjustable legs if needed',
            'Ensure good lighting without glare on the table surface',
            'Keep the net tension properly adjusted'
          ],
          safety: [
            'Non-slip mats under table legs recommended',
            'Ensure no obstacles in playing area',
            'Good ventilation for active play',
            'First aid kit nearby for minor injuries'
          ],
          tips: [
            'Orient table away from direct sunlight',
            'Consider sound dampening for neighbors',
            'Store paddles and balls in designated area',
            'Regular cleaning maintains playing surface'
          ]
        };
      case 'darts':
        return {
          setup: [
            'Mount dartboard 1.73m from floor to center',
            'Ensure 2.37m throwing distance (marked line)',
            'Wall protection behind and around dartboard',
            'Good lighting without shadows on board',
            'Scoreboard visible to all players'
          ],
          safety: [
            'Clear throwing lane - no obstructions',
            'Soft flooring to protect dropped darts',
            'Wall protection extends 1m beyond board',
            'Never throw when someone is near the board'
          ],
          tips: [
            'Use steel-tip darts for traditional boards',
            'Regular rotation of dartboard for even wear',
            'Keep spare darts and flights available',
            'Consider electronic scoring for convenience'
          ]
        };
      case 'chess':
        return {
          setup: [
            'Stable table at comfortable height (70-75cm)',
            'Good lighting from above or side',
            'Comfortable seating for both players',
            'Chess clock positioned between players',
            'Quiet environment for concentration'
          ],
          safety: [
            'Ensure pieces are secure and won\'t fall',
            'Stable table that won\'t tip',
            'Comfortable seating to prevent strain',
            'Good posture support for long games'
          ],
          tips: [
            'Orient board so each player has white square on right',
            'Keep captured pieces organized',
            'Have notation sheets available for serious games',
            'Ensure pieces are regulation size and weight'
          ]
        };
      default:
        return {
          setup: ['Follow manufacturer setup instructions', 'Ensure adequate space for safe play'],
          safety: ['Check all equipment before use', 'Maintain clear playing area'],
          tips: ['Regular maintenance extends equipment life', 'Store properly when not in use']
        };
    }
  };

  const instructions = getGameSpecificInstructions(game.title);

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{game.title}</h2>
            <p className="text-gray-600">Complete setup and placement guide</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Users className="w-4 h-4 mr-1" />
              Max {game.maxPlayers} players
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {game.totalPlayTime}h played
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-indigo-600" />
          Quick Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Space Needed</div>
            <div className="text-lg font-semibold text-gray-900">
              {dimensions.width.toFixed(1)}m × {dimensions.depth.toFixed(1)}m
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Height Clearance</div>
            <div className="text-lg font-semibold text-gray-900">
              {dimensions.height.toFixed(1)}m minimum
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Setup Time</div>
            <div className="text-lg font-semibold text-gray-900">
              15-30 minutes
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Setup Instructions
        </h3>
        <div className="space-y-3">
          {instructions.setup.map((instruction, index) => (
            <div key={index} className="flex items-start">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-gray-700">{instruction}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
          Safety Guidelines
        </h3>
        <div className="space-y-3">
          {instructions.safety.map((guideline, index) => (
            <div key={index} className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{guideline}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
          Pro Tips
        </h3>
        <div className="space-y-3">
          {instructions.tips.map((tip, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Checklist */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {game.equipment.map((item, index) => (
            <label key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" className="mr-3 text-indigo-600 rounded" />
              <span className="text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Layout Suggestions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Optimal Room Layout</h3>
        <div className="space-y-4">
          <div className="bg-white/70 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Placement</h4>
            <ul className="space-y-1 text-blue-800 text-sm">
              <li>• Center the game in the room for equal access from all sides</li>
              <li>• Position away from high-traffic areas</li>
              <li>• Ensure natural light doesn't create glare</li>
              <li>• Keep storage for equipment nearby but out of playing area</li>
            </ul>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Things to Avoid</h4>
            <ul className="space-y-1 text-blue-800 text-sm">
              <li>• Placing near fragile items or decorations</li>
              <li>• Areas with low ceilings or hanging fixtures</li>
              <li>• Uneven or slippery floor surfaces</li>
              <li>• Locations with poor ventilation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}