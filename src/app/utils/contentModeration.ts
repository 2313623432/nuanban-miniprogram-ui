/**
 * 敏感词检测工具
 * 用于检测用户发布内容是否包含违规信息
 */

// 敏感词库
const sensitiveWords = {
  // 违反宪法基本原则
  constitutional: [
    '颠覆国家政权',
    '推翻社会主义制度',
    '分裂国家',
    '破坏国家统一',
    '违宪',
    '反宪法'
  ],
  
  // 危害国家安全、泄露国家秘密
  nationalSecurity: [
    '国家机密',
    '军事机密',
    '泄密',
    '间谍',
    '窃取情报',
    '危害国家安全'
  ],
  
  // 煽动民族仇恨或民族歧视
  ethnicHatred: [
    '民族仇恨',
    '民族歧视',
    '种族歧视',
    '煽动民族对立',
    '民族分裂'
  ],
  
  // 破坏社会稳定
  socialStability: [
    '暴乱',
    '骚乱',
    '煽动闹事',
    '群体性事件',
    '非法集会',
    '非法游行',
    '破坏社会秩序'
  ],
  
  // 宣扬邪教或迷信
  cultSuperstition: [
    '邪教',
    '法轮功',
    '全能神',
    '门徒会',
    '血水圣灵',
    '观音法门',
    '封建迷信'
  ],
  
  // 违法犯罪行为
  criminal: [
    '贩毒',
    '走私',
    '贩卖人口',
    '绑架',
    '非法持枪',
    '制造爆炸物',
    '恐怖袭击',
    '杀人',
    '抢劫',
    '强奸',
    '拐卖',
    '贩卖枪支',
    '制毒',
    '洗钱',
    '非法集资',
    '传销'
  ],
  
  // 赌博、毒品、诈骗
  gamblingDrugsFraud: [
    '赌博',
    '开设赌场',
    '网络赌博',
    '赌场',
    '赌球',
    '澳门赌',
    '网赌',
    '毒品',
    '海洛因',
    '冰毒',
    '大麻',
    '可卡因',
    '摇头丸',
    'K粉',
    '吸毒',
    '贩毒',
    '诈骗',
    '电信诈骗',
    '网络诈骗',
    '金融诈骗',
    '刷单诈骗',
    '杀猪盘',
    '裸聊',
    '博彩'
  ]
};

/**
 * 检测文本是否包含敏感词
 * @param text 要检测的文本
 * @returns 是否包含敏感词
 */
export function containsSensitiveWords(text: string): boolean {
  if (!text) return false;
  
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');
  
  // 遍历所有分类的敏感词
  for (const category of Object.values(sensitiveWords)) {
    for (const word of category) {
      const normalizedWord = word.toLowerCase().replace(/\s+/g, '');
      if (normalizedText.includes(normalizedWord)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * 检测文本是否包含敏感词，并返回匹配到的敏感词
 * @param text 要检测的文本
 * @returns 匹配到的敏感词数组
 */
export function detectSensitiveWords(text: string): string[] {
  if (!text) return [];
  
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');
  const matchedWords: string[] = [];
  
  // 遍历所有分类的敏感词
  for (const category of Object.values(sensitiveWords)) {
    for (const word of category) {
      const normalizedWord = word.toLowerCase().replace(/\s+/g, '');
      if (normalizedText.includes(normalizedWord)) {
        matchedWords.push(word);
      }
    }
  }
  
  return matchedWords;
}
