import React from 'react';
import { useGame } from './GameContext';
import { LobbyScreen } from './LobbyScreen';
import { GameScreen } from './GameScreen';
import { EndGameScreen } from './EndGameScreen';

export function MafiaGame() {
  const { state } = useGame();

  switch (state.gamePhase) {
    case 'lobby':
      return <LobbyScreen />;
    case 'playing':
      return <GameScreen />;
    case 'ended':
      return <EndGameScreen />;
    default:
      return <LobbyScreen />;
  }
}