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

  const [status, setStatus] =
    useState<'idle' | 'playing' | 'finished' | 'failed'>('idle');

  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(240);
  const [items, setItems] = useState<FallingItem[]>([]);

  const keys = useRef<{ left?: boolean; right?: boolean }>({});
  const saved = useRef(false);

  const WIDTH = 900;
  const HEIGHT = 520;
  const ITEM = 80;
  const BASKET = 120;
  const SPEED = 5;
  const TARGET = 200;

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [status]);

  /* ================= MOVE BASKET ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setBasketX(x => {
        if (keys.current.left) return Math.max(0, x - 18);
        if (keys.current.right)
          return Math.min(WIDTH - BASKET, x + 18);
        return x;
      });
    }, 16);
    return () => clearInterval(id);
  }, [status]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          setStatus(score >= TARGET ? 'finished' : 'failed');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, score]);

  /* ================= SPAWN ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      const r = gameData.stage4[Math.floor(Math.random() * gameData.stage4.length)];
      setItems(i => [
        ...i.slice(-15),
        {
          id: crypto.randomUUID(),
          label: r.label,
          isCorrect: r.isCorrect,
          x: Math.random() * (WIDTH - ITEM),
          y: -ITEM
        }
      ]);
    }, 700);
    return () => clearInterval(id);
  }, [status]);

  /* ================= GAME LOOP ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setItems(items =>
        items
          .map(i => ({ ...i, y: i.y + SPEED }))
          .filter(i => {
            const hit =
              i.y + ITEM >= HEIGHT - 80 &&
              i.x + ITEM / 2 >= basketX &&
              i.x + ITEM / 2 <= basketX + BASKET;

            if (hit) {
              setScore(s => (i.isCorrect ? s + 10 : Math.max(0, s - 5)));
              return false;
            }
            return i.y < HEIGHT;
          })
      );
    }, 30);
    return () => clearInterval(id);
  }, [status, basketX]);

  /* ================= SAVE SCORE ================= */
  useEffect(() => {
    if (status === 'finished' && !saved.current) {
      addStage4Score(score);
      saved.current = true;
    }
  }, [status, score, addStage4Score]);

  const start = () => {
    saved.current = false;
    setScore(0);
    setTimeLeft(30);
    setItems([]);
    setBasketX(240);
    setStatus('playing');
  };

  /* ================= UI ================= */

  if (status !== 'playing') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-black">
        <div className="bg-black/70 p-8 rounded-xl text-center w-[420px]">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            GIAI ĐOẠN 4
          </h2>
          <p className="text-white mb-6">
            Đạt {TARGET} điểm trong 30 giây
          </p>

          {status === 'failed' && (
            <p className="text-red-400 mb-4">
              Bạn chỉ đạt {score} điểm
            </p>
          )}

          <Button onClick={start} className="w-full py-3 text-lg">
            {status === 'idle' ? 'BẮT ĐẦU' : 'CHƠI LẠI'}
          </Button>

          {status === 'finished' && (
            <Button
              onClick={() => moveToStage(5)}
              className="w-full mt-4 py-3"
            >
              Sang giai đoạn 5 →
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-black">
      <div
        className="relative bg-black/80 border-4 border-yellow-500 rounded-xl"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* HUD */}
        <div className="absolute top-2 left-3 text-white">⏱ {timeLeft}s</div>
        <div className="absolute top-2 right-3 text-white">
          ⭐ {score}/{TARGET}
        </div>

        {/* ITEMS */}
        {items.map(i => (
          <div
            key={i.id}
            className="absolute text-xs font-bold text-white rounded-xl flex items-center justify-center text-center px-1"
            style={{
              width: ITEM,
              height: ITEM,
              left: i.x,
              top: i.y,
              background: i.isCorrect ? '#22c55e' : '#ef4444'
            }}
          >
            {i.label}
          </div>
        ))}

        {/* BASKET */}
        <div
          className="absolute bottom-3 bg-yellow-400 rounded-xl flex items-center justify-center text-3xl"
          style={{ left: basketX, width: BASKET, height: 60 }}
        >
          🧺
        </div>
      </div>
    </div>
  );
}
