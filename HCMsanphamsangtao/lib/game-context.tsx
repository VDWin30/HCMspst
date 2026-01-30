'use client';

import React, { createContext, useContext, useState } from 'react';

type GameState = {
  currentStage: number; // 0 = Home
  score: number;

  // Stage 2
  stage2Answers: Record<string, number>;
};

type GameContextType = {
  gameState: GameState;

  moveToStage: (stage: number) => void;

  // Score
  addScore: (point: number) => void;
  getTotalScore: () => number;

  // Stage helpers
  completeStage1: () => void;
  recordStage2Answer: (questionId: string, answer: number) => void;
  addStage2Score: (point: number) => void;

  resetGame: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: 0,
    score: 0,
    stage2Answers: {},
  });

  /* ===== NAVIGATION ===== */
  const moveToStage = (stage: number) => {
    setGameState(prev => ({ ...prev, currentStage: stage }));
  };

  /* ===== SCORE ===== */
  const addScore = (point: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + point,
    }));
  };

  const getTotalScore = () => gameState.score;

  /* ===== STAGE 1 ===== */
  const completeStage1 = () => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 100,
    }));
  };

  /* ===== STAGE 2 ===== */
  const recordStage2Answer = (questionId: string, answer: number) => {
    setGameState(prev => ({
      ...prev,
      stage2Answers: {
        ...prev.stage2Answers,
        [questionId]: answer,
      },
    }));
  };

  const addStage2Score = (point: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + point,
    }));
  };

  /* ===== RESET ===== */
  const resetGame = () => {
    setGameState({
      currentStage: 0,
      score: 0,
      stage2Answers: {},
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        moveToStage,
        addScore,
        getTotalScore,
        completeStage1,
        recordStage2Answer,
        addStage2Score,
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
