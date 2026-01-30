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

const PUZZLE_LEVELS: Record<number, { cols: number; rows: number }> = {
  6: { cols: 3, rows: 2 },
  8: { cols: 4, rows: 2 },
  12: { cols: 4, rows: 3 },
  14: { cols: 7, rows: 2 },
  16: { cols: 4, rows: 4 },
};

const getRandomPuzzleLevel = () => {
  const roll = Math.random() * 100;
  if (roll < 5) return { pieces: 6, ...PUZZLE_LEVELS[6] };

  const others = [8, 12, 14, 16];
  const pick = others[Math.floor(Math.random() * others.length)];
  return { pieces: pick, ...PUZZLE_LEVELS[pick] };
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

  /* ===== INIT ===== */
  const initPuzzle = () => {
    const puzzle =
      gameData.stage1[Math.floor(Math.random() * gameData.stage1.length)];

    const level = getRandomPuzzleLevel();

    setCols(level.cols);
    setRows(level.rows);
    setImageUrl(puzzle.image);
    setPlaced(new Set());
    setCompleted(false);

    const temp: Piece[] = [];
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        temp.push({
          id: `piece-${r}-${c}-${Math.random()}`,
          col: c,
          row: r,
        });
      }
    }

    setPieces(temp.sort(() => Math.random() - 0.5));
  };

  /* ===== DRAG ===== */
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('pieceId', id);
  };

  const onDrop = (e: React.DragEvent, col: number, row: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('pieceId');
    const piece = pieces.find(p => p.id === id);
    if (!piece) return;

    if (piece.col === col && piece.row === row) {
      setPlaced(prev => {
        const next = new Set(prev);
        next.add(id);

        if (next.size === pieces.length) {
          setTimeout(() => {
            setCompleted(true);
            completeStage1(); // +100 điểm
          }, 300);
        }

        return next;
      });
    }
  };

  /* ===== COMPLETE ===== */
  if (completed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-10 bg-green-500/20 border border-green-400 rounded-xl text-center">
          <h3 className="text-3xl font-bold text-green-300 mb-3">
            🎉 Hoàn thành Stage 1
          </h3>
          <p className="text-white/80 mb-6">
            Bạn đã ghép xong bức tranh lịch sử
          </p>
          <Button
            onClick={() => moveToStage(2)}
            className="bg-green-600 hover:bg-green-700"
          >
            Sang giai đoạn 2 →
          </Button>
        </div>
      </div>
    );
  }

  /* ===== UI ===== */
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          Giai đoạn 1: Ghép tranh lịch sử
        </h2>
        <p className="text-white/70 text-sm">
          Kéo mảnh ảnh vào đúng vị trí ({placed.size}/{pieces.length})
        </p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* BOARD */}
        <div className="flex-1 bg-black/40 border border-yellow-400/40 rounded-lg p-3">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${PIECE_SIZE}px)`,
            }}
          >
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const piece = pieces.find(p => p.col === c && p.row === r);
                const isPlaced = piece && placed.has(piece.id);

                return (
                  <div
                    key={`${r}-${c}`}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => onDrop(e, c, r)}
                    className={`border ${
                      isPlaced ? 'border-green-400' : 'border-yellow-300/40'
                    }`}
                    style={{
                      width: PIECE_SIZE,
                      height: PIECE_SIZE,
                      backgroundImage:
                        isPlaced && piece ? `url(${imageUrl})` : undefined,
                      backgroundPosition: `-${c * PIECE_SIZE}px -${
                        r * PIECE_SIZE
                      }px`,
                      backgroundSize: `${cols * PIECE_SIZE}px ${
                        rows * PIECE_SIZE
                      }px`,
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* PIECES */}
        <div className="w-56 bg-black/30 border border-red-500/40 rounded-lg p-2 grid grid-cols-2 gap-2 overflow-y-auto">
          {pieces.map(piece => {
            const isPlaced = placed.has(piece.id);

            return (
              <div
                key={piece.id}
                draggable={!isPlaced}
                onDragStart={e => onDragStart(e, piece.id)}
                className={`rounded border ${
                  isPlaced ? 'opacity-30' : 'cursor-grab hover:scale-105'
                }`}
                style={{
                  width: PIECE_SIZE,
                  height: PIECE_SIZE,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `-${piece.col * PIECE_SIZE}px -${
                    piece.row * PIECE_SIZE
                  }px`,
                  backgroundSize: `${cols * PIECE_SIZE}px ${
                    rows * PIECE_SIZE
                  }px`,
                }}
              />
            );
          })}
        </div>
      </div>

      <Button onClick={initPuzzle} variant="outline" className="mx-auto">
        🔄 Xáo trộn lại
      </Button>
    </div>
  );
}
