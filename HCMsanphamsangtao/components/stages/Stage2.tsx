'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, Trophy, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Thêm framer-motion để mượt hơn

export function Stage2() {
  const { moveToStage, recordStage2Answer, addStage2Score, gameState } = useGame();
  const [selectedQuestions, setSelectedQuestions] = useState<typeof gameData.stage2>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const shuffled = [...gameData.stage2].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 10));
  }, []);

  if (selectedQuestions.length === 0) return null;

  const currentQuestion = selectedQuestions[currentIndex];
  const progress = ((currentIndex + 1) / 10) * 100;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentQuestion.correct;
    setIsCorrect(correct);
    setAnswered(true);
    recordStage2Answer(currentQuestion.id, selectedOption);
    if (correct) addStage2Score(10);
  };

  const handleNext = () => {
    if (currentIndex === 9) {
      moveToStage(3);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto px-4 py-6 font-sans antialiased text-white">
      
      {/* 1. TOP BAR: Thông tin gọn gàng */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <GraduationCap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Câu hỏi</h3>
            <p className="text-lg font-black">{currentIndex + 1} <span className="text-white/20">/ 10</span></p>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Điểm số</h3>
          <div className="flex items-center justify-end gap-2 text-lg font-black text-yellow-400">
            <Trophy className="w-4 h-4" />
            {gameState.score}
          </div>
        </div>
      </div>

      {/* 2. PROGRESS BAR: Mảnh mai, sang trọng */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
        />
      </div>

      {/* 3. QUESTION AREA: Typography sạch sẽ */}
      <div className="flex-1 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <h2 className="text-xl md:text-2xl font-medium leading-[1.4] text-white/95 tracking-tight">
              {currentQuestion.question}
            </h2>

            {/* OPTIONS: Thiết kế dạng thẻ tối giản */}
            <div className="grid gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const showCorrect = answered && idx === currentQuestion.correct;
                const showWrong = answered && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => setSelectedOption(idx)}
                    className={`
                      relative w-full p-4 rounded-2xl text-left transition-all duration-300 border-2
                      ${!answered && isSelected ? 'border-yellow-400/50 bg-yellow-400/5' : 'border-white/5 bg-white/[0.03]'}
                      ${!answered && !isSelected ? 'hover:bg-white/[0.06] hover:border-white/10' : ''}
                      ${showCorrect ? 'border-emerald-500/50 bg-emerald-500/10' : ''}
                      ${showWrong ? 'border-rose-500/50 bg-rose-500/10' : ''}
                      ${answered && !isSelected && !showCorrect ? 'opacity-30 blur-[0.5px]' : ''}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`
                        w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors
                        ${isSelected ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/50'}
                        ${showCorrect ? 'bg-emerald-500 text-white' : ''}
                        ${showWrong ? 'bg-rose-500 text-white' : ''}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-medium text-[15px]">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. FEEDBACK & ACTION: Tách biệt rõ ràng */}
      <div className="mt-8 space-y-4">
        <AnimatePresence>
          {answered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl flex gap-3 items-start border ${
                isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
              }`}
            >
              {isCorrect ? 
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : 
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              }
              <p className="text-sm leading-relaxed text-white/70 italic">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={answered ? handleNext : handleSubmit}
          disabled={selectedOption === null && !answered}
          className={`
            w-full h-14 rounded-2xl font-bold text-sm tracking-widest transition-all
            ${!answered 
              ? 'bg-white text-black hover:bg-yellow-400 shadow-xl shadow-white/5' 
              : 'bg-white/10 text-white hover:bg-white/20'}
          `}
        >
          {answered ? (currentIndex === 9 ? 'HOÀN TẤT' : 'TIẾP TỤC') : 'KIỂM TRA'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
