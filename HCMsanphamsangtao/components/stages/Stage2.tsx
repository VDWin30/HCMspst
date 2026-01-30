'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

export function Stage2() {
  const { moveToStage, recordStage2Answer, addStage2Score, gameState } = useGame();

  const [selectedQuestions, setSelectedQuestions] =
    useState<typeof gameData.stage2>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const shuffled = [...gameData.stage2].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 10));
  }, []);

  if (selectedQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/70">Đang tải câu hỏi...</p>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentIndex];
  const isLastQuestion = currentIndex === selectedQuestions.length - 1;
  const progress = ((currentIndex + 1) / selectedQuestions.length) * 100;

  const handleSelectOption = (index: number) => {
    if (!answered) setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === currentQuestion.correct;
    setIsCorrect(correct);
    setAnswered(true);

    recordStage2Answer(currentQuestion.id, selectedOption);

    if (correct) {
      addStage2Score(10); // ✅ +10 điểm chuẩn GameContext
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      moveToStage(3);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">
          Giai đoạn 2: Trả Lời Câu Hỏi
        </h2>
        <p className="text-white/70 text-sm">
          Trả lời 10 câu hỏi về tư tưởng Hồ Chí Minh
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm px-2">
          <span className="text-white/80 font-semibold">
            Câu {currentIndex + 1}/10
          </span>
          <span className="text-yellow-400 font-bold">
            Tổng điểm: {gameState.score}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-black/30 border border-yellow-400/30">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-yellow-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 bg-black/40 border-2 border-yellow-400/30 rounded-xl p-6">
        <p className="text-white text-lg font-bold mb-6">
          {currentQuestion.question}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={answered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedOption === idx
                  ? 'bg-yellow-400/20 border-yellow-400'
                  : 'border-white/20 hover:border-yellow-400/50'
              }`}
            >
              <b className="mr-3">{String.fromCharCode(65 + idx)}.</b>
              {opt}
            </button>
          ))}
        </div>

        {answered && (
          <div
            className={`mt-6 p-4 rounded-lg border-2 ${
              isCorrect
                ? 'bg-green-500/20 border-green-400'
                : 'bg-red-500/20 border-red-400'
            }`}
          >
            <b>{isCorrect ? '✓ Chính xác' : '✗ Sai'}</b>
            <p className="text-sm mt-1">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <Button
        onClick={answered ? handleNext : handleSubmit}
        disabled={selectedOption === null && !answered}
        className="w-full font-bold"
      >
        {answered
          ? isLastQuestion
            ? 'Hoàn tất giai đoạn 2 →'
            : 'Câu tiếp theo'
          : 'Trả lời'}
      </Button>
    </div>
  );
}
