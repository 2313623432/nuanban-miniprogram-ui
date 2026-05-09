export interface Expert {
  id: string;
  name: string;
  gender: string;
  dialect: string;
  avatar: string;
  description: string;
  personality: string[];
  expertise: string[];
  sampleQuestions: string[];
}

export const experts: Expert[] = [
  {
    id: "1",
    name: "李医生",
    gender: "男",
    dialect: "普通话",
    avatar: "https://images.unsplash.com/photo-1616139041180-d93f6a89cc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbWlkZGxlJTIwYWdlZCUyMHBhbGUlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njg4Mjg4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "专注糖尿病综合治疗，温和耐心",
    personality: ["专业", "耐心", "温和"],
    expertise: ["病理知识", "综合治疗", "用药指导", "并发症预防"],
    sampleQuestions: [
      "血糖高了怎么办？",
      "药该怎么吃？",
      "有哪些并发症需要注意？"
    ]
  },
  {
    id: "2",
    name: "王大夫",
    gender: "女",
    dialect: "河南话",
    avatar: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1pZGRsZSUyMGFnZWQlMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2ODgyODg0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "中医调理专家，亲切幽默",
    personality: ["开朗", "幽默", "亲切"],
    expertise: ["中医调理", "食疗养生", "经络穴位", "体质辨识"],
    sampleQuestions: [
      "中医咋调理糖尿病？",
      "有啥食疗方子？",
      "按摩哪些穴位好？"
    ]
  },
  {
    id: "3",
    name: "张营养师",
    gender: "女",
    dialect: "四川话",
    avatar: "https://images.unsplash.com/photo-1765248149444-3d01d93f93e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbWlkZGxlJTIwYWdlZCUyMGZlbWFsZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODgyODg0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "饮食营养专家，细心体贴",
    personality: ["细心", "体贴", "专业"],
    expertise: ["营养搭配", "饮食计划", "热量控制", "血糖管理"],
    sampleQuestions: [
      "每天吃啥子好？",
      "水果能不能吃？",
      "咋个控制饮食热量？"
    ]
  },
  {
    id: "4",
    name: "刘教练",
    gender: "男",
    dialect: "长沙话",
    avatar: "https://images.unsplash.com/photo-1767499912056-8f9bf8bad682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1pZGRsZSUyMGFnZWQlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODgyODg0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "运动康复专家，活力满满",
    personality: ["活力", "鼓励", "专业"],
    expertise: ["运动指导", "康复训练", "体能评估", "运动安全"],
    sampleQuestions: [
      "咋个运动最合适？",
      "走路要走多久？",
      "哪些运动不能做？"
    ]
  },
  {
    id: "5",
    name: "陈心理师",
    gender: "女",
    dialect: "普通话",
    avatar: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3Njg4Mjg4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "心理健康专家，温暖治愈",
    personality: ["温暖", "治愈", "善倾听"],
    expertise: ["心理疏导", "情绪管理", "压力缓解", "家庭支持"],
    sampleQuestions: [
      "心情不好怎么办？",
      "怎么调节情绪？",
      "家人不理解我怎么办？"
    ]
  }
];

export const memories = [
  {
    id: "1",
    type: "饮食偏好",
    content: "爱吃面食",
    source: "1月12日与河南话专家",
    enabled: true
  },
  {
    id: "2",
    type: "运动习惯",
    content: "饭后散步30分钟",
    source: "1月10日与刘教练",
    enabled: true
  },
  {
    id: "3",
    type: "用药记录",
    content: "每日早晚各一次二甲双胍",
    source: "1月8日与李医生",
    enabled: true
  }
];

export const bookInfo = {
  title: "葱、姜、蒜、酒、茶、醋治百病",
  cover: "https://images.unsplash.com/photo-1592093238602-9eaac81a9d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBmb29kJTIwaW5ncmVkaWVudHMlMjBnaW5nZXIlMjBnYXJsaWN8ZW58MXx8fHwxNzY5Njc0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  description: "深度解析常见食材的药用价值，教你用厨房里的食材治疗常见疾病",
  status: "已入库 ✅",
  chapters: [
    { id: "1", title: "第一章：葱的神奇功效", pages: "1-28" },
    { id: "2", title: "第二章：姜的养生妙用", pages: "29-56" },
    { id: "3", title: "第三章：蒜的治病良方", pages: "57-85" },
    { id: "4", title: "第四章：药酒配方与应用", pages: "86-118" },
    { id: "5", title: "第五章：茶疗养生宝典", pages: "119-152" },
    { id: "6", title: "第六章：醋的保健作用", pages: "153-180" },
    { id: "7", title: "第七章：综合调理方案", pages: "181-208" },
    { id: "8", title: "第八章：常见病症食疗", pages: "209-240" }
  ]
};

export const savedContent = [
  {
    id: "1",
    type: "image",
    title: "食疗养生食材搭配",
    content: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
    note: "记得多用葱姜蒜",
    date: "2025-01-14"
  },
  {
    id: "2",
    type: "video",
    title: "中医食疗养生操",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    duration: "5:32",
    note: "每天照着做",
    date: "2025-01-13"
  },
  {
    id: "3",
    type: "qa",
    question: "血糖高了怎么办？",
    answer: "首先不要慌张，先检查是否按时服药...",
    source: "来自《葱、姜、蒜、酒、茶、醋治百病》p.45",
    date: "2025-01-12"
  }
];

export const recentBooks = [
  {
    id: "1",
    title: "葱、姜、蒜、酒、茶、醋治百病",
    cover: "https://images.unsplash.com/photo-1592093238602-9eaac81a9d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBmb29kJTIwaW5ncmVkaWVudHMlMjBnaW5nZXIlMjBnYXJsaWN8ZW58MXx8fHwxNzY5Njc0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    expertId: "2",
    expertName: "王大夫",
    expertIds: ["2", "3", "1"], // 对应的专家IDs
    progress: 45,
    lastRead: "今天 14:32"
  },
  {
    id: "2",
    title: "吃出自愈力",
    cover: "https://images.unsplash.com/photo-1610851296465-9c5a6f8752f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMG51dHJpdGlvbiUyMGhlYWxpbmd8ZW58MXx8fHwxNzY5Njc0Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    expertId: "3",
    expertName: "张营养师",
    expertIds: ["3", "2", "1"], // 对应的专家IDs
    progress: 62,
    lastRead: "昨天"
  },
  {
    id: "3",
    title: "百病食疗",
    cover: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwZm9vZCUyMHRoZXJhcHklMjB2ZWdldGFibGVzfGVufDF8fHx8MTc2OTY3NDM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    expertId: "2",
    expertName: "王大夫",
    expertIds: ["2", "3", "1"], // 对应的专家IDs
    progress: 28,
    lastRead: "1月27日"
  }
];