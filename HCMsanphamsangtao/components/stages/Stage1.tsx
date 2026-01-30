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
  const [cols, setCols] = useState(2); // Mặc định 2x2
  const [rows, setRows] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const puzzle = gameData.stage1[Math.floor(Math.random() * gameData.stage1.length)];
      
      // Chỉ dùng config 2x2 hoặc 3x3 để đơn giản
      const configs = [
        { cols: 2, rows: 2 },
        { cols: 3, rows: 2 },
        { cols: 3, rows: 3 }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];

      setCols(config.cols);
      setRows(config.rows);
      setImageUrl(puzzle.image);

      // Tạo mảnh puzzle
      const newPieces: Piece[] = [];
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          newPieces.push({
            id: `piece-${row}-${col}-${Date.now()}-${Math.random()}`,
            col,
            row
          });
        }
      }
      
      // Xáo trộn mảnh
      const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);
      setPieces(shuffledPieces);
      setPlacedPieces(new Set());
      setIsLoading(false);
      
    } catch (err) {
      setError('Không thể tải trò chơi. Vui lòng thử lại.');
      setIsLoading(false);
      console.error('Error initializing puzzle:', err);
    }
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
      setPlacedPieces(prev => {
        const newSet = new Set([...prev, pieceId]);
        
        // Kiểm tra hoàn thành
        if (newSet.size === pieces.length) {
          setTimeout(() => {
            setCompleted(true);
            setSolvedPuzzle();
          }, 300);
        }
        
        return newSet;
      });
    }
  };

  const handleRetry = () => {
    setCompleted(false);
    setPlacedPieces(new Set());
    initializePuzzle();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Đang tải trò chơi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-red-500/20 rounded-xl border-2 border-red-400 backdrop-blur">
          <h3 className="text-xl font-bold text-red-400 mb-2">Lỗi tải trò chơi</h3>
          <p className="text-white/80 mb-4">{error}</p>
          <Button
            onClick={initializePuzzle}
            className="bg-yellow-400 hover:bg-yellow-500 text-red-700 font-bold"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-green-500/20 rounded-xl border-2 border-green-400 backdrop-blur">
          <h3 className="text-3xl font-bold text-green-400 mb-2">Tuyệt vời!</h3>
          <p className="text-white/80 mb-4">Bạn đã hoàn thành giai đoạn 1</p>
          <Button 
            onClick={() => moveToStage(2)} 
            className="bg-green-500 hover:bg-green-600 text-white font-bold"
          >
            Tiếp tục giai đoạn 2 →
          </Button>
        </div>
      </div>
    );
  }

  const PIECE_WIDTH = 80; // Giảm kích thước để vừa màn hình
  const PIECE_HEIGHT = 80;
  const unplacedCount = pieces.length - placedPieces.size;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Giai đoạn 1: Ghép Tranh</h2>
        <p className="text-white/70 text-sm">Kéo các mảnh tranh vào khung ({placedPieces.size}/{pieces.length})</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Puzzle Board */}
        <div className="flex-1 flex flex-col">
          <div className="text-white/80 text-sm font-semibold mb-2">Khung ghép tranh</div>
          <div className="flex-1 bg-black/40 border-2 border-yellow-400/50 rounded-lg overflow-auto p-3">
            <div className="inline-grid gap-1" style={{ 
              gridTemplateColumns: `repeat(${cols}, ${PIECE_WIDTH}px)`,
              gridTemplateRows: `repeat(${rows}, ${PIECE_HEIGHT}px)`
            }}>
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                  const pieceId = pieces.find(p => p.col === col && p.row === row)?.id || '';
                  const isPlaced = placedPieces.has(pieceId);

                  return (
                    <div
                      key={`board-${row}-${col}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnBoard(e, col, row)}
                      className={`border flex items-center justify-center text-xs font-bold transition-all ${
                        isPlaced
                          ? 'border-green-400 bg-green-400/10'
                          : 'border-yellow-300/30 bg-yellow-300/5 hover:border-yellow-300'
                      }`}
                      style={{
                        width: PIECE_WIDTH,
                        height: PIECE_HEIGHT,
                        backgroundImage: isPlaced && imageUrl ? `url(${imageUrl})` : 'none',
                        backgroundPosition: `-${col * PIECE_WIDTH}px -${row * PIECE_HEIGHT}px`,
                        backgroundSize: `${cols * PIECE_WIDTH}px ${rows * PIECE_HEIGHT}px`,
                        cursor: !isPlaced ? 'pointer' : 'default'
                      }}
                    >
                      {!isPlaced && <span className="text-white/30 text-xs">({col},{row})</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Pieces Panel */}
        <div className="w-44 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm font-semibold">Các mảnh</span>
            <span className="text-yellow-300 text-sm font-bold">{unplacedCount}</span>
          </div>
          <div className="flex-1 bg-black/30 border-2 border-red-600/50 rounded-lg overflow-y-auto p-2 space-y-2">
            {pieces.map(piece => {
              const isPlaced = placedPieces.has(piece.id);
              return (
                <div
                  key={piece.id}
                  draggable={!isPlaced}
                  onDragStart={(e) => !isPlaced && handleDragStart(e, piece.id)}
                  className={`p-2 rounded border text-center text-xs font-semibold transition-all ${
                    isPlaced
                      ? 'opacity-40 border-gray-500 bg-gray-500/20 cursor-default'
                      : 'border-yellow-300 bg-yellow-300/20 hover:bg-yellow-300/30 active:scale-95 cursor-grab'
                  }`}
                >
                  Mảnh {piece.col},{piece.row}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full py-2 text-sm"
            >
              Xáo trộn lại
            </Button>
            <div className="text-xs text-white/60 text-center">
              Kéo thả mảnh vào ô tương ứng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
