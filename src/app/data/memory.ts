// 记忆类目
export const memoryCategories = [
  { id: "identity", name: "身份信息" },
  { id: "health", name: "健康状况" },
  { id: "lifestyle", name: "生活习惯" },
  { id: "goals", name: "养生目标" },
  { id: "emotion", name: "情绪状态" },
  { id: "relationships", name: "亲友情况" },
  { id: "preference", name: "交流偏好" },
  { id: "hobbies", name: "兴趣爱好" },
  { id: "other", name: "其他" }
] as const;

export type MemoryCategoryId = typeof memoryCategories[number]["id"];

export interface Memory {
  id: string;
  category: MemoryCategoryId;
  content: string;
  createdAt: string; // 显示文本
  timestamp: number; // 用于排序
}

// 辅助函数：将时间戳转换为显示文本
export function formatMemoryTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) {
    if (hours < 1) return "刚刚";
    return `${hours}小时前`;
  }
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days === 2) return "前天";
  if (days < 7) return `${days}天前`;

  const date = new Date(timestamp);
  const thisYear = new Date().getFullYear();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (year === thisYear) {
    return `${month}-${day}`;
  }
  return `${year}-${month}-${day}`;
}

// Mock数据
const now = Date.now();
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * oneHour;

export const mockMemories: Memory[] = [
  // 身份信息
  {
    id: "m1",
    category: "identity",
    content: "用户现在住在上海，\n平时一个人生活。",
    createdAt: "昨天",
    timestamp: now - oneDay
  },
  {
    id: "m2",
    category: "identity",
    content: "用户更喜欢别人叫她王阿姨。",
    createdAt: "03-18",
    timestamp: now - 20 * oneDay
  },
  {
    id: "m3",
    category: "identity",
    content: "用户女儿在杭州工作，\n平时会经常联系。",
    createdAt: "2024-12-03",
    timestamp: now - 97 * oneDay
  },

  // 健康状况
  {
    id: "m4",
    category: "health",
    content: "用户最近经常提到胃胀的问题，\n尤其是在晚饭之后更明显。",
    createdAt: "今天",
    timestamp: now - 2 * oneHour
  },
  {
    id: "m5",
    category: "health",
    content: "用户说这几天睡眠不太好，\n夜里容易醒。",
    createdAt: "前天",
    timestamp: now - 2 * oneDay
  },
  {
    id: "m6",
    category: "health",
    content: "用户有轻度高血压，\n平时比较关注血压变化。",
    createdAt: "03-09",
    timestamp: now - 29 * oneDay
  },
  {
    id: "m7",
    category: "health",
    content: "用户提到膝盖偶尔会酸，\n上下楼时会更明显。",
    createdAt: "03-15",
    timestamp: now - 23 * oneDay
  },
  {
    id: "m8",
    category: "health",
    content: "用户之前说过胃不太好，\n平时会尽量少吃生冷食物。",
    createdAt: "2024-12-21",
    timestamp: now - 78 * oneDay
  },

  // 生活习惯
  {
    id: "m9",
    category: "lifestyle",
    content: "用户每天早上六点左右起床，\n喜欢出去散步。",
    createdAt: "今天",
    timestamp: now - 3 * oneHour
  },
  {
    id: "m10",
    category: "lifestyle",
    content: "用户晚上经常看电视到十一点以后。",
    createdAt: "昨天",
    timestamp: now - oneDay - 5 * oneHour
  },
  {
    id: "m11",
    category: "lifestyle",
    content: "用户平时喜欢喝热茶，\n吃饭口味偏清淡。",
    createdAt: "03-05",
    timestamp: now - 33 * oneDay
  },

  // 养生目标
  {
    id: "m12",
    category: "goals",
    content: "用户最近想通过饮食调理改善睡眠。",
    createdAt: "昨天",
    timestamp: now - oneDay - 2 * oneHour
  },
  {
    id: "m13",
    category: "goals",
    content: "用户希望把血压控制得更稳定一些。",
    createdAt: "3天前",
    timestamp: now - 3 * oneDay
  },
  {
    id: "m14",
    category: "goals",
    content: "用户最近开始更关注脾胃调理。",
    createdAt: "03-01",
    timestamp: now - 37 * oneDay
  },

  // 情绪状态
  {
    id: "m15",
    category: "emotion",
    content: "用户最近有时候会觉得有点孤单，\n晚上更想找人聊聊天。",
    createdAt: "今天",
    timestamp: now - 4 * oneHour
  },
  {
    id: "m16",
    category: "emotion",
    content: "最近天气变化时，\n用户更容易觉得心情烦躁。",
    createdAt: "昨天",
    timestamp: now - oneDay - 3 * oneHour
  },
  {
    id: "m17",
    category: "emotion",
    content: "用户提到最近有点担心自己的睡眠问题。",
    createdAt: "03-11",
    timestamp: now - 27 * oneDay
  },

  // 亲友情况
  {
    id: "m18",
    category: "relationships",
    content: "用户和女儿联系比较频繁，\n女儿经常提醒她注意身体。",
    createdAt: "昨天",
    timestamp: now - oneDay - 4 * oneHour
  },
  {
    id: "m19",
    category: "relationships",
    content: "用户平时会和小区里的老朋友一起散步聊天。",
    createdAt: "03-16",
    timestamp: now - 22 * oneDay
  },
  {
    id: "m20",
    category: "relationships",
    content: "用户提到老伴去世后，\n平时大多数时间是自己生活。",
    createdAt: "2024-10-28",
    timestamp: now - 132 * oneDay
  },

  // 交流偏好
  {
    id: "m21",
    category: "preference",
    content: "用户更喜欢简单直接的建议，\n不太喜欢太复杂的表达。",
    createdAt: "今天",
    timestamp: now - 5 * oneHour
  },
  {
    id: "m22",
    category: "preference",
    content: "用户聊天时更喜欢慢慢说，\n不喜欢太长的回复。",
    createdAt: "前天",
    timestamp: now - 2 * oneDay - 3 * oneHour
  },
  {
    id: "m23",
    category: "preference",
    content: "用户更接受食疗和日常调理类建议。",
    createdAt: "03-07",
    timestamp: now - 31 * oneDay
  },

  // 兴趣爱好
  {
    id: "m24",
    category: "hobbies",
    content: "用户平时喜欢养花，\n阳台上种了很多植物。",
    createdAt: "昨天",
    timestamp: now - oneDay - 6 * oneHour
  },
  {
    id: "m25",
    category: "hobbies",
    content: "用户喜欢听京剧，\n有时候会在手机上听戏曲节目。",
    createdAt: "03-12",
    timestamp: now - 26 * oneDay
  },
  {
    id: "m26",
    category: "hobbies",
    content: "用户平时喜欢早上散步，\n也喜欢看看传统养生内容。",
    createdAt: "2024-11-15",
    timestamp: now - 114 * oneDay
  }
];