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

export function Stage1() {
  const { moveToStage, setSolvedPuzzle } = useGame();

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [completed, setCompleted] = useState(false);

  const PIECE_SIZE = 80;

  useEffect(() => {
    initPuzzle();
  }, []);

  const initPuzzle = () => {
    const puzzle =
      gameData.stage1[Math.floor(Math.random() * gameData.stage1.length)];

    const configs = [
      { cols: 2, rows: 2 },
      { cols: 3, rows: 2 },
      { cols: 3, rows: 3 },
    ];

    const config = configs[Math.floor(Math.random() * configs.length)];

    setCols(config.cols);
    setRows(config.rows);
    setImageUrl(puzzle.image);
    setCompleted(false);

    const newPieces: Piece[] = [];
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        newPieces.push({
          id: `piece-${r}-${c}-${Date.now()}-${Math.random()}`,
          col: c,
          row: r,
        });
      }
    }

    setPlaced(new Set());
    setPieces(newPieces.sort(() => Math.random() - 0.5));
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
            setSolvedPuzzle();
          }, 300);
        }

        return next;
      });
    }
  };

  if (completed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-10 bg-green-500/20 border-2 border-green-400 rounded-xl text-center">
          <h3 className="text-3xl font-bold text-green-400 mb-3">
            Hoàn thành!
          </h3>
          <p className="text-white/80 mb-6">
            Bạn đã ghép xong bức tranh lịch sử 🎉
          </p>
          <Button
            onClick={() => moveToStage(2)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold"
          >
            Sang giai đoạn 2 →
          </Button>
        </div>
      </div>
    );
  }

  const unplaced = pieces.length - placed.size;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          Giai đoạn 1: Ghép Tranh
        </h2>
        <p className="text-white/70 text-sm">
          Kéo các mảnh vào đúng vị trí ({placed.size}/{pieces.length})
        </p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* BOARD */}
        <div className="flex-1 flex flex-col">
          <div className="text-white/80 text-sm font-semibold mb-2">
            Khung ghép tranh
          </div>

          <div className="relative flex-1 bg-black/40 border-2 border-yellow-400/50 rounded-lg p-3 overflow-auto">
            {/* Gợi ý ảnh mờ */}
            <div
              className="absolute inset-3 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${cols * PIECE_SIZE}px ${
                  rows * PIECE_SIZE
                }px`,
                backgroundRepeat: 'no-repeat',
              }}
            />

            <div
              className="relative grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${cols}, ${PIECE_SIZE}px)`,
              }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const piece = pieces.find(
                    (p) => p.col === c && p.row === r
                  );
                  const isPlaced = piece && placed.has(piece.id);

                  return (
                    <div
                      key={`${r}-${c}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop(e, c, r)}
                      className={`border transition-all ${
                        isPlaced
                          ? 'border-green-400'
                          : 'border-yellow-300/40 hover:border-yellow-300'
                      }`}
                      style={{
                        width: PIECE_SIZE,
                        height: PIECE_SIZE,
                        backgroundImage:
                          isPlaced && piece
                            ? `url(${imageUrl})`
                            : 'none',
                        backgroundPosition: `-${
                          c * PIECE_SIZE
                        }px -${r * PIECE_SIZE}px`,
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
        </div>

        {/* PIECES */}
        <div className="w-52 flex flex-col">
          <div className="flex justify-between mb-2">
            <span className="text-white/80 text-sm font-semibold">
              Các mảnh
            </span>
            <span className="text-yellow-300 font-bold">{unplaced}</span>
          </div>

          <div className="flex-1 bg-black/30 border-2 border-red-600/50 rounded-lg p-2 grid grid-cols-2 gap-2 overflow-y-auto">
            {pieces.map((piece) => {
              const isPlaced = placed.has(piece.id);

              return (
                <div
                  key={piece.id}
                  draggable={!isPlaced}
                  onDragStart={(e) => onDragStart(e, piece.id)}
                  className={`relative rounded border transition-all ${
                    isPlaced
                      ? 'opacity-30'
                      : 'cursor-grab hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    width: PIECE_SIZE,
                    height: PIECE_SIZE,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `-${
                      piece.col * PIECE_SIZE
                    }px -${piece.row * PIECE_SIZE}px`,
                    backgroundSize: `${cols * PIECE_SIZE}px ${
                      rows * PIECE_SIZE
                    }px`,
                    borderColor: isPlaced ? '#555' : '#facc15',
                  }}
                >
                  {isPlaced && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Button
              onClick={initPuzzle}
              variant="outline"
              className="w-full"
            >
              Xáo trộn lại
            </Button>
            <p className="text-xs text-white/60 text-center mt-2">
              Kéo mảnh ảnh vào đúng vị trí
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
