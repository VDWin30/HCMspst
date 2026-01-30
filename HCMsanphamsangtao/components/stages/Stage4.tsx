'use client';

import { useState, useEffect, useRef } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

interface FallingItem {
  id: string;
  label: string;
  isCorrect: boolean;
  x: number;
  y: number;
}

export function Stage4() {
  const { moveToStage, addStage4Score } = useGame();

  const [gameStatus, setGameStatus] =
    useState<'idle' | 'playing' | 'finished' | 'failed'>('idle');

  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(200);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const savedScoreRef = useRef(false);
  const keysRef = useRef<{ left?: boolean; right?: boolean }>({});
  const gameLoopRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const CONTAINER_WIDTH = 480;
  const CONTAINER_HEIGHT = 420;
  const BASKET_WIDTH = 100;
  const ITEM_SIZE = 70;
  const FALL_SPEED = 4;
  const REQUIRED_SCORE = 200;
  const INITIAL_TIME = 30;

  const cleanup = () => {
    [gameLoopRef, spawnRef, timerRef].forEach(ref => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    });
    keysRef.current = {};
  };

  useEffect(() => cleanup, []);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      if (e.key === 'a' || e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'd' || e.key === 'ArrowRight') keysRef.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'd' || e.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [gameStatus]);

  // Basket move
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const id = setInterval(() => {
      setBasketX(x => {
        if (keysRef.current.left) return Math.max(0, x - 14);
        if (keysRef.current.right)
          return Math.min(CONTAINER_WIDTH - BASKET_WIDTH, x + 14);
        return x;
      });
    }, 30);
    return () => clearInterval(id);
  }, [gameStatus]);

  // Timer (QUYẾT ĐỊNH THẮNG / THUA)
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          cleanup();
          if (score >= REQUIRED_SCORE) {
            setGameStatus('finished');
          } else {
            setFailedAttempts(v => v + 1);
            setGameStatus('failed');
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => cleanup();
  }, [gameStatus, score]);

  // Spawn item
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    spawnRef.current = setInterval(() => {
      const data = gameData.stage4;
      const r = data[Math.floor(Math.random() * data.length)];
      setFallingItems(items => [
        ...items.slice(-12),
        {
          id: crypto.randomUUID(),
          label: r.label,
          isCorrect: r.isCorrect,
          x: Math.random() * (CONTAINER_WIDTH - ITEM_SIZE),
          y: -ITEM_SIZE
        }
      ]);
    }, 600);

    return () => cleanup();
  }, [gameStatus]);

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      setFallingItems(items =>
        items
          .map(i => ({ ...i, y: i.y + FALL_SPEED }))
          .filter(item => {
            const hit =
              item.y + ITEM_SIZE >= CONTAINER_HEIGHT - 70 &&
              item.x + ITEM_SIZE / 2 >= basketX &&
              item.x + ITEM_SIZE / 2 <= basketX + BASKET_WIDTH;

            if (hit) {
              setScore(s => (item.isCorrect ? s + 10 : Math.max(0, s - 5)));
              return false;
            }
            return item.y < CONTAINER_HEIGHT;
          })
      );
    }, 40);

    return () => cleanup();
  }, [gameStatus, basketX]);

  // Save score ONCE
  useEffect(() => {
    if (gameStatus === 'finished' && !savedScoreRef.current) {
      addStage4Score(score);
      savedScoreRef.current = true;
    }
  }, [gameStatus, score, addStage4Score]);

  const start = () => {
    cleanup();
    savedScoreRef.current = false;
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setBasketX(200);
    setFallingItems([]);
    setGameStatus('playing');
  };

  /* ================= UI ================= */

  if (gameStatus === 'idle' || gameStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-black/50 border border-yellow-400/40 rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Giai đoạn 4: Hứng Ý Tưởng
          </h2>
          <p className="text-white/70 mb-4">
            Đạt {REQUIRED_SCORE} điểm trong {INITIAL_TIME}s
          </p>
          {gameStatus === 'failed' && (
            <p className="text-red-400 mb-3">
              Thử {failedAttempts} lần – đạt {score} điểm
            </p>
          )}
          <Button onClick={start} className="w-full text-lg py-3">
            {failedAttempts ? 'CHƠI LẠI' : 'BẮT ĐẦU'}
          </Button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-green-500/20 border border-green-400 rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-3xl text-green-400 font-bold mb-2">HOÀN THÀNH!</h2>
          <p className="text-white mb-6">Bạn đạt {score} điểm</p>
          <Button onClick={() => moveToStage(5)} className="w-full py-3">
            Sang giai đoạn 5 →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="relative bg-black/70 border-2 border-yellow-400/40 rounded-lg overflow-hidden"
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
      >
        {/* HUD */}
        <div className="absolute top-2 left-2 text-xs text-white">
          ⏱ {timeLeft}s
        </div>
        <div className="absolute top-2 right-2 text-xs text-white">
          ⭐ {score}/{REQUIRED_SCORE}
        </div>

        {/* Items */}
        {fallingItems.map(i => (
          <div
            key={i.id}
            className="absolute text-xs text-white font-bold rounded-lg flex items-center justify-center text-center"
            style={{
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              left: i.x,
              top: i.y,
              background: i.isCorrect ? '#10b981' : '#ef4444'
            }}
          >
            {i.label}
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-2 h-[60px] bg-yellow-500 rounded-lg flex items-center justify-center"
          style={{ left: basketX, width: BASKET_WIDTH }}
        >
          🧺
        </div>
      </div>
    </div>
  );
}
