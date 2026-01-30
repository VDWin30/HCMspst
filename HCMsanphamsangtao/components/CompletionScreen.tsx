'use client';

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
  onHome,
}: CompletionScreenProps) {
  const percentage =
    maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const getPassageMessage = () => {
    if (percentage === 100) {
      return 'Bạn là một công dân thế hệ Hồ Chí Minh xuất sắc!';
    }
    if (percentage >= 80) {
      return 'Bạn đã nắm vững kiến thức về tư tưởng Hồ Chí Minh!';
    }
    if (percentage >= 60) {
      return 'Bạn có hiểu biết tốt về tư tưởng Hồ Chí Minh.';
    }
    return 'Hãy cố gắng hơn để tìm hiểu sâu hơn về tư tưởng Hồ Chí Minh!';
  };

  const CIRCUMFERENCE = 2 * Math.PI * 90;
  const dashOffset = CIRCUMFERENCE * (1 - percentage / 100);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-xl bg-black/40 border border-white/10 overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="text-center bg-gradient-to-r from-orange-500/80 to-red-600/80 p-8">
          <h1 className="text-5xl font-bold mb-2 text-white">Hoàn thành!</h1>
          <h2 className="text-2xl font-semibold text-white/90">
            Bạn đã hoàn thành trò chơi
          </h2>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">
          {/* SCORE */}
          <div className="text-center space-y-4">
            <p className="text-lg text-white/70">Tổng điểm đạt được</p>
            <div className="text-6xl font-bold text-yellow-300">
              {score}
            </div>
            <p className="text-white/60">/ {maxScore}</p>

            {/* PROGRESS */}
            <div className="flex justify-center mt-6">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#ffde59"
                    strokeWidth="8"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 100 100)"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-yellow-300">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <p className="text-xl font-semibold text-yellow-100 mt-6">
              {getPassageMessage()}
            </p>
          </div>

          {/* INFO */}
          <div className="bg-black/30 border-l-4 border-yellow-300 rounded-lg p-6 text-center">
            <p className="text-lg text-white/90 leading-relaxed">
              Tư tưởng Hồ Chí Minh là nền tảng tinh thần vững chắc của cách mạng
              Việt Nam. Hãy tiếp tục học tập, rèn luyện để trở thành công dân
              thế hệ Hồ Chí Minh trong thời đại mới.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onRestart}
              className="h-12 rounded-lg font-bold text-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition"
            >
              🔁 Chơi lại
            </button>
            <button
              onClick={onHome}
              className="h-12 rounded-lg font-bold text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              🏠 Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
