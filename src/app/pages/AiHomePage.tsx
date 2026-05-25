import { TabBar } from "@/app/components/layout/TabBar";
import { useNavigate, useLocation } from "react-router";
import bannerImage from "figma:asset/415a03bf2cc290efa42b5a4ad62863e6498660d1.png";
import xiaoNuanAvatar from "figma:asset/0920eea3eda0373cd901e9b3b15d14e3d2555646.png";
import wechatLogo from "figma:asset/667e7fc3b19f62b1d1f1468a589d3d89f9fb3443.png";
import { ImagePlus, Mic, Send, Crown, X, Camera, Volume2, ThumbsUp, ThumbsDown, Copy, Pause, Loader, MessageCircle, Check, Keyboard, Share2, Image, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MembershipModal } from "@/app/components/MembershipModal";
import { ShareImagePreview } from "@/app/components/ShareImagePreview";
import { ShareCardPreview } from "@/app/components/ShareCardPreview";
import { useMembership } from "@/app/contexts/MembershipContext";
import { usePlan } from "@/app/contexts/PlanContext";
import { toast } from "sonner";
import { AIAdviceCard } from "@/app/components/AIAdviceCard";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  isLocked?: boolean;
  imageUrl?: string;
  liked?: boolean;
  disliked?: boolean;
  isCallLabel?: boolean; // 标记是否为通话标注
  isAdviceCard?: boolean; // 标记是否为AI建议卡片
  adviceData?: {
    serviceName: string;
    analysis: string;
    plan: string;
  };
}

