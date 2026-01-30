'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

interface FallingItem {
  id: string;
  label: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number; // Tốc độ riêng cho từng item
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
  const [baseSpeed, setBaseSpeed] = useState(4);
  const [lastSpawn, setLastSpawn] = useState(0);

  /* ================= REF ================= */
  const keys = useRef<{ left?: boolean; right?: boolean }>({});
  const basketRef = useRef(basketX);
  const saved = useRef(false);
  const gameLoopId = useRef<number | null>(null);
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  /* ================= CONST ================= */
  const WIDTH = 900;
  const HEIGHT = 520;
  const ITEM = 70; // Kích thước vừa phải
  const BASKET = 140;
  const TARGET = 200;
  const BASE_SPEED = 4;
  const MAX_SPEED = 10;
  const SPAWN_RATE = 450; // ms giữa mỗi lần spawn

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

  /* ================= MOVE BASKET (SMOOTH) ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    
    const moveBasket = () => {
      setBasketX(x => {
        let newX = x;
        if (keys.current.left) newX = Math.max(0, x - 16);
        if (keys.current.right) newX = Math.min(WIDTH - BASKET, x + 16);
        return newX;
      });
      animationFrameId.current = requestAnimationFrame(moveBasket);
    };
    
    animationFrameId.current = requestAnimationFrame(moveBasket);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
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

        // Tăng tốc theo thời gian
        const newSpeed = Math.min(MAX_SPEED, BASE_SPEED + (30 - t) * 0.2);
        setBaseSpeed(newSpeed);

        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, score]);

  /* ================= SPAWN ITEM ================= */
  useEffect(() => {
    if (status !== 'playing') return;
    
    const spawnItem = () => {
      const r = gameData.stage4[Math.floor(Math.random() * gameData.stage4.length)];
      const speedVariation = 0.5 + Math.random() * 0.5; // 0.5 - 1.0
      
      setItems(i => [
        ...i.slice(-25), // Giữ tối đa 25 item
        {
          id: crypto.randomUUID(),
          label: r.label,
          isCorrect: r.isCorrect,
          x: Math.random() * (WIDTH - ITEM),
          y: -ITEM,
          speed: baseSpeed * speedVariation // Tốc độ ngẫu nhiên
        }
      ]);
      setLastSpawn(Date.now());
    };

    // Spawn đầu tiên
    spawnItem();
    
    const id = setInterval(spawnItem, SPAWN_RATE);
    return () => clearInterval(id);
  }, [status, baseSpeed]);

