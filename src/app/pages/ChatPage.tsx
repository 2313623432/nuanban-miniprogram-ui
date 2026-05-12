import { MembershipModal } from "@/app/components/MembershipModal";
import { ShareImagePreview } from "@/app/components/ShareImagePreview";
import { ShareCardPreview } from "@/app/components/ShareCardPreview";
import wechatLogo from "figma:asset/667e7fc3b19f62b1d1f1468a589d3d89f9fb3443.png";
import { toast } from "sonner";
import { useParams, useNavigate, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useMembership } from "@/app/contexts/MembershipContext";
import { ArrowLeft, Mic, Send, ImagePlus, ThumbsUp, ThumbsDown, Copy, Share2, Check, Keyboard, Image, Crown, ChevronDown, ChevronUp, Play, Pause, Volume2, X, Phone, BookOpen, Heart, Maximize2, Download } from "lucide-react";
import { experts } from "@/app/data/experts";

interface Message {
  id: string;
  type: "user" | "expert" | "reference" | "image" | "steps" | "video";
  content?: string;
  references?: { id: number; source: string }[];
  source?: string;
  expanded?: boolean;
  title?: string;
  url?: string;
  description?: string;
  steps?: string[];
  coverUrl?: string;
  duration?: string;
  liked?: boolean;
  disliked?: boolean;
}

