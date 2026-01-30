'use client';

import { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 520;
const PLAYER_WIDTH = 70;
const PLAYER_HEIGHT = 22;
const ITEM_SIZE = 26;
const WIN_SCORE = 10;
const GAME_TIME = 30;

type Item = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

export default function CatchGame() {
  const [screen, setScreen] = useState<'menu' | 'play' | 'win' | 'lose'>('menu');
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_TIME);

  const rafRef = useRef<number>();

  /* ================= TIMER ================= */
  useEffect(() => {
    if (screen !== 'play') return;
    const t = setInterval(() => setTime((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [screen]);

  useEffect(() => {
    if (screen === 'play' && time <= 0) {
      setScreen(score >= WIN_SCORE ? 'win' : 'lose');
    }
  }, [time, score, screen]);

  /* ================= SPAWN ITEM ================= */
  useEffect(() => {
    if (screen !== 'play') return;
    const spawn = setInterval(() => {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
          y: -ITEM_SIZE,
          speed: 2 + Math.random() * 2,
        },
      ]);
    }, 700);
    return () => clearInterval(spawn);
  }, [screen]);

  /* ================= GAME LOOP ================= */
  const loop = () => {
    setItems((prev) =>
      prev
        .map((i) => ({ ...i, y: i.y + i.speed }))
        .filter((i) => {
          const hit =
            i.y + ITEM_SIZE >= GAME_HEIGHT - PLAYER_HEIGHT - 8 &&
            i.x + ITEM_SIZE > playerX &&
            i.x < playerX + PLAYER_WIDTH;

          if (hit) {
            setScore((s) => s + 1);
            return false;
          }

          return i.y < GAME_HEIGHT;
        })
    );
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (screen === 'play') rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [screen, playerX]);

  /* ================= CONTROL ================= */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (screen !== 'play') return;
      if (e.key === 'ArrowLeft')
        setPlayerX((x) => Math.max(0, x - 30));
      if (e.key === 'ArrowRight')
        setPlayerX((x) => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + 30));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [screen]);

  const startGame = () => {
    setScore(0);
    setTime(GAME_TIME);
    setItems([]);
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setScreen('play');
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 to-red-900">
      <div className="bg-white rounded-2xl shadow-2xl p-4">

        {/* ===== MENU ===== */}
        {screen === 'menu' && (
          <div className="text-center space-y-4 w-[320px]">
            <h1 className="text-3xl font-bold">🎮 GAME HỨNG ĐỒ</h1>
            <p>Hứng ≥ {WIN_SCORE} vật trong {GAME_TIME} giây</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              BẮT ĐẦU
            </button>
          </div>
        )}

        {/* ===== GAME ===== */}
        {screen === 'play' && (
          <>
            {/* HUD */}
            <div className="flex justify-between mb-2 font-semibold">
              <span>⭐ {score}/{WIN_SCORE}</span>
              <span>⏱ {time}s</span>
            </div>

            {/* GAME AREA */}
            <div
              className="relative bg-gradient-to-b from-yellow-100 to-orange-200 rounded-xl overflow-hidden border-4 border-red-700"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              {/* Items */}
              {items.map((i) => (
                <div
                  key={i.id}
                  className="absolute bg-yellow-400 rounded-full shadow-md"
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    left: i.x,
                    top: i.y,
                  }}
                />
              ))}

              {/* Player */}
              <div
                className="absolute bg-red-600 rounded-xl shadow-lg"
                style={{
                  width: PLAYER_WIDTH,
                  height: PLAYER_HEIGHT,
                  left: playerX,
                  bottom: 6,
                }}
              />
            </div>

            {/* MOBILE CONTROL */}
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setPlayerX((x) => Math.max(0, x - 40))}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                ⬅️
              </button>
              <button
                onClick={() =>
                  setPlayerX((x) =>
                    Math.min(GAME_WIDTH - PLAYER_WIDTH, x + 40)
                  )
                }
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                ➡️
              </button>
            </div>
          </>
        )}

        {/* ===== WIN ===== */}
        {screen === 'win' && (
          <div className="text-center space-y-3 w-[320px]">
            <h2 className="text-3xl font-bold text-green-600">🎉 CHIẾN THẮNG</h2>
            <p>Điểm đạt được: {score}</p>
            <button onClick={startGame} className="btn bg-green-600 text-white px-4 py-2 rounded-xl">
              Chơi lại
            </button>
          </div>
        )}

        {/* ===== LOSE ===== */}
        {screen === 'lose' && (
          <div className="text-center space-y-3 w-[320px]">
            <h2 className="text-3xl font-bold text-gray-700">💀 THUA CUỘC</h2>
            <p>Điểm đạt được: {score}</p>
            <button onClick={startGame} className="btn bg-red-600 text-white px-4 py-2 rounded-xl">
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
