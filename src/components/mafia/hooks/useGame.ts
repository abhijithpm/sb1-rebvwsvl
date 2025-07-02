import { useContext } from 'react';
import { GameContextType } from '../GameContext';
import { GameContext } from '../GameContext';

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}