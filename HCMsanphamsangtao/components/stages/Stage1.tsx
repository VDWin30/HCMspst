'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/lib/game-context';
import { gameData } from '@/lib/game-data';

interface Piece {
  id: string;
  col: number;
  row: number;
}

const PIECE_SIZE = 80;

const LEVELS = [
  { pieces: 6, cols: 3, rows: 2, rate: 5 },        // 5%
  { pieces: 8, cols: 4, rows: 2, rate: 23.75 },
  { pieces: 12, cols: 4, rows: 3, rate: 23.75 },
  { pieces: 14, cols: 7, rows: 2, rate: 23.75 },
  { pieces: 16, cols: 4, rows: 4, rate: 23.75 },
];

const pickLevel = () => {
  let roll = Math.random() * 100;
  for (const lvl of LEVELS) {
    if (roll < lvl.rate) return lvl;
    roll -= lvl.rate;
  }
  return LEVELS[LEVELS.length - 1];
};

export function Stage1() {
  const { moveToStage, completeStage1 } = useGame();

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    initPuzzle();
  }, []);

  const initPuzzle = () => {
    const puzzle =
      gameData.stage1[Math.floor(Math.random() * gameData.stage1.length)];
    const level = pickLevel();

    setCols(level.cols);
    setRows(level.rows);
    setImageUrl(puzzle.image);
    setPlaced(new Set());
    setCompleted(false);

    const temp: Piece[] = [];
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        temp.push({
          id: `${r}-${c}-${Math.random()}`,
          col: c,
          row: r,
        });
      }
    }

    setPieces(temp.sort(() => Math.random() - 0.5));
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('pieceId', id);
  };

  const onDrop = (e: React.DragEvent, col: number, row: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('pieceId');
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;

    if (piece.col === col && piece.row === row) {
      setPlaced((prev) => {
        const next = new Set(prev);
        next.add(id);

        if (next.size === pieces.length) {
          setTimeout(() => {
            setCompleted(true);
            completeStage1(); // ✅ +100 điểm (chuẩn GameContext)
          }, 300);
        }

        return next;
      });
    }
  };

  /* ===== DONE SCREEN ===== */
  if (completed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-10 bg-green-500/20 border-2 border-green-400 rounded-xl text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-3">
            Hoàn thành!
          </h2>
          <p className="text-white/80 mb-4">
            Bạn nhận được{' '}
            <span className="text-yellow-300 font-bold">+100 điểm</span>
          </p>
          <Button
            onClick={() => moveToStage(2)}
            className="bg-green-500 hover:bg-green-600"
          >
            Sang giai đoạn 2 →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* BOARD */}
      <div
        className="grid gap-1 p-4 bg-black/40 border-2 border-yellow-400/50 rounded"
        style={{ gridTemplateColumns: `repeat(${cols}, ${PIECE_SIZE}px)` }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const piece = pieces.find((p) => p.col === c && p.row === r);
            const ok = piece && placed.has(piece.id);

            return (
              <div
                key={`${r}-${c}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, c, r)}
                className="border"
                style={{
                  width: PIECE_SIZE,
                  height: PIECE_SIZE,
                  backgroundImage: ok ? `url(${imageUrl})` : 'none',
                  backgroundPosition: `-${c * PIECE_SIZE}px -${r * PIECE_SIZE}px`,
                  backgroundSize: `${cols * PIECE_SIZE}px ${rows * PIECE_SIZE}px`,
                }}
              />
            );
          })
        )}
      </div>

      {/* PIECES */}
      <div className="grid grid-cols-2 gap-2">
        {pieces.map((p) => (
          <div
            key={p.id}
            draggable={!placed.has(p.id)}
            onDragStart={(e) => onDragStart(e, p.id)}
            className="border cursor-grab"
            style={{
              width: PIECE_SIZE,
              height: PIECE_SIZE,
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: `-${p.col * PIECE_SIZE}px -${p.row * PIECE_SIZE}px`,
              backgroundSize: `${cols * PIECE_SIZE}px ${rows * PIECE_SIZE}px`,
              opacity: placed.has(p.id) ? 0.3 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
