// 广告关键词白名单和商品映射配置
interface AdKeyword {
  keyword: string;
  productIds: string[];
  priority: number;
}

interface Product {
  id: string;
  spu: string;
  name: string;
  description: string;
  imageUrl: string;
  points: number;
  stock: number;
  status: 'active' | 'inactive';
}

// 模拟关键词映射库（实际应该从后台获取）
const KEYWORD_MAPPING: AdKeyword[] = [
  { keyword: '血糖', productIds: ['prod_001', 'prod_002'], priority: 10 },
  { keyword: '糖尿病', productIds: ['prod_001', 'prod_002'], priority: 10 },
  { keyword: '控糖', productIds: ['prod_001'], priority: 9 },
  { keyword: '血压', productIds: ['prod_003', 'prod_004'], priority: 8 },
  { keyword: '高血压', productIds: ['prod_003'], priority: 8 },
  { keyword: '降压', productIds: ['prod_003', 'prod_004'], priority: 8 },
  { keyword: '睡眠', productIds: ['prod_005'], priority: 7 },
  { keyword: '失眠', productIds: ['prod_005'], priority: 7 },
  { keyword: '安神', productIds: ['prod_005'], priority: 7 },
  { keyword: '运动', productIds: ['prod_006'], priority: 6 },
  { keyword: '锻炼', productIds: ['prod_006'], priority: 6 },
  { keyword: '饮食', productIds: ['prod_007'], priority: 5 },
  { keyword: '营养', productIds: ['prod_007'], priority: 5 },
  { keyword: '食谱', productIds: ['prod_007'], priority: 5 },
  { keyword: '养生', productIds: ['prod_007'], priority: 5 },
  { keyword: '健康', productIds: ['prod_006', 'prod_007'], priority: 4 },
  { keyword: '中医', productIds: ['prod_002', 'prod_004'], priority: 4 },
  { keyword: '调理', productIds: ['prod_002', 'prod_005'], priority: 4 },
];

// 模拟商品库（实际应该从后台获取）
const PRODUCTS: Record<string, Product> = {
  'prod_001': {
    id: 'prod_001',
    spu: 'spu_blood_sugar_monitor',
    name: '智能血糖仪',
    description: '无痛采血，快速测量，专为糖尿病患者设计',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e3f2fd"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E🩸%3C/text%3E%3C/svg%3E',
    points: 500,
    stock: 100,
    status: 'active'
  },
  'prod_002': {
    id: 'prod_002',
    spu: 'spu_sugar_control_tea',
    name: '控糖养生茶',
    description: '天然草本配方，辅助控制血糖水平',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f1f8e9"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E🍵%3C/text%3E%3C/svg%3E',
    points: 300,
    stock: 50,
    status: 'active'
  },
  'prod_003': {
    id: 'prod_003',
    spu: 'spu_blood_pressure_monitor',
    name: '电子血压计',
    description: '家用便携式，医疗级精准测量',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23fce4ec"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E💉%3C/text%3E%3C/svg%3E',
    points: 450,
    stock: 80,
    status: 'active'
  },
  'prod_004': {
    id: 'prod_004',
    spu: 'spu_pressure_control_pill',
    name: '降压保健品',
    description: '天然植物提取，科学辅助降压',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23fff3e0"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E💊%3C/text%3E%3C/svg%3E',
    points: 350,
    stock: 60,
    status: 'active'
  },
  'prod_005': {
    id: 'prod_005',
    spu: 'spu_sleep_aid',
    name: '助眠香薰套装',
    description: '天然植物精油，舒缓压力改善睡眠',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e8eaf6"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E😴%3C/text%3E%3C/svg%3E',
    points: 200,
    stock: 120,
    status: 'active'
  },
  'prod_006': {
    id: 'prod_006',
    spu: 'spu_fitness_band',
    name: '智能运动手环',
    description: '实时心率监测，科学运动管理',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e0f2f1"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E⌚%3C/text%3E%3C/svg%3E',
    points: 800,
    stock: 30,
    status: 'active'
  },
  'prod_007': {
    id: 'prod_007',
    spu: 'spu_nutrition_powder',
    name: '营养代餐粉',
    description: '均衡营养配方，健康饮食管理',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23fff9c4"/%3E%3Ctext x="50%25" y="50%25" font-size="32" text-anchor="middle" dy=".3em"%3E🥤%3C/text%3E%3C/svg%3E',
    points: 250,
    stock: 90,
    status: 'active'
  },
};

