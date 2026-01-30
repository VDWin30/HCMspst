'use client';

import React, { createContext, useContext, useState } from 'react';

/* ================= TYPE ================= */

type GameState = {
  currentStage: number;
  score: number;

  // Stage 1
  stage1Completed: boolean;

  // Stage 2
  stage2Answers: Record<string, number>;

  // Stage 3
  stage3Score: number;
  stage3Moves: number;
  stage3Completed: boolean;

  // Stage 5
  stage5Answers: Record<string, boolean>;
};

type GameContextType = {
  gameState: GameState;

  /* ===== NAV ===== */
  moveToStage: (stage: number) => void;

  /* ===== GLOBAL SCORE ===== */
  addScore: (point: number) => void;

  /* ===== STAGE 1 ===== */
  completeStage1: () => void;

  /* ===== STAGE 2 ===== */
  recordStage2Answer: (id: string, answer: number) => void;
  addStage2Score: (point: number) => void;

  /* ===== STAGE 3 ===== */
  startStage3: () => void;
  recordStage3Move: () => void;
  completeStage3: () => void;

  /* ===== STAGE 4 ===== */
  addStage4Score: (point: number) => void;

  /* ===== STAGE 5 ===== */
  answerStage5: (id: string, correct: boolean) => void;

  /* ===== RESET ===== */
  resetGame: () => void;
};

/* ================= CONTEXT ================= */

const GameContext = createContext<GameContextType | null>(null);

/* ================= PROVIDER ================= */

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: 0,
    score: 0,

    stage1Completed: false,

    stage2Answers: {},

    stage3Score: 0,
    stage3Moves: 0,
    stage3Completed: false,

    stage5Answers: {},
  });

  /* ===== NAV ===== */
  const moveToStage = (stage: number) => {
    setGameState(p => ({ ...p, currentStage: stage }));
  };

  /* ===== GLOBAL SCORE ===== */
  const addScore = (point: number) => {
    setGameState(p => ({ ...p, score: p.score + point }));
  };

  /* ================= STAGE 1 ================= */
  const completeStage1 = () => {
    setGameState(p => {
      if (p.stage1Completed) return p;

      return {
        ...p,
        stage1Completed: true,
        score: p.score + 100,
      };
    });
  };

  /* ================= STAGE 2 ================= */
  const recordStage2Answer = (id: string, answer: number) => {
    setGameState(p => ({
      ...p,
      stage2Answers: {
        ...p.stage2Answers,
        [id]: answer,
      },
    }));
  };

  const addStage2Score = (point: number) => {
    addScore(point);
  };

  /* ================= STAGE 3 ================= */

  // Init Stage 3 (chỉ reset nếu chưa chơi)
  const startStage3 = () => {
    setGameState(p => ({
      ...p,
      stage3Score: 500,
      stage3Moves: 0,
      stage3Completed: false,
    }));
  };

  // Mỗi lượt lật: trừ điểm stage 3
  const recordStage3Move = () => {
    setGameState(p => ({
      ...p,
      stage3Moves: p.stage3Moves + 1,
      stage3Score: Math.max(0, p.stage3Score - 10),
    }));
  };

  // Hoàn thành Stage 3 → cộng điểm đúng 1 lần
  const completeStage3 = () => {
    setGameState(p => {
      if (p.stage3Completed) return p;

      return {
        ...p,
        stage3Completed: true,
        score: p.score + p.stage3Score,
      };
    });
  };

  /* ================= STAGE 4 ================= */
  const addStage4Score = (point: number) => {
    addScore(point);
  };

  /* ================= STAGE 5 ================= */
  const answerStage5 = (id: string, correct: boolean) => {
    setGameState(p => {
      const alreadyCorrect = p.stage5Answers[id];

      return {
        ...p,
        stage5Answers: {
          ...p.stage5Answers,
          [id]: correct,
        },
        score:
          correct && !alreadyCorrect
            ? p.score + 100
            : p.score,
      };
    });
  };

  /* ================= RESET ================= */
  const resetGame = () => {
    setGameState({
      currentStage: 0,
      score: 0,

      stage1Completed: false,

      stage2Answers: {},

      stage3Score: 0,
      stage3Moves: 0,
      stage3Completed: false,

      stage5Answers: {},
    });
  };

  /* ================= PROVIDER ================= */

  return (
    <GameContext.Provider
      value={{
        gameState,
        moveToStage,

        addScore,

        completeStage1,

        recordStage2Answer,
        addStage2Score,

        startStage3,
        recordStage3Move,
        completeStage3,

        addStage4Score,

        answerStage5,

        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return ctx;
}
