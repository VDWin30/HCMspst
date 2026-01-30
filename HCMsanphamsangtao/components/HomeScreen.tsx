'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Header */}
        <div className="text-center space-y-4 p-8 rounded-lg bg-black/30 border border-white/10">
          <div className="text-6xl font-bold text-yellow-300 text-balance">
            Thế hệ Hồ Chí Minh
          </div>
          <div className="text-2xl text-yellow-100 font-semibold">
            Hành trình theo dấu chân Bác
          </div>
        </div>

        {/* Game Introduction */}
        <div className="p-6 rounded-lg bg-black/30 border border-white/10 space-y-4">
          <h2 className="text-2xl font-bold text-yellow-300">Chào mừng!</h2>
          <p className="text-white/90 text-lg leading-relaxed">
            Hồ Chí Minh là một trong những vị lãnh tụ lỗi lạc nhất của Việt Nam.
            Tư tưởng và sự nghiệp của người còn sống mãi trong lòng nhân dân
            Việt Nam. Hãy cùng tìm hiểu về cuộc đời và tư tưởng vĩ đại của người
            thông qua trò chơi này!
          </p>

          {/* Game Stages Overview */}
          <div className="bg-black/40 rounded-lg p-4 space-y-3 border-l-4 border-yellow-300 mt-4">
            <h3 className="font-bold text-yellow-300">5 Giai đoạn học tập:</h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex gap-3">
                <span className="font-bold text-yellow-300">1.</span>
                <span>
                  <strong>Ghép Tranh</strong> - Ghép các mảnh tranh để hoàn thành bức ảnh
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-yellow-300">2.</span>
                <span>
                  <strong>Trắc Nghiệm</strong> - Trả lời 10 câu hỏi ngẫu nhiên từ ngân hàng câu hỏi
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-yellow-300">3.</span>
                <span>
                  <strong>Tìm Ảnh Giống Nhau</strong> - Tìm các cặp ảnh giống nhau trong trò chơi memory
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-yellow-300">4.</span>
                <span>
                  <strong>Hứng Ý Tưởng</strong> - Di chuyển rổ để hứng các ý tưởng Hồ Chí Minh
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-yellow-300">5.</span>
                <span>
                  <strong>Điền Chỗ Trống</strong> - Hoàn thành các câu về Hồ Chí Minh
                </span>
              </li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-black/40 border-l-4 border-orange-400 p-4 rounded mt-4">
            <p className="font-semibold text-orange-300 mb-2">Gợi ý:</p>
            <p className="text-white/80">
              Trả lời đúng sẽ cộng điểm. Hoàn thành tất cả 5 giai đoạn để trở thành "Công dân Thế hệ Hồ Chí Minh"!
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full font-bold text-xl h-14 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all transform hover:scale-105 shadow-lg"
        >
          Bắt đầu trò chơi
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-white/60">
          <p>
            Hồ Chí Minh (1890-1969) - Nhà lãnh đạo vĩ đại, Chủ tịch nước Cộng
            hòa Xã hội chủ nghĩa Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
}
