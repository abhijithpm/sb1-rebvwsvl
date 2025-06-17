import React from 'react';
import { Game } from '../../../../types';
import { useARStore } from '../../../../store/arStore';
import { GameModel } from './GameModel';

interface PreviewObjectProps {
  games: Game[];
}

export function PreviewObject({ games }: PreviewObjectProps) {
  const { previewObject } = useARStore();

  if (!previewObject) return null;

  const game = games.find(g => g.id === previewObject.gameId);
  if (!game) return null;

  return (
    <GameModel
      game={game}
      position={previewObject.position}
      rotation={previewObject.rotation}
      scale={previewObject.scale}
      isPreview={true}
    />
  );
}