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

  /* ================= STATE ================= */
  const [status, setStatus] =
    useState<'idle' | 'playing' | 'finished' | 'failed'>('idle');

  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(240);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [combo, setCombo] = useState(0);
  const [speed, setSpeed] = useState(4);

  /* ================= REF ================= */
  const keys = useRef<{ left?: boolean; right?: boolean }>({});
  const basketRef = useRef(basketX);
  const saved = useRef(false);

  /* ================= CONST ================= */
  const WIDTH = 900;
  const HEIGHT = 520;
  const ITEM = 60; // Giảm kích thước vật thể
  const BASKET = 120;
  const TARGET = 200;
  const BASE_SPEED = 4;
  const MAX_SPEED = 9;

  /* ================= SYNC REF ================= */
  useEffect(() => {
    basketRef.current = basketX;
  }, [basketX]);

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

  /* ================= TIMER + SPEED UP ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          setStatus(score >= TARGET ? 'finished' : 'failed');
          return 0;
        }

        // tăng tốc theo thời gian
        setSpeed(s => Math.min(MAX_SPEED, BASE_SPEED + (30 - t) * 0.15));

        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, score]);

  /* ================= SPAWN ITEM ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      const r =
        gameData.stage4[
          Math.floor(Math.random() * gameData.stage4.length)
        ];
      setItems(i => [
        ...i.slice(-18),
        {
          id: crypto.randomUUID(),
          label: r.label,
          isCorrect: r.isCorrect,
          x: Math.random() * (WIDTH - ITEM),
          y: -ITEM
        }
      ]);
    }, 500); // Tăng tần suất rơi
    return () => clearInterval(id);
  }, [status]);

  /* ================= GAME LOOP (FIX HITBOX) ================= */
  useEffect(() => {
    if (status !== 'playing') return;

    const id = setInterval(() => {
      setItems(items =>
        items
          .map(i => ({ ...i, y: i.y + speed }))
          .filter(i => {
            const basketY = HEIGHT - 80; // Vị trí Y của giỏ
            const basketCenter = basketRef.current + BASKET / 2;
            const itemCenter = i.x + ITEM / 2;

            // Hitbox chính xác hơn: item phải rơi vào khoảng giữa giỏ
            const hit =
              i.y + ITEM >= basketY && // Chạm đáy item với đỉnh giỏ
              i.y <= basketY + 60 && // Đảm bảo item không qua khỏi giỏ
              itemCenter >= basketRef.current + 20 && // Cách lề trái 20px
              itemCenter <= basketRef.current + BASKET - 20; // Cách lề phải 20px

            if (hit) {
              if (i.isCorrect) {
                const newCombo = combo + 1;
                setCombo(newCombo);
                const multiplier = newCombo >= 3 ? 2 : 1;
                setScore(s => s + 10 * multiplier);
              } else {
                setCombo(0);
                setScore(s => Math.max(0, s - 5));
              }
              return false;
            }

            return i.y < HEIGHT;
          })
      );
    }, 30);

    return () => clearInterval(id);
  }, [status, speed, combo]);

  /* ================= SAVE SCORE ================= */
  useEffect(() => {
    if (status === 'finished' && !saved.current) {
      addStage4Score(score);
      saved.current = true;
    }
  }, [status, score, addStage4Score]);

  /* ================= START ================= */
  const start = () => {
    saved.current = false;
    setScore(0);
    setCombo(0);
    setSpeed(BASE_SPEED);
    setTimeLeft(30);
    setItems([]);
    setBasketX(240);
    setStatus('playing');
  };

  /* ================= UI ================= */

  if (status !== 'playing') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-black">
        <div className="bg-black/70 p-8 rounded-xl text-center w-[420px] border-2 border-yellow-500">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            🎮 GIAI ĐOẠN 4
          </h2>
          <p className="text-white mb-4 text-lg">
            Đuổi hình bắt chữ - Tư tưởng Hồ Chí Minh
          </p>
          <p className="text-yellow-300 mb-6">
            Đạt <span className="font-bold">{TARGET} điểm</span> trong 30 giây
          </p>

          {status === 'failed' && (
            <div className="mb-4 p-3 bg-red-500/20 rounded-lg border border-red-500">
              <p className="text-red-300">
                Bạn đạt <span className="font-bold">{score} điểm</span>
              </p>
              <p className="text-sm text-red-300/80 mt-1">
                Cần {TARGET - score} điểm nữa để qua!
              </p>
            </div>
          )}

          {status === 'finished' && (
            <div className="mb-4 p-3 bg-green-500/20 rounded-lg border border-green-500">
              <p className="text-green-300 font-bold text-xl">
                🎉 CHÚC MỪNG! {score} điểm
              </p>
            </div>
          )}

          <Button 
            onClick={start} 
            className="w-full py-3 text-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
          >
            {status === 'idle' ? 'BẮT ĐẦU' : 'CHƠI LẠI'}
          </Button>

          {status === 'finished' && (
            <Button
              onClick={() => moveToStage(5)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Sang giai đoạn 5 →
            </Button>
          )}

          <div className="mt-6 text-white/70 text-sm">
            <p>📌 Sử dụng phím <span className="text-yellow-400">← →</span> hoặc <span className="text-yellow-400">A D</span> để di chuyển</p>
            <p>📌 Bắt đúng: <span className="text-green-400">+10 điểm</span>, sai: <span className="text-red-400">-5 điểm</span></p>
            <p>📌 COMBO x3: <span className="text-yellow-400">nhân đôi điểm</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      {/* HUD TOP */}
      <div className="w-full max-w-[900px] mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/50 p-3 rounded-xl border border-yellow-500/50 text-center">
            <div className="text-white/70 text-sm">THỜI GIAN</div>
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              ⏱ {timeLeft}s
            </div>
          </div>
          
          <div className="bg-black/50 p-3 rounded-xl border border-yellow-500/50 text-center">
            <div className="text-white/70 text-sm">ĐIỂM SỐ</div>
            <div className="text-2xl font-bold text-white">
              ⭐ {score}<span className="text-white/50">/{TARGET}</span>
            </div>
          </div>
          
          <div className="bg-black/50 p-3 rounded-xl border border-yellow-500/50 text-center">
            <div className="text-white/70 text-sm">COMBO</div>
            <div className="text-2xl font-bold text-blue-400">
              {combo >= 3 ? '🔥 ' : ''}{combo}
              {combo >= 3 && <span className="text-sm text-yellow-400"> x2</span>}
            </div>
          </div>
        </div>
      </div>

      {/* GAME CONTAINER */}
      <div className="relative">
        <div
          className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border-4 border-yellow-500 shadow-2xl"
          style={{ width: WIDTH, height: HEIGHT }}
        >
          {/* BACKGROUND PATTERN */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 to-transparent" />
          </div>

          {/* ITEMS */}
          {items.map(i => (
            <div
              key={i.id}
              className="absolute flex flex-col items-center justify-center rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                width: ITEM,
                height: ITEM,
                left: i.x,
                top: i.y,
                background: i.isCorrect 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: `2px solid ${i.isCorrect ? '#059669' : '#dc2626'}`,
                boxShadow: `0 4px 12px ${i.isCorrect ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`
              }}
            >
              <div className="text-xs font-bold text-white text-center px-1 leading-tight">
                {i.label}
              </div>
              <div className={`text-lg mt-1 ${i.isCorrect ? 'text-green-100' : 'text-red-100'}`}>
                {i.isCorrect ? '✓' : '✗'}
              </div>
            </div>
          ))}

          {/* BASKET WITH BETTER VISUAL */}
          <div
            className="absolute flex items-center justify-center transition-all duration-100"
            style={{ 
              left: basketX, 
              bottom: 20, 
              width: BASKET, 
              height: 60 
            }}
          >
            <div className="relative w-full h-full">
              {/* Basket shadow */}
              <div className="absolute inset-0 bg-yellow-600/30 blur-md rounded-xl" />
              
              {/* Main basket */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl border-2 border-yellow-300 flex items-center justify-center">
                <div className="text-3xl animate-bounce">🧺</div>
                
                {/* Basket handle */}
                <div className="absolute -top-2 left-4 right-4 h-4 bg-yellow-300 rounded-full" />
              </div>
              
              {/* Hitbox indicator */}
              <div className="absolute -top-1 left-5 right-5 h-1 bg-green-400/50 rounded-full" />
            </div>
          </div>

          {/* FLOOR */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-700 to-gray-800 border-t-2 border-yellow-500/30" />
        </div>

        {/* CONTROLS INFO */}
        <div className="mt-4 text-center text-white/70 text-sm">
          Sử dụng <span className="text-yellow-400 font-bold">← →</span> hoặc 
          <span className="text-yellow-400 font-bold mx-2">A D</span> 
          để di chuyển giỏ
        </div>
      </div>

      {/* PAUSE/RESTART BUTTON */}
      <div className="mt-6">
        <Button
          onClick={() => setStatus('failed')}
          variant="outline"
          className="text-white border-red-500 hover:bg-red-500/20"
        >
          Kết thúc
        </Button>
      </div>
    </div>
  );
}
