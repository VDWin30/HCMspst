'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Star, Trophy, ChevronRight } from 'lucide-react';

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
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-white/70 text-lg">Đang tải câu hỏi…</p>
        </div>
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

  // Màu gradient cho câu hỏi
  const questionGradient = "linear-gradient(135deg, #1a237e 0%, #311b92 50%, #4a148c 100%)";
  const optionGradients = [
    "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
    "linear-gradient(135deg, #006064 0%, #00838f 100%)",
    "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
    "linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)"
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-4 md:p-6">
      {/* HEADER với hiệu ứng */}
      <div className="text-center space-y-3 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-red-500/10 to-yellow-500/10 rounded-2xl blur-xl" />
        <div className="relative bg-gradient-to-br from-red-600/90 to-yellow-500/90 p-6 rounded-2xl border-2 border-yellow-400/50 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full mb-3">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-yellow-300 font-bold text-sm">GIAI ĐOẠN 2</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Trắc nghiệm kiến thức
          </h2>
          <p className="text-white/90 text-lg">
            Tư tưởng Hồ Chí Minh
          </p>
        </div>
      </div>

      {/* PROGRESS BAR hiện đại */}
      <div className="bg-gradient-to-r from-gray-900 to-black p-5 rounded-2xl border border-yellow-400/20 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-lg">{gameState.score}</span>
            </div>
            <span className="text-white/70">|</span>
            <span className="text-white font-medium">
              Câu <span className="text-yellow-400 text-xl">{index + 1}</span>/{questions.length}
            </span>
          </div>
          <div className="text-white/60 text-sm">
            {Math.round(progress)}%
          </div>
        </div>
        
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-yellow-400 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* QUESTION CARD với hiệu ứng 3D */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-red-500/5 to-yellow-500/5 rounded-3xl blur-2xl" />
        <div 
          className="relative h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl border-2 border-yellow-400/20 p-6 md:p-8 space-y-8 shadow-2xl"
          style={{ background: questionGradient }}
        >
          {/* Question số */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Câu hỏi #{index + 1}</span>
            </div>
            <div className="text-yellow-400 font-bold text-lg">
              100 điểm
            </div>
          </div>

          {/* Câu hỏi */}
          <p className="text-2xl md:text-3xl font-bold text-white leading-tight text-center">
            {q.question}
          </p>

          {/* OPTIONS grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectAnswer = answered && i === q.correct;
              const isWrong = answered && isSelected && i !== q.correct;

              return (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] group
                    ${isSelected ? 'scale-[1.02]' : ''}
                    ${
                      isCorrectAnswer
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400 shadow-lg shadow-green-500/20'
                        : isWrong
                        ? 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400'
                        : isSelected
                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400 shadow-lg shadow-yellow-500/20'
                        : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-white/10 hover:border-yellow-400/40'
                    }`}
                  style={{ background: !isCorrectAnswer && !isWrong && !isSelected ? optionGradients[i] : undefined }}
                >
                  {/* Chỉ số option */}
                  <div className={`absolute -top-2 -left-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2
                    ${isCorrectAnswer ? 'bg-green-500 border-green-400 text-white' :
                      isWrong ? 'bg-red-500 border-red-400 text-white' :
                      isSelected ? 'bg-yellow-500 border-yellow-400 text-black' :
                      'bg-gray-800 border-white/20 text-white'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>

                  {/* Nội dung option */}
                  <div className="ml-8">
                    <span className="text-lg font-medium text-white">{opt}</span>
                  </div>

                  {/* Icon feedback */}
                  {answered && (isCorrectAnswer || isWrong) && (
                    <div className="absolute top-3 right-3">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  )}

                  {/* Hiệu ứng hover */}
                  {!answered && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>

          {/* FEEDBACK section */}
          {answered && (
            <div className={`p-5 rounded-xl border-2 backdrop-blur-sm animate-in slide-in-from-bottom-5
              ${correct 
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/50' 
                : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-400/50'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {correct ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${correct ? 'text-green-300' : 'text-red-300'}`}>
                    {correct ? '🎉 Chính xác!' : '📝 Cần cố gắng hơn!'}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {q.explanation}
                  </p>
                  {correct && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">+10 điểm</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTION BUTTON */}
      <Button
        onClick={answered ? next : submit}
        disabled={selected === null && !answered}
        className="w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl group"
        variant={answered ? (correct ? "default" : "destructive") : "default"}
      >
        <div className="flex items-center justify-center gap-3">
          {answered ? (
            <>
              {last ? 'Hoàn thành giai đoạn 2' : 'Tiếp tục'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            'Xác nhận câu trả lời'
          )}
        </div>
      </Button>

      {/* Footer hint */}
      <div className="text-center text-white/50 text-sm">
        Chọn một đáp án và nhấn xác nhận để tiếp tục
      </div>
    </div>
  );
}
