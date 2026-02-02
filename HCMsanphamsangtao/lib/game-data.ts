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
    question: 'Nền tảng tư tưởng của Hồ Chí Minh là gì?',
    options: ['Chủ nghĩa dân tộc', 'Chủ nghĩa Mác – Lênin', 'Chủ nghĩa tự do', 'Chủ nghĩa cải lương'],
    correct: 1,
    explanation: 'Tư tưởng Hồ Chí Minh lấy chủ nghĩa Mác – Lênin làm nền tảng'
  },
  {
    id: 'q2',
    question: 'Mục tiêu cao nhất của tư tưởng Hồ Chí Minh là gì?',
    options: ['Phát triển kinh tế', 'Độc lập dân tộc gắn liền với CNXH', 'Hội nhập quốc tế', 'Mở rộng lãnh thổ'],
    correct: 1,
    explanation: 'Độc lập dân tộc phải gắn liền với CNXH'
  },
  {
    id: 'q3',
    question: 'Theo Hồ Chí Minh, ai là chủ thể của cách mạng?',
    options: ['Đảng', 'Quân đội', 'Nhân dân', 'Trí thức'],
    correct: 2,
    explanation: 'Nhân dân là gốc của cách mạng'
  },
  {
    id: 'q4',
    question: 'Chiến lược lâu dài của cách mạng Việt Nam theo Hồ Chí Minh là gì?',
    options: ['Đấu tranh vũ trang', 'Cải cách kinh tế', 'Đại đoàn kết toàn dân', 'Ngoại giao'],
    correct: 2,
    explanation: 'Đại đoàn kết toàn dân là chiến lược quyết định'
  },
  {
    id: 'q5',
    question: 'Nhà nước theo tư tưởng Hồ Chí Minh là gì?',
    options: ['Nhà nước cai trị', 'Nhà nước quân sự', 'Nhà nước của dân, do dân, vì dân', 'Nhà nước giai cấp'],
    correct: 2,
    explanation: 'Nhà nước phục vụ nhân dân'
  },
  {
    id: 'q6',
    question: 'Theo Hồ Chí Minh, đạo đức cách mạng có vai trò gì?',
    options: ['Không quan trọng', 'Phụ', 'Là gốc của người cách mạng', 'Chỉ cần với lãnh đạo'],
    correct: 2,
    explanation: 'Có đức mà không có tài thì làm việc gì cũng khó'
  },
  {
    id: 'q7',
    question: 'Hồ Chí Minh quan niệm thế nào về Đảng Cộng sản?',
    options: ['Đảng đứng trên dân', 'Đảng chỉ lãnh đạo', 'Đảng vừa lãnh đạo vừa phục vụ nhân dân', 'Đảng là tổ chức quyền lực'],
    correct: 2,
    explanation: 'Đảng là đầy tớ trung thành của nhân dân'
  },
  {
    id: 'q8',
    question: 'Theo Hồ Chí Minh, cách mạng muốn thành công cần điều gì?',
    options: ['Vũ khí mạnh', 'Nhân dân ủng hộ', 'Tiền bạc', 'Ngoại viện'],
    correct: 1,
    explanation: 'Dễ trăm lần không dân cũng chịu'
  },
  {
    id: 'q9',
    question: 'Tư tưởng Hồ Chí Minh về con người là gì?',
    options: ['Công cụ sản xuất', 'Yếu tố phụ', 'Vừa là mục tiêu vừa là động lực', 'Phụ thuộc Nhà nước'],
    correct: 2,
    explanation: 'Con người là trung tâm của cách mạng'
  },
  {
    id: 'q10',
    question: 'Theo Hồ Chí Minh, độc lập có ý nghĩa gì?',
    options: ['Danh nghĩa', 'Hình thức', 'Gắn với tự do, hạnh phúc của nhân dân', 'Chỉ chính trị'],
    correct: 2,
    explanation: 'Độc lập mà dân không hạnh phúc thì độc lập vô nghĩa'
  },
     {
    id: 'q31',
    question: 'Đảng Cộng sản Việt Nam được thành lập vào ngày nào?',
    options: ['1/1/1930', '3/2/1930', '19/5/1930', '2/9/1930'],
    correct: 1,
    explanation: 'Đảng Cộng sản Việt Nam thành lập ngày 3/2/1930'
  },
  {
    id: 'q32',
    question: 'Ai là người sáng lập Đảng Cộng sản Việt Nam?',
    options: ['Trường Chinh', 'Phạm Văn Đồng', 'Hồ Chí Minh', 'Võ Nguyên Giáp'],
    correct: 2,
    explanation: 'Hồ Chí Minh sáng lập và rèn luyện Đảng'
  },
  {
    id: 'q33',
    question: 'Mục tiêu của Đảng Cộng sản Việt Nam là gì?',
    options: ['Phát triển kinh tế', 'Giành độc lập', 'Xây dựng CNXH và CNCS', 'Hội nhập quốc tế'],
    correct: 2,
    explanation: 'Mục tiêu lâu dài là CNXH và CNCS'
  },
  {
    id: 'q34',
    question: 'Đảng Cộng sản Việt Nam lấy chủ nghĩa gì làm nền tảng?',
    options: ['Chủ nghĩa dân tộc', 'Chủ nghĩa Mác – Lênin', 'Chủ nghĩa tự do', 'Chủ nghĩa cải lương'],
    correct: 1,
    explanation: 'Đảng lấy chủ nghĩa Mác – Lênin và tư tưởng Hồ Chí Minh'
  },
  {
    id: 'q35',
    question: 'Vai trò lãnh đạo của Đảng thể hiện ở đâu?',
    options: ['Quân đội', 'Nhà nước', 'Toàn xã hội', 'Kinh tế'],
    correct: 2,
    explanation: 'Đảng lãnh đạo toàn diện xã hội'
  },
     {
    id: 'q46',
    question: 'Quân đội Nhân dân Việt Nam được thành lập vào ngày nào?',
    options: ['19/5/1944', '22/12/1944', '2/9/1945', '7/5/1954'],
    correct: 1,
    explanation: 'Quân đội Nhân dân Việt Nam thành lập ngày 22/12/1944'
  },
  {
    id: 'q47',
    question: 'Tên gọi đầu tiên của Quân đội Nhân dân Việt Nam là gì?',
    options: [
      'Quân giải phóng',
      'Việt Nam Tuyên truyền Giải phóng quân',
      'Vệ quốc đoàn',
      'Quân đội nhân dân'
    ],
    correct: 1,
    explanation: 'Tên ban đầu là Việt Nam Tuyên truyền Giải phóng quân'
  },
  {
    id: 'q48',
    question: 'Bản chất của Quân đội Nhân dân Việt Nam là gì?',
    options: ['Quân đội nhà nước', 'Quân đội của Đảng', 'Quân đội của nhân dân', 'Quân đội đánh thuê'],
    correct: 2,
    explanation: 'Quân đội từ nhân dân mà ra, vì nhân dân mà chiến đấu'
  },
  {
    id: 'q49',
    question: 'Nhà nước Việt Nam Dân chủ Cộng hòa được thành lập vào ngày nào?',
    options: ['19/8/1945', '2/9/1945', '3/2/1930', '7/5/1954'],
    correct: 1,
    explanation: 'Ngày 2/9/1945, nước Việt Nam Dân chủ Cộng hòa ra đời'
  },
  {
    id: 'q50',
    question: 'Mặt trận Việt Minh được thành lập vào năm nào?',
    options: ['1930', '1935', '1941', '1945'],
    correct: 2,
    explanation: 'Việt Minh thành lập năm 1941'
  }
  ],

  // Stage 3: Memory game - find matching images, randomly selected from data
  stage3: [
    {
      id: 'mem1',
      imageUrl: 'https://hcmue.edu.vn/images/PhongBan/CTCT/MY_CONGTACGIADUCTUTUONG/2024/THANG6/4.HCM/1-chnh.png',
      title: 'Chân dung lịch sử 1'
    },
    {
      id: 'mem2',
      imageUrl: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/hinh-anh-bac-ho-ra-di-tim-duong-cuu-nuoc-inkythuatso-04-10-49-49.jpg',
      title: 'Di tích 1'
    },
    {
      id: 'mem3',
      imageUrl: 'https://luatduonggia.vn/wp-content/uploads/2024/07/nguon-goc-co-so-va-qua-trinh-hinh-thanh-tu-tuong-ho-chi-minh.png',
      title: 'Cách mạng 1'
    },
    {
      id: 'mem4',
      imageUrl: 'https://images.hcmcpv.org.vn/res/news/2024/01/21-01-2024-nhan-thuc-sau-sac-tu-tuong-ho-chi-minh-cung-la-mot-cach-phong-ngua-su-suy-thoai--1CCFB382.jpg',
      title: 'Chân dung lịch sử 2'
    },
    {
      id: 'mem5',
      imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/24/1/29/tc_65b7bdb6291bb.jpg',
      title: 'Di tích 2'
    },
    {
      id: 'mem6',
      imageUrl: 'https://www.tapchicongsan.org.vn/documents/20182/387375801/Bo+truong+Phan+Van+Giang+kiem+tra+chien+si+2.jpg/bafc9e2e-5bfb-487f-a092-bade5decceb4?t=1720336171135',
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
