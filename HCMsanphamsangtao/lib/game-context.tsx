'use client';

import React, { createContext, useContext, useState } from 'react';

/* =======================
   TYPES
======================= */

export interface GameState {
  currentStage: number;
  score: number;

  // Game 1
  stage1Solved: boolean;

  // Game 2
  stage2Answers: Map<string, number>;
  stage2CorrectCount: number;

  // Game 3
  stage3Matches: Map<string, string>;
  stage3RemainingScore: number;

  // Game 4
  stage4Score: number;

  // Game 5
  stage5Answers: Map<string, string[]>;
  stage5CorrectCount: number;
}

interface GameContextType {
  gameState: GameState;

  moveToStage: (stage: number) => void;

  // Game 1
  completeStage1: () => void;

  // Game 2
  answerStage2: (questionId: string, selectedOption: number, isCorrect: boolean) => void;

  // Game 3
  moveStage3: () => void;
  recordStage3Match: (matchId: string, matchedWithId: string) => void;

  // Game 4
  addStage4Score: (points: number) => void;

  // Game 5
  answerStage5: (questionId: string, blanks: string[], isCorrect: boolean) => void;

  resetGame: () => void;
}

/* =======================
   INITIAL STATE
======================= */

const initialGameState: GameState = {
  currentStage: 1,
  score: 0,

  stage1Solved: false,

  stage2Answers: new Map(),
  stage2CorrectCount: 0,

  stage3Matches: new Map(),
  stage3RemainingScore: 500,

  stage4Score: 0,

  stage5Answers: new Map(),
  stage5CorrectCount: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const moveToStage = (stage: number) => {
    setGameState(prev => ({ ...prev, currentStage: stage }));
  };

  /* ===== GAME 1 ===== */
  const completeStage1 = () => {
    setGameState(prev => {
      if (prev.stage1Solved) return prev;
      return {
        ...prev,
        stage1Solved: true,
        score: prev.score + 100
      };
    });
  };

  /* ===== GAME 2 ===== */
  const answerStage2 = (
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ) => {
    setGameState(prev => {
      const alreadyAnswered = prev.stage2Answers.has(questionId);

      return {
        ...prev,
        stage2Answers: new Map(prev.stage2Answers).set(questionId, selectedOption),
        stage2CorrectCount: isCorrect && !alreadyAnswered
          ? prev.stage2CorrectCount + 1
          : prev.stage2CorrectCount,
        score: isCorrect && !alreadyAnswered
          ? prev.score + 10
          : prev.score
      };
    });
  };

  /* ===== GAME 3 ===== */
  const moveStage3 = () => {
    setGameState(prev => ({
      ...prev,
      stage3RemainingScore: Math.max(prev.stage3RemainingScore - 10, 0),
      score: Math.max(prev.score - 10, 0)
    }));
  };

  const recordStage3Match = (matchId: string, matchedWithId: string) => {
    setGameState(prev => ({
      ...prev,
      stage3Matches: new Map(prev.stage3Matches).set(matchId, matchedWithId)
    }));
  };

  /* ===== GAME 4 ===== */
  const addStage4Score = (points: number) => {
    setGameState(prev => ({
      ...prev,
      stage4Score: prev.stage4Score + points,
      score: prev.score + points
    }));
  };

  /* ===== GAME 5 ===== */
  const answerStage5 = (
    questionId: string,
    blanks: string[],
    isCorrect: boolean
  ) => {
    setGameState(prev => {
      const alreadyAnswered = prev.stage5Answers.has(questionId);

      return {
        ...prev,
        stage5Answers: new Map(prev.stage5Answers).set(questionId, blanks),
        stage5CorrectCount: isCorrect && !alreadyAnswered
          ? prev.stage5CorrectCount + 1
          : prev.stage5CorrectCount,
        score: isCorrect && !alreadyAnswered
          ? prev.score + 100
          : prev.score
      };
    });
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        moveToStage,
        completeStage1,
        answerStage2,
        moveStage3,
        recordStage3Match,
        addStage4Score,
        answerStage5,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
