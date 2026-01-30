'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { HomeScreen } from '@/components/HomeScreen';
import { CompletionScreen } from '@/components/CompletionScreen';
import { Stage1 } from '@/components/stages/Stage1';
import { Stage2 } from '@/components/stages/Stage2';
import { Stage3 } from '@/components/stages/Stage3';
import { Stage4 } from '@/components/stages/Stage4';
import { Stage5 } from '@/components/stages/Stage5';

function GameContent() {
  const { gameState, moveToStage, resetGame, getTotalScore } = useGame();
  const [gameScreen, setGameScreen] = useState<
    'home' | 'playing' | 'completed'
  >('home');

  const maxScore = 145;

  const handleStartGame = () => {
    moveToStage(1);
    setGameScreen('playing');
  };

  const handleRestart = () => {
    resetGame();
    setGameScreen('home');
  };

  const handleHome = () => {
    resetGame();
    setGameScreen('home');
  };

  if (gameScreen === 'home') {
    return <HomeScreen onStart={handleStartGame} />;
  }

  if (gameScreen === 'completed') {
    return (
      <CompletionScreen
        score={getTotalScore()}
        maxScore={maxScore}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 flex flex-col">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full mb-4">
        <div className="flex justify-between items-center p-4 rounded-lg bg-black/40 border border-yellow-400/20">
          <div>
            <p className="text-xs text-white/60">
              Giai đoạn {gameState.currentStage}
            </p>
            <p className="text-lg font-bold text-yellow-300">
              {getTotalScore()} điểm
            </p>
          </div>
          <button
            onClick={handleHome}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white"
          >
            ← Quay về
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        {gameState.currentStage === 1 && <Stage1 />}
        {gameState.currentStage === 2 && <Stage2 />}
        {gameState.currentStage === 3 && <Stage3 />}
        {gameState.currentStage === 4 && <Stage4 />}
        {gameState.currentStage === 5 && <Stage5 />}
        {gameState.currentStage > 5 && (
          <CompletionScreen
            score={getTotalScore()}
            maxScore={maxScore}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <GameContent />;
}
