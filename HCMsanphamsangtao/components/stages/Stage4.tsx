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
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(175);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [completed, setCompleted] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const BASKET_WIDTH = 100;
  const CONTAINER_HEIGHT = 600;
  const CONTAINER_WIDTH = 500;
  const ITEM_SIZE = 70;
  const FALL_SPEED = 5;
  const REQUIRED_SCORE = 200;

  // Smooth keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') keysRef.current['left'] = true;
      if (key === 'd' || key === 'arrowright') keysRef.current['right'] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') keysRef.current['left'] = false;
      if (key === 'd' || key === 'arrowright') keysRef.current['right'] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Smooth basket movement loop
  useEffect(() => {
    if (!gameStarted) return;

    const moveLoop = setInterval(() => {
      setBasketX(prev => {
        let newX = prev;
        if (keysRef.current['left']) newX = Math.max(0, prev - 15);
        if (keysRef.current['right']) newX = Math.min(CONTAINER_WIDTH - BASKET_WIDTH, prev + 15);
        return newX;
      });
    }, 30);

    return () => clearInterval(moveLoop);
  }, [gameStarted]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || completed) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameStarted(false);
          if (score < REQUIRED_SCORE) {
            setFailedAttempts(prev + 1);
          } else {
            setCompleted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, completed, score]);

  // Spawn falling items
  useEffect(() => {
    if (!gameStarted || completed) return;

    spawnRef.current = setInterval(() => {
      const randomIdeology = gameData.stage4[Math.floor(Math.random() * gameData.stage4.length)];
      const newItem: FallingItem = {
        id: `item-${Date.now()}`,
        label: randomIdeology.label,
        isCorrect: randomIdeology.isCorrect,
        x: Math.random() * (CONTAINER_WIDTH - ITEM_SIZE),
        y: -ITEM_SIZE
      };
      setFallingItems(prev => [...prev, newItem]);
    }, 600);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameStarted, completed]);

  // Game loop - movement and collision
  useEffect(() => {
    if (!gameStarted || completed) return;

    gameLoopRef.current = setInterval(() => {
      setFallingItems(prev => {
        const updated = prev.map(item => ({
          ...item,
          y: item.y + FALL_SPEED
        }));

        const remaining: FallingItem[] = [];
        updated.forEach(item => {
          const itemCenterX = item.x + ITEM_SIZE / 2;
          const basketLeft = basketX;
          const basketRight = basketX + BASKET_WIDTH;
          const basketY = CONTAINER_HEIGHT - 80;

          // Check collision with basket
          if (
            item.y + ITEM_SIZE >= basketY &&
            item.y <= basketY + 60 &&
            itemCenterX >= basketLeft &&
            itemCenterX <= basketRight
          ) {
            if (item.isCorrect) {
              setScore(s => s + 10);
            } else {
              setScore(s => Math.max(0, s - 5));
            }
          } else if (item.y < CONTAINER_HEIGHT) {
            remaining.push(item);
          }
        });

        return remaining;
      });
    }, 40);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, basketX, completed]);

  // Sync score to context when completed
  useEffect(() => {
    if (completed && score >= REQUIRED_SCORE) {
      addStage4Score(score);
    }
  }, [completed, score]);

  const handleStart = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setScore(0);
    setFallingItems([]);
  };

  const handleRetry = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setScore(0);
    setFallingItems([]);
  };

  if (completed && score >= REQUIRED_SCORE) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-green-500/20 rounded-xl border-2 border-green-400 backdrop-blur">
          <h3 className="text-3xl font-bold text-green-400 mb-2">Tuyệt vời!</h3>
          <p className="text-white/80 mb-4">Bạn đã hứng được {score} điểm</p>
          <Button onClick={() => moveToStage(5)} className="bg-green-500 hover:bg-green-600 text-white font-bold">
            Tiếp tục giai đoạn 5 →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Giai đoạn 4: Hứng Ý Tưởng</h2>
        <p className="text-white/70 text-sm">Hứng các ý tưởng xanh (đúng), tránh các ý tưởng đỏ (sai)</p>
      </div>

      {!gameStarted && !completed ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center p-8 bg-black/40 rounded-lg border border-white/10">
            <p className="text-white/80 mb-6 text-lg">
              Cần đạt <span className="text-yellow-300 font-bold text-xl">{REQUIRED_SCORE} điểm</span> để qua giai đoạn
            </p>
            {failedAttempts > 0 && (
              <p className="text-red-300 mb-4">Lần chơi thứ {failedAttempts + 1}</p>
            )}
            <Button
              onClick={handleStart}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 text-lg"
            >
              Bắt đầu
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="flex justify-between gap-3 text-center">
            <div className="flex-1 bg-blue-600/20 p-3 rounded-lg border border-blue-400/50">
              <p className="text-xs text-white/70">Điểm</p>
              <p className="text-2xl font-bold text-blue-300">{score}</p>
            </div>
            <div className="flex-1 bg-red-600/20 p-3 rounded-lg border border-red-400/50">
              <p className="text-xs text-white/70">Thời gian</p>
              <p className="text-2xl font-bold text-red-300">{timeLeft}s</p>
            </div>
            <div className="flex-1 bg-green-600/20 p-3 rounded-lg border border-green-400/50">
              <p className="text-xs text-white/70">Cần</p>
              <p className="text-2xl font-bold text-yellow-400">{REQUIRED_SCORE}</p>
            </div>
          </div>

          {/* Game Area */}
          <div
            ref={containerRef}
            className="flex-1 bg-gradient-to-b from-black/50 to-black/70 border-3 border-yellow-400/40 rounded-lg relative overflow-hidden mx-auto"
            style={{
              height: `${CONTAINER_HEIGHT}px`,
              width: `${CONTAINER_WIDTH}px`
            }}
          >
            {/* Falling items */}
            {fallingItems.map(item => (
              <div
                key={item.id}
                className={`absolute rounded-lg font-bold text-center transition-all flex items-center justify-center text-sm leading-tight`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${ITEM_SIZE}px`,
                  height: `${ITEM_SIZE}px`,
                  backgroundColor: item.isCorrect ? '#10b981' : '#ef4444',
                  color: 'white',
                  boxShadow: item.isCorrect ? '0 0 10px #10b981' : '0 0 10px #ef4444',
                  padding: '4px',
                  wordBreak: 'break-word',
                  fontSize: '11px'
                }}
              >
                {item.label}
              </div>
            ))}

            {/* Basket */}
            <div
              className="absolute bottom-2 left-0 flex items-center justify-center rounded-lg transition-all"
              style={{
                left: `${basketX}px`,
                width: `${BASKET_WIDTH}px`,
                height: '60px',
                backgroundColor: '#f59e0b',
                boxShadow: '0 0 20px #f59e0b',
                border: '3px solid #fbbf24'
              }}
            >
              <span className="text-white font-bold text-xl">🧺</span>
            </div>

            {/* Keyboard controls hint */}
            <div className="absolute top-3 left-3 text-xs text-white/60">
              Dùng <kbd className="bg-black/60 px-1 py-0.5 rounded">A</kbd> + <kbd className="bg-black/60 px-1 py-0.5 rounded">D</kbd> để di chuyển
            </div>
          </div>

          {/* Failure message */}
          {completed && score < REQUIRED_SCORE && (
            <div className="text-center p-6 bg-red-500/20 rounded-lg border-2 border-red-400 backdrop-blur">
              <p className="text-white/80 mb-4">
                Bạn chỉ có <span className="font-bold text-yellow-400">{score}</span>/{REQUIRED_SCORE} điểm. Cần <span className="text-red-400 font-bold">{REQUIRED_SCORE - score}</span> điểm nữa!
              </p>
              <Button
                onClick={handleRetry}
                className="bg-yellow-400 hover:bg-yellow-500 text-red-700 font-bold"
              >
                Chơi lại
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