// 获取今日日期字符串
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// 检查是否达到单日展示限制
export const checkDailyAdLimit = (): boolean => {
  try {
    const adStatsJson = localStorage.getItem('dailyAdStats');
    if (!adStatsJson) return false;

    const adStats = JSON.parse(adStatsJson);
    const today = getTodayDateString();

    if (adStats.date !== today) {
      // 不是今天的数据，重置
      return false;
    }

    // 单日最多展示10次（增加限制以便演示）
    return adStats.showCount >= 10;
  } catch {
    return false;
  }
};

// 记录广告展示
export const recordAdShow = () => {
  try {
    const today = getTodayDateString();
    const adStatsJson = localStorage.getItem('dailyAdStats');
    let adStats = adStatsJson ? JSON.parse(adStatsJson) : null;

    if (!adStats || adStats.date !== today) {
      adStats = { date: today, showCount: 0 };
    }

    adStats.showCount += 1;
    localStorage.setItem('dailyAdStats', JSON.stringify(adStats));
  } catch (error) {
    console.error('Failed to record ad show:', error);
  }
};

// 检查商品是否已购买且在7天内
export const isProductRecentlyPurchased = (spu: string): boolean => {
  try {
    const purchasedJson = localStorage.getItem('purchasedProducts');
    if (!purchasedJson) return false;

    const purchased = JSON.parse(purchasedJson);
    const productPurchase = purchased[spu];

    if (!productPurchase) return false;

    // 检查是否在7天内购买
    const purchaseTime = new Date(productPurchase.purchaseDate).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return (now - purchaseTime) < sevenDays;
  } catch {
    return false;
  }
};

// 检查商品是否被标记为不感兴趣且在30天内
export const isProductNotInterested = (spu: string): boolean => {
  try {
    const notInterestedJson = localStorage.getItem('notInterestedProducts');
    if (!notInterestedJson) return false;

    const notInterested = JSON.parse(notInterestedJson);
    const productFeedback = notInterested[spu];

    if (!productFeedback) return false;

    // 检查是否在30天内
    const feedbackTime = new Date(productFeedback.feedbackDate).getTime();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return (now - feedbackTime) < thirtyDays;
  } catch {
    return false;
  }
};

// 标记商品为不感兴趣
export const markProductNotInterested = (spu: string) => {
  try {
    const notInterestedJson = localStorage.getItem('notInterestedProducts');
    const notInterested = notInterestedJson ? JSON.parse(notInterestedJson) : {};

    notInterested[spu] = {
      spu,
      feedbackDate: new Date().toISOString()
    };

    localStorage.setItem('notInterestedProducts', JSON.stringify(notInterested));
  } catch (error) {
    console.error('Failed to mark product as not interested:', error);
  }
};

// 检查SPU是否在当前会话中已展示
export const isSpuShownInSession = (spu: string, sessionShownSpus: Set<string>): boolean => {
  return sessionShownSpus.has(spu);
};

// 匹配AI回答中的关键词并返回推荐商品
export const matchProductFromAnswer = (
  answerText: string,
  sessionShownSpus: Set<string>
): Product | null => {
  // 1. 检查单日限制
  if (checkDailyAdLimit()) {
    return null;
  }

  // 2. 扫描关键词
  const matchedKeywords: { keyword: AdKeyword; index: number }[] = [];

  for (const keywordConfig of KEYWORD_MAPPING) {
    const index = answerText.indexOf(keywordConfig.keyword);
    if (index !== -1) {
      matchedKeywords.push({ keyword: keywordConfig, index });
    }
  }

  if (matchedKeywords.length === 0) {
    return null;
  }

  // 3. 按优先级排序（优先级高的在前，同优先级按出现位置排序）
  matchedKeywords.sort((a, b) => {
    if (a.keyword.priority !== b.keyword.priority) {
      return b.keyword.priority - a.keyword.priority;
    }
    return a.index - b.index;
  });

  // 4. 按优先级遍历，找到第一个可用商品
  for (const { keyword } of matchedKeywords) {
    for (const productId of keyword.productIds) {
      const product = PRODUCTS[productId];

      if (!product) continue;

      // 检查商品状态
      if (product.status !== 'active' || product.stock <= 0) {
        continue;
      }

      // 检查去重规则
      if (isSpuShownInSession(product.spu, sessionShownSpus)) {
        continue; // 本轮对话已展示过此SPU
      }

      if (isProductRecentlyPurchased(product.spu)) {
        continue; // 7天内已购买
      }

      if (isProductNotInterested(product.spu)) {
        continue; // 30天内标记为不感兴趣
      }

      // 找到可用商品
      return product;
    }
  }

  return null;
};
