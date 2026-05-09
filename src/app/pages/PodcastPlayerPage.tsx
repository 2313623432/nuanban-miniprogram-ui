import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Settings, MessageCircle, Plus, ImagePlus, Send, Phone, Lock, List, X, Volume2, ThumbsUp, ThumbsDown, Copy, Check, Mic, Share2, Image, Keyboard } from "lucide-react";
import { TabBar } from "@/app/components/layout/TabBar";
import { useMembership } from "@/app/contexts/MembershipContext";
import { MembershipModal } from "@/app/components/MembershipModal";
import { ShareImagePreview } from "@/app/components/ShareImagePreview";
import { ShareCardPreview } from "@/app/components/ShareCardPreview";
import { PodcastShareCardPreview } from "@/app/components/PodcastShareCardPreview";
import { PodcastShareImagePreview } from "@/app/components/PodcastShareImagePreview";
import wechatLogo from "figma:asset/667e7fc3b19f62b1d1f1468a589d3d89f9fb3443.png";
import { toast } from "sonner";

type PodcastStyle = "simple" | "deep" | "humor" | "local";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "podcast";
  content: string;
  liked?: boolean;
  disliked?: boolean;
  hasVisual?: boolean;
  visualTitle?: string;
  visualImage?: string;
  visualDescription?: string;
  references?: { id: number, source: string }[];
  isLocked?: boolean;
}