  /* ================= GAME LOOP (OPTIMIZED WITH RAF) ================= */
  useEffect(() => {
    if (status !== 'playing') return;

    const gameLoop = (timestamp: number) => {
      if (!lastTime.current) lastTime.current = timestamp;
      const delta = timestamp - lastTime.current;
      
      if (delta > 16) { // ~60fps
        setItems(items => {
          const newItems: FallingItem[] = [];
          let comboChange = 0;
          let scoreChange = 0;

          for (const item of items) {
            // Di chuyển item
            const newY = item.y + item.speed;
            
            // Tính toán hitbox
            const basketLeft = basketRef.current;
            const basketRight = basketRef.current + BASKET;
            const basketTop = HEIGHT - 80; // Vị trí Y của giỏ
            const basketBottom = basketTop + 40; // Chiều cao hitbox
            
            const itemLeft = item.x;
            const itemRight = item.x + ITEM;
            const itemTop = newY;
            const itemBottom = newY + ITEM;

            // Kiểm tra va chạm (AABB collision)
            const hit = 
              itemLeft < basketRight &&
              itemRight > basketLeft &&
              itemTop < basketBottom &&
              itemBottom > basketTop;

            if (hit) {
              // Item bị bắt
              if (item.isCorrect) {
                comboChange += 1;
                const multiplier = combo + comboChange >= 3 ? 2 : 1;
                scoreChange += 10 * multiplier;
              } else {
                comboChange = -combo; // Reset combo
                scoreChange -= 5;
              }
              // Không thêm item này vào danh sách mới (đã bị bắt)
            } else if (newY < HEIGHT) {
              // Item chưa chạm đáy
              newItems.push({ ...item, y: newY });
            }
          }

          // Cập nhật state
          if (comboChange !== 0) {
            setCombo(c => Math.max(0, c + comboChange));
          }
          if (scoreChange !== 0) {
            setScore(s => Math.max(0, s + scoreChange));
          }

          return newItems;
        });
        
        lastTime.current = timestamp;
      }
      
      gameLoopId.current = requestAnimationFrame(gameLoop);
    };

    gameLoopId.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopId.current) {
        cancelAnimationFrame(gameLoopId.current);
      }
    };
  }, [status, combo]);

  /* ================= SAVE SCORE ================= */
  useEffect(() => {
    if (status === 'finished' && !saved.current) {
      addStage4Score(score);
      saved.current = true;
    }
  }, [status, score, addStage4Score]);

  /* ================= START ================= */
  const start = useCallback(() => {
    // Dọn dẹp animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (gameLoopId.current) {
      cancelAnimationFrame(gameLoopId.current);
    }
    
    saved.current = false;
    setScore(0);
    setCombo(0);
    setBaseSpeed(BASE_SPEED);
    setTimeLeft(30);
    setItems([]);
    setBasketX((WIDTH - BASKET) / 2);
    setStatus('playing');
    lastTime.current = 0;
  }, [WIDTH, BASKET]);

  /* ================= UI ================= */

  if (status !== 'playing') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="relative max-w-md w-full mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-red-500/10 to-yellow-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-4 py-2 rounded-full">
                <span className="text-yellow-300 font-bold">🎮 GIAI ĐOẠN 4</span>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Đuổi hình bắt chữ
              </h2>
              <p className="text-white/70">
                Tư tưởng Hồ Chí Minh
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl">
              <p className="text-yellow-300 font-bold text-xl">
                Đạt <span className="text-white">{TARGET} điểm</span> trong 30 giây
              </p>
            </div>

            {status === 'failed' && (
              <div className="p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl border border-red-500/30">
                <p className="text-red-300 font-bold text-lg">
                  {score} điểm
                </p>
                <p className="text-red-300/80 text-sm mt-1">
                  Cần {TARGET - score} điểm nữa để qua!
                </p>
              </div>
            )}

            {status === 'finished' && (
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                <p className="text-green-300 font-bold text-xl">
                  🎉 {score} điểm
                </p>
              </div>
            )}

            <Button 
              onClick={start} 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
            >
              {status === 'idle' ? 'BẮT ĐẦU' : 'CHƠI LẠI'}
            </Button>

            {status === 'finished' && (
              <Button
                onClick={() => moveToStage(5)}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Tiếp tục giai đoạn 5 →
              </Button>
            )}

            <div className="pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 gap-2 text-sm text-white/70">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Đúng: <span className="text-green-400">+10 điểm</span></span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Sai: <span className="text-red-400">-5 điểm</span></span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>COMBO x3: <span className="text-yellow-400">nhân đôi điểm</span></span>
                </div>
              </div>
            </div>
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
          <div className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border border-yellow-500/30 text-center">
            <div className="text-white/70 text-sm mb-1">THỜI GIAN</div>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              {timeLeft}s
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border border-yellow-500/30 text-center">
            <div className="text-white/70 text-sm mb-1">ĐIỂM SỐ</div>
            <div className="text-3xl font-bold text-white">
              {score}<span className="text-white/50 text-xl">/{TARGET}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border border-yellow-500/30 text-center">
            <div className="text-white/70 text-sm mb-1">COMBO</div>
            <div className="text-3xl font-bold text-blue-400">
              {combo >= 3 ? '🔥 ' : ''}{combo}
              {combo >= 3 && <span className="text-sm text-yellow-400 ml-1">x2</span>}
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
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 to-transparent" />
          </div>

          {/* ITEMS */}
          {items.map(i => (
            <div
              key={i.id}
              className="absolute flex flex-col items-center justify-center rounded-xl shadow-lg"
              style={{
                width: ITEM,
                height: ITEM,
                left: i.x,
                top: i.y,
                background: i.isCorrect 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: `3px solid ${i.isCorrect ? '#059669' : '#dc2626'}`,
                boxShadow: `0 6px 16px ${i.isCorrect ? 'rgba(5, 150, 105, 0.6)' : 'rgba(220, 38, 38, 0.6)'}`,
                transition: 'transform 0.1s'
              }}
            >
              <div className="text-xs font-bold text-white text-center px-1 leading-tight">
                {i.label}
              </div>
              <div className={`text-xl mt-1 ${i.isCorrect ? 'text-green-100' : 'text-red-100'}`}>
                {i.isCorrect ? '✓' : '✗'}
              </div>
            </div>
          ))}

          {/* BASKET */}
          <div
            className="absolute flex items-center justify-center"
            style={{ 
              left: basketX, 
              bottom: 20, 
              width: BASKET, 
              height: 60 
            }}
          >
            <div className="relative w-full h-full">
              {/* Basket shadow */}
              <div className="absolute inset-0 bg-yellow-600/40 blur-lg rounded-xl" />
              
              {/* Main basket */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl border-3 border-amber-300 flex items-center justify-center shadow-lg">
                <div className="text-4xl">🧺</div>
              </div>
              
              {/* Hitbox indicator */}
              <div className="absolute -top-2 left-4 right-4 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-70" />
            </div>
          </div>

          {/* FLOOR */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-700 to-gray-800 border-t-4 border-yellow-500/40" />
        </div>

        {/* CONTROLS INFO */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 bg-black/30 px-6 py-3 rounded-full">
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-gray-800 rounded border border-gray-700 text-yellow-400 font-bold">←</kbd>
              <kbd className="px-3 py-1 bg-gray-800 rounded border border-gray-700 text-yellow-400 font-bold">A</kbd>
              <span className="text-white/70">Di chuyển trái</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-gray-800 rounded border border-gray-700 text-yellow-400 font-bold">→</kbd>
              <kbd className="px-3 py-1 bg-gray-800 rounded border border-gray-700 text-yellow-400 font-bold">D</kbd>
              <span className="text-white/70">Di chuyển phải</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAUSE/RESTART BUTTON */}
      <div className="mt-8">
        <Button
          onClick={() => setStatus('failed')}
          variant="outline"
          className="px-8 py-3 text-white border-red-500/50 hover:bg-red-500/20 hover:border-red-400"
        >
          Kết thúc
        </Button>
      </div>
    </div>
  );
}
