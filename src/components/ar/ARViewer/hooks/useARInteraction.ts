import { useCallback } from 'react';
import { Vector3 } from 'three';
import { Game } from '../../../../types';

interface UseARInteractionProps {
  selectedGame: Game | null;
  onPlaceGame: (gameId: string, position: Vector3) => void;
}

export function useARInteraction({ selectedGame, onPlaceGame }: UseARInteractionProps) {
  const handleSelect = useCallback((event: { intersection?: { point: Vector3 } }) => {
    if (selectedGame && event.intersection?.point) {
      onPlaceGame(selectedGame.id, event.intersection.point);
    }
  }, [selectedGame, onPlaceGame]);

  return { handleSelect };
}