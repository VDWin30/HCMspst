'use client';

import React, { createContext, useContext, useState } from 'react';

/* =======================
   TYPES
======================= */

export interface GameState {
  currentStage: number;
  score: number;

  // Stage 1
  stage1Solved: boolean;

  // Stage 2
  stage2Answers: Map<string, number>;
  stage2CorrectCount: number;

  // Stage 3
  stage3Matches: Map<string, string>;
  stage3RemainingScore: number;

  // Stage 4
  stage4Score: number;

  // Stage 5
  stage5Answers: Map<string, string[]>;
  stage5CorrectCount: number;
}

interface GameContextType {
  gameState: GameState;

  moveToStage(stage: number): void;

  // Stage 1
  completeStage1(): void;

  // Stage 2
  answerStage2(
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ): void;

  // Stage 3
  recordStage3Match(matchId: string, matchedWithId: string): void;
  penaltyStage3(): void;

  // Stage 4
  addStage4Score(points: number): void;

  // Stage 5
  answerStage5(
    questionId: string,
    blanks: string[],
    isCorrect: boolean
  ): void;

  resetGame(): void;
}

/* =======================
   INITIAL STATE (FACTORY)
======================= */

const createInitialGameState = (): GameState => ({
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
});

const GameContext = createContext<GameContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );

  /* ===== MOVE STAGE ===== */
  const moveToStage = (stage: number) => {
    setGameState(prev => ({ ...prev, currentStage: stage }));
  };

  /* ===== STAGE 1 ===== */
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

  /* ===== STAGE 2 ===== */
  const answerStage2 = (
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ) => {
    setGameState(prev => {
      if (prev.stage2Answers.has(questionId)) return prev;

      const nextAnswers = new Map(prev.stage2Answers);
      nextAnswers.set(questionId, selectedOption);

      return {
        ...prev,
        stage2Answers: nextAnswers,
        stage2CorrectCount: isCorrect
          ? prev.stage2CorrectCount + 1
          : prev.stage2CorrectCount,
        score: isCorrect ? prev.score + 10 : prev.score
      };
    });
  };

  /* ===== STAGE 3 ===== */
  const recordStage3Match = (matchId: string, matchedWithId: string) => {
    setGameState(prev => {
      const next = new Map(prev.stage3Matches);
      next.set(matchId, matchedWithId);

      return {
        ...prev,
        stage3Matches: next
      };
    });
  };

  // dùng khi chọn sai / quá thời gian
  const penaltyStage3 = () => {
    setGameState(prev => ({
      ...prev,
      stage3RemainingScore: Math.max(prev.stage3RemainingScore - 10, 0),
      score: Math.max(prev.score - 10, 0)
    }));
  };

  /* ===== STAGE 4 ===== */
  const addStage4Score = (points: number) => {
    setGameState(prev => ({
      ...prev,
      stage4Score: prev.stage4Score + points,
      score: prev.score + points
    }));
  };

  /* ===== STAGE 5 ===== */
  const answerStage5 = (
    questionId: string,
    blanks: string[],
    isCorrect: boolean
  ) => {
    setGameState(prev => {
      if (prev.stage5Answers.has(questionId)) return prev;

      const nextAnswers = new Map(prev.stage5Answers);
      nextAnswers.set(questionId, blanks);

      return {
        ...prev,
        stage5Answers: nextAnswers,
        stage5CorrectCount: isCorrect
          ? prev.stage5CorrectCount + 1
          : prev.stage5CorrectCount,
        score: isCorrect ? prev.score + 100 : prev.score
      };
    });
  };

  /* ===== RESET ===== */
  const resetGame = () => {
    setGameState(createInitialGameState());
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        moveToStage,
        completeStage1,
        answerStage2,
        recordStage3Match,
        penaltyStage3,
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
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return ctx;
}
