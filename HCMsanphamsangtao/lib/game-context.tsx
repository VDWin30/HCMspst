'use client';

import React, { createContext, useContext, useState } from 'react';

type GameState = {
  stage: number;
  score: number;
};

type GameContextType = {
  gameState: GameState;

  moveToStage: (stage: number) => void;
  addScore: (point: number) => void;
  getTotalScore: () => number;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    stage: 0, // 0 = Home
    score: 0,
  });

  const moveToStage = (stage: number) => {
    setGameState(prev => ({ ...prev, stage }));
  };

  const addScore = (point: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + point }));
  };

  const getTotalScore = () => {
    return gameState.score;
  };

  const resetGame = () => {
    setGameState({ stage: 0, score: 0 });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        moveToStage,
        addScore,
        getTotalScore,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return ctx;
}
