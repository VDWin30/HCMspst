'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

export function Stage2() {
  const { moveToStage, recordStage2Answer } = useGame();
  const [selectedQuestions, setSelectedQuestions] = useState<typeof gameData.stage2>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const allQuestions = gameData.stage2;
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
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
    if (!answered) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentQuestion.correct;
    setIsCorrect(correct);
    recordStage2Answer(currentQuestion.id, selectedOption);
    setAnswered(true);
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      moveToStage(3);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Giai đoạn 2: Trả Lời Câu Hỏi</h2>
        <p className="text-white/70 text-sm">Trả lời 10 câu hỏi về tư tưởng Hồ Chí Minh</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm px-2">
          <span className="text-white/80 font-semibold">Câu {currentIndex + 1}/10</span>
          <span className="text-yellow-400 font-bold">Điểm: {score}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-black/30 border border-yellow-400/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-yellow-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col bg-black/40 border-2 border-yellow-400/30 rounded-xl p-6 overflow-y-auto">
        {/* Question */}
        <div className="mb-6">
          <p className="text-white text-lg font-bold leading-relaxed">{currentQuestion.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(index)}
              disabled={answered}
              className={`w-full p-4 text-left rounded-lg font-medium transition-all border-2 ${
                selectedOption === index
                  ? 'bg-yellow-400/20 text-white border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : answered
                    ? 'bg-black/30 text-white/70 border-white/20'
                    : 'bg-black/30 text-white border-white/20 hover:border-yellow-400/50 hover:bg-black/50'
              } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-current mr-3 font-bold text-sm bg-black/40">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className={`mt-6 p-4 rounded-lg border-2 ${
              isCorrect
                ? 'bg-green-500/20 border-green-400 text-green-200'
                : 'bg-red-500/20 border-red-400 text-red-200'
            }`}
          >
            <p className="font-bold mb-2">{isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}</p>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Button */}
      <Button
        onClick={answered ? handleNext : handleSubmit}
        disabled={selectedOption === null && !answered}
        className={`w-full font-bold h-11 transition-all ${
          answered
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-yellow-400 hover:bg-yellow-500 text-red-700'
        }`}
      >
        {answered ? (isLastQuestion ? 'Hoàn tất giai đoạn 2 →' : 'Câu tiếp theo') : 'Trả lời'}
      </Button>
    </div>
  );
}
