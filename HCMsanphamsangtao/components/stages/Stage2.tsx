'use client';

import { useState, useEffect } from 'react';
import { gameData } from '@/lib/game-data';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col h-full max-w-2xl mx-auto px-6 py-8 text-slate-100">
      
      {/* --- HEADER GỌN GÀNG --- */}
      <div className="flex justify-between items-end mb-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Tiến trình</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-white">{currentIndex + 1}</span>
            <span className="text-slate-600 font-medium">/ 10</span>
          </div>
        </div>
        
        <div className="bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700/50 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-xl font-black tracking-tight">{gameState.score}</span>
        </div>
      </div>

      {/* --- THANH PROGRESS MẢNH --- */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* --- KHU VỰC CÂU HỎI --- */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-white">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-4">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectBase = answered && idx === currentQuestion.correct;
                const isWrongBase = answered && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => setSelectedOption(idx)}
                    className={`
                      group relative w-full p-5 rounded-2xl text-left transition-all duration-200 border-2
                      flex items-center gap-5
                      ${!answered && isSelected ? 'border-yellow-500 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/40'}
                      ${!answered && !isSelected ? 'hover:border-slate-700 hover:bg-slate-800/40' : ''}
                      ${isCorrectBase ? 'border-emerald-500 bg-emerald-500/10' : ''}
                      ${isWrongBase ? 'border-rose-500 bg-rose-500/10' : ''}
                      ${answered && !isSelected && !isCorrectBase ? 'opacity-40 grayscale-[0.5]' : ''}
                    `}
                  >
                    <span className={`
                      flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold
                      transition-colors duration-300
                      ${isSelected ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}
                      ${isCorrectBase ? 'bg-emerald-500 text-white' : ''}
                      ${isWrongBase ? 'bg-rose-500 text-white' : ''}
                    `}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <p className="font-medium text-lg leading-snug">{opt}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- PHẦN PHẢN HỒI --- */}
      <div className="mt-8 space-y-6">
        <div className="h-[100px]"> {/* Giữ chiều cao cố định để ko bị nhảy giao diện */}
          <AnimatePresence>
            {answered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border flex gap-4 ${
                  isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' : 'bg-rose-500/5 border-rose-500/20 text-rose-200'
                }`}
              >
                {isCorrect ? <Sparkles className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                <p className="text-sm leading-relaxed opacity-90">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={answered ? handleNext : handleSubmit}
          disabled={selectedOption === null && !answered}
          size="lg"
          className={`
            w-full h-16 rounded-2xl font-black text-lg transition-all active:scale-[0.98]
            ${!answered 
              ? 'bg-white text-slate-950 hover:bg-yellow-400' 
              : 'bg-slate-800 text-white hover:bg-slate-700'}
          `}
        >
          {answered ? (currentIndex === 9 ? 'HOÀN TẤT' : 'CÂU TIẾP THEO') : 'XÁC NHẬN'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
