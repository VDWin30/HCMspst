'use client';

import React, { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

interface Card {
  id: string;
  imageUrl: string;
  title: string;
  isMatched: boolean;
  pairId: string;
}

export function Stage3() {
  const { moveToStage, recordStage3Move, gameState, startStage3 } = useGame();

  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [completed, setCompleted] = useState(false);

  /* INIT */
  useEffect(() => {
    startStage3();

    const shuffled = [...gameData.stage3]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const pairs = shuffled.flatMap((img, idx) => [
      { ...img, id: `${img.id}-a`, pairId: String(idx) },
      { ...img, id: `${img.id}-b`, pairId: String(idx) },
    ]);

    setCards(
      pairs
        .sort(() => Math.random() - 0.5)
        .map(c => ({
          id: c.id,
          imageUrl: c.imageUrl,
          title: c.title,
          pairId: c.pairId,
          isMatched: false,
        }))
    );
  }, []);

  /* CLICK */
  const handleClick = (id: string) => {
    if (flipped.length === 2) return;
    if (flipped.includes(id)) return;
    if (cards.find(c => c.id === id)?.isMatched) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      recordStage3Move();
      checkMatch(next);
    }
  };

  /* CHECK */
  const checkMatch = (ids: string[]) => {
    const [a, b] = ids.map(id => cards.find(c => c.id === id));

    if (a && b && a.pairId === b.pairId) {
      setCards(prev =>
        prev.map(c =>
          c.id === a.id || c.id === b.id
            ? { ...c, isMatched: true }
            : c
        )
      );
      setMatches(m => m + 1);
      setFlipped([]);

      if (matches + 1 === cards.length / 2) {
        setCompleted(true);
      }
    } else {
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const progress = (matches / (cards.length / 2)) * 100;

  return (
    <div className="min-h-full flex flex-col gap-6 px-4 py-6">
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-extrabold text-white">
          🧠 Giai đoạn 3: Tìm Ảnh Giống Nhau
        </h2>
        <p className="text-white/70 text-sm">
          Lật 2 thẻ giống nhau • Sai trừ 10 điểm
        </p>
      </div>

      {/* HUD */}
      <div className="max-w-3xl mx-auto w-full bg-black/40 rounded-xl p-4 border border-white/10">
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>✔️ Cặp đúng: {matches}/6</span>
          <span>⭐ Điểm còn lại: {gameState.stage3Score}</span>
        </div>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* COMPLETED */}
      {completed ? (
        <div className="max-w-xl mx-auto text-center bg-green-500/20 border-2 border-green-400 rounded-2xl p-8 animate-fade-in">
          <h3 className="text-3xl font-bold text-green-300 mb-2">
            🎉 Hoàn thành xuất sắc!
          </h3>
          <p className="text-white/80 mb-4">
            Điểm nhận được:
            <span className="text-yellow-300 font-bold ml-2">
              {gameState.stage3Score}
            </span>
          </p>
          <Button
            onClick={() => moveToStage(4)}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            Sang giai đoạn 4 →
          </Button>
        </div>
      ) : (
        /* BOARD */
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {cards.map(card => {
            const isFlipped =
              flipped.includes(card.id) || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleClick(card.id)}
                disabled={card.isMatched}
                className={`relative aspect-square rounded-xl overflow-hidden transition-transform duration-300
                  ${
                    card.isMatched
                      ? 'opacity-40'
                      : 'hover:scale-105'
                  }`}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-500 ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {isFlipped ? (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-700 text-white text-4xl font-bold">
                      ?
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