export function PodcastPlayerPage() {
  const { style } = useParams<{ style: PodcastStyle }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMember, memberExpiryDate, activateMembership } = useMembership();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1245); // 20:45 in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [showTip, setShowTip] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "podcast",
      content: "大家好，今天我们来讲解《糖尿病疗法》这本书的核心内容..."
    },
    {
      id: "2",
      type: "user",
      content: "请问这个饮食建议适合所有糖尿病人吗？"
    },
    {
      id: "3",
      type: "ai",
      content: "让我详细解释一下。1型糖尿病和2型糖尿病的饮食建议确实有所不同。1型糖尿病患者需要更严格地控制碳水化合物的摄入量和时间，因为他们的胰岛素完全依赖外部注射。而2型糖尿病患者则更注重整体热量控制和饮食结构的调整。",
      hasVisual: true,
      visualTitle: "不同类型糖尿病的饮食差异",
      visualImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
      visualDescription: "1型和2型糖尿病患者的饮食建议有所不同",
      references: [
        { id: 1, source: "《糖尿病饮食指南》(第5版) 人民教育出版社" },
        { id: 2, source: "《1型糖尿病管理手册》(第3版) 上海教育出版社" }
      ]
    }
  ]);
  const [playingTTS, setPlayingTTS] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatInputMode, setChatInputMode] = useState<"voice" | "text">("voice");
  const [chatInputText, setChatInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 转发功能相关状态
  const [forwardMode, setForwardMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showShareImagePreview, setShowShareImagePreview] = useState(false);
  const [showShareCardPreview, setShowShareCardPreview] = useState(false);
  const [showPodcastShareSheet, setShowPodcastShareSheet] = useState(false); // 播客内容分享弹窗
  const [showPodcastShareCardPreview, setShowPodcastShareCardPreview] = useState(false); // 播客分享卡片预览
  const [showPodcastShareImagePreview, setShowPodcastShareImagePreview] = useState(false); // 播客分享图片预览
  
  // 播客文字稿内容（用于主内容区域展示）
  const podcastTranscript = `大家好，今天我们来讲解《糖尿病疗法》这本书的核心内容。

让我详细解释一下。1型糖尿病和2型糖尿病的饮食建议确实有所不同。1型糖尿病患者需要更严格地控制碳水化合物的摄入量和时间，因为他们的胰岛素完全依赖外部注射。而2型糖尿病患者则更注重整体热量控制和饮食结构的调整。

具体来说，1型糖尿病患者需要精确计算每餐的碳水化合物含量，并根据摄入量调整胰岛素剂量。建议采用碳水化合物计数法，每15克碳水化合物为一个交换份。同时要注意餐后血糖监测，及时调整治疗方案。

而2型糖尿病患者的饮食重点在于控制总热量摄入，保持健康体重。建议采用"三低一高"的饮食原则：低糖、低盐、低脂、高纤维。每日总热量应根据体重、活动量等因素个体化制定，一般建议每公斤体重25到30千卡。

此外，无论是1型还是2型糖尿病患者，都应该注重饮食的规律性。建议一日三餐定时定量，避免暴饮暴食。如果需要加餐，应选择低GI也就是低血糖生成指数的食物，如坚果、酸奶等。

运动对于糖尿病患者同样重要。适度的有氧运动可以提高胰岛素敏感性，帮助控制血糖。建议每周进行至少150分钟的中等强度运动，如快走、游泳、骑自行车等。

最后要提醒大家，糖尿病的管理是一个长期过程，需要患者、家属和医护人员的共同努力。定期监测血糖，及时调整治疗方案，保持良好的生活习惯，才能有效控制病情，提高生活质量。`;
  
  // 计算当前应该高亮的文字位置（基于播放时间）
  // 假设平均每秒钟朗读4个汉字
  const getReadPosition = () => {
    const charsPerSecond = 4;
    return Math.floor(currentTime * charsPerSecond);
  };
  
  // 章节数据
  const chapters = [
    { id: 1, title: "第一章：糖尿病基础知识", startTime: 0, duration: 180 },
    { id: 2, title: "第二章：饮食控制方法", startTime: 180, duration: 240 },
    { id: 3, title: "第三章：运动与锻炼", startTime: 420, duration: 200 },
    { id: 4, title: "第四章：药物治疗", startTime: 620, duration: 220 },
    { id: 5, title: "第五章：并发症预防", startTime: 840, duration: 195 },
    { id: 6, title: "第六章：日常护理", startTime: 1035, duration: 210 }
  ];
  
  const styleConfig = {
    simple: {
      title: "简洁讲解",
      host: "李医生",
      expertName: "李中医",
      expertId: "1",
      icon: "👤"
    },
    deep: {
      title: "深度解读",
      host: "李医生 & 张营养师",
      expertName: "王专家",
      expertId: "2",
      icon: "👥"
    },
    humor: {
      title: "幽默解读",
      host: "王大夫 & 刘教练",
      expertName: "刘老师",
      expertId: "3",
      icon: "😄"
    },
    local: {
      title: "专业讲解",
      host: "张医生",
      expertName: "老张",
      expertId: "4",
      icon: "🏠"
    }
  };
  
  const config = styleConfig[style as PodcastStyle] || styleConfig.simple;
  
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, playbackSpeed]);
  
  // Countdown tip timer
  useEffect(() => {
    if (showTip && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowTip(false);
    }
  }, [countdown, showTip]);
  
  // Check if returning from voice call with chat modal flag
  useEffect(() => {
    const state = location.state as any;
    if (state?.returnToChatModal) {
      setShowChatModal(true);
      // Clear the state to prevent reopening on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    // Sync voice messages from call if available
    if (state?.voiceMessages && state.voiceMessages.length > 0) {
      setChatMessages(prev => [...prev, ...state.voiceMessages]);
    }
  }, [location.state]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const progress = (currentTime / duration) * 100;
  
  const jumpToChapter = (chapterIndex: number) => {
    // 第一章节免费，其他章节需要会员
    if (chapterIndex > 0 && !isMember) {
      setShowMemberModal(true);
      return;
    }
    setCurrentTime(chapters[chapterIndex].startTime);
    setCurrentChapter(chapterIndex);
    setShowChapterList(false);
  };
  
  // Handle skip forward/backward
  const handleSkipBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };
  
  const handleSkipForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 10));
  };
  
  // Handle TTS playback
  const handleTTS = (messageId: string) => {
    if (playingTTS === messageId) {
      setPlayingTTS(null);
    } else {
      setPlayingTTS(messageId);
      // Simulate TTS playback
      setTimeout(() => {
        setPlayingTTS(null);
      }, 3000);
    }
  };
  
  // Handle copy
  const handleCopy = (content: string, messageId: string) => {
    // Use a more compatible copy method
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedId(messageId);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    textArea.remove();
  };
  
  // 判断消息是否被锁定的通用函数
  const isChatMessageLocked = (messageId: string): boolean => {
    // 会员可以访问所有消息
    if (isMember) return false;
    
    // 过滤出只有 user 和 ai 类型的消息
    const userAiMessages = chatMessages.filter(m => m.type === "user" || m.type === "ai");
    
    // 找到当前消息在过滤后列表中的索引
    const userAiIndex = userAiMessages.findIndex(m => m.id === messageId);
    
    // 如果找不到或者是前两条（第一对对话），则不锁定
    if (userAiIndex === -1 || userAiIndex <= 1) {
      return false;
    }
    
    // 第二对及以后的对话需要会员
    return true;
  };
  
  // Handle like/dislike
  const handleLike = (messageId: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, liked: !msg.liked, disliked: false }
        : msg
    ));
  };
  
  const handleDislike = (messageId: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, disliked: !msg.disliked, liked: false }
        : msg
    ));
  };
  
  // 处理发送消息
  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    
    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInputText.trim()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInputText("");
    
    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `根据您的问题"${chatInputText.trim()}"，让我为您详细解答。\n\n对于糖尿病患者来说，这是一个非常重要的问题。根据《糖尿病疗法》中的专业知识[1]，我建议您注意以下几点：\n\n1. 定期监测血糖水平\n2. 保持均衡的饮食结构\n3. 适当进行有氧运动\n4. 按时服用药物或注射胰岛素\n\n同时建议您咨询专业医生，制定个性化的治疗方案[2]。`,
        references: [
          { id: 1, source: "《糖尿病疗法》(第6版) 人民卫生出版社" },
          { id: 2, source: "《糖尿病管理指南》(第4版) 中国医药科技出版社" }
        ]
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  // 处理转发按钮点击
  const handleForwardMessage = (messageId: string) => {
    // 检查消息是否被锁定
    if (isChatMessageLocked(messageId)) {
      setShowMemberModal(true);
      return;
    }
    
    // 找到当前消息的索引
    const messageIndex = chatMessages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = chatMessages[messageIndex];
    
    // 再次确认：只有AI消息才能转发
    if (message.type !== "ai") {
      return;
    }
    
    // 进入转发模式
    setForwardMode(true);
    
    // 自动选中当前AI消息和对应的用户问题
    const newSelected = new Set<string>();
    newSelected.add(messageId);
    
    // 向前查找对应的用户问题
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (chatMessages[i].type === "user") {
        // 只选择未被锁定的用户消息
        if (!isChatMessageLocked(chatMessages[i].id)) {
          newSelected.add(chatMessages[i].id);
        }
        break;
      }
    }
    
    setSelectedMessages(newSelected);
    
    // 直接显示分享选项
    setShowShareSheet(true);
  };
  
  // 切换消息选中状态 - 成对选中/取消
  const toggleMessageSelection = (messageId: string) => {
    // 检查消息是否被锁定
    if (isChatMessageLocked(messageId)) {
      setShowMemberModal(true);
      return;
    }
    
    const messageIndex = chatMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    const message = chatMessages[messageIndex];
    const newSelection = new Set(selectedMessages);
    
    if (message.type === "ai") {
      // 点击AI消息，找到前一条用户消息
      let userMessageId: string | null = null;
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (chatMessages[i].type === "user") {
          userMessageId = chatMessages[i].id;
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
        // 选择AI和用户消息前检查是否被锁定
        newSelection.add(messageId);
        if (userMessageId && !isChatMessageLocked(userMessageId)) {
          newSelection.add(userMessageId);
        }
      }
    } else {
      // 点击用户消息，找到后一条AI消息
      let aiMessageId: string | null = null;
      
      for (let i = messageIndex + 1; i < chatMessages.length; i++) {
        if (chatMessages[i].type === "ai") {
          aiMessageId = chatMessages[i].id;
          break;
        }
      }
      
      // 如果对应的AI消息被锁定，不允许选择
      if (aiMessageId && isChatMessageLocked(aiMessageId)) {
        setShowMemberModal(true);
        return;
      }
      
      // 如果当前用户消息已选中，则取消选中用户和AI消息
      if (newSelection.has(messageId)) {
        newSelection.delete(messageId);
        if (aiMessageId) {
          newSelection.delete(aiMessageId);
        }
      } else {
        // 选择用户和AI消息
        newSelection.add(messageId);
        if (aiMessageId && !isChatMessageLocked(aiMessageId)) {
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
  
  // Render AI message with action buttons
  const renderAIMessage = (conv: ChatMessage) => {
    // 将带有引用标注的文本转换为React元素
    const renderTextWithReferences = (text: string) => {
      const parts = text.split(/(\\[\\d+\\])/g);
      return parts.map((part, index) => {
        const match = part.match(/\\[(\\d+)\\]/);
        if (match) {
          return (
            <sup key={index} className="text-primary font-medium mx-0.5">
              [{match[1]}]
            </sup>
          );
        }
        return <span key={index}>{part}</span>;
      });
    };
    
    return (
      <div key={conv.id} className="flex justify-start animate-fadeIn">
        <div className="max-w-[85%] glass-button border-2 border-secondary/40 rounded-2xl p-4 shadow-md relative">
          {/* Content */}
          <div>
            <p className="text-base leading-relaxed mb-0">{renderTextWithReferences(conv.content)}</p>
          </div>
          
          {conv.hasVisual && (
            <div className="mt-4 pt-4 border-t border-white/30">
              <h4 className="text-base font-medium mb-3">{conv.visualTitle}</h4>
              <div className="relative rounded-xl overflow-hidden mb-3 shadow-lg">
                <img
                  src={conv.visualImage}
                  alt={conv.visualTitle}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {conv.visualDescription}
              </p>
            </div>
          )}
          
          {/* References */}
          {conv.references && conv.references.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/30">
              <p className="text-sm text-muted-foreground mb-2">参考来源：</p>
              {conv.references.map((ref) => (
                <div key={ref.id} className="flex items-start gap-2 mb-1">
                  <span className="text-sm text-primary">
                    [{ref.id}] {ref.source}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Action buttons - 仅在非转发模式和会员状态下显示 */}
          {!forwardMode && isMember && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
              {/* TTS Button */}
              <button
                onClick={() => handleTTS(conv.id)}
                className={`p-2 rounded-xl transition-all ${
                  playingTTS === conv.id
                    ? "glass-primary"
                    : "glass-button hover:bg-primary/20"
                }`}
                title="朗读"
              >
                <Volume2 className={`h-5 w-5 ${playingTTS === conv.id ? "animate-pulse" : ""}`} />
              </button>
              
              {/* Like Button */}
              <button
                onClick={() => handleLike(conv.id)}
                className={`p-2 rounded-xl transition-all ${
                  conv.liked
                    ? "glass-primary"
                    : "glass-button hover:bg-primary/20"
                }`}
                title="点赞"
              >
                <ThumbsUp className={`h-5 w-5 ${conv.liked ? "fill-current" : ""}`} />
              </button>
              
              {/* Dislike Button */}
              <button
                onClick={() => handleDislike(conv.id)}
                className={`p-2 rounded-xl transition-all ${
                  conv.disliked
                    ? "glass-primary"
                    : "glass-button hover:bg-primary/20"
                }`}
                title="点踩"
              >
                <ThumbsDown className={`h-5 w-5 ${conv.disliked ? "fill-current" : ""}`} />
              </button>
              
              {/* Copy Button */}
              <button
                onClick={() => handleCopy(conv.content, conv.id)}
                className="p-2 rounded-xl glass-button hover:bg-primary/20 transition-all"
                title="复制"
              >
                {copiedId === conv.id ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
              
              {/* Forward Button */}
              <button
                onClick={() => handleForwardMessage(conv.id)}
                className="p-2 rounded-xl glass-button hover:bg-primary/20 transition-all"
                title="转发"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Member-only blur overlay - 覆盖整个消息卡片包括操作按钮 */}
          {!isMember && (
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent backdrop-blur-sm rounded-2xl flex items-end justify-center pb-6 pt-32 z-10">
              <button
                onClick={() => setShowMemberModal(true)}
                className="glass-primary px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"
              >
                <Lock className="h-5 w-5" />
                <span className="text-base font-medium">开通会员查看完整答案</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 glass-header z-50 safe-area-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/lectures")}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium">{config.title}</h1>
          </div>
          
          {/* History button */}
          <button
            onClick={() => setShowChatModal(true)}
            className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
            title="查看历史对话"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-64 px-4 max-w-2xl mx-auto w-full relative z-10">
        {/* Podcast Transcript with highlight */}
        <div className="glass-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/30">
            <div className="w-10 h-10 glass-primary rounded-full flex items-center justify-center flex-shrink-0">
              🎙️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">播客内容</h3>
              <p className="text-sm text-muted-foreground">{config.host}</p>
            </div>
            {/* 转发按钮 */}
            <button
              onClick={() => setShowPodcastShareSheet(true)}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
              title="转发播客内容"
            >
              <Share2 className="h-5 w-5 text-primary" />
            </button>
          </div>
          
          {/* Dynamic text with read/unread highlighting */}
          <div className="text-base leading-loose">
            {(() => {
              const readPos = getReadPosition();
              const text = podcastTranscript;
              
              // Split text into read and unread parts
              const readText = text.slice(0, readPos);
              const currentChar = text.slice(readPos, readPos + 20); // Current reading window
              const unreadText = text.slice(readPos + 20);
              
              return (
                <>
                  {/* Already read text - gray color */}
                  <span className="text-gray-500">
                    {readText}
                  </span>
                  
                  {/* Currently reading text - highlighted */}
                  <span className="bg-primary/30 text-gray-900 font-medium px-1 rounded">
                    {currentChar}
                  </span>
                  
                  {/* Unread text - normal color */}
                  <span className="text-gray-800">
                    {unreadText}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      </div>
      
      {/* Fixed player controls */}
      <div className="fixed bottom-0 left-0 right-0 glass-header border-b-0 z-50 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          {/* Countdown tip - above controls */}
          {showTip && (
            <div className="px-4 pt-3">
              <div className="glass-primary rounded-2xl px-4 py-3 shadow-lg animate-fadeIn">
                <p className="text-sm text-center">
                  有听不懂的，点击语音键提问哦 ({countdown}s)
                </p>
              </div>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="px-4 pt-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
              <span>{formatTime(currentTime)}</span>
              <div className="flex items-center gap-2">
                {/* Skip Backward 10s */}
                <button
                  onClick={handleSkipBackward}
                  className="p-2 glass-button hover:bg-primary/20 rounded-full transition-all active:scale-95"
                  title="后退10秒"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                
                {/* Chapter list button */}
                <button
                  onClick={() => setShowChapterList(!showChapterList)}
                  className="px-3 py-1 glass-button hover:bg-primary/20 rounded-full transition-all text-sm flex items-center gap-1"
                >
                  <List className="h-4 w-4" />
                  章节
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-3 py-1 glass-button hover:bg-primary/20 rounded-full transition-all text-sm flex items-center gap-1"
                  >
                    {playbackSpeed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 glass-card rounded-2xl p-2 shadow-xl animate-fadeIn">
                      {speeds.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSpeedMenu(false);
                          }}
                          className={`block w-full px-4 py-2 rounded-xl text-sm transition-all ${
                            speed === playbackSpeed
                              ? "glass-primary"
                              : "hover:bg-primary/10"
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Skip Forward 10s */}
                <button
                  onClick={handleSkipForward}
                  className="p-2 glass-button hover:bg-primary/20 rounded-full transition-all active:scale-95"
                  title="前进10秒"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Segmented progress bar */}
            <div className="h-2 glass-input rounded-full overflow-hidden shadow-inner flex gap-1 p-0.5">
              {chapters.map((chapter, index) => {
                const chapterProgress = ((currentTime - chapter.startTime) / chapter.duration) * 100;
                const isActive = currentTime >= chapter.startTime && currentTime < chapter.startTime + chapter.duration;
                const isPassed = currentTime >= chapter.startTime + chapter.duration;
                
                return (
                  <div
                    key={chapter.id}
                    className="flex-1 h-full rounded-full overflow-hidden bg-white/30"
                    style={{ flex: chapter.duration }}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPassed ? 'glass-primary' : isActive ? 'glass-primary' : ''
                      }`}
                      style={{ 
                        width: isPassed ? '100%' : isActive ? `${Math.max(0, Math.min(100, chapterProgress))}%` : '0%'
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-center gap-6">
              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-5 glass-primary rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </button>
              
              {/* Voice/Mic - Opens chat modal */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setShowChatModal(true)}
                  className="p-4 glass-primary rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Mic className="h-7 w-7" />
                </button>
                <span className="text-sm text-muted-foreground">提问</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chapter List Modal */}
      {showChapterList && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowChapterList(false)}
        >
          <div
            className="glass-card rounded-t-3xl p-6 max-w-2xl w-full max-h-[70vh] overflow-y-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">章节列表</h2>
              <button
                onClick={() => setShowChapterList(false)}
                className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {chapters.map((chapter, index) => {
                const isActive = currentTime >= chapter.startTime && currentTime < chapter.startTime + chapter.duration;
                const isPassed = currentTime >= chapter.startTime + chapter.duration;
                const isLocked = index > 0 && !isMember;
                
                return (
                  <button
                    key={chapter.id}
                    onClick={() => jumpToChapter(index)}
                    className={`w-full text-left glass-button hover:glass-primary rounded-2xl p-4 transition-all ${
                      isActive ? "ring-2 ring-primary/50" : ""
                    } ${isLocked ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-medium">{chapter.title}</h3>
                          {isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          时长: {formatTime(chapter.duration)}
                        </p>
                      </div>
                      {!isLocked && isPassed && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {!isLocked && isActive && (
                        <div className="w-6 h-6 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Modal */}
      {showChatModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowChatModal(false)}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
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
                    <h2 className="text-xl font-medium">{config.expertName}</h2>
                    
                    {/* 和我电话按钮 */}
                    <button
                      onClick={() => {
                        // 检查会员状态
                        if (!isMember) {
                          setShowMemberModal(true);
                          return;
                        }
                        
                        setShowChatModal(false);
                        navigate(`/call/${config.expertId}`, { 
                          state: { 
                            returnTo: `/podcast/${style}`,
                            returnToChatModal: true
                          } 
                        });
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 glass-primary rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">和我电话</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.filter(conv => conv.type !== "podcast").map((conv, index, filteredMessages) => {
                // 判断消息是否被锁定
                // 规则：第一对对话（用户问题+AI回答）是免费的，其余需要会员
                let isMessageLocked = false;
                
                if (conv.type === "ai") {
                  // AI消息：找到它在过滤后列表中的位置
                  // 第一条AI消息（index=1）是免费的，其他需要会员
                  if (index > 1 && !isMember) {
                    isMessageLocked = true;
                  }
                } else if (conv.type === "user") {
                  // 用户消息：找到对应的AI消息
                  // 第一条用户消息（index=0）是免费的，其他需要检查对应的AI消息
                  if (index > 0) {
                    // 不是第一条用户消息，检查对应的AI消息是否被锁定
                    for (let i = index + 1; i < filteredMessages.length; i++) {
                      if (filteredMessages[i].type === "ai") {
                        // 找到了对应的AI消息，检查它的索引
                        if (i > 1 && !isMember) {
                          isMessageLocked = true;
                        }
                        break;
                      }
                    }
                  }
                }
                
                return (
                  <div key={conv.id} className="flex items-start gap-3">
                    {/* 选择框 - 只有在转发模式下且未被锁定时才显示 */}
                    {forwardMode && !isMessageLocked && (
                      <button
                        onClick={() => toggleMessageSelection(conv.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedMessages.has(conv.id)
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {selectedMessages.has(conv.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                    
                    {conv.type === "user" ? (
                      <div className="flex-1 flex justify-end animate-fadeIn">
                        <div className="max-w-[80%] glass-primary rounded-2xl px-5 py-3 shadow-md">
                          <p className="text-base leading-relaxed">{conv.content}</p>
                        </div>
                      </div>
                    ) : conv.type === "ai" ? (
                      <div className="flex-1">
                        {renderAIMessage(conv)}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            
            {/* Input Area - 仅在非转发模式下显示 */}
            {!forwardMode && (
              <div className="border-t border-white/30 pt-4">
                <div className="flex items-end gap-3">
                  {chatInputMode === "voice" ? (
                    // 语音输入模式（默认）
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 glass-button hover:bg-primary/25 rounded-2xl transition-all active:scale-95 flex-shrink-0"
                      >
                        <ImagePlus className="h-6 w-6 text-primary" />
                      </button>
                      
                      <button 
                        onClick={() => setChatInputMode("text")}
                        className="flex-1 flex items-center justify-center gap-3 h-14 glass-primary rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl active:scale-98 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                        <Mic className="h-7 w-7 relative z-10" />
                        <span className="text-lg relative z-10">按住说话</span>
                      </button>
                      
                      <button 
                        onClick={() => setChatInputMode("text")}
                        className="p-3 glass-button hover:bg-primary/25 rounded-2xl transition-all active:scale-95 flex-shrink-0"
                      >
                        <Send className="h-6 w-6 text-primary" />
                      </button>
                    </>
                  ) : (
                    // 文字输入模式
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 glass-button hover:bg-primary/25 rounded-2xl transition-all active:scale-95 flex-shrink-0"
                      >
                        <ImagePlus className="h-6 w-6 text-primary" />
                      </button>
                      
                      <div className="flex-1 glass-input rounded-2xl flex items-center px-4 py-2">
                        <textarea
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          placeholder="输入您的问题..."
                          className="flex-1 bg-transparent resize-none outline-none text-base py-2 max-h-32"
                          rows={1}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                          }}
                        />
                      </div>
                      
                      <button 
                        onClick={() => setChatInputMode("voice")}
                        className="p-3 glass-primary rounded-2xl hover:opacity-95 transition-all active:scale-95 flex-shrink-0"
                      >
                        <Mic className="h-6 w-6" />
                      </button>
                      
                      <button
                        disabled={!chatInputText.trim()}
                        onClick={handleSendMessage}
                        className="p-3 glass-primary rounded-2xl hover:opacity-95 transition-all active:scale-95 flex-shrink-0 disabled:opacity-50"
                      >
                        <Send className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* 转发模式底部分享按钮 */}
            {forwardMode && showShareSheet && (
              <div className="border-t border-white/30 pt-4">
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
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
      
      {/* Podcast Share Sheet - 吸底分享弹窗 */}
      {showPodcastShareSheet && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowPodcastShareSheet(false)}
        >
          <div
            className="glass-card rounded-t-3xl p-6 max-w-2xl w-full animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowPodcastShareSheet(false);
                  // 显示播客专用分卡片览
                  setTimeout(() => setShowPodcastShareCardPreview(true), 200);
                }}
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
                onClick={() => {
                  setShowPodcastShareSheet(false);
                  // 显示播客专用图片分享
                  setTimeout(() => setShowPodcastShareImagePreview(true), 200);
                }}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <Image className="h-6 w-6 text-white" />
                <span className="text-base font-semibold text-white">生成图片</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Podcast Share Card Preview - 播客专用分享卡片 */}
      <PodcastShareCardPreview
        isOpen={showPodcastShareCardPreview}
        onClose={() => setShowPodcastShareCardPreview(false)}
        bookTitle="糖尿病疗法"
        styleTitle={`${config.expertName}${config.title}`}
        bookCover="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
        podcastStyle={style as string}
        userName="张大爷"
      />
      
      {/* Podcast Share Image Preview - 播客专用分享图片 */}
      <PodcastShareImagePreview
        isOpen={showPodcastShareImagePreview}
        onClose={() => setShowPodcastShareImagePreview(false)}
        userName="张大爷"
        bookTitle="糖尿病疗法"
        styleTitle={`${config.expertName}详细讲解`}
        bookCover="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
      />
      
      {/* Member Modal */}
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
        messages={
          selectedMessages.size > 0
            ? chatMessages
                .filter(m => selectedMessages.has(m.id))
                .map(m => ({
                  id: m.id,
                  type: m.type === "ai" ? "expert" : "user",
                  content: m.content
                }))
            : [{ id: "podcast-content", type: "expert", content: podcastTranscript }]
        }
        userName="我"
        expertName={config.expertName}
      />
      
      {/* Share Card Preview */}
      <ShareCardPreview
        isOpen={showShareCardPreview}
        onClose={() => {
          setShowShareCardPreview(false);
          setForwardMode(false);
          setSelectedMessages(new Set());
        }}
        messages={
          selectedMessages.size > 0
            ? chatMessages
                .filter(m => selectedMessages.has(m.id))
                .map(m => ({
                  id: m.id,
                  type: m.type === "ai" ? "expert" : "user",
                  content: m.content
                }))
            : [{ id: "podcast-content", type: "expert", content: podcastTranscript }]
        }
        userName="我"
        expertName={config.expertName}
      />
    </div>
  );
}