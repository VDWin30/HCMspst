'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Stage5() {
  const { moveToStage, answerStage5 } = useGame();

  const questions = gameData.stage5;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [blanks, setBlanks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  /* ===== INIT BLANKS ===== */
  useEffect(() => {
    setBlanks(new Array(currentQuestion.blanks.length).fill(''));
    setSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex, currentQuestion]);

  /* ===== HANDLE INPUT ===== */
  const handleBlankChange = (index: number, value: string) => {
    const next = [...blanks];
    next[index] = value;
    setBlanks(next);
  };

  /* ===== CHECK ANSWER ===== */
  const checkAnswers = () => {
    if (blanks.some(b => !b.trim())) {
      alert('Vui lòng điền đầy đủ các chỗ trống');
      return;
    }

    const correct = blanks.every(
      (b, i) =>
        b.trim().toLowerCase() ===
        currentQuestion.blanks[i].trim().toLowerCase()
    );

    setIsCorrect(correct);
    setSubmitted(true);

    // ✅ LƯU + CHẤM ĐIỂM QUA GAMECONTEXT
    answerStage5(currentQuestion.id, correct);
  };

  /* ===== NEXT ===== */
  const handleNext = () => {
    if (isLastQuestion) {
      setCompleted(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  /* ===== AUTO MOVE STAGE ===== */
  useEffect(() => {
    if (!completed) return;
    const id = setTimeout(() => moveToStage(6), 600);
    return () => clearTimeout(id);
  }, [completed, moveToStage]);

  /* ===== COMPLETE SCREEN ===== */
  if (completed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-green-500/30 rounded-lg border-2 border-green-400">
          <h3 className="text-3xl font-bold text-green-300 mb-2">
            Hoàn thành!
          </h3>
          <p className="text-white/80 text-lg">
            Bạn đã hoàn thành giai đoạn 5
          </p>
          <p className="text-yellow-300 mt-4 font-bold text-xl">
            +100 điểm / câu đúng
          </p>
        </div>
      </div>
    );
  }

  /* ===== MAIN UI ===== */
  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Giai đoạn 5: Điền chỗ trống
        </h2>
        <p className="text-white/70 text-sm">
          Trả lời đúng mỗi câu được 100 điểm
        </p>
      </div>

      {/* PROGRESS */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Câu {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-black/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* QUESTION */}
      <div className="flex-1 bg-black/40 rounded-lg p-8 flex flex-col gap-6">
        <p className="text-white text-lg leading-relaxed">
          {currentQuestion.text.split('{blank}').map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < currentQuestion.blanks.length && (
                <span className="mx-1 font-bold text-yellow-300">___</span>
              )}
            </span>
          ))}
        </p>

        {/* INPUTS */}
        <div className="grid gap-4">
          {blanks.map((b, idx) => (
            <Input
              key={idx}
              value={b}
              disabled={submitted}
              placeholder={`Từ ${idx + 1}`}
              onChange={e => handleBlankChange(idx, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !submitted && checkAnswers()}
            />
          ))}
        </div>

        {/* FEEDBACK */}
        {submitted && (
          <div
            className={`p-4 rounded ${
              isCorrect
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}
          >
            <p className="font-bold mb-2">
              {isCorrect ? '✓ Chính xác!' : '✗ Sai rồi!'}
            </p>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* BUTTON */}
      <Button
        onClick={submitted ? handleNext : checkAnswers}
        className="h-12 font-bold"
      >
        {submitted
          ? isLastQuestion
            ? 'Hoàn tất'
            : 'Câu tiếp theo'
          : 'Kiểm tra'}
      </Button>
    </div>
  );
}
