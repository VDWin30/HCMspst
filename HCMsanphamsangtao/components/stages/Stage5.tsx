'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Stage5() {
  const { moveToStage, recordStage5Answer } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blanks, setBlanks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = gameData.stage5;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Initialize blanks on mount or when question changes
  useEffect(() => {
    setBlanks(new Array(currentQuestion.blanks.length).fill(''));
    setSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex, currentQuestion]);

  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    setBlanks(newBlanks);
  };

  const checkAnswers = () => {
    // Check if all blanks are filled
    if (blanks.some((b) => !b.trim())) {
      alert('Vui lòng điền đủ tất cả chỗ trống!');
      return;
    }

    // Check correctness (case-insensitive)
    const correct = blanks.every((blank, idx) =>
      blank.toLowerCase().trim() === currentQuestion.blanks[idx].toLowerCase().trim()
    );

    setIsCorrect(correct);
    recordStage5Answer(currentQuestion.id, blanks);
    setSubmitted(true);

    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (completed) {
    // Auto navigate to completion screen after brief moment
    setTimeout(() => {
      moveToStage(6);
    }, 500);
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-green-500/30 rounded-lg border-2 border-green-400">
          <h3 className="text-3xl font-bold text-green-300 mb-2">Hoàn thành!</h3>
          <p className="text-white/80 mb-4 text-lg">Bạn đã hoàn thành giai đoạn 5 - Điền chỗ trống</p>
          <p className="text-white/70 mb-6">Điểm đạt được: <span className="text-yellow-300 font-bold text-xl">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Giai đoạn 5: Điền Chỗ Trống</h2>
        <p className="text-white/70 text-sm">Hoàn thành các câu về Hồ Chí Minh bằng cách điền các từ còn thiếu</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Câu {currentIndex + 1}/{questions.length}
          </span>
          <span className="font-semibold text-yellow-300">Điểm: {score}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-black/50 overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 bg-black/40 rounded-lg border border-white/10 p-8 flex flex-col gap-6">
        {/* Question Text */}
        <div className="bg-black/50 p-6 rounded-lg border-l-4 border-yellow-300">
          <p className="text-white text-lg leading-relaxed">
            {currentQuestion.text.split('{blank}').map((part, idx) => (
              <span key={idx}>
                <span>{part}</span>
                {idx < currentQuestion.blanks.length && (
                  <span className="inline-block mx-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 font-bold">
                      ___
                    </span>
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="grid gap-4">
            {blanks.map((blank, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Từ #{idx + 1}
                </label>
                <Input
                  type="text"
                  value={blank}
                  onChange={(e) => handleBlankChange(idx, e.target.value)}
                  disabled={submitted}
                  placeholder={`Nhập từ ${idx + 1}...`}
                  className="h-12 text-base bg-black/50 text-white border-white/20 placeholder:text-white/40"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !submitted) {
                      checkAnswers();
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <div
            className={`p-6 rounded-lg border-l-4 ${
              isCorrect
                ? 'bg-green-500/20 border-green-400 text-green-300'
                : 'bg-red-500/20 border-red-400 text-red-300'
            }`}
          >
            <p className="font-bold mb-2 text-lg">
              {isCorrect ? '✓ Đúng rồi!' : '✗ Sai rồi!'}
            </p>
            <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
            {!isCorrect && (
              <div className="mt-3 p-3 bg-black/30 rounded">
                <p className="text-sm text-white/80">
                  <span className="font-semibold">Đáp án đúng:</span>
                  <br />
                  {currentQuestion.blanks.map((ans, idx) => (
                    <span key={idx}>
                      {idx > 0 && ' - '}
                      <span className="text-yellow-300">{ans}</span>
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={submitted ? handleNext : checkAnswers}
          disabled={!submitted && blanks.some((b) => !b.trim())}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 h-12 text-base"
        >
          {submitted ? (isLastQuestion ? 'Hoàn tất trò chơi' : 'Câu tiếp theo') : 'Kiểm tra đáp án'}
        </Button>
      </div>
    </div>
  );
}