export function AiHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMember, memberExpiryDate, activateMembership } = useMembership();
  const { setPlanData } = usePlan();
  const [inputText, setInputText] = useState("");
  const [chatInputText, setChatInputText] = useState(""); // 聊天模态框中的输入文本
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice"); // 默认语音输入
  const [freeUnlockCount, setFreeUnlockCount] = useState(0); // 免费解锁次数
  const [currentPage, setCurrentPage] = useState(0); // 首页滑动页码
  const [unlockedMessages, setUnlockedMessages] = useState<Set<string>>(new Set()); // 已解锁的消息ID
  const [selectedPlan, setSelectedPlan] = useState<"single-month" | "single-year">("single-year"); // 默认选中按年付费
  const [forwardMode, setForwardMode] = useState(false); // 转发模式
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set()); // 选中的消息ID（成对）
  const [showShareSheet, setShowShareSheet] = useState(false); // 显示分享面板
  const [showShareImagePreview, setShowShareImagePreview] = useState(false); // 显示分享图片预览
  const [showShareCardPreview, setShowShareCardPreview] = useState(false); // 显示分享卡片预览

  // 问诊状态追踪
  const [diagnosisStep, setDiagnosisStep] = useState<'ask_problem' | 'ask_disease' | 'generate_plan' | 'confirm_plan' | 'completed'>('ask_problem');
  const [userProblem, setUserProblem] = useState<string>(''); // 用户想调理的问题
  const [userDisease, setUserDisease] = useState<string>(''); // 用户的基础病
  const [generatedPlan, setGeneratedPlan] = useState<string>(''); // 生成的计划

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // 检查是否从语音通话返回或从计划页打开诊断
  useEffect(() => {
    const state = location.state as any;

    // 从计划页打开诊断
    if (state?.openDiagnosis && state?.serviceTitle) {
      const service = services.find(s => s.title === state.serviceTitle);
      if (service) {
        setSelectedService(service.title);

        // 重置问诊状态
        setDiagnosisStep('ask_problem');
        setUserProblem('');
        setUserDisease('');
        setGeneratedPlan('');

        // 打开AI对话，显示第一个问题
        const aiGreeting: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: "您好！我是您的健康管理专家 🌿\n\n为了给您制定最合适的养生计划，请先告诉我：\n\n您主要想调理什么问题呢？\n例如：睡眠不好、血压偏高、消化不良、容易疲劳等"
        };
        setMessages([aiGreeting]);
        setShowChatModal(true);
      }

      // 清除location state，避免重复加载
      window.history.replaceState({}, document.title);
      return;
    }

    // 从语音通话返回
    if (state?.returnToChatModal && state?.voiceMessages && state?.isVoiceEnded) {
      // 从语音通话返回，加载语音消息到聊天模态框
      const voiceMessages = state.voiceMessages;

      // 转换语音消息为聊天消息格式，并添加开始/结束通话标注
      const convertedMessages: Message[] = [];

      // 添加"开始通话"标注
      convertedMessages.push({
        id: `call-start-${Date.now()}`,
        type: "ai",
        content: "📞 开始通话",
        isCallLabel: true
      } as Message & { isCallLabel?: boolean });

      // 添加语音对话消息
      voiceMessages.forEach((vm: any) => {
        convertedMessages.push({
          id: vm.id,
          type: vm.type === "ai" ? "ai" : "user",
          content: vm.content
        });
      });

      // 添加"结束通话"标注
      convertedMessages.push({
        id: `call-end-${Date.now()}`,
        type: "ai",
        content: "📞 结束通话",
        isCallLabel: true
      } as Message & { isCallLabel?: boolean });

      setMessages(convertedMessages);
      setShowChatModal(true);

      // 清除location state，避免重复加载
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // ── 第一页：小暖帮您（原有功能）─────────────────
  const services = [
    // 问一问 — AI对话调理
    { id: 1, title: "降压疗法", subtitle: "平稳守护血压", icon: "❤️", bgColor: "bg-red-50",    buttonLabel: "去定制", hasAi: true,  section: "ask" as const, aiPrompt: "请告诉我您的血压情况、年龄和饮食习惯，我会为您推荐科学的降压方案。" },
    { id: 2, title: "失眠疗法", subtitle: "守护深度睡眠", icon: "🌙", bgColor: "bg-blue-50",   buttonLabel: "去定制", hasAi: true,  section: "ask" as const, aiPrompt: "请告诉我您失眠或焦虑的具体情况、持续时间和主要症状，我会为您推荐改善方案。" },
    { id: 3, title: "防癌指南", subtitle: "避开致癌陷阱", icon: "🛡️", bgColor: "bg-gray-50",  buttonLabel: "去定制", hasAi: true,  section: "ask" as const, aiPrompt: "请告诉我您的年龄、家族病史和日常饮食习惯，我会为您定制科学的防癌饮食方案。" },
    { id: 4, title: "养生食谱", subtitle: "药食同源秘方", icon: "🍲", bgColor: "bg-orange-50", buttonLabel: "去定制", hasAi: true,  section: "ask" as const, aiPrompt: "请告诉我您的体质特点、年龄、有什么健康问题，我会为您定制专属的养生食谱。" },
    // 看一看 — 拍照直接进入相机
    { id: 5, title: "手掌健康", subtitle: "拍掌纹知健康", icon: "🤚", bgColor: "bg-orange-50", buttonLabel: "去体验", hasAi: false, section: "look" as const },
    { id: 6, title: "舌苔诊断", subtitle: "细看体质寒热", icon: "👅", bgColor: "bg-yellow-50", buttonLabel: "去体验", hasAi: false, section: "look" as const },
    { id: 7, title: "饮食诊断", subtitle: "辨食物调身体", icon: "🥗", bgColor: "bg-green-50",  buttonLabel: "去体验", hasAi: false, section: "look" as const },
    { id: 8, title: "风水测评", subtitle: "测评家居风水", icon: "☯️", bgColor: "bg-purple-50", buttonLabel: "去体验", hasAi: false, section: "look" as const },
  ];

  // ── 第二页：看一看 + 问一问（新功能）─────────────
  const newServices = [
    // 看一看（第一位是报告解读）
    { id: 101, title: "报告解读", icon: "📋", bgColor: "bg-blue-50",    buttonLabel: "去体验", section: "look" as const, aiPrompt: "请上传您的体检报告照片，我会帮您解读异常指标，给出饮食和生活方式建议。" },
    { id: 102, title: "面色诊断", icon: "😊", bgColor: "bg-pink-50",   buttonLabel: "去体验", section: "look" as const, aiPrompt: "请上传一张光线充足的正脸照片，我会分析您的面色、眼袋、唇色等特征，给出气血和脾胃调理建议。" },
    { id: 103, title: "脱发检测", icon: "💇", bgColor: "bg-purple-50", buttonLabel: "去体验", section: "look" as const, aiPrompt: "请上传头顶、发际线的清晰照片，我会结合中医理论分析您的脱发类型和调理方向。" },
    { id: 104, title: "指甲检测", icon: "✋", bgColor: "bg-yellow-50", buttonLabel: "去体验", section: "look" as const, aiPrompt: "请上传双手手指和指甲的清晰照片，我会分析指甲颜色、竖纹、月牙等特征，提示营养和健康关注点。" },
    // 问一问
    { id: 105, title: "血压调理", icon: "❤️", bgColor: "bg-red-50",    buttonLabel: "去定制", section: "ask" as const, aiPrompt: "请告诉我您的性别、年龄、平时的血压数值和是否在吃药，我会为您定制科学的降压调理方案。" },
    { id: 106, title: "肥胖评估", icon: "⚖️", bgColor: "bg-green-50",  buttonLabel: "去定制", section: "ask" as const, aiPrompt: "请告诉我您的身高、体重、腰围和平时活动量，我会为您评估身体状况并给出科学的体重管理建议。" },
    { id: 107, title: "肝脏调理", icon: "🫁", bgColor: "bg-orange-50", buttonLabel: "去定制", section: "ask" as const, aiPrompt: "请告诉我您的具体不适症状、是否有确诊的肝脏疾病和其他基础病，我会为您定制肝脏调理方案。" },
    { id: 108, title: "肠胃调养", icon: "🍵", bgColor: "bg-teal-50",   buttonLabel: "去定制", section: "ask" as const, aiPrompt: "请告诉我您具体有哪些肠胃不适症状，平时是否喜欢喝茶，我会为您推荐适合的茶饮和调理方法。" },
  ];
  
  const handleServiceClick = (service: typeof services[0] | typeof newServices[0]) => {
    setSelectedService(service.title);

    // 判断是否为新版"问一问"类型
    if ("section" in service && service.section === "ask") {
      setDiagnosisStep('ask_problem');
      setUserProblem('');
      setUserDisease('');
      setGeneratedPlan('');
      const aiGreeting: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `您好！我是您的健康管理专家 🌿\n\n${service.aiPrompt}\n\n请详细告诉我您的情况，我会为您提供专业的调理建议。`
      };
      setMessages([aiGreeting]);
      setShowChatModal(true);
    } else if ("section" in service && service.section === "look") {
      // 看一看类型：直接打开相机拍照
      fileInputRef.current?.click();
    } else if ("hasAi" in service && service.hasAi) {
      // 原有"去定制"类型
      setDiagnosisStep('ask_problem');
      setUserProblem('');
      setUserDisease('');
      setGeneratedPlan('');
      const aiGreeting: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: "您好！我是您的健康管理专家 🌿\n\n为了给您制定最合适的养生计划，请先告诉我：\n\n您主要想调理什么问题呢？\n例如：睡眠不好、血压偏高、消化不良、容易疲劳等"
      };
      setMessages([aiGreeting]);
      setShowChatModal(true);
    } else {
      // 原有"去体验"类型：调取照片选择器
      fileInputRef.current?.click();
    }
  };
  
  const generateAIResponse = (userQuestion: string, serviceTitle: string): string => {
    const responses: Record<string, string> = {
      // ── 原有服务 ──
      "养生食谱": `根据您的情况分析，我为您定制以下养生食谱方案：

【早餐建议】
山药红枣粥：补脾养胃，益气补血
核桃芝麻糊：滋养肝肾，润肠通便
温热豆浆配全麦面包

【午餐建议】
清蒸鲈鱼：富含优质蛋白，易消化
木耳炒山药：降血脂，增强免疫
糙米饭：富含B族维生素
时令蔬菜汤

【晚餐建议】
小米南瓜粥：养胃安神
清炒西花：富含维生素C和膳食纤维
适量豆制品

【日常注意】
每日饮水1500-2000ml
避免生冷油腻食物
三餐定时定量
晚餐不宜过饱，建议7分饱

【参考来源】
[1] 《中医食疗学》(第2版) 中国中医药出版社
[2] 《本草纲目》 人民卫生出版社`,

      "失眠疗法": `根据您的失眠焦虑情况，我为您推荐以下综合调理方案：

【中医分析】
您的症状属于心脾两虚、肝郁气滞型失眠[1]。长期精神紧张导致气血失调。

【调理方案】
一、中药调理
酸枣仁15g：养心安神
茯苓12g：宁心安神
百合15g：清心安神
合欢皮10g：解郁安神

二、穴位按摩[2]
神门穴：每晚睡前按压3-5分钟
内关穴：缓解焦虑情绪
三阴交：改善睡眠质量

三、生活调理
建立规律作息：晚上10点前入睡
睡前1小时避免使用电子设备
睡前温水泡脚15-20分钟

【参考来源】
[1] 《中医内科学》(第10版) 人民卫生出版社
[2] 《针灸学》(第9版) 中国中医药出版社`,

      "舌苔诊断": `【舌象分析】
根据图片，您的舌象呈现以下特征：

舌质：淡红偏白，提示气血不足[1]
舌苔：薄白微腻，显示脾胃虚弱
舌形：舌体略胖，有齿痕，说明脾虚湿重

【中医诊断】
综合舌象判断，目前属于：
1. 脾气虚弱型体质
2. 体内湿气较重
3. 气血运行不畅

【健康建议】
一、饮食调理
宜食：山药、薏米、红豆、茯苓等健脾祛湿食物
忌食：生冷、油腻、甜腻食物

二、生活调理
改善睡眠质量，保证7-8小时睡眠
适量运动，促进气血循环

【参考来源】
[1] 《中医诊断学》(第9版) 中国中医药出版社
[2] 《中医舌诊学》(第2版) 人民卫生出版社`,

      "饮食诊断": `【饮食分析】
根据您上传的图片，我对这份饮食进行以下分析：

食物类型：以碳水化合物和脂肪为主
营养结构：蛋白质摄入不足，蔬菜量偏少
烹饪方式：偏油腻，不利于消化
总体评价：营养不够均衡

【改善建议】
一、调整食物比例[1]
蔬菜：占每餐的1/2
优质蛋白：占1/4（鱼、豆制品、瘦肉）
主食：占1/4（粗粮为主）

二、优化烹饪方式
多采用蒸、煮、炖的方式
少油少盐少糖

【参考来源】
[1] 《中国居民膳食指南》(2022版) 人民卫生出版社`,

      "防癌指南": `【饮食分析】
根据您的年龄、家族病史和日常饮食习惯，我为您定制以下防癌饮食方案：

【早餐建议】
燕麦粥：富含膳食纤维，有助于肠道健康
蔬菜沙拉：提供多种维生素和矿物质
低脂牛奶：补充钙质和蛋白质

【午餐建议】
烤鸡胸肉：低脂肪高蛋白
红薯：富含维生素A和膳食纤维
绿叶蔬菜：提供维生素C和叶酸

【晚餐建议】
煮鱼：富含Omega-3脂肪酸
紫甘蓝沙拉：提供维生素K和抗氧化剂

【日常注意】
每日饮水1500-2000ml
避免高糖高脂肪食物
增加蔬菜水果摄入量

【参考来源】
[1] 《癌症预防与控制》(第3版) 人民卫生出版社`,

      "降压疗法": `根据您的情况，为您定制以下降压方案：

【饮食调理】
芹菜：含有降压成分，可凉拌或榨汁
洋葱：有助于血管扩张
黑木耳：活血化瘀，降低血液粘稠度
香蕉：富含钾元素，有助钠排出
控制盐摄入：每天不超过6g

【运动建议】
适合运动：快走、太极拳、八段锦
运动频率：每周5次，每次30分钟
注意事项：避免清晨空腹剧烈运动

【生活方式】
保持情绪稳定，避免大喜大悲
规律作息，保证充足睡眠
戒烟限酒

【参考来源】
[1] 《学会吃！快速调理高血压》人民卫生出版社
[2] 《心脑血管疾病中医食养方》中国中医药出版社`,

      "手掌健康": `【手诊分析】
根据图片，您的手掌呈现以下特征：

掌色偏红：提示体内有热，需关注心血管
掌纹杂乱：可能长期劳累，睡眠不足
手指末端饱满：气血较充足
大鱼际区域饱满度适中：脾胃功能尚可

【健康提示】
注意情绪管理，避免急躁易怒
定期检查血压和血脂
保持手掌温暖，促进末梢循环

【参考来源】
[1] 《手诊全书》中医古籍出版社
[2] 《实用中医养生速查图典》人民卫生出版社`,

      "风水测评": `【风水分析】
根据您上传的住宅图片，分析如下：

【整体布局】
户型方正，符合传统风水学中理想格局
采光充足，阳气充盈，有利于身心健康
气口通畅，空气流通良好

【重点区域】
客厅：处于房屋中心位置，利于家庭和谐
卧室：远离入户门，私密性好
厨房：保持整洁，定期清理油污

【改善建议】
入户玄关可摆放绿植
客厅可悬挂山水画，寓意靠山有水
卧室宜使用温暖色调

【参考来源】
[1] 《居家风水学》(第4版) 中国建筑工业出版社
[2] 《阳宅风水实用图解》 中国传统文化出版社`,

      // ── 新功能：看一看 ──
      "报告解读": `【报告解读】
根据您上传的体检报告，分析如下：

【主要异常指标】
如有血压偏高：需关注心血管健康
如有血糖异常：注意控制饮食中的糖分摄入
如有血脂偏高：减少饱和脂肪摄入

【饮食建议】
多吃新鲜蔬菜水果，每天至少500g
选择全谷物主食，减少精制碳水
优质蛋白：鱼、豆制品、去皮禽肉
控制盐摄入，每天不超过6g

【生活方式建议】
每周至少150分钟中等强度运动
保持规律作息，充足睡眠
定期复查异常指标，遵医嘱

【特别提醒】
本解读仅供参考，不能替代医生诊断。

【参考来源】
[1] 《始于三餐，血压轻松降》人民卫生出版社
[2] 《食疗心脑血管病真有效》中国中医药出版社`,

      "面色诊断": `【面诊分析】
根据您上传的正脸照片，分析如下：

【整体面色评估】
面色整体偏黄，光泽度不足，提示脾胃功能需关注。

【具体特征分析】
面色暗黄：提示脾胃虚弱，气血生化不足
眼袋明显：可能与肾气不足、水液代谢不畅有关
唇色偏淡：反映气血不足，需补养心脾

【日常调理建议】
一、饮食调理
多吃健脾食物：山药、莲子、红枣、小米
补气血食物：枸杞、桂圆、黑芝麻
避免生冷、油腻、辛辣食物

二、作息调理
保证充足睡眠，晚上11点前入睡
午间小憩15-30分钟

三、按摩保健
每天按揉足三里穴3-5分钟

【参考来源】
[1] 《面诊全书》中医古籍出版社
[2] 《实用中医养生速查图典》人民卫生出版社`,

      "脱发检测": `【头发分析报告】
根据您上传的头发照片，分析如下：

【头发整体状况】
脱发/白发情况属于肝肾亏虚、气血不足型，在中年人群中较为常见。

【脱发类型分析】
头顶区域稀疏：提示肾气不足
发际线后移：可能与血热、精神压力有关
白发增多：肝肾阴虚，精血不能濡养毛发

【中医调理建议】
一、饮食调理
多吃黑色食物：黑芝麻、黑豆、黑米
补肾食物：核桃、枸杞、桑葚、山药
补充优质蛋白：鱼、蛋、豆制品

二、洗护建议
使用温和的草本洗发产品
每周用生姜片按摩头皮2-3次

三、生活调理
保证充足睡眠，减少熬夜
适当运动，促进气血循环

【参考来源】
[1] 《实用中医养生速查图典》人民卫生出版社
[2] 《新编中草药图鉴》人民卫生出版社`,

      "指甲检测": `【指甲分析报告】
根据您上传的指甲照片，分析如下：

【整体健康评估】
指甲反映出一些气血和营养方面的关注点。

【具体特征分析】
指甲颜色偏淡：提示气血不足或贫血倾向
竖纹明显：可能与长期劳累、肝血不足有关
月牙偏小：反映身体能量储备不足
指甲脆裂：提示蛋白质、钙质摄入不足

【日常养护建议】
一、饮食调理
多吃富含铁的食物：红枣、菠菜
补充优质蛋白：蛋、奶、鱼、豆制品
适量坚果：核桃、杏仁

二、习惯调整
避免频繁美甲
做家务时戴手套

三、全面养生
保证充足睡眠，养肝血
定期体检，关注血常规指标

【参考来源】
[1] 《手诊全书》中医古籍出版社
[2] 《实用中医养生速查图典》人民卫生出版社`,

      // ── 新功能：问一问 ──
      "血压调理": `【高血压调理方案】
根据您提供的情况，为您定制以下调理方案：

【饮食调理建议】
一、推荐食物
芹菜：含有降压成分，可凉拌或榨汁
洋葱：有助于血管扩张
黑木耳：活血化瘀
香蕉：富含钾元素
深海鱼类：富含Omega-3

二、需要避免
高盐食物：每天盐控制在6g以下
腌制食品：咸菜、腊肉
高脂食物：肥肉、油炸食品

【运动调理建议】
适合运动：快走、太极拳、八段锦
运动频率：每周5次，每次30-40分钟

【重要提醒】
请按时服药，勿自行调整剂量。本建议仅供参考。

【参考来源】
[1] 《学会吃！快速调理高血压》人民卫生出版社
[2] 《心脏与心血管保护手册》人民卫生出版社`,

      "肥胖评估": `【体重管理评估报告】
根据您提供的信息，分析如下：

【身体状况评估】
BMI指数和腰围数据显示需要关注体重管理，腹型肥胖是重点风险因素。

【饮食调整建议】
一、推荐饮食
早餐：燕麦粥+鸡蛋+水果
午餐：杂粮饭+清蒸鱼/鸡胸肉+蔬菜
晚餐：清淡为主，7分饱

二、需要控制
减少精制碳水：白米饭、面条
避免含糖饮料和加工零食
晚餐在19:00前完成

【运动建议】
适合运动：快走、游泳、太极拳
每周至少5次，每次40-60分钟

【参考来源】
[1] 《肥胖.真相：医生也在读》人民卫生出版社
[2] 《养生食谱》中国轻工业出版社`,

      "肝脏调理": `【肝脏调理方案】
根据您描述的情况，提供以下调理建议：

【饮食调理建议】
一、推荐食物
绿叶蔬菜：菠菜、西兰花
优质蛋白：鱼肉、鸡胸肉、豆制品
全谷物：燕麦、糙米、小米
枸杞：养肝明目，可泡水或煮粥

二、严格避免
绝对禁酒
高脂食物：肥肉、油炸食品
霉变食物：发霉的花生、玉米
加工食品：含防腐剂的食物

【生活方式建议】
晚上11点前入睡
适度运动如散步、太极
保持心情舒畅，避免生气伤肝

【重要提醒】
本建议仅供参考。肝脏疾病请务必在医生指导下治疗。

【参考来源】
[1] 《肝脏疾病吃什么？禁什么》中国轻工业出版社`,

      "肠胃调养": `【茶饮调理建议】
根据您描述的肠胃情况，推荐以下茶饮方案：

【推荐茶饮】
一、陈皮普洱茶
功效：理气健脾、消食化积、暖胃驱寒
适用：脾胃虚寒、消化不良
冲泡：陈皮3g+普洱茶5g，沸水冲泡
饮用：饭后半小时最佳

二、桂圆红枣茶
功效：补气养血、温胃健脾
适用：脾胃虚弱、食欲不振
冲泡：桂圆5颗+红枣3颗，沸水焖泡10分钟

三、大麦茶
功效：健脾消食、清热解暑
适用：食积不化、消化不良
冲泡：炒大麦10g，沸水冲泡5分钟

【日常肠胃养护】
三餐定时定量
少食生冷、油腻食物
饭后散步15分钟
注意腹部保暖

【参考来源】
[1] 《中国茶道全书》中国轻工业出版社
[2] 《实用中医养生速查图典》人民卫生出版社`,
    };

    return responses[serviceTitle] || "感谢您的提问，让我为您详细分析...";
  };
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // 直接跳转到新的聊天页面，传递用户的第一条消息
    navigate('/chat/new', { 
      state: { 
        initialMessage: inputText,
        isNewConversation: true
      } 
    });
    
    setInputText("");
  };
  
  // 将AI回复拆分为分析和计划
  const splitAnalysisAndPlan = (fullText: string): { analysis: string; plan: string } => {
    // 查找计划部分的关键词
    const planKeywords = [
      "【早餐建议】",
      "【午餐建议】",
      "【晚餐建议】",
      "【日常注意】",
      "【调理方案】",
      "【生活调理】",
      "【健康建议】",
      "【改善建议】",
      "一、饮食调理",
      "一、调整食物比例",
      "二、"
    ];
    
    // 找到第一个计划关键词的位置
    let splitIndex = -1;
    let foundKeyword = "";
    
    for (const keyword of planKeywords) {
      const index = fullText.indexOf(keyword);
      if (index !== -1 && (splitIndex === -1 || index < splitIndex)) {
        splitIndex = index;
        foundKeyword = keyword;
      }
    }
    
    if (splitIndex === -1) {
      // 没找到分割点，全部作为分析，计划为空
      return {
        analysis: fullText,
        plan: "请按照以上建议执行健康计划"
      };
    }
    
    // 分割文本
    const analysis = fullText.substring(0, splitIndex).trim();
    const plan = fullText.substring(splitIndex).trim();
    
    return { analysis, plan };
  };
  
  // 在聊天模态框中发送消息
  const handleChatSendMessage = () => {
    if (!chatInputText.trim() || !selectedService) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: chatInputText.trim()
    };
    setMessages(prev => [...prev, userMessage]);
    const userInput = chatInputText.trim();
    setChatInputText("");

    // 判断是否是"去定制"类型的服务（引导式问诊）
    const currentService = [...services, ...newServices].find(s => s.title === selectedService);
    const isAskService = (s: typeof currentService) => s != null && (("hasAi" in s && s.hasAi) || ("section" in s && s.section === "ask"));
    const shouldShowAdviceCard = isAskService(currentService);

    if (shouldShowAdviceCard) {
      // 引导式问诊流程
      setTimeout(() => {
        handleDiagnosisFlow(userInput);
      }, 1500);
    } else {
      // 普通AI消息（如上传图片类型）
      setTimeout(() => {
        const fullResponse = generateAIResponse(userInput, selectedService);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: fullResponse,
          isLocked: false,
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1500);
    }
  };

  // 处理引导式问诊流程
  const handleDiagnosisFlow = (userInput: string) => {
    if (diagnosisStep === 'ask_problem') {
      // 记录用户问题
      setUserProblem(userInput);
      setDiagnosisStep('ask_disease');

      // 问基础病
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "好的，我了解了您的情况 ✅\n\n接下来请告诉我：\n\n您有没有基础疾病呢？\n例如：糖尿病、高血压、心脏病、无等\n\n这将帮助我为您制定更安全、更合适的调理方案。"
      };
      setMessages(prev => [...prev, aiMessage]);

    } else if (diagnosisStep === 'ask_disease') {
      // 记录基础病
      setUserDisease(userInput);
      setDiagnosisStep('generate_plan');

      // 生成计划
      const fullResponse = generateCustomizedPlan(userProblem, userInput);
      const { analysis, plan } = splitAnalysisAndPlan(fullResponse);
      setGeneratedPlan(plan);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "",
        isAdviceCard: true,
        adviceData: {
          serviceName: selectedService || "健康调理计划",
          analysis: analysis,
          plan: plan
        },
      };
      setMessages(prev => [...prev, aiMessage]);

      // 询问用户是否满意
      setTimeout(() => {
        setDiagnosisStep('confirm_plan');
        const confirmMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: "这是根据您的情况制定的养生计划 📋\n\n请问这个计划可以吗？\n\n• 如果满意，可以直接点击上方「接受建议并加入打卡」\n• 如果需要修改，请告诉我您想调整的地方，我会重新为您生成"
        };
        setMessages(prev => [...prev, confirmMessage]);
      }, 1000);

    } else if (diagnosisStep === 'confirm_plan') {
      // 用户想修改计划
      if (userInput.includes('修改') || userInput.includes('调整') || userInput.includes('不') || userInput.includes('重新')) {
        // 重新生成计划
        const fullResponse = generateCustomizedPlan(userProblem, userDisease, userInput);
        const { analysis, plan } = splitAnalysisAndPlan(fullResponse);
        setGeneratedPlan(plan);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "",
          isAdviceCard: true,
          adviceData: {
            serviceName: selectedService || "健康调理计划",
            analysis: analysis,
            plan: plan
          },
        };
        setMessages(prev => [...prev, aiMessage]);

        // 再次询问
        setTimeout(() => {
          const confirmMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "ai",
            content: "我已经根据您的要求重新调整了计划 ✨\n\n请问现在这个计划可以吗？\n\n• 满意的话可以点击「接受建议并加入打卡」\n• 还需要修改请继续告诉我"
          };
          setMessages(prev => [...prev, confirmMessage]);
        }, 1000);
      } else {
        // 用户表示满意或其他回复
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "太好了！请点击上方的「接受建议并加入打卡」按钮，系统会自动为您创建每日打卡任务 ✅\n\n坚持执行这个计划，您的健康状况会逐步改善！💪"
        };
        setMessages(prev => [...prev, aiMessage]);
        setDiagnosisStep('completed');
      }
    }
  };

  // 生成个性化计划
  const generateCustomizedPlan = (problem: string, disease: string, modification?: string): string => {
    // 模拟根据用户情况生成计划
    let plan = `根据您想调理「${problem}」的情况`;

    if (disease && !disease.includes('无')) {
      plan += `，以及您有「${disease}」的基础`;
    }

    if (modification) {
      plan += `，并结合您的修改建议「${modification}」`;
    }

    plan += `，我为您定制以下养生方案：

【早餐建议】
• 山药红枣粥：补脾养胃，益气补血
• 核桃芝麻糊：滋养肝肾，润肠通便
• 温热豆浆配全麦面包

【午餐建议】
• 清蒸鲈鱼：富含优质蛋白，易消化
• 木耳炒山药：降血脂，增强免疫
• 糙米饭：富含B族维生素
• 时令蔬菜汤

【晚餐建议】
• 小米南瓜粥：养胃安神
• 清炒西花：富含维生素C和膳食纤维
• 适量豆制品

【日常注意】
• 每日饮水1500-2000ml
• 避免生冷油腻食物
• 三餐定时定量
• 晚餐不宜过饱，建议7分饱
• 保持规律作息，改善睡眠质量

【运动建议】
• 每天散步30分钟
• 练习太极或八段锦
• 避免剧烈运动

【特别提醒】
根据中医理论，您的体质适合温补调理。坚持3个月后体质会有明显改善。

【参考来源】
[1] 《中医食疗学》(第2版) 中国中医药出版社
[2] 《本草纲目》 人民卫生出版社`;

    return plan;
  };
  
  const toggleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, liked: !msg.liked, disliked: false }
        : msg
    ));
  };
  
  const toggleDislike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, disliked: !msg.disliked, liked: false }
        : msg
    ));
  };
  
  const handleCopyMessage = (content: string, messageId: string) => {
    // 使用传统方法作为主要复制方案
    const copyToClipboard = (text: string) => {
      try {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          textArea.remove();
          return successful;
        } catch (err) {
          console.error('复制失败:', err);
          textArea.remove();
          return false;
        }
      } catch (err) {
        console.error('复制失败:', err);
        return false;
      }
    };
    
    const success = copyToClipboard(content);
    if (success) {
      setCopiedMessage(messageId);
      toast.success("已复制到剪贴板");
      setTimeout(() => setCopiedMessage(null), 2000);
    } else {
      toast.error("复制失败，请重试");
    }
  };
  
  // 将带有引用标注的文本转换为React元素
  const renderTextWithReferences = (text: string) => {
    const parts = text.split(/(\\[\\d+\\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\\[(\\d+)\\]/);
      if (match) {
        return (
          <sup key={index} className="text-orange-600 font-semibold mx-0.5">
            [{match[1]}]
          </sup>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };
  
  const handleTextToSpeech = (messageId: string, content: string) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
      window.speechSynthesis.cancel();
    } else {
      setLoadingAudio(messageId);
      setPlayingAudio(messageId);
      
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'zh-CN';
      utterance.onend = () => {
        setPlayingAudio(null);
        setLoadingAudio(null);
      };
      utterance.onstart = () => {
        setLoadingAudio(null);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setShowCamera(true);
    } catch (error) {
      console.error("无法访问摄像头", error);
      fileInputRef.current?.click();
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setShowCamera(false);
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current && selectedService) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();
        
        const imageMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "上传的图片",
          imageUrl: imageData
        };
        setMessages([imageMessage]);
        setShowChatModal(true);
        
        setTimeout(() => {
          const fullResponse = generateAIResponse("", selectedService);
          const aiAnalysis: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: fullResponse,
            isLocked: false,
            imageUrl: imageData,
          };
          setMessages(prev => [...prev, aiAnalysis]);
        }, 1500);
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedService) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCapturedImage(imageUrl);
        
        const imageMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "上传的图片",
          imageUrl: imageUrl
        };
        setMessages([imageMessage]);
        setShowChatModal(true);

        setTimeout(() => {
          const fullResponse = generateAIResponse("", selectedService);
          const aiAnalysis: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: fullResponse,
            isLocked: false,
            imageUrl: imageUrl,
          };
          setMessages(prev => [...prev, aiAnalysis]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
    
    event.target.value = '';
  };
  
  // 处理转发按钮点击 - 自动选中当前AI消息和对应的用户问题
  const handleForwardMessage = (aiMessageId: string) => {
    // 检查消息是否被锁定
    if (isMessageLockedForForward(aiMessageId)) {
      setShowMemberModal(true);
      return;
    }
    
    // 找到AI消息的索引
    const aiIndex = messages.findIndex(msg => msg.id === aiMessageId);
    if (aiIndex === -1) return;
    
    // 找到前一条用户消息（如果存在且未锁定）
    let userMessageId: string | null = null;
    for (let i = aiIndex - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        if (!isMessageLockedForForward(messages[i].id)) {
          userMessageId = messages[i].id;
        }
        break;
      }
    }
    
    // 自动选中AI消息和用户消息（如果存在）
    const newSelection = new Set<string>();
    if (userMessageId) {
      newSelection.add(userMessageId);
    }
    newSelection.add(aiMessageId);
    
    setSelectedMessages(newSelection);
    setForwardMode(true);
    
    // 直接显示分享选项
    setShowShareSheet(true);
  };
  
  // 切换消息选中状态 - 成对选中/取消
  const toggleMessageSelection = (messageId: string) => {
    // 检查消息是否被锁定
    if (isMessageLockedForForward(messageId)) {
      setShowMemberModal(true);
      return;
    }
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    const message = messages[messageIndex];
    const newSelection = new Set(selectedMessages);
    
    if (message.type === "ai") {
      // 点击AI消息，找到前一条用户消息
      let userMessageId: string | null = null;
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].type === "user") {
          userMessageId = messages[i].id;
          break;
        }
      }
      
      // 如果当前AI消息已选中，则取消选中AI和用户消息
      if (newSelection.has(messageId)) {
        newSelection.delete(messageId);
        if (userMessageId) {
          newSelection.delete(userMessageId);
        }
      } else {
        // 否则选中AI和用户消息（只选未锁定的）
        newSelection.add(messageId);
        if (userMessageId && !isMessageLockedForForward(userMessageId)) {
          newSelection.add(userMessageId);
        }
      }
    } else {
      // 点击用户消息，找到后一条AI消息
      let aiMessageId: string | null = null;
      for (let i = messageIndex + 1; i < messages.length; i++) {
        if (messages[i].type === "ai") {
          aiMessageId = messages[i].id;
          break;
        }
      }
      
      // 如果当前用户消息已选中，则取消选中用户和AI消息
      if (newSelection.has(messageId)) {
        newSelection.delete(messageId);
        if (aiMessageId) {
          newSelection.delete(aiMessageId);
        }
      } else {
        // 否则选中用户和AI消息（只选未锁定的）
        newSelection.add(messageId);
        if (aiMessageId && !isMessageLockedForForward(aiMessageId)) {
          newSelection.add(aiMessageId);
        }
      }
    }
    
    setSelectedMessages(newSelection);
  };
  
  // 处理分享好友
  const handleShareToWechat = () => {
    if (selectedMessages.size === 0) {
      toast.error("请选择要转发的消息");
      return;
    }
    
    // 关闭分享面板，显示分享卡片预览
    setShowShareSheet(false);
    setShowShareCardPreview(true);
  };
  
  // 处理生成图片
  const handleGenerateImage = () => {
    if (selectedMessages.size === 0) {
      toast.error("请选择要转发的消息");
      return;
    }
    
    // 关闭分享面板，显示图片预览
    setShowShareSheet(false);
    setShowShareImagePreview(true);
  };
  
  // 取消转发模式
  const cancelForwardMode = () => {
    setForwardMode(false);
    setShowShareSheet(false);
    setSelectedMessages(new Set());
  };
  
  const isMessageLockedForForward = (_messageId: string): boolean => {
    return false;
  };

  // 确认转发
  const confirmForward = () => {
    if (selectedMessages.size === 0) {
      toast.error("请选择要转发的消息");
      return;
    }
    
    // 显示分享面板
    setShowShareSheet(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD9B3] via-[#FFE8CC] to-[#FFF7EA] pb-44 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-yellow-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="pt-6 px-4 max-w-2xl mx-auto relative z-10">
        {/* Banner */}
        <div className="rounded-3xl overflow-hidden mb-6 shadow-2xl">
          <img
            src={bannerImage}
            alt="欢迎来到暖伴"
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Welcome Message - Separated */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl bg-white/80 border-2 border-white/40 overflow-hidden">
              <img 
                src={xiaoNuanAvatar} 
                alt="暖伴" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="rounded-3xl p-6 shadow-2xl backdrop-blur-xl bg-white/30 border border-white/50">
                <p className="text-lg leading-relaxed text-gray-800 font-semibold">
                  我可以基于海量名医名书的知识，为你做这些事：
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 左右滑动切换页面 */}
        <div className="relative mb-6">
          {/* 左箭头 — 桌面端 */}
          <button
            onClick={() => {
              const container = document.getElementById("service-pages-container") as HTMLElement;
              if (container) container.scrollTo({ left: 0, behavior: "smooth" });
              setCurrentPage(0);
            }}
            disabled={currentPage === 0}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 shadow-lg items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-default transition-all"
            style={{ left: "-12px" }}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          {/* 右箭头 — 桌面端 */}
          <button
            onClick={() => {
              const container = document.getElementById("service-pages-container") as HTMLElement;
              if (container) container.scrollTo({ left: container.clientWidth, behavior: "smooth" });
              setCurrentPage(1);
            }}
            disabled={currentPage === 1}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 shadow-lg items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-default transition-all"
            style={{ right: "-12px" }}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          <div
            id="service-pages-container"
            className="flex overflow-x-auto scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
            onScroll={(e) => {
              const idx = Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth);
              setCurrentPage(Math.min(Math.max(idx, 0), 1));
            }}
          >
            {/* ── 第一页：新功能（看一看 + 问一问）── */}
            <div className="flex-none w-full pr-4" style={{ scrollSnapAlign: "start" }}>
              {/* 看一看 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📷</span>
                  <h2 className="text-lg font-bold text-gray-800">看一看</h2>
                  <span className="text-xs text-muted-foreground">拍照出结果</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {newServices.filter(s => s.section === "look").map((service) => (
                    <div key={service.id} className={`group relative rounded-3xl p-5 transition-all duration-300 shadow-xl hover:shadow-2xl ${service.bgColor} border-2 border-white/50`}>
                      <div className="flex justify-center mb-3"><div className="text-4xl drop-shadow-lg">{service.icon}</div></div>
                      <h3 className="text-base font-bold text-gray-800 text-center mb-3">{service.title}</h3>
                      <button onClick={() => handleServiceClick(service)} className="w-full py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-base font-medium transition-all active:scale-95">{service.buttonLabel}</button>
                    </div>
                  ))}
                </div>
              </div>
              {/* 问一问 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💬</span>
                  <h2 className="text-lg font-bold text-gray-800">问一问</h2>
                  <span className="text-xs text-muted-foreground">AI深度调理</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {newServices.filter(s => s.section === "ask").map((service) => (
                    <div key={service.id} className={`group relative rounded-3xl p-5 transition-all duration-300 shadow-xl hover:shadow-2xl ${service.bgColor} border-2 border-white/50`}>
                      <div className="flex justify-center mb-3"><div className="text-4xl drop-shadow-lg">{service.icon}</div></div>
                      <h3 className="text-base font-bold text-gray-800 text-center mb-3">{service.title}</h3>
                      <button onClick={() => handleServiceClick(service)} className="w-full py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-base font-medium transition-all active:scale-95">{service.buttonLabel}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 第二页：问一问 + 看一看 ── */}
            <div className="flex-none w-full pl-1" style={{ scrollSnapAlign: "start" }}>
              {/* 问一问 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💬</span>
                  <h2 className="text-lg font-bold text-gray-800">问一问</h2>
                  <span className="text-xs text-muted-foreground">AI深度调理</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {services.filter(s => s.section === "ask").map((service) => (
                    <div key={service.id} className={`group relative rounded-3xl p-5 transition-all duration-300 shadow-xl hover:shadow-2xl ${service.bgColor} border-2 border-white/50`}>
                      <div className="flex justify-center mb-3"><div className="text-4xl drop-shadow-lg">{service.icon}</div></div>
                      <h3 className="text-base font-bold text-gray-800 text-center">{service.title}</h3>
                      <p className="text-xs text-muted-foreground text-center mb-3">{(service as any).subtitle}</p>
                      <button onClick={() => handleServiceClick(service)} className="w-full py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-base font-medium transition-all active:scale-95">{service.buttonLabel}</button>
                    </div>
                  ))}
                </div>
              </div>
              {/* 看一看 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📷</span>
                  <h2 className="text-lg font-bold text-gray-800">看一看</h2>
                  <span className="text-xs text-muted-foreground">拍照知健康</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {services.filter(s => s.section === "look").map((service) => (
                    <div key={service.id} className={`group relative rounded-3xl p-5 transition-all duration-300 shadow-xl hover:shadow-2xl ${service.bgColor} border-2 border-white/50`}>
                      <div className="flex justify-center mb-3"><div className="text-4xl drop-shadow-lg">{service.icon}</div></div>
                      <h3 className="text-base font-bold text-gray-800 text-center">{service.title}</h3>
                      <p className="text-xs text-muted-foreground text-center mb-3">{(service as any).subtitle}</p>
                      <button onClick={() => handleServiceClick(service)} className="w-full py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-base font-medium transition-all active:scale-95">{service.buttonLabel}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 页面指示器 */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[0, 1].map(i => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i);
                  const container = document.getElementById("service-pages-container") as HTMLElement;
                  if (container) container.scrollTo({ left: container.clientWidth * i, behavior: "smooth" });
                }}
                className={`h-2 rounded-full transition-all ${currentPage === i ? "w-6 bg-primary" : "w-2 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom Input Area - 固定在底部的输入框 */}
      <div className="fixed bottom-20 left-0 right-0 z-40">
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex items-center gap-3">
            {inputMode === "voice" ? (
              // 语音输入模式（默认）
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                >
                  <ImagePlus className="h-6 w-6 text-gray-700" />
                </button>
                
                <button 
                  className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 transition-all active:scale-95 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  <Mic className="h-6 w-6 text-white relative z-10" />
                  <span className="text-lg font-medium text-white relative z-10">按住说话</span>
                </button>
                
                <button 
                  onClick={() => setInputMode("text")}
                  className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                >
                  <Keyboard className="h-6 w-6 text-gray-700" />
                </button>
              </>
            ) : (
              // 文字输入模式
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                >
                  <ImagePlus className="h-6 w-6 text-gray-700" />
                </button>
                
                <div className="flex-1 rounded-2xl bg-white/90 shadow-lg focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="输入您的问题..."
                    className="w-full px-5 py-4 bg-transparent outline-none text-base text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                
                {inputText.trim() ? (
                  // 有内容时显示发送按钮
                  <button 
                    onClick={handleSendMessage}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 shadow-lg transition-all active:scale-95"
                  >
                    <Send className="h-6 w-6 text-white" />
                  </button>
                ) : (
                  // 没有内容时显示语音输入图标
                  <button 
                    onClick={() => setInputMode("voice")}
                    className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                  >
                    <Mic className="h-6 w-6 text-gray-700" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      
      <TabBar />
      
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute top-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={stopCamera}
                  className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 transition-all active:scale-95"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/30">
                  <p className="text-white text-sm font-medium">{selectedService}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-white/50 rounded-3xl"></div>
            </div>
          </div>
          
          <div className="bg-black/80 backdrop-blur-xl p-6 border-t border-white/20">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={captureImage}
                  className="w-20 h-20 rounded-full bg-white border-4 border-orange-400 hover:border-orange-500 transition-all active:scale-95 shadow-2xl flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </button>
              </div>
              
              <p className="text-center text-white/70 mt-4 text-sm">
                {selectedService === "舌苔诊断"
                  ? "请伸出舌头，对准取景框拍摄"
                  : selectedService === "手掌健康"
                  ? "请将手掌对准取景框，确保掌纹清晰"
                  : selectedService === "饮食诊断"
                  ? "请将食物对准取景框拍摄"
                  : selectedService === "风水测评"
                  ? "请对准需要测评的空间拍摄"
                  : selectedService === "面色诊断"
                  ? "请正脸对准取景框，保持光线充足"
                  : selectedService === "脱发检测"
                  ? "请将头顶和发际线对准取景框"
                  : selectedService === "指甲检测"
                  ? "请将手指和指甲对准取景框"
                  : selectedService === "报告解读"
                  ? "请将体检报告对准取景框，确保文字清晰"
                  : "请对准取景框拍摄"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Modal */}
      {showChatModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowChatModal(false)}
        >
          <div
            className="w-full h-[90vh] rounded-t-3xl backdrop-blur-xl bg-white/95 border-t border-white/50 shadow-2xl animate-slideUp flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {/* 转发模式顶部取消按钮 */}
              {forwardMode ? (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={cancelForwardMode}
                    className="px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-all active:scale-95"
                  >
                    取消
                  </button>
                  <h3 className="text-base font-semibold text-gray-800">选择消息</h3>
                  <div className="w-16"></div> {/* 占位元素，保持居中 */}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img 
                        src={xiaoNuanAvatar} 
                        alt="暖伴" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedService}</h3>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        在线
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 打电话聊按钮 */}
                    <button
                      onClick={() => {
                        // 导航到语音通话页面（使用专家ID 1，即小暖），并传递fromAiHomePage标志
                        navigate('/call/1', {
                          state: {
                            fromAiHomePage: true
                          }
                        });
                      }}
                      className="p-2 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 transition-all active:scale-95 shadow-md"
                      aria-label="打电话聊"
                    >
                      <Phone className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => setShowChatModal(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all active:scale-95"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                // 如果是通话标注，居中显示
                if (message.isCallLabel) {
                  return (
                    <div key={message.id} className="flex justify-center py-2">
                      <div className="px-4 py-2 rounded-full bg-gray-200/80 backdrop-blur-sm">
                        <p className="text-sm text-gray-600 font-medium">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // 正常消息渲染
                return (
                  <div
                    key={message.id}
                    className="flex items-start gap-3"
                  >
                    {/* 选择框 - 始终在最左边 */}
                    {forwardMode && !isMessageLockedForForward(message.id) && (
                      <button
                        onClick={() => toggleMessageSelection(message.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedMessages.has(message.id)
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {selectedMessages.has(message.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                    
                    {message.type === "user" ? (
                      // 用户消息 - 右对齐
                      <div className="flex-1 flex justify-end">
                        <div className="rounded-2xl p-4 max-w-[85%] bg-gradient-to-br from-blue-400 to-blue-500 text-white">
                          {message.imageUrl && (
                            <div className="mb-3">
                              <img
                                src={message.imageUrl}
                                alt="上传的图片"
                                className="w-full h-auto object-cover rounded-xl"
                              />
                            </div>
                          )}
                          <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // AI消息 - 左对齐
                      <div className="flex-1">
                        {/* 判断是否是建议卡片 */}
                        {message.isAdviceCard && message.adviceData ? (
                          <>
                            {/* 使用AIAdviceCard渲染 */}
                            <AIAdviceCard
                              serviceName={message.adviceData.serviceName}
                              analysis={message.adviceData.analysis}
                              plan={message.adviceData.plan}
                              onCreatePlan={(title, tasks) => {
                                const planData = {
                                  title,
                                  tasks,
                                  startDate: new Date().toISOString(),
                                  createdAt: Date.now()
                                };
                                setPlanData(planData);
                                window.dispatchEvent(new CustomEvent('planCreated', { detail: planData }));
                                navigate('/checkin');
                              }}
                            />

                          </>
                        ) : (
                          <div className="rounded-2xl p-4 max-w-[85%] bg-gray-100">
                            {message.isLocked && !isMember && !unlockedMessages.has(message.id) ? (
                            <div className="relative">
                              {message.imageUrl && (
                                <div className="mb-3">
                                  <img
                                    src={message.imageUrl}
                                    alt="上传的图片"
                                    className="w-full h-auto object-cover rounded-xl"
                                  />
                                </div>
                              )}
                              
                              <div className="relative max-h-32 overflow-hidden">
                                <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                                  {message.content.split('\n').slice(0, 8).join('\n')}
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent"></div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-300">
                                <button
                                  onClick={() => {
                                    if (freeUnlockCount < 3) {
                                      // 免费解锁
                                      setUnlockedMessages(prev => new Set([...prev, message.id]));
                                      setFreeUnlockCount(prev => prev + 1);
                                    } else {
                                      // 显示付费弹窗
                                      setShowMemberModal(true);
                                    }
                                  }}
                                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2"
                                >
                                  <Crown className="h-5 w-5 text-white" />
                                  <span className="text-base font-semibold text-white">
                                    {freeUnlockCount < 3 
                                      ? `免费解锁内容（${freeUnlockCount + 1}/3）`
                                      : "成为会员解锁内容"
                                    }
                                  </span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {message.imageUrl && (
                                <div className="mb-3">
                                  <img
                                    src={message.imageUrl}
                                    alt="上传的图片"
                                    className="w-full h-auto object-cover rounded-xl"
                                  />
                                </div>
                              )}
                              
                              <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                                {renderTextWithReferences(message.content)}
                              </p>
                              
                              {/* AI消息操作按钮 - 仅在非转发模式下显示 */}
                              {!forwardMode && (
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                  <button
                                    onClick={() => toggleLike(message.id)}
                                    className={`p-2 rounded-lg transition-all active:scale-95 ${
                                      message.liked 
                                        ? "bg-orange-100 text-orange-500" 
                                        : "bg-white/80 hover:bg-white text-gray-600"
                                    }`}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                  </button>
                                  
                                  <button
                                    onClick={() => toggleDislike(message.id)}
                                    className={`p-2 rounded-lg transition-all active:scale-95 ${
                                      message.disliked 
                                        ? "bg-red-100 text-red-500" 
                                        : "bg-white/80 hover:bg-white text-gray-600"
                                    }`}
                                  >
                                    <ThumbsDown className="h-4 w-4" />
                                  </button>
                                  
                                  <button
                                    onClick={() => handleCopyMessage(message.content, message.id)}
                                    className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all active:scale-95 flex items-center gap-1"
                                  >
                                    {copiedMessage === message.id ? (
                                      <>
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span className="text-xs text-green-500">已复制</span>
                                      </>
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleForwardMessage(message.id)}
                                    className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all active:scale-95"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 接受建议并打卡 — 对话底部固定按钮，仅当有建议卡片时展示 */}
            {!forwardMode && messages.some(m => m.isAdviceCard) && (
              <div className="px-4 pt-3 pb-0 border-t border-orange-100 bg-white/95">
                <button
                  onClick={() => {
                    const adviceMsg = [...messages].reverse().find(m => m.isAdviceCard && m.adviceData);
                    if (!adviceMsg?.adviceData) return;
                    const plan = adviceMsg.adviceData.plan;
                    const patterns = [/•\s*([^•\n]+)/g, /\d+\.\s*([^\n]+)/g, /【([^】]+)】/g];
                    const tasks: string[] = [];
                    patterns.forEach(p => {
                      for (const m of plan.matchAll(p)) {
                        const t = m[1].trim();
                        if (t.length > 5 && t.length < 50 && !t.includes('建议') && !t.includes('注意')) tasks.push(t);
                      }
                    });
                    const finalTasks = tasks.length > 0 ? tasks.slice(0, 5) : ["按照AI建议执行健康计划","记录每日健康数据","保持良好作息习惯"];
                    const svcName = adviceMsg.adviceData.serviceName || "";
                    const titleKeywords: Record<string, string> = {
                      "血糖":"血糖","糖尿病":"控糖","高血压":"降压","血压":"稳压",
                      "睡眠":"安眠","失眠":"安眠","运动":"运动","减肥":"减脂",
                      "饮食":"饮食","关节":"关节","颈椎":"颈椎","腰椎":"护腰",
                      "心脏":"养心","肠胃":"养胃","情绪":"情绪","疲劳":"抗疲劳",
                      "食谱":"饮食","养生":"养生","按摩":"按摩","艾灸":"艾灸",
                    };
                    let title = "健康调理计划";
                    for (const [k, v] of Object.entries(titleKeywords)) {
                      if (svcName.includes(k)) { title = `${v}调理计划`; break; }
                    }
                    const planData = { title, tasks: finalTasks, startDate: new Date().toISOString(), createdAt: Date.now() };
                    setPlanData(planData);
                    window.dispatchEvent(new CustomEvent('planCreated', { detail: planData }));
                    navigate('/checkin');
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  接受建议并打卡
                </button>
              </div>
            )}

            {/* Chat Input Area */}
            {!forwardMode && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  {inputMode === "voice" ? (
                    // 语音输入模式（默认）
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                      >
                        <ImagePlus className="h-6 w-6 text-gray-700" />
                      </button>
                      
                      <button 
                        className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 transition-all active:scale-95 shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                        <Mic className="h-6 w-6 text-white relative z-10" />
                        <span className="text-lg font-medium text-white relative z-10">按住说话</span>
                      </button>
                      
                      <button 
                        onClick={() => setInputMode("text")}
                        className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                      >
                        <Keyboard className="h-6 w-6 text-gray-700" />
                      </button>
                    </>
                  ) : (
                    // 文字输入模式
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                      >
                        <ImagePlus className="h-6 w-6 text-gray-700" />
                      </button>
                      
                      <div className="flex-1 rounded-2xl bg-white/90 shadow-lg focus-within:bg-white transition-all">
                        <input
                          type="text"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleChatSendMessage()}
                          placeholder="输入您的问题..."
                          className="w-full px-5 py-4 bg-transparent outline-none text-base text-gray-800 placeholder:text-gray-500"
                        />
                      </div>
                      
                      {chatInputText.trim() ? (
                        // 有内容时显示发送按钮
                        <button 
                          onClick={handleChatSendMessage}
                          className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 shadow-lg transition-all active:scale-95"
                        >
                          <Send className="h-6 w-6 text-white" />
                        </button>
                      ) : (
                        // 没有内容时显示语音输入图标
                        <button 
                          onClick={() => setInputMode("voice")}
                          className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                        >
                          <Mic className="h-6 w-6 text-gray-700" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* 转发模式底部按钮 - 在模态框内部吸底 */}
            {forwardMode && !showShareSheet && (
              <div className="p-4 border-t border-gray-200 bg-white/95 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelForwardMode}
                    className="flex-1 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-all active:scale-95 font-medium text-gray-700"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmForward}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 transition-all active:scale-95 font-medium text-white shadow-lg"
                  >
                    转发 ({selectedMessages.size})
                  </button>
                </div>
              </div>
            )}
            
            {/* Share Sheet - 在模态框内部吸底 */}
            {showShareSheet && (
              <div className="p-4 border-t border-gray-200 bg-white/95 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShareToWechat}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <img
                      src={wechatLogo}
                      alt="微信"
                      className="h-6 w-6"
                    />
                    <span className="text-base font-semibold text-white">分享好友</span>
                  </button>
                  
                  <button
                    onClick={handleGenerateImage}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Image className="h-6 w-6 text-white" />
                    <span className="text-base font-semibold text-white">生成图片</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Membership Modal */}
      <MembershipModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSuccess={(plan) => activateMembership(plan)}
      />
      
      {/* Share Image Preview */}
      <ShareImagePreview
        isOpen={showShareImagePreview}
        onClose={() => {
          setShowShareImagePreview(false);
          setForwardMode(false);
          setSelectedMessages(new Set());
        }}
        messages={messages
          .filter(m => selectedMessages.has(m.id))
          .map(m => ({
            id: m.id,
            type: m.type === "ai" ? "expert" : "user",
            content: m.content
          }))}
        userName="我"
        expertName="暖伴"
      />
      
      {/* Share Card Preview */}
      <ShareCardPreview
        isOpen={showShareCardPreview}
        onClose={() => {
          setShowShareCardPreview(false);
          setForwardMode(false);
          setSelectedMessages(new Set());
        }}
        messages={messages
          .filter(m => selectedMessages.has(m.id))
          .map(m => ({
            id: m.id,
            type: m.type === "ai" ? "expert" : "user",
            content: m.content
          }))}
        userName="我"
        expertName="暖伴"
      />
    </div>
  );
}