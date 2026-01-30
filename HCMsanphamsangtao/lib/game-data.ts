// Game data structure for Ho Chi Minh Generation Game
export interface GameData {
  stage1: JigsawPuzzleImage[];
  stage2: QuestionPool[];
  stage3: MemoryImage[];
  stage4: FallingIdeology[];
  stage5: FillInTheBlanks[];
}

export interface JigsawPuzzleImage {
  id: string;
  image: string; // URL to full image
  title: string;
  description: string;
}

export interface QuestionPool {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface MemoryImage {
  id: string;
  imageUrl: string; // Link to image
  title: string;
}

export interface FallingIdeology {
  id: string;
  label: string;
  isCorrect: boolean; // true = Ho Chi Minh ideology, false = wrong ideology
}

export interface FillInTheBlanks {
  id: string;
  text: string; // Use {blank} to mark blanks
  blanks: string[]; // Correct answers for each blank
  explanation: string;
}

// Placeholder game data - REPLACE WITH YOUR DATA
export const gameData: GameData = {
  // Stage 1: Jigsaw puzzle - takes 1 image and cuts into {4, 8, 12, 14} random pieces
  stage1: [
    {
      id: 'puzzle1',
      image: 'https://printgo.vn/uploads/media/790919/hinh-anh-chan-dung-bac-ho-3_1620742202.jpg',
      title: 'Chân dung Lịch sử',
      description: 'Ghép tranh để hoàn thành bức chân dung'
    },
    {
      id: 'puzzle2',
      image: 'https://static.tuoitre.vn/tto/i/s626/2016/07/09/2ce4879d.jpg',
      title: 'Di tích lịch sử',
      description: 'Ghép tranh về di tích lịch sử Việt Nam'
    },
    {
      id: 'puzzle3',
      image: 'https://media.la34.com.vn/upload/image/202508/original/40cb63687e0f70fab7f5c35967def143.jpg',
      title: 'Cách mạng Việt Nam',
      description: 'Ghép tranh về cách mạng tháng 8 năm 1945'
    }
  ],

  // Stage 2: Answer 10 random questions from 20+ questions in pool
  stage2: [
    {
      id: 'q1',
      question: 'Hồ Chí Minh sinh năm nào?',
      options: ['1890', '1891', '1892', '1893'],
      correct: 0,
      explanation: 'Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890'
    },
    {
      id: 'q2',
      question: 'Hồ Chí Minh thành lập Đảng Cộng sản Việt Nam vào năm nào?',
      options: ['1925', '1930', '1935', '1940'],
      correct: 1,
      explanation: 'Đảng Cộng sản Việt Nam được thành lập vào 3 tháng 2 năm 1930'
    },
    {
      id: 'q3',
      question: 'Tư tưởng Hồ Chí Minh dựa trên nền tảng nào?',
      options: ['Chủ nghĩa tư bản', 'Chủ nghĩa Mác - Lê Nin', 'Chủ nghĩa phát xít', 'Chủ nghĩa tự do'],
      correct: 1,
      explanation: 'Tư tưởng Hồ Chí Minh dựa trên nền tảng chủ nghĩa Mác - Lê Nin'
    },
    {
      id: 'q4',
      question: 'Cách mạng tháng 8 diễn ra vào năm nào?',
      options: ['1943', '1944', '1945', '1946'],
      correct: 2,
      explanation: 'Cách mạng tháng 8 năm 1945 thành công, Việt Nam tuyên bố độc lập'
    },
    {
      id: 'q5',
      question: 'Hồ Chí Minh công bố Độc lập nước Việt Nam vào ngày mấy?',
      options: ['1 tháng 9', '2 tháng 9', '15 tháng 8', '31 tháng 8'],
      correct: 1,
      explanation: 'Ngày 2 tháng 9 năm 1945, Hồ Chí Minh công bố Độc lập'
    },
    {
      id: 'q6',
      question: 'Hồ Chí Minh đề cao giá trị nào nhất?',
      options: ['Tư lợi cá nhân', 'Độc lập và tự do', 'Tài nguyên thiên nhiên', 'Công nghệ'],
      correct: 1,
      explanation: 'Hồ Chí Minh luôn đề cao độc lập dân tộc và tự do'
    },
    {
      id: 'q7',
      question: 'Vai trò của nhân dân trong tư tưởng Hồ Chí Minh?',
      options: ['Nhân dân là bộ máy chính phủ', 'Nhân dân là gốc của cách mạng', 'Nhân dân là quân đội', 'Nhân dân là các nhà khoa học'],
      correct: 1,
      explanation: 'Hồ Chí Minh coi nhân dân là gốc, là lực lượng chính của cách mạng'
    },
    {
      id: 'q8',
      question: 'Hồ Chí Minh mất vào năm nào?',
      options: ['1967', '1969', '1970', '1972'],
      correct: 2,
      explanation: 'Hồ Chí Minh mất vào ngày 2 tháng 9 năm 1969'
    },
    {
      id: 'q9',
      question: 'Tư tưởng Hồ Chí Minh có đặc điểm gì?',
      options: ['Quốc tế và dân tộc', 'Chỉ quốc tế', 'Chỉ dân tộc', 'Không liên quan'],
      correct: 0,
      explanation: 'Tư tưởng Hồ Chí Minh vừa có tính quốc tế vừa có tính dân tộc'
    },
    {
      id: 'q10',
      question: 'Hồ Chí Minh là người nước nào?',
      options: ['Trung Quốc', 'Việt Nam', 'Lào', 'Campuchia'],
      correct: 1,
      explanation: 'Hồ Chí Minh là người Việt Nam, sinh tại Nghệ An'
    },
    {
      id: 'q11',
      question: 'Hồ Chí Minh sống ở nước ngoài được bao lâu?',
      options: ['10 năm', '20 năm', '30 năm', '40 năm'],
      correct: 2,
      explanation: 'Hồ Chí Minh sống ở nước ngoài khoảng 30 năm để học tập và tìm đường cứu nước'
    },
    {
      id: 'q12',
      question: 'Chủ trương của Hồ Chí Minh về đoàn kết dân tộc là gì?',
      options: ['Chỉ đoàn kết công nhân', 'Đoàn kết tất cả các tầng lớp nhân dân', 'Chỉ đoàn kết nông dân', 'Chỉ đoàn kết trí thức'],
      correct: 1,
      explanation: 'Hồ Chí Minh nhấn mạnh đoàn kết tất cả các tầng lớp nhân dân lao động'
    },
    {
      id: 'q13',
      question: 'Hồ Chí Minh gặp Lênin ở đâu?',
      options: ['Pháp', 'Liên Xô', 'Trung Quốc', 'Nhật Bản'],
      correct: 1,
      explanation: 'Hồ Chí Minh gặp Lênin tại Liên Xô và được tiếp nhận vào Đảng Cộng sản'
    },
    {
      id: 'q14',
      question: 'Tên gốc của Hồ Chí Minh là gì?',
      options: ['Nguyễn Sinh Cung', 'Tống Văn Tần', 'Bảo Thái', 'Lý Thị Tú'],
      correct: 0,
      explanation: 'Tên gốc của Hồ Chí Minh là Nguyễn Sinh Cung, sinh tại Kỳ Ngàn, Nghệ An'
    },
    {
      id: 'q15',
      question: 'Hồ Chí Minh đi học ở Pháp được bao lâu?',
      options: ['1 năm', '3 năm', '5 năm', '7 năm'],
      correct: 1,
      explanation: 'Hồ Chí Minh sang Pháp vào năm 1911 và ở lại khoảng 5 năm'
    },
    {
      id: 'q16',
      question: 'Bộ Độc lập Tuyên ngôn của Hồ Chí Minh có ý nghĩa gì?',
      options: ['Khai báo chiến tranh với Pháp', 'Công bố độc lập nước Việt Nam', 'Công bố thành lập Đảng', 'Công bố quốc huy'],
      correct: 1,
      explanation: 'Bộ Độc lập Tuyên ngôn công bố sự độc lập, tự do và chủ quyền của Việt Nam'
    },
    {
      id: 'q17',
      question: 'Hồ Chí Minh xem trọng điều gì nhất?',
      options: ['Tiền bạc', 'Quyền lực', 'Độc lập tự do của dân tộc', 'Danh vọng cá nhân'],
      correct: 2,
      explanation: 'Hồ Chí Minh luôn xem trọng độc lập, tự do của dân tộc Việt Nam'
    },
    {
      id: 'q18',
      question: 'Chiến dịch nào là thắng lợi lớn nhất của Hồ Chí Minh?',
      options: ['Chiến dịch Điện Biên Phủ', 'Cách mạng tháng 8', 'Chiến dịch Tây Bắc', 'Chiến dịch Hạ Long'],
      correct: 0,
      explanation: 'Chiến dịch Điện Biên Phủ (1954) là thắng lợi lớn nhất, buộc Pháp rút khỏi Việt Nam'
    },
    {
      id: 'q19',
      question: 'Tư tưởng Hồ Chí Minh về phụ nữ là gì?',
      options: ['Phụ nữ nên ở nhà', 'Phụ nữ bằng quyền với đàn ông', 'Phụ nữ chỉ làm việc nhẹ', 'Phụ nữ không cần học hành'],
      correct: 1,
      explanation: 'Hồ Chí Minh nhấn mạnh phụ nữ có quyền bằng đàn ông trong cách mạng'
    },
    {
      id: 'q20',
      question: 'Hồ Chí Minh đặt nước nước lợi ích gì lên trên hết?',
      options: ['Lợi ích cá nhân', 'Lợi ích giai cấp', 'Lợi ích dân tộc', 'Lợi ích quốc tế'],
      correct: 2,
      explanation: 'Hồ Chí Minh luôn đặt lợi ích dân tộc và nhân dân lên trên hết'
    }
  ],

  // Stage 3: Memory game - find matching images, randomly selected from data
  stage3: [
    {
      id: 'mem1',
      imageUrl: 'https://nads.1cdn.vn/2024/06/28/W_than-thien-copyrs.jpg',
      title: 'Chân dung lịch sử 1'
    },
    {
      id: 'mem2',
      imageUrl: 'https://vcdn1-giadinh.vnecdn.net/2016/03/29/Image-ExtractWord-2-Out-6620-1459219034.jpeg?w=1200&h=0&q=100&dpr=1&fit=crop&s=BtPfsZCAZZQDlIHFR9sNLw',
      title: 'Di tích 1'
    },
    {
      id: 'mem3',
      imageUrl: 'https://vcdn1-giadinh.vnecdn.net/2016/03/29/Image-942802835-ExtractWord-7-6460-7566-1459219025.png?w=680&h=0&q=100&dpr=2&fit=crop&s=7JeeTLl0YiwoZ8wi3TfuZw',
      title: 'Cách mạng 1'
    },
    {
      id: 'mem4',
      imageUrl: 'https://vcdn1-giadinh.vnecdn.net/2016/03/29/Image-322193178-ExtractWord-3-5762-8378-1459219022.png?w=680&h=0&q=100&dpr=2&fit=crop&s=rzDSxRtho3FQqKuMitCiXA',
      title: 'Chân dung lịch sử 2'
    },
    {
      id: 'mem5',
      imageUrl: 'https://vcdn1-giadinh.vnecdn.net/2016/03/29/Image-ExtractWord-6-Out-6941-1459219025.png?w=680&h=0&q=100&dpr=2&fit=crop&s=0j2O5JYduFp_nQOH4ODrTA',
      title: 'Di tích 2'
    },
    {
      id: 'mem6',
      imageUrl: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/8/22/1383302/Canhdep_Vietnam-1.jpg',
      title: 'Cách mạng 2'
    }
  ],

  // Stage 4: Catch falling ideologies - basket game with A/D and arrow keys
  stage4: [
    { id: 'ide1', label: 'Độc lập dân tộc', isCorrect: true },
    { id: 'ide2', label: 'Chế độ phong kiến', isCorrect: false },
    { id: 'ide3', label: 'Chủ nghĩa Mác - Lê Nin', isCorrect: true },
    { id: 'ide4', label: 'Chủ nghĩa Phát xít', isCorrect: false },
    { id: 'ide5', label: 'Nhân dân là gốc', isCorrect: true },
    { id: 'ide6', label: 'Chế độ nô lệ', isCorrect: false },
    { id: 'ide7', label: 'Tự do dân tộc', isCorrect: true },
    { id: 'ide8', label: 'Chế độ độc tài', isCorrect: false },
    { id: 'ide9', label: 'Bình đẳng xã hội', isCorrect: true },
    { id: 'ide10', label: 'Chế độ quân phiệt', isCorrect: false }
  ],

  // Stage 5: Fill in the blanks - insert words in correct positions
  stage5: [
    {
      id: 'fill1',
      text: 'Hồ Chí Minh sinh ngày 19 tháng {blank} năm 1890 tại {blank}, {blank}.',
      blanks: ['5', 'Kỳ Ngàn', 'Nghệ An'],
      explanation: 'Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890 tại Kỳ Ngàn, Nghệ An'
    },
    {
      id: 'fill2',
      text: 'Tư tưởng Hồ Chí Minh vừa có tính {blank} vừa có tính {blank}.',
      blanks: ['quốc tế', 'dân tộc'],
      explanation: 'Tư tưởng Hồ Chí Minh mang tính vừa quốc tế vừa dân tộc rất sâu sắc'
    },
    {
      id: 'fill3',
      text: 'Hồ Chí Minh thành lập Đảng Cộng sản Việt Nam vào ngày {blank} tháng {blank} năm {blank}.',
      blanks: ['3', '2', '1930'],
      explanation: 'Đảng Cộng sản Việt Nam được thành lập vào 3 tháng 2 năm 1930'
    },
    {
      id: 'fill4',
      text: 'Cách mạng tháng {blank} năm 1945 thành công, Việt Nam tuyên bố {blank}.',
      blanks: ['8', 'độc lập'],
      explanation: 'Cách mạng tháng 8 năm 1945 là cuộc cách mạng giành độc lập lịch sử'
    },
    {
      id: 'fill5',
      text: 'Hồ Chí Minh nhấn mạnh vai trò của {blank}} trong cách mạng.',
      blanks: ['nhân dân'],
      explanation: 'Hồ Chí Minh luôn coi nhân dân là lực lượng chính, là gốc của cách mạng'
    }
  ]
};
