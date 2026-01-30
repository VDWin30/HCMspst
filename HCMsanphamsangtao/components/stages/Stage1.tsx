'use client';

import React, { useState, useEffect } from 'react';
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
  const [placedPieces, setPlacedPieces] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const puzzle = gameData.stage1[Math.floor(Math.random() * gameData.stage1.length)];
    const configs = [
      { cols: 2, rows: 2 },
      { cols: 2, rows: 2 },
      { cols: 2, rows: 4 },
      { cols: 4, rows: 3 }
    ];
    const config = configs[Math.floor(Math.random() * configs.length)];

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setCols(config.cols);
      setRows(config.rows);
      setImageUrl(puzzle.image);

      const newPieces: Piece[] = [];
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          newPieces.push({
            id: `${row}-${col}`,
            col,
            row
          });
        }
      }
      setPieces(newPieces.sort(() => Math.random() - 0.5));
    };
    img.src = puzzle.image;
  };

  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('pieceId', pieceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnBoard = (e: React.DragEvent, dropCol: number, dropRow: number) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('pieceId');
    const piece = pieces.find(p => p.id === pieceId);

    if (piece && piece.col === dropCol && piece.row === dropRow) {
      setPlacedPieces(prev => new Set([...prev, pieceId]));

      if (placedPieces.size + 1 === pieces.length) {
        setCompleted(true);
        setSolvedPuzzle();
      }
    }
  };

  if (pieces.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/70 text-lg">Đang tải trò chơi...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-green-500/20 rounded-xl border-2 border-green-400 backdrop-blur">
          <h3 className="text-3xl font-bold text-green-400 mb-2">Tuyệt vời!</h3>
          <p className="text-white/80 mb-4">Bạn đã hoàn thành giai đoạn 1</p>
          <Button onClick={() => moveToStage(2)} className="bg-green-500 hover:bg-green-600 text-white font-bold">
            Tiếp tục giai đoạn 2 →
          </Button>
        </div>
      </div>
    );
  }

  const PIECE_WIDTH = 100;
  const PIECE_HEIGHT = 100;
  const unplacedCount = pieces.length - placedPieces.size;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Giai đoạn 1: Ghép Tranh</h2>
        <p className="text-white/70 text-sm">Kéo các mảnh tranh vào khung ({placedPieces.size}/{pieces.length})</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Puzzle Board */}
        <div className="flex-1 flex flex-col">
          <div className="text-white/80 text-sm font-semibold mb-3">Khung ghép tranh</div>
          <div className="flex-1 bg-black/40 border-3 border-yellow-400 rounded-lg overflow-auto p-4">
            <div className="inline-grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, ${PIECE_WIDTH}px)` }}>
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                  const pieceId = `${row}-${col}`;
                  const isPlaced = placedPieces.has(pieceId);

                  return (
                    <div
                      key={pieceId}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnBoard(e, col, row)}
                      className={`border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isPlaced
                          ? 'border-green-400 bg-green-400/10'
                          : 'border-yellow-300/30 bg-yellow-300/5 hover:border-yellow-300'
                      }`}
                      style={{
                        width: PIECE_WIDTH,
                        height: PIECE_HEIGHT,
                        backgroundImage: isPlaced ? `url(${imageUrl})` : 'none',
                        backgroundPosition: `-${col * PIECE_WIDTH}px -${row * PIECE_HEIGHT}px`,
                        backgroundSize: `${cols * PIECE_WIDTH}px ${rows * PIECE_HEIGHT}px`
                      }}
                    >
                      {!isPlaced && <span className="text-white/40">#{col},{row}</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Pieces */}
        <div className="w-48 flex flex-col">
          <div className="text-white/80 text-sm font-semibold mb-3">Các mảnh ({unplacedCount})</div>
          <div className="flex-1 bg-black/30 border-3 border-red-600/50 rounded-lg overflow-y-auto p-3 space-y-2">
            {pieces.map(piece => {
              const isPlaced = placedPieces.has(piece.id);
              return (
                <div
                  key={piece.id}
                  draggable={!isPlaced}
                  onDragStart={(e) => handleDragStart(e, piece.id)}
                  className={`p-2 rounded border-2 text-center cursor-move text-xs font-semibold transition-all ${
                    isPlaced
                      ? 'opacity-50 border-gray-500 bg-gray-500/20'
                      : 'border-yellow-300 bg-yellow-300/20 hover:bg-yellow-300/30 active:scale-95'
                  }`}
                >
                  Mảnh {piece.col},{piece.row}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
