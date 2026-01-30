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
  const {
    moveToStage,
    recordStage3Move,
    gameState,
    startStage3,
  } = useGame();

  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [completed, setCompleted] = useState(false);

  // 🔥 init game + set 500 điểm
  useEffect(() => {
    startStage3();

    const shuffledImages = [...gameData.stage3]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const pairs = shuffledImages.flatMap((img, idx) => [
      { ...img, id: `${img.id}-a`, pairId: String(idx) },
      { ...img, id: `${img.id}-b`, pairId: String(idx) },
    ]);

    setCards(
      pairs
        .sort(() => Math.random() - 0.5)
        .map((c) => ({
          id: c.id,
          imageUrl: c.imageUrl,
          title: c.title,
          pairId: c.pairId,
          isMatched: false,
        }))
    );
  }, []);

  const handleClick = (id: string) => {
    if (flipped.length === 2) return;
    if (flipped.includes(id)) return;
    if (cards.find((c) => c.id === id)?.isMatched) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      recordStage3Move(); // ❗ -10 điểm
      checkMatch(next);
    }
  };

  const checkMatch = (ids: string[]) => {
    const [a, b] = ids.map((id) => cards.find((c) => c.id === id));

    if (a && b && a.pairId === b.pairId) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === a.id || c.id === b.id ? { ...c, isMatched: true } : c
        )
      );
      setMatches((m) => m + 1);
      setFlipped([]);

      if (matches + 1 === cards.length / 2) {
        setCompleted(true);
      }
    } else {
      setTimeout(() => setFlipped([]), 700);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          Giai đoạn 3: Tìm Ảnh Giống Nhau
        </h2>
        <p className="text-white/70 text-sm">
          Mỗi lượt sai bị trừ 10 điểm
        </p>
      </div>

      {completed ? (
        <div className="text-center p-8 bg-green-500/30 rounded-lg border-2 border-green-400">
          <h3 className="text-2xl font-bold text-green-300 mb-2">
            Hoàn thành!
          </h3>
          <p className="text-white/80 mb-1">
            Điểm giai đoạn 3:
            <span className="text-yellow-300 font-bold ml-2">
              {gameState.stage3Score}
            </span>
          </p>
          <Button
            onClick={() => moveToStage(4)}
            className="bg-green-600 hover:bg-green-700 mt-4"
          >
            Sang giai đoạn 4 →
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-sm text-white/80">
            <span>Cặp đúng: {matches}/{cards.length / 2}</span>
            <span>Điểm còn lại: {gameState.stage3Score}</span>
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
            {cards.map((card) => {
              const isFlipped =
                flipped.includes(card.id) || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleClick(card.id)}
                  disabled={card.isMatched}
                  className={`aspect-square rounded-lg overflow-hidden transition ${
                    card.isMatched ? 'opacity-40' : 'hover:scale-105'
                  }`}
                >
                  {isFlipped ? (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-700 text-white text-4xl">
                      ?
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
