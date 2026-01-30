'use client';

import React, { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

interface Card {
  id: string;
  imageUrl: string;
  title: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

export function Stage3() {
  const { moveToStage } = useGame();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Initialize memory game with more images
  useEffect(() => {
    const imagePool = gameData.stage3;
    // Select 6 random images instead of 3
    const shuffled = [...imagePool].sort(() => Math.random() - 0.5).slice(0, 6);
    
    // Create pairs (double each image for memory matching)
    const pairs = shuffled.flatMap((img, index) => [
      { ...img, id: `${img.id}-1`, pairId: String(index) },
      { ...img, id: `${img.id}-2`, pairId: String(index), imageUrl: img.imageUrl, title: img.title }
    ]);

    // Shuffle pairs
    const shuffledPairs = pairs.sort(() => Math.random() - 0.5);

    setCards(
      shuffledPairs.map((card) => ({
        id: card.id,
        imageUrl: card.imageUrl,
        title: card.title,
        isFlipped: false,
        isMatched: false,
        pairId: card.pairId
      }))
    );
  }, []);

  const handleCardClick = (id: string) => {
    if (flippedCards.length >= 2 || flippedCards.includes(id)) return;
    if (cards.find((c) => c.id === id)?.isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      checkMatch(newFlipped);
    }
  };

  const checkMatch = (flipped: string[]) => {
    const card1 = cards.find((c) => c.id === flipped[0]);
    const card2 = cards.find((c) => c.id === flipped[1]);

    // Cards match if they have same pairId
    if (card1?.pairId === card2?.pairId) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === flipped[0] || c.id === flipped[1] ? { ...c, isMatched: true } : c
        )
      );
      setMatches((prev) => prev + 1);
      setFlippedCards([]);

      // Check if all matched
      if (matches + 1 === cards.length / 2) {
        setCompleted(true);
      }
    } else {
      setTimeout(() => setFlippedCards([]), 800);
    }
  };

  const isCardFlipped = (id: string) => flippedCards.includes(id);
  const isCardMatched = (id: string) => cards.find((c) => c.id === id)?.isMatched || false;

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Giai đoạn 3: Tìm Ảnh Giống Nhau</h2>
        <p className="text-white/70 text-sm">Nhấp vào các thẻ để tìm ra những cặp ảnh giống nhau</p>
      </div>

      {completed ? (
        <div className="text-center p-8 bg-green-500/30 rounded-lg border-2 border-green-400 mx-auto">
          <h3 className="text-2xl font-bold text-green-300 mb-2">Hoàn thành!</h3>
          <p className="text-white/80 mb-2">Bạn đã hoàn thành giai đoạn 3</p>
          <p className="text-white/70 mb-4 text-sm">Số lần di chuyển: {moves}</p>
          <Button onClick={() => moveToStage(4)} className="bg-green-600 hover:bg-green-700">
            Tiếp tục giai đoạn 4
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="flex justify-between gap-4 text-center">
            <div className="flex-1 bg-blue-500/30 p-3 rounded-lg border border-blue-400">
              <p className="text-sm text-white/70">Cặp tìm được</p>
              <p className="text-2xl font-bold text-blue-300">
                {matches}/{cards.length / 2}
              </p>
            </div>
            <div className="flex-1 bg-orange-500/30 p-3 rounded-lg border border-orange-400">
              <p className="text-sm text-white/70">Lần di chuyển</p>
              <p className="text-2xl font-bold text-orange-300">{moves}</p>
            </div>
          </div>

          {/* Game Board - larger grid for 6 pairs (12 cards) */}
          <div className="grid grid-cols-4 gap-3 flex-1 justify-center mx-auto w-full max-w-2xl">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isCardMatched(card.id)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                  isCardMatched(card.id)
                    ? 'opacity-50 cursor-default hover:scale-100'
                    : ''
                }`}
                style={{ aspectRatio: '1' }}
              >
                <div
                  className={`w-full h-full flex items-center justify-center font-bold text-white transition-all duration-300 transform rounded-lg ${
                    isCardFlipped(card.id) || isCardMatched(card.id)
                      ? 'rotateY-0'
                      : 'bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700'
                  }`}
                >
                  {isCardFlipped(card.id) || isCardMatched(card.id) ? (
                    <img
                      src={card.imageUrl || "/placeholder.svg"}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-4xl">?</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
