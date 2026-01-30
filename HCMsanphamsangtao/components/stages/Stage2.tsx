'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';

export function Stage2() {
  const { moveToStage, recordStage2Answer, addStage2Score, gameState } =
    useGame();

  const [questions, setQuestions] = useState<typeof gameData.stage2>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    const shuffled = [...gameData.stage2].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
  }, []);

  if (!questions.length) {
    return (
      <div className="flex h-full items-center justify-center text-white/70">
        Đang tải câu hỏi…
      </div>
    );
  }

  const q = questions[index];
  const last = index === questions.length - 1;
  const progress = ((index + 1) / questions.length) * 100;

  const submit = () => {
    if (selected === null) return;

    const isRight = selected === q.correct;
    setCorrect(isRight);
    setAnswered(true);

    recordStage2Answer(q.id, selected);
    if (isRight) addStage2Score(10);
  };

  const next = () => {
    if (last) moveToStage(3);
    else {
      setIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setCorrect(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-extrabold text-white">
          📘 Giai đoạn 2: Trắc nghiệm
        </h2>
        <p className="text-white/70 text-sm">
          Kiến thức tư tưởng Hồ Chí Minh
        </p>
      </div>

      {/* HUD */}
      <div className="bg-black/40 border border-yellow-400/30 rounded-xl p-4">
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>
            Câu {index + 1}/{questions.length}
          </span>
          <span className="text-yellow-400 font-bold">
            ⭐ {gameState.score}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-yellow-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="flex-1 bg-black/50 border-2 border-yellow-400/30 rounded-2xl p-6 space-y-6">
        <p className="text-xl font-bold text-white leading-relaxed">
          {q.question}
        </p>

        {/* OPTIONS */}
        <div className="grid gap-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectAnswer = answered && i === q.correct;
            const isWrong =
              answered && isSelected && i !== q.correct;

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => setSelected(i)}
                className={`p-4 rounded-xl border-2 text-left transition-all
                  ${
                    isCorrectAnswer
                      ? 'bg-green-500/20 border-green-400'
                      : isWrong
                      ? 'bg-red-500/20 border-red-400'
                      : isSelected
                      ? 'bg-yellow-400/20 border-yellow-400'
                      : 'border-white/20 hover:border-yellow-400/60'
                  }`}
              >
                <span className="font-bold mr-3">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK */}
        {answered && (
          <div
            className={`p-4 rounded-xl border-2 text-sm ${
              correct
                ? 'bg-green-500/20 border-green-400 text-green-200'
                : 'bg-red-500/20 border-red-400 text-red-200'
            }`}
          >
            <b>
              {correct
                ? '✓ Chính xác!'
                : '✗ Chưa đúng'}
            </b>
            <p className="mt-1 text-white/80">
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      {/* ACTION */}
      <Button
        onClick={answered ? next : submit}
        disabled={selected === null && !answered}
        className="w-full text-lg font-bold"
      >
        {answered
          ? last
            ? 'Hoàn tất giai đoạn 2 →'
            : 'Câu tiếp theo'
          : 'Trả lời'}
      </Button>
    </div>
  );
}
