'use client';

import React, { useEffect, useState } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

interface Card {
  id: string;
  imageUrl: string;
  title: string;
  pairId: string;
  isMatched: boolean;
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
  const [locked, setLocked] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    startStage3();

    const images = [...gameData.stage3]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const pairs: Card[] = images.flatMap((img, idx) => [
      {
        id: `${img.id}-a`,
        imageUrl: img.imageUrl,
        title: img.title,
        pairId: String(idx),
        isMatched: false,
      },
      {
        id: `${img.id}-b`,
        imageUrl: img.imageUrl,
        title: img.title,
        pairId: String(idx),
        isMatched: false,
      },
    ]);

    setCards(pairs.sort(() => Math.random() - 0.5));
  }, []);

  /* ================= CLICK ================= */
  const handleClick = (id: string) => {
    if (locked) return;
    if (flipped.includes(id)) return;

    const card = cards.find(c => c.id === id);
    if (!card || card.isMatched) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      recordStage3Move();
      checkMatch(next);
    }
  };

  /* ================= MATCH ================= */
  const checkMatch = (ids: string[]) => {
    const [a, b] = ids.map(id =>
      cards.find(c => c.id === id)
    );

    if (!a || !b) {
      resetFlip();
      return;
    }

    if (a.pairId === b.pairId) {
      setCards(prev =>
        prev.map(c =>
          c.pairId === a.pairId
            ? { ...c, isMatched: true }
            : c
        )
      );

      setMatches(prev => {
        const next = prev + 1;
        if (next === cards.length / 2) {
          setCompleted(true);
        }
        return next;
      });

      resetFlip(300);
    } else {
      resetFlip(700);
    }
  };

  const resetFlip = (delay = 0) => {
    setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, delay);
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          🧠 Giai đoạn 3: Tìm ảnh giống nhau
        </h2>
        <p className="text-white/70 text-sm">
          Mỗi lượt sai bị trừ 10 điểm
        </p>
      </div>

      {completed ? (
        <div className="max-w-md mx-auto text-center p-8 bg-green-500/20 rounded-xl border border-green-400">
          <h3 className="text-2xl font-bold text-green-300 mb-2">
            🎉 Hoàn thành!
          </h3>
          <p className="text-white mb-4">
            Điểm Stage 3:
            <span className="text-yellow-300 font-bold ml-2">
              {gameState.stage3Score}
            </span>
          </p>
          <Button
            onClick={() => moveToStage(4)}
            className="bg-green-600 hover:bg-green-700"
          >
            Sang giai đoạn 4 →
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-white/80 max-w-2xl mx-auto">
            <span>Cặp đúng: {matches}/{cards.length / 2}</span>
            <span>Điểm: {gameState.stage3Score}</span>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {cards.map(card => {
              const isFlipped =
                flipped.includes(card.id) || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleClick(card.id)}
                  disabled={card.isMatched}
                  className={`aspect-square rounded-xl overflow-hidden
                    transition-all duration-300
                    ${card.isMatched ? 'opacity-40' : 'hover:scale-105'}
                    bg-blue-800 shadow-lg`}
                >
                  {isFlipped ? (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
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