export function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMember, activateMembership } = useMembership();
  
  // 获取从首页传递过来的初始消息
  const initialMessage = location.state?.initialMessage;
  const isNewConversation = location.state?.isNewConversation;
  
  // 获取从语音通话返回的消息
  const voiceMessages = location.state?.voiceMessages;
  const isVoiceEnded = location.state?.isVoiceEnded;
  
  const expert = id === "new" ? null : experts.find((e) => e.id === id);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // 转发功能相关状态
  const [forwardMode, setForwardMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showShareImagePreview, setShowShareImagePreview] = useState(false);
  const [showShareCardPreview, setShowShareCardPreview] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  
  // 初始化对话
  useEffect(() => {
    if (isVoiceEnded && voiceMessages) {
      // 从语音通话返回，转换并加载消息
      const convertedMessages: Message[] = voiceMessages.map((vm: any) => ({
        id: vm.id,
        type: vm.type === "ai" ? "expert" : "user",
        content: vm.content
      }));
      
      setMessages(convertedMessages);
      
      // 添加分隔符
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: "expert",
          content: "\n--本次语音对话已结束--\n"
        }]);
      }, 300);
      
    } else if (isNewConversation && initialMessage) {
      // 添加用户的初始消息
      const userMsg: Message = {
        id: Date.now().toString(),
        type: "user",
        content: initialMessage
      };
      
      setMessages([userMsg]);
      setIsGenerating(true);
      
      // 模拟AI回复
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "expert",
          content: generateAIResponse(initialMessage),
          references: [
            { id: 1, source: "《糖尿病自我管理指南》(第3版)" }
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsGenerating(false);
      }, 1500);
    } else if (!isNewConversation && id !== "new") {
      // 加载已有对话的历史记录
      setMessages(getDefaultMessages());
    }
  }, [initialMessage, isNewConversation, id, voiceMessages, isVoiceEnded]);
  
  const generateAIResponse = (userQuestion: string): string => {
    // 根据用户问题生成AI回复
    return `您好！我已经收到了您的问题："${userQuestion}"。\n\n让我为您详细分析一下。根据中医理论和现代医学研究[1]，针对您的情况，我建议从以下几个方面着手：\n\n【健康建议】\n1. 调整日常饮食结构，多吃蔬菜水果\n2. 保持规律作息，每天充足睡眠\n3. 适度运动，建议每天步行30分钟\n4. 保持良好心态，避免过度焦虑\n\n【中医调理】\n根据您的体质特点，可以适当使用一些温和的调理方法，比如穴位按摩、食疗等。具体方案需要根据您的详细情况来定制。\n\n如果您有更具体的问题，欢迎继续向我咨询！`;
  };
  
  const getDefaultMessages = (): Message[] => {
    return [
      {
        id: "1",
        type: "user",
        content: "我最近血糖有点高,该怎么办?"
      },
      {
        id: "2",
        type: "expert",
        content: "别担心,我先帮你分析一下可能的原因。血糖升高通常与饮食、运动和用药有关[1]。让我为您详细说明一下控制血糖的关键方法。",
        references: [
          { id: 1, source: "《糖尿病自我管理指南》(第3版)" }
        ]
      },
      {
        id: "3",
        type: "reference",
        content: "根据《糖尿病疗法》第二章的内容...",
        source: "来自《糖尿病疗法》p.45-48",
        expanded: false
      },
      {
        id: "4",
        type: "image",
        title: "血糖控制饮食建议",
        url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
        description: "这是为你生成的饮食金字塔图示"
      },
      {
        id: "5",
        type: "expert",
        content: "建议你每天按照这个饮食金字塔来安排饮食[2]，多吃蔬菜，控制主食量。同时要注意，糖尿病患者应该选择低GI（血糖生成指数）的食物[3]，这样可以更好地稳定血糖。",
        references: [
          { id: 2, source: "《中国居民膳食指南》(2022版)" },
          { id: 3, source: "《低GI饮食法》" }
        ]
      },
      {
        id: "6",
        type: "steps",
        title: "今日饮食建议3步",
        steps: [
          "早餐:全麦面包1片 + 鸡蛋1个 + 牛奶200ml",
          "午餐:米饭半碗 + 清蒸鱼100g + 青菜200g",
          "晚餐:杂粮粥1碗 + 豆腐100g + 炒蔬菜150g"
        ]
      }
    ];
  };
  
  const handleSend = () => {
    if (message.trim()) {
      // 添加用户消息
      const userMsg: Message = {
        id: Date.now().toString(),
        type: "user",
        content: message
      };
      
      setMessages(prev => [...prev, userMsg]);
      setMessage("");
      setIsGenerating(true);
      
      // 模拟AI回复
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "expert",
          content: generateAIResponse(message),
          references: [
            { id: 1, source: "《糖尿病自我管理指南》(第3版)" }
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsGenerating(false);
      }, 1500);
    }
  };
  
  const handleVoiceInput = () => {
    // 语音输入逻辑
    console.log("开始语音输入");
  };
  
  // 将带有引用标注的文本转换为React元素
  const renderTextWithReferences = (text: string) => {
    // 匹配 [数字] 格式的引用标注
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
  
  // 判断消息是否被锁定的通用函数
  const isMessageLocked = (messageId: string): boolean => {
    // 会员可以访问所有消息
    if (isMember) return false;
    
    // 过滤出只有 user 和 expert 类型的消息
    const userExpertMessages = messages.filter(m => m.type === "user" || m.type === "expert");
    
    // 找到当前消息在过滤后列表中的索引
    const userExpertIndex = userExpertMessages.findIndex(m => m.id === messageId);
    
    // 如果找不到或者是前两条（第一对对话），则不锁定
    if (userExpertIndex === -1 || userExpertIndex <= 1) {
      return false;
    }
    
    // 第二对及以后的对话需要会员
    return true;
  };
  
  // 转发功能处理函数
  const handleForwardMessage = (messageId: string) => {
    // 检查消息是否被锁定
    if (isMessageLocked(messageId)) {
      setShowMemberModal(true);
      return;
    }
    
    // 找到当前消息的索引
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = messages[messageIndex];
    
    // 只有 expert 消息才能触发转发
    if (message.type !== "expert") {
      return;
    }
    
    // 进入转发模式
    setForwardMode(true);
    
    // 自动选中当前AI消息和对应的用户问题
    const newSelected = new Set<string>();
    newSelected.add(messageId);
    
    // 向前查找对应的用户问题
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        // 只选择未被锁定的用户消息
        if (!isMessageLocked(messages[i].id)) {
          newSelected.add(messages[i].id);
        }
        break;
      }
    }
    
    setSelectedMessages(newSelected);
    
    // 直接显示分享选项
    setShowShareSheet(true);
  };
  
  const toggleMessageSelection = (messageId: string) => {
    // 检查消息是否被锁定
    if (isMessageLocked(messageId)) {
      setShowMemberModal(true);
      return;
    }
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const currentMessage = messages[messageIndex];
    const newSelected = new Set(selectedMessages);
    
    if (currentMessage.type === "user") {
      // 如果点击用户消息，成对选择/取消用户+AI
      if (newSelected.has(messageId)) {
        // 取消选择：移除用户消息和后续的AI消息
        newSelected.delete(messageId);
        for (let i = messageIndex + 1; i < messages.length; i++) {
          if (messages[i].type === "expert") {
            newSelected.delete(messages[i].id);
            break;
          }
        }
      } else {
        // 选择：添加用户消息和后续的AI消息（需要检查是否被锁定）
        newSelected.add(messageId);
        for (let i = messageIndex + 1; i < messages.length; i++) {
          if (messages[i].type === "expert") {
            // 只选择未被锁定的AI消息
            if (!isMessageLocked(messages[i].id)) {
              newSelected.add(messages[i].id);
            }
            break;
          }
        }
      }
    } else if (currentMessage.type === "expert") {
      // 如果点击AI消息，成对选择/取消用户+AI
      if (newSelected.has(messageId)) {
        // 取消选择：移除AI消息和前面的用户消息
        newSelected.delete(messageId);
        for (let i = messageIndex - 1; i >= 0; i--) {
          if (messages[i].type === "user") {
            newSelected.delete(messages[i].id);
            break;
          }
        }
      } else {
        // 选择：添加AI消息和前面的用户消息（需要检查是否被锁定）
        newSelected.add(messageId);
        for (let i = messageIndex - 1; i >= 0; i--) {
          if (messages[i].type === "user") {
            // 只选择未被锁定的用户消息
            if (!isMessageLocked(messages[i].id)) {
              newSelected.add(messages[i].id);
            }
            break;
          }
        }
      }
    }
    
    setSelectedMessages(newSelected);
  };
  
  const confirmForward = () => {
    if (selectedMessages.size === 0) {
      toast.error("请选择要转发的消息");
      return;
    }
    setShowShareSheet(true);
  };
  
  const cancelForwardMode = () => {
    setForwardMode(false);
    setSelectedMessages(new Set());
    setShowShareSheet(false);
  };
  
  const handleShareToWechat = () => {
    if (selectedMessages.size === 0) {
      toast.error("请选择要转发的消息");
      return;
    }
    
    // 关闭分享面板，显示分享卡片预览
    setShowShareSheet(false);
    setShowShareCardPreview(true);
  };
  
  const handleGenerateImage = () => {
    if (selectedMessages.size === 0) {
      toast.error("请选择要转发的消息");
      return;
    }
    
    // 关闭分享面板，显示图片预览
    setShowShareSheet(false);
    setShowShareImagePreview(true);
  };
  
  const toggleLike = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId
        ? { ...msg, liked: !msg.liked, disliked: false }
        : msg
    ));
  };
  
  const toggleDislike = (messageId: string) => {
    setMessages(messages.map(msg =>
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] flex flex-col relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Enhanced Custom Header */}
      <div className="fixed top-0 left-0 right-0 glass-header z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
              aria-label="返回"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium">{expert ? expert.name : "新对"}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 glass-button rounded-full text-sm shadow-sm">
              {expert ? expert.dialect : "打电话聊"}
            </span>
            <button
              onClick={() => {
                // 检查会员状态
                if (!isMember) {
                  setShowMemberModal(true);
                  return;
                }
                navigate(`/call/${expert?.id}`);
              }}
              className="p-2 glass-primary rounded-full transition-all hover:shadow-lg active:scale-95"
              aria-label="语音通话"
            >
              <Phone className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages container with safe area */}
      <div className="flex-1 overflow-y-auto pt-20 pb-32 px-4 max-w-2xl mx-auto w-full relative z-10">
        {/* 转发模式顶部取消按钮 */}
        {forwardMode && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                onClick={cancelForwardMode}
                className="px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 transition-all active:scale-95"
              >
                取消
              </button>
              <h3 className="text-base font-semibold text-gray-800">选择消息</h3>
              <div className="w-16"></div> {/* 占位元素，保持居中 */}
            </div>
          </div>
        )}
        
        <div className="space-y-4 py-4">
          {messages.map((msg, index) => {
            // 判断消息是否被锁定
            // 规则：只计算 user 和 expert 类型的消息，第一对对话（index 0-1）是免费的，其余需要会员
            // 需要过滤出只有 user 和 expert 的消息来计算索引
            const userExpertMessages = messages.filter(m => m.type === "user" || m.type === "expert");
            const userExpertIndex = userExpertMessages.findIndex(m => m.id === msg.id);
            
            let isMessageLocked = false;
            
            if (msg.type === "user") {
              return (
                <div key={msg.id} className="flex items-start animate-fadeIn">
                  {/* 选择框 - 只有在转发模式下且未被锁定时才显示 */}
                  {forwardMode && !isMessageLocked && (
                    <button
                      onClick={() => toggleMessageSelection(msg.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-2 transition-all ${
                        selectedMessages.has(msg.id)
                          ? "border-green-500 bg-green-500"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {selectedMessages.has(msg.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  )}
                  
                  <div className="flex-1 flex justify-end">
                    <div className="max-w-[80%] glass-primary rounded-3xl rounded-tr-md px-6 py-4 shadow-lg">
                      <p className="text-lg leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              );
            }
            
            if (msg.type === "expert") {
              return (
                <div key={msg.id} className="flex items-start animate-fadeIn">
                  {/* 选择框 - 只有在转发模式下且未被锁定时才显示 */}
                  {forwardMode && !isMessageLocked && (
                    <button
                      onClick={() => toggleMessageSelection(msg.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-2 transition-all ${
                        selectedMessages.has(msg.id)
                          ? "border-green-500 bg-green-500"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {selectedMessages.has(msg.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  )}
                  
                  <div className="flex-1">
                    <div className="max-w-[80%] glass-card rounded-3xl rounded-tl-md px-6 py-4 shadow-md">
                      <p className="text-lg leading-relaxed">{renderTextWithReferences(msg.content)}</p>
                      {msg.references && msg.references.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/30">
                          <p className="text-sm text-muted-foreground mb-2">参考来源：</p>
                          {msg.references.map((ref) => (
                            <div key={ref.id} className="flex items-start gap-2 mb-1">
                              <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-primary">
                                [{ref.id}] {ref.source}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 操作按钮 - 仅在非转发模式下显示 */}
                      {!forwardMode && (
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/30">
                          <button
                            onClick={() => toggleLike(msg.id)}
                            className={`p-2 rounded-lg transition-all active:scale-95 ${
                              msg.liked 
                                ? "bg-orange-100 text-orange-500" 
                                : "bg-white/80 hover:bg-white text-gray-600"
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleDislike(msg.id)}
                            className={`p-2 rounded-lg transition-all active:scale-95 ${
                              msg.disliked 
                                ? "bg-red-100 text-red-500" 
                                : "bg-white/80 hover:bg-white text-gray-600"
                            }`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleCopyMessage(msg.content || "", msg.id)}
                            className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all active:scale-95 flex items-center gap-1"
                          >
                            {copiedMessage === msg.id ? (
                              <>
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-500">已复制</span>
                              </>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleForwardMessage(msg.id)}
                            className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all active:scale-95"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            
            if (msg.type === "reference") {
              return (
                <div key={msg.id} className="flex justify-start animate-fadeIn">
                  <div className="max-w-[80%] glass-card rounded-3xl rounded-tl-md p-5 border-2 border-primary/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="text-sm text-primary font-medium">{msg.source}</span>
                    </div>
                    <p className="text-base leading-relaxed">
                      {msg.expanded ? msg.content : msg.content.slice(0, 50) + "..."}
                    </p>
                    <button className="text-primary text-sm mt-2 hover:underline">
                      {msg.expanded ? "收起" : "展开"}
                    </button>
                  </div>
                </div>
              );
            }
            
            if (msg.type === "image") {
              return (
                <div key={msg.id} className="flex justify-start animate-fadeIn">
                  <div className="max-w-[80%] glass-card rounded-3xl p-4 shadow-lg overflow-hidden">
                    <h4 className="text-lg font-medium mb-3">{msg.title}</h4>
                    <div className="relative rounded-2xl overflow-hidden mb-3 shadow-xl">
                      <img
                        src={msg.url}
                        alt={msg.title}
                        className="w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <p className="text-base text-muted-foreground mb-3">{msg.description}</p>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-4 py-2 glass-button hover:bg-primary/25 rounded-xl transition-all active:scale-95 shadow-sm">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">收藏</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 glass-button hover:bg-primary/25 rounded-xl transition-all active:scale-95 shadow-sm">
                        <Maximize2 className="h-4 w-4" />
                        <span className="text-sm">放大</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 glass-button hover:bg-primary/25 rounded-xl transition-all active:scale-95 shadow-sm">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">保存</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            
            if (msg.type === "steps") {
              return (
                <div key={msg.id} className="flex justify-start animate-fadeIn">
                  <div className="max-w-[80%] glass-card rounded-3xl p-5 shadow-lg">
                    <h4 className="text-lg font-medium mb-4">{msg.title}</h4>
                    <div className="space-y-3">
                      {msg.steps.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-8 h-8 glass-primary rounded-full flex items-center justify-center font-medium flex-shrink-0 shadow-md">
                            {index + 1}
                          </div>
                          <p className="text-base leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            
            return null;
          })}
          
          {isGenerating && (
            <div className="flex justify-start animate-fadeIn">
              <div className="max-w-[80%] glass-card rounded-3xl px-6 py-4 shadow-md">
                <p className="text-base text-muted-foreground">正在生成可视化内容...</p>
                <div className="flex gap-2 mt-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Input area */}
      {!forwardMode && (
        <div className="fixed bottom-20 left-0 right-0 p-4 z-50">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            {inputMode === "voice" ? (
              // 语音输入模式（默认）
              <>
                <button 
                  onClick={() => {
                    // 图片上传逻辑
                    console.log("上传图片");
                  }}
                  className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                >
                  <ImagePlus className="h-6 w-6 text-gray-700" />
                </button>
                
                <button 
                  onClick={handleVoiceInput}
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
                  onClick={() => {
                    // 图片上传逻辑
                    console.log("上传图片");
                  }}
                  className="p-3.5 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all active:scale-95"
                >
                  <ImagePlus className="h-6 w-6 text-gray-700" />
                </button>
                
                <div className="flex-1 rounded-2xl bg-white/90 shadow-lg focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="输您的问题..."
                    className="w-full px-5 py-4 bg-transparent outline-none text-base text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                
                {message.trim() ? (
                  // 有内容时显示发送按钮
                  <button 
                    onClick={handleSend}
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
      
      {/* Membership Modal */}
      <MembershipModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSuccess={(plan) => activateMembership(plan)}
      />
      
      {/* 转发模式底部按钮 */}
      {forwardMode && !showShareSheet && (
        <div className="fixed bottom-20 left-0 right-0 p-4 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
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
      
      {/* Share Sheet - 横向并列按钮 */}
      {showShareSheet && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
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
      
      {/* Share Image Preview */}
      {showShareImagePreview && (
        <ShareImagePreview
          isOpen={showShareImagePreview}
          onClose={() => {
            setShowShareImagePreview(false);
            setForwardMode(false);
            setSelectedMessages(new Set());
          }}
          messages={messages.filter(m => selectedMessages.has(m.id))}
          userName="我"
          expertName={expert?.name || "专家"}
        />
      )}
      
      {/* Share Card Preview */}
      {showShareCardPreview && (
        <ShareCardPreview
          isOpen={showShareCardPreview}
          onClose={() => {
            setShowShareCardPreview(false);
            setForwardMode(false);
            setSelectedMessages(new Set());
          }}
          messages={messages.filter(m => selectedMessages.has(m.id))}
          userName="我"
          expertName={expert?.name || "专家"}
        />
      )}
    </div>
  );
}