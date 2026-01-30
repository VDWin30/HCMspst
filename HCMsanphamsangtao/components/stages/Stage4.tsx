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
  const [showGameArea, setShowGameArea] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const BASKET_WIDTH = 100;
  const CONTAINER_HEIGHT = 600;
  const CONTAINER_WIDTH = 500;
  const ITEM_SIZE = 70;
  const FALL_SPEED = 5;
  const REQUIRED_SCORE = 200;
  const INITIAL_TIME = 30;

  // Xóa tất cả interval khi component unmount
  useEffect(() => {
    return () => {
      cleanupGame();
    };
  }, []);

  const cleanupGame = () => {
    if (gameLoopRef.current) {
      window.clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (spawnRef.current) {
      window.clearInterval(spawnRef.current);
      spawnRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    keysRef.current = {};
  };

  // Smooth keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((key === 'a' || key === 'arrowleft') && gameStarted) {
        e.preventDefault();
        keysRef.current['left'] = true;
      }
      if ((key === 'd' || key === 'arrowright') && gameStarted) {
        e.preventDefault();
        keysRef.current['right'] = true;
      }
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
  }, [gameStarted]);

  // Smooth basket movement loop
  useEffect(() => {
    if (!gameStarted || completed) return;

    const moveLoop = window.setInterval(() => {
      setBasketX(prev => {
        let newX = prev;
        if (keysRef.current['left']) newX = Math.max(0, prev - 15);
        if (keysRef.current['right']) newX = Math.min(CONTAINER_WIDTH - BASKET_WIDTH, prev + 15);
        return newX;
      });
    }, 30);

    return () => window.clearInterval(moveLoop);
  }, [gameStarted, completed]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || completed) return;

    // Xóa timer cũ nếu có
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Thời gian hết
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // Kiểm tra điểm
          if (score >= REQUIRED_SCORE) {
            setCompleted(true);
          } else {
            setFailedAttempts(prev => prev + 1);
          }
          setGameStarted(false);
          setShowGameArea(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStarted, completed, score]);

  // Spawn falling items
  useEffect(() => {
    if (!gameStarted || completed) return;

    if (spawnRef.current) window.clearInterval(spawnRef.current);
    
    spawnRef.current = window.setInterval(() => {
      if (gameData.stage4 && gameData.stage4.length > 0) {
        const randomIdeology = gameData.stage4[Math.floor(Math.random() * gameData.stage4.length)];
        const newItem: FallingItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          label: randomIdeology.label,
          isCorrect: randomIdeology.isCorrect,
          x: Math.random() * (CONTAINER_WIDTH - ITEM_SIZE),
          y: -ITEM_SIZE
        };
        setFallingItems(prev => [...prev.slice(-15), newItem]);
      }
    }, 600);

    return () => {
      if (spawnRef.current) {
        window.clearInterval(spawnRef.current);
        spawnRef.current = null;
      }
    };
  }, [gameStarted, completed]);

  // Game loop - movement and collision
  useEffect(() => {
    if (!gameStarted || completed) return;

    if (gameLoopRef.current) window.clearInterval(gameLoopRef.current);
    
    gameLoopRef.current = window.setInterval(() => {
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
          const hasCollided = 
            item.y + ITEM_SIZE >= basketY &&
            item.y <= basketY + 60 &&
            itemCenterX >= basketLeft &&
            itemCenterX <= basketRight;

          if (hasCollided) {
            if (item.isCorrect) {
              setScore(s => s + 10);
            } else {
              setScore(s => Math.max(0, s - 5));
            }
            // Không thêm vào remaining
          } else if (item.y < CONTAINER_HEIGHT) {
            remaining.push(item);
          }
        });

        return remaining;
      });
    }, 40);

    return () => {
      if (gameLoopRef.current) {
        window.clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameStarted, basketX, completed]);

  // Kiểm tra điều kiện thắng
  useEffect(() => {
    if (gameStarted && !completed && score >= REQUIRED_SCORE) {
      setCompleted(true);
      setGameStarted(false);
      setShowGameArea(false);
    }
  }, [score, gameStarted, completed]);

  // Xử lý khi hoàn thành
  useEffect(() => {
    if (completed && score >= REQUIRED_SCORE) {
      addStage4Score(score);
      cleanupGame();
    }
  }, [completed, score, addStage4Score]);

  const handleStart = () => {
    // Dọn dẹp hoàn toàn
    cleanupGame();
    
    // Reset tất cả state
    setGameStarted(true);
    setCompleted(false);
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setFallingItems([]);
    setBasketX(175);
    setShowGameArea(true);
    keysRef.current = {};
  };

  const handleRetry = () => {
    handleStart();
  };

  const handleContinue = () => {
    if (score >= REQUIRED_SCORE) {
      moveToStage(5);
    }
  };

  // Hiển thị màn hình hoàn thành
  if (completed && score >= REQUIRED_SCORE) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-center p-8 bg-green-500/20 rounded-xl border-2 border-green-400 backdrop-blur max-w-md w-full">
          <h3 className="text-3xl font-bold text-green-400 mb-2">Tuyệt vời!</h3>
          <p className="text-white/80 mb-4">Bạn đã hứng được {score} điểm</p>
          <Button 
            onClick={handleContinue}
            className="bg-green-500 hover:bg-green-600 text-white font-bold w-full py-3 text-lg"
          >
            Tiếp tục giai đoạn 5 →
          </Button>
        </div>
      </div>
    );
  }

  // Hiển thị màn hình thất bại
  if (!gameStarted && timeLeft === 0 && score < REQUIRED_SCORE) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-center p-8 bg-red-500/20 rounded-xl border-2 border-red-400 backdrop-blur max-w-md w-full">
          <h3 className="text-2xl font-bold text-red-400 mb-2">Chưa đạt yêu cầu!</h3>
          <p className="text-white/80 mb-4">
            Bạn có <span className="font-bold text-yellow-400">{score}</span>/{REQUIRED_SCORE} điểm
          </p>
          <p className="text-white/60 text-sm mb-6">
            Cần thêm <span className="text-red-400 font-bold">{REQUIRED_SCORE - score}</span> điểm
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleRetry}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-700 font-bold py-3 text-lg"
            >
              Chơi lại (Lần {failedAttempts + 1})
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị màn hình bắt đầu
  if (!gameStarted && !completed) {
    return (
      <div className="flex flex-col gap-6 p-6 h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">Giai đoạn 4: Hứng Ý Tưởng</h2>
          <p className="text-white/70 text-sm">Hứng các ý tưởng xanh (đúng), tránh các ý tưởng đỏ (sai)</p>
          <p className="text-yellow-300 text-sm mt-1">Sử dụng phím A và D để di chuyển giỏ</p>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-6">
          <div className="text-center p-8 bg-black/40 rounded-lg border border-white/10 max-w-md w-full">
            <div className="mb-6">
              <p className="text-white/80 text-lg mb-2">
                Cần đạt <span className="text-yellow-300 font-bold text-2xl">{REQUIRED_SCORE} điểm</span>
              </p>
              <p className="text-white/60 text-sm">Thời gian: {INITIAL_TIME} giây</p>
            </div>
            
            {failedAttempts > 0 && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300">Đã thử: {failedAttempts} lần</p>
                <p className="text-white/70 text-sm">Điểm cao nhất: {Math.max(score, 0)}</p>
              </div>
            )}
            
            <Button
              onClick={handleStart}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 text-lg w-full"
            >
              {failedAttempts > 0 ? 'CHƠI LẠI' : 'BẮT ĐẦU'}
            </Button>
            
            <div className="mt-6 text-xs text-white/50 space-y-1">
              <p>• Ý tưởng xanh (đúng): +10 điểm</p>
              <p>• Ý tưởng đỏ (sai): -5 điểm</p>
              <p>• Di chuyển giỏ bằng phím A (trái) và D (phải)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị game đang chạy
  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Giai đoạn 4: Hứng Ý Tưởng</h2>
        <p className="text-white/70 text-sm">Hứng các ý tưởng xanh (đúng), tránh các ý tưởng đỏ (sai)</p>
        <p className="text-yellow-300 text-sm mt-1">Sử dụng phím A và D để di chuyển giỏ</p>
      </div>

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
      {showGameArea && (
        <div className="flex-1 flex flex-col items-center">
          <div
            ref={containerRef}
            className="flex-1 bg-gradient-to-b from-black/50 to-black/70 border-3 border-yellow-400/40 rounded-lg relative overflow-hidden"
            style={{
              height: `${CONTAINER_HEIGHT}px`,
              width: `${CONTAINER_WIDTH}px`,
              maxWidth: '100%'
            }}
          >
            {/* Falling items */}
            {fallingItems.map(item => (
              <div
                key={item.id}
                className={`absolute rounded-lg font-bold text-center flex items-center justify-center transition-all`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${ITEM_SIZE}px`,
                  height: `${ITEM_SIZE}px`,
                  backgroundColor: item.isCorrect ? '#10b981' : '#ef4444',
                  color: 'white',
                  boxShadow: item.isCorrect 
                    ? '0 0 15px rgba(16, 185, 129, 0.8)' 
                    : '0 0 15px rgba(239, 68, 68, 0.8)',
                  padding: '8px',
                  wordBreak: 'break-word',
                  fontSize: '12px',
                  lineHeight: '1.2',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  border: '2px solid white',
                  zIndex: 10
                }}
              >
                {item.label}
              </div>
            ))}

            {/* Basket */}
            <div
              className="absolute bottom-2 left-0 flex items-center justify-center rounded-lg transition-all duration-50"
              style={{
                left: `${basketX}px`,
                width: `${BASKET_WIDTH}px`,
                height: '60px',
                backgroundColor: '#f59e0b',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.8)',
                border: '3px solid #fbbf24',
                zIndex: 20
              }}
            >
              <span className="text-white font-bold text-2xl">🧺</span>
            </div>

            {/* Keyboard controls hint */}
            <div className="absolute top-3 left-3 text-xs text-white/80 bg-black/60 px-2 py-1 rounded">
              Dùng <kbd className="bg-black/80 px-2 py-0.5 rounded mx-1">A</kbd> 
              và <kbd className="bg-black/80 px-2 py-0.5 rounded mx-1">D</kbd> để di chuyển
            </div>
            
            {/* Score progress */}
            <div className="absolute top-3 right-3 text-xs text-white/80 bg-black/60 px-2 py-1 rounded">
              Tiến độ: {score}/{REQUIRED_SCORE}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-white/70">
            <p>Di chuyển giỏ để hứng ý tưởng xanh (+10) và tránh ý tưởng đỏ (-5)</p>
          </div>
        </div>
      )}
    </div>
  );
}
