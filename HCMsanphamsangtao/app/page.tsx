'use client';

import { useState } from 'react';
import { GameProvider, useGame } from '@/lib/game-context';
import { HomeScreen } from '@/components/HomeScreen';
import { CompletionScreen } from '@/components/CompletionScreen';
import { Stage1 } from '@/components/stages/Stage1';
import { Stage2 } from '@/components/stages/Stage2';
import { Stage3 } from '@/components/stages/Stage3';
import { Stage4 } from '@/components/stages/Stage4';
import { Stage5 } from '@/components/stages/Stage5';
import { Card } from '@/components/ui/card';

function GameContent() {
  const { gameState, moveToStage, resetGame, getTotalScore } = useGame();
  const [gameScreen, setGameScreen] = useState<
    'home' | 'playing' | 'completed'
  >('home');

  const maxScore = 145; // 30 + 30 + 15 + 40 + 30

  const handleStartGame = () => {
    moveToStage(1);
    setGameScreen('playing');
  };

  const handleCompleteStage = () => {
    const nextStage = gameState.currentStage + 1;

    if (nextStage > 5) {
      setGameScreen('completed');
    } else {
      moveToStage(nextStage);
    }
  };

  const handleRestart = () => {
    resetGame();
    setGameScreen('home');
  };

  const handleHome = () => {
    resetGame();
    setGameScreen('home');
  };

  // Render current screen
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

  // Playing screen with stage components
  return (
    <div className="min-h-screen py-4 px-4 flex flex-col">
      {/* Compact Header Bar */}
      <div className="max-w-7xl mx-auto w-full mb-4">
        <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-black/40 to-black/20 shadow-lg border border-yellow-400/20 backdrop-blur">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-yellow-300">Thế hệ Hồ Chí Minh</h1>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-xs text-white/60">Giai đoạn {gameState.currentStage}</p>
              <p className="text-lg font-bold text-yellow-300">{getTotalScore()} điểm</p>
            </div>
          </div>
          <button
            onClick={handleHome}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-sm font-semibold text-white"
          >
            ← Quay về
          </button>
        </div>

        {/* Compact Stage Progress */}
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div key={stage} className="flex-1 h-2 rounded-full overflow-hidden bg-white/10">
              <div
                className={`h-full transition-all ${
                  stage < gameState.currentStage
                    ? 'bg-green-500 w-full'
                    : stage === gameState.currentStage
                      ? 'bg-yellow-400 w-full'
                      : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="flex-1 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="rounded-xl bg-black/35 p-6 h-full shadow-2xl border border-yellow-400/10 backdrop-blur">
          {gameState.currentStage === 1 && <Stage1 />}
          {gameState.currentStage === 2 && <Stage2 />}
          {gameState.currentStage === 3 && <Stage3 />}
          {gameState.currentStage === 4 && <Stage4 />}
          {gameState.currentStage === 5 && <Stage5 />}
          {gameState.currentStage === 6 && (
            <CompletionScreen
              score={getTotalScore()}
              maxScore={maxScore}
              onRestart={handleRestart}
              onHome={handleHome}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
