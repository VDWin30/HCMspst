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

  useEffect(() => {
    startStage3();

    const shuffled = [...gameData.stage3]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const pairs = shuffled.flatMap((img, i) => [
      { ...img, id: `${img.id}-a`, pairId: String(i) },
      { ...img, id: `${img.id}-b`, pairId: String(i) },
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

  const checkMatch = ([aId, bId]: string[]) => {
    const a = cards.find(c => c.id === aId);
    const b = cards.find(c => c.id === bId);

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
      setTimeout(() => setFlipped([]), 700);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 px-6 py-10">
      {/* TITLE */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-white">
          🧠 Giai đoạn 3: Tìm ảnh giống nhau
        </h2>
        <p className="text-white/70 text-sm">
          Lật 2 thẻ giống nhau • Sai bị trừ 10 điểm
        </p>
      </div>

      {/* HUD */}
      <div className="w-full max-w-3xl bg-black/40 border border-yellow-400/30 rounded-xl px-6 py-4 flex justify-between text-white">
        <span>✔ Cặp đúng: {matches}/6</span>
        <span className="text-yellow-400 font-bold">
          ⭐ {gameState.stage3Score}
        </span>
      </div>

      {/* GAME BOARD */}
      <div className="w-full max-w-3xl bg-black/50 border-2 border-yellow-400/30 rounded-2xl p-6">
        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => {
            const isOpen =
              flipped.includes(card.id) || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleClick(card.id)}
                disabled={card.isMatched}
                className={`aspect-square rounded-xl overflow-hidden transition-all
                  ${
                    card.isMatched
                      ? 'opacity-40'
                      : 'hover:scale-105'
                  }`}
              >
                {isOpen ? (
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
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPLETE */}
      {completed && (
        <div className="text-center bg-green-500/20 border-2 border-green-400 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-300 mb-2">
            🎉 Hoàn thành!
          </h3>
          <p className="text-white mb-4">
            Điểm giai đoạn 3:{' '}
            <b className="text-yellow-400">
              {gameState.stage3Score}
            </b>
          </p>
          <Button
            onClick={() => moveToStage(4)}
            className="bg-green-600 hover:bg-green-700"
          >
            Sang giai đoạn 4 →
          </Button>
        </div>
      )}
    </div>
  );
}
