'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, HelpCircle, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

export function Stage5() {
  const { moveToStage, answerStage5, gameState } = useGame();

  const questions = gameData.stage5;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [blanks, setBlanks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [animate, setAnimate] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  /* ===== INIT BLANKS ===== */
  useEffect(() => {
    setBlanks(new Array(currentQuestion.blanks.length).fill(''));
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setAnimate(true);
    
    // Reset animation
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
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
      // Hiệu ứng shake cho inputs trống
      const emptyIndices = blanks.map((b, i) => !b.trim() ? i : -1).filter(i => i !== -1);
      const inputs = document.querySelectorAll('.blank-input');
      emptyIndices.forEach(i => {
        if (inputs[i]) {
          inputs[i].classList.add('animate-shake');
          setTimeout(() => inputs[i].classList.remove('animate-shake'), 500);
        }
      });
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
      setTimeout(() => moveToStage(6), 1500);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  /* ===== SHOW HINT ===== */
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  /* ===== COMPLETE SCREEN ===== */
  if (completed) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="relative max-w-lg w-full">
          {/* Background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20 rounded-3xl blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-green-400/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-400 rounded-full">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-green-300">
                Chúc mừng!
              </h3>
              <p className="text-white/80 text-lg">
                Bạn đã hoàn thành giai đoạn 5
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-4 py-3 rounded-full">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-bold text-lg">
                +100 điểm / câu đúng
              </span>
            </div>
            
            <div className="pt-4">
              <div className="animate-pulse text-sm text-white/60">
                Đang chuyển sang giai đoạn tiếp theo...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===== MAIN UI ===== */
  return (
    <div className="h-full flex flex-col p-4 md:p-6 gap-6 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-cyan-900/10" />
      
      {/* HEADER */}
      <div className="relative text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 px-4 py-2 rounded-full mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="font-bold text-white">GIAI ĐOẠN 5</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Điền chỗ trống
        </h2>
        <p className="text-white/70 text-lg">
          Hoàn thành câu bằng cách điền từ thích hợp
        </p>
      </div>

      {/* PROGRESS & SCORE */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-gray-900 to-black p-5 rounded-2xl border border-blue-400/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/70">Tiến độ</span>
            <span className="text-blue-400 font-bold">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full transition-all duration-700 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-900 to-black p-5 rounded-2xl border border-yellow-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70">Điểm hiện tại</span>
            </div>
            <span className="text-yellow-400 text-2xl font-bold">
              {gameState.score}
            </span>
          </div>
          <div className="mt-2 text-sm text-white/50">
            +100 điểm cho mỗi câu đúng
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className={`relative flex-1 transition-all duration-500 ${animate ? 'animate-in slide-in-from-bottom-5' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5 rounded-3xl blur-2xl" />
        
        <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl border-2 border-blue-400/30 p-6 md:p-8 space-y-8 shadow-2xl">
          {/* Question header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                Câu hỏi #{currentIndex + 1}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHint}
                className="text-blue-300 hover:text-blue-400 hover:bg-blue-400/10"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Gợi ý
              </Button>
              <div className="text-yellow-400 font-bold text-lg bg-yellow-400/10 px-3 py-1 rounded-full">
                100 điểm
              </div>
            </div>
          </div>

          {/* Question text with blanks */}
          <div className="space-y-6">
            <div className="text-2xl md:text-3xl font-bold text-white leading-relaxed text-center">
              {currentQuestion.text.split('{blank}').map((part, idx) => (
                <span key={idx}>
                  {part}
                  {idx < currentQuestion.blanks.length && (
                    <span className="relative mx-2">
                      {/* Animated underline */}
                      <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
                      
                      {/* Input indicator */}
                      <span className="inline-block px-4 py-1 mx-1 bg-gradient-to-b from-blue-500/10 to-blue-700/10 rounded-lg border border-blue-400/30 min-w-[120px]">
                        {submitted ? (
                          <span className={`font-bold ${blanks[idx]?.toLowerCase() === currentQuestion.blanks[idx].toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                            {blanks[idx] || '______'}
                          </span>
                        ) : (
                          <span className="text-blue-300/50">
                            {blanks[idx] ? blanks[idx] : `Chỗ trống ${idx + 1}`}
                          </span>
                        )}
                      </span>
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Hint */}
            {showHint && (
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/30">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-300 font-bold mb-1">💡 Gợi ý</h4>
                    <p className="text-white/80 text-sm">{currentQuestion.hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUTS SECTION */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              Điền từ vào các ô bên dưới:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blanks.map((b, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-white/70 text-sm">
                    Từ thứ {idx + 1}
                  </label>
                  <input
                    className={`blank-input w-full p-4 rounded-xl border-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white placeholder-white/30
                      transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${submitted 
                        ? b.toLowerCase() === currentQuestion.blanks[idx].toLowerCase()
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                        : 'border-blue-400/30 hover:border-blue-400/50'
                      }`}
                    value={b}
                    disabled={submitted}
                    placeholder={`Nhập từ thứ ${idx + 1}...`}
                    onChange={e => handleBlankChange(idx, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !submitted && checkAnswers()}
                    autoFocus={idx === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FEEDBACK */}
          {submitted && (
            <div className={`p-5 rounded-xl border-2 backdrop-blur-sm animate-in slide-in-from-bottom-5
              ${isCorrect 
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/50' 
                : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-400/50'
              }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                    {isCorrect ? '🎉 Xuất sắc!' : '📝 Cần cố gắng hơn!'}
                  </h3>
                  <p className="text-white/90 mb-3 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  {isCorrect && (
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-bold">
                        +100 điểm đã được cộng
                      </span>
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
        onClick={submitted ? handleNext : checkAnswers}
        disabled={!submitted && blanks.some(b => !b.trim())}
        className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl group
          ${submitted 
            ? isCorrect 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
            : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
          }`}
      >
        <div className="flex items-center justify-center gap-3">
          {submitted ? (
            <>
              {isLastQuestion ? 'Hoàn thành giai đoạn' : 'Câu tiếp theo'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            'Kiểm tra câu trả lời'
          )}
        </div>
      </Button>

      {/* Footer instructions */}
      <div className="text-center text-white/50 text-sm">
        Nhấn Enter để nhanh chóng kiểm tra kết quả
      </div>

      {/* Add CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
