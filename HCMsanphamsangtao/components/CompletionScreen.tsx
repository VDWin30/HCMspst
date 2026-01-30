'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompletionScreenProps {
  score: number;
  maxScore: number;
  onRestart: () => void;
  onHome: () => void;
}

export function CompletionScreen({
  score,
  maxScore,
  onRestart,
  onHome
}: CompletionScreenProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const getPassageMessage = () => {
    if (percentage === 100) {
      return 'Bạn là một công dân thế hệ Hồ Chí Minh xuất sắc!';
    } else if (percentage >= 80) {
      return 'Bạn đã nắm vững kiến thức về Hồ Chí Minh!';
    } else if (percentage >= 60) {
      return 'Bạn có hiểu biết tốt về Hồ Chí Minh.';
    } else {
      return 'Hãy cố gắng hơn để tìm hiểu thêm về Hồ Chí Minh!';
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-black/40 border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="text-center bg-gradient-to-r from-orange-500/80 to-red-600/80 p-8">
          <div className="text-5xl font-bold mb-2">Cảm ơn!</div>
          <h2 className="text-3xl font-bold text-white">Bạn đã hoàn thành trò chơi</h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-lg text-white/70">Điểm của bạn</p>
              <div className="text-6xl font-bold text-yellow-300">{score}</div>
              <p className="text-xl text-white/70">/ {maxScore}</p>
            </div>

            {/* Progress Circle */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#ffde59"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
                    className="transition-all duration-500"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-yellow-300">{percentage}%</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <p className="text-xl font-semibold text-yellow-100 mt-6">
              {getPassageMessage()}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="bg-black/30 rounded-lg p-6 space-y-3 border border-white/10">
            <h3 className="font-bold text-lg text-yellow-300">Kết quả chi tiết:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-black/20 p-3 rounded border border-white/5">
                <p className="text-sm text-white/60">Giai đoạn 1</p>
                <p className="text-2xl font-bold text-green-400">+10</p>
              </div>
              <div className="space-y-1 bg-black/20 p-3 rounded border border-white/5">
                <p className="text-sm text-white/60">Giai đoạn 2</p>
                <p className="text-2xl font-bold text-green-400">+100</p>
              </div>
              <div className="space-y-1 bg-black/20 p-3 rounded border border-white/5">
                <p className="text-sm text-white/60">Giai đoạn 3</p>
                <p className="text-2xl font-bold text-green-400">+0</p>
              </div>
              <div className="space-y-1 bg-black/20 p-3 rounded border border-white/5">
                <p className="text-sm text-white/60">Giai đoạn 4</p>
                <p className="text-2xl font-bold text-green-400">+0</p>
              </div>
              <div className="space-y-1 col-span-2 bg-black/20 p-3 rounded border border-white/5">
                <p className="text-sm text-white/60">Giai đoạn 5</p>
                <p className="text-2xl font-bold text-green-400">+0</p>
              </div>
            </div>
          </div>

          {/* Inspirational Message */}
          <div className="bg-black/30 border-l-4 border-yellow-300 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-white/90">
              Tư tưởng Hồ Chí Minh là di sản quý báu của dân tộc Việt Nam.
              Hãy tiếp tục tìm hiểu để trở thành công dân thế hệ Hồ Chí Minh
              đích thực!
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onRestart}
              className="font-bold text-lg h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all"
            >
              Chơi lại
            </button>
            <button
              onClick={onHome}
              className="font-bold text-lg h-12 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              Quay về
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
