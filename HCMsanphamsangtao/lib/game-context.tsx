'use client';

import React, { createContext, useContext, useState } from 'react';

export interface GameState {
  currentStage: number;
  score: number;
  stage1Solved: boolean; // Puzzle completed
  stage2Answers: Map<string, number>; // Question ID -> selected option index
  stage3Matches: Map<string, string>; // Match ID -> matched ID
  stage4Score: number; // Points from catching ideologies
  stage5Answers: Map<string, string[]>; // Question ID -> filled blanks
}

interface GameContextType {
  gameState: GameState;
  moveToStage: (stage: number) => void;
  setSolvedPuzzle: () => void;
  recordStage2Answer: (questionId: string, selectedOption: number) => void;
  recordStage3Match: (matchId: string, matchedWithId: string) => void;
  addStage4Score: (points: number) => void;
  recordStage5Answer: (questionId: string, blanks: string[]) => void;
  resetGame: () => void;
  getTotalScore: () => number;
  updateScore: (points: number) => void;
  recordStage1Answer: (answer: boolean) => void;
  recordStage3Answer: (matchId: string, matchedWithId: string) => void;
  recordStage4Answer: (points: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  currentStage: 0,
  score: 0,
  stage1Solved: false,
  stage2Answers: new Map(),
  stage3Matches: new Map(),
  stage4Score: 0,
  stage5Answers: new Map()
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const moveToStage = (stage: number) => {
    setGameState((prev) => ({ ...prev, currentStage: stage }));
  };

  const setSolvedPuzzle = (answer: boolean) => {
    setGameState((prev) => ({
      ...prev,
      stage1Solved: answer,
      score: prev.score + (answer ? 10 : 0)
    }));
  };

  const recordStage2Answer = (questionId: string, selectedOption: number) => {
    setGameState((prev) => ({
      ...prev,
      stage2Answers: new Map(prev.stage2Answers).set(questionId, selectedOption)
    }));
  };

  const recordStage3Match = (matchId: string, matchedWithId: string) => {
    setGameState((prev) => ({
      ...prev,
      stage3Matches: new Map(prev.stage3Matches).set(matchId, matchedWithId)
    }));
  };

  const addStage4Score = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      stage4Score: prev.stage4Score + points,
      score: prev.score + points
    }));
  };

  const recordStage5Answer = (questionId: string, blanks: string[]) => {
    setGameState((prev) => ({
      ...prev,
      stage5Answers: new Map(prev.stage5Answers).set(questionId, blanks)
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const getTotalScore = () => gameState.score;

  const updateScore = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points
    }));
  };

  const recordStage1Answer = (answer: boolean) => {
    setGameState((prev) => ({
      ...prev,
      stage1Solved: answer,
      score: prev.score + (answer ? 10 : 0)
    }));
  };

  const recordStage3Answer = (matchId: string, matchedWithId: string) => {
    setGameState((prev) => ({
      ...prev,
      stage3Matches: new Map(prev.stage3Matches).set(matchId, matchedWithId)
    }));
  };

  const recordStage4Answer = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      stage4Score: prev.stage4Score + points,
      score: prev.score + points
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        moveToStage,
        setSolvedPuzzle,
        recordStage2Answer,
        recordStage3Match,
        addStage4Score,
        recordStage5Answer,
        resetGame,
        getTotalScore
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
