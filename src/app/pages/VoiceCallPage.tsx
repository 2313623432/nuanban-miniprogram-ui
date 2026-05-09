import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Phone, MicOff, Mic } from "lucide-react";
import xiaoNuanAvatar from "figma:asset/0920eea3eda0373cd901e9b3b15d14e3d2555646.png";
import { VoiceWave } from "@/app/components/VoiceWave";
import { experts } from "@/app/data/experts";

// 语音对话状态
type VoiceState = "idle" | "listening" | "userSpeaking" | "generating" | "aiSpeaking" | "muted" | "ended";

interface VoiceMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: number;
}

export function VoiceCallPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 根据ID获取对应的专家信息，如果没有则使用小暖作为默认
  const expert = experts.find(e => e.id === id);
  const expertName = expert ? expert.name : "小暖";
  const expertAvatar = expert ? expert.avatar : xiaoNuanAvatar;
  
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentUserText, setCurrentUserText] = useState("");
  const [currentAIText, setCurrentAIText] = useState("");
  const [statusText, setStatusText] = useState("正在连接...");
  
  // 模拟声波数据
  const [waveAmplitude, setWaveAmplitude] = useState(0);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  
  // 初始化语音对话
  useEffect(() => {
    // 模拟连接延迟
    setTimeout(() => {
      setVoiceState("aiSpeaking");
      setStatusText("小暖在说话...");
      
      // AI主动问候
      const greeting = "你好，我在。今天想聊点什么？";
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < greeting.length) {
          setCurrentAIText(greeting.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          
          // 问候结束，保存消息并进入监听状态
          setTimeout(() => {
            setMessages([{
              id: Date.now().toString(),
              type: "ai",
              content: greeting,
              timestamp: Date.now()
            }]);
            setCurrentAIText("");
            setVoiceState("listening");
            setStatusText("我在听，你说~");
          }, 500);
        }
      }, 80);
      
      return () => clearInterval(interval);
    }, 1000);
  }, []);
  
  // 监听状态变化，更新提示语
  useEffect(() => {
    switch (voiceState) {
      case "listening":
        setStatusText("我在听，你说~");
        setWaveAmplitude(0.3);
        break;
      case "userSpeaking":
        setStatusText("听着呢...");
        setWaveAmplitude(1.0); // 用户说话时最大振幅
        break;
      case "generating":
        setStatusText("思考中...");
        setWaveAmplitude(0.4);
        break;
      case "aiSpeaking":
        setStatusText("说话或点击打断");
        setWaveAmplitude(0.85); // AI说话时也有较大振幅
        break;
      case "muted":
        setStatusText("你已静音，我听不到声音");
        setWaveAmplitude(0);
        break;
      default:
        setWaveAmplitude(0);
    }
  }, [voiceState]);
  
  // 模拟用户说话（用于测试，实际应通过VAD检测）
  useEffect(() => {
    if (voiceState === "listening" && !isMuted) {
      // 模拟5秒后用户开始说话
      const timer = setTimeout(() => {
        simulateUserSpeaking();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [voiceState, isMuted]);
  
  const simulateUserSpeaking = () => {
    setVoiceState("userSpeaking");
    
    // 模拟语音识别
    const userMessage = "我最近血糖有点高，该怎么办？";
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < userMessage.length) {
        setCurrentUserText(userMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        
        // 识别完成后，进入生成状态
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: "user",
            content: userMessage,
            timestamp: Date.now()
          }]);
          setCurrentUserText("");
          setVoiceState("generating");
          
          // 模拟AI生成回复
          setTimeout(() => {
            simulateAIResponse();
          }, 1500);
        }, 300);
      }
    }, 100);
  };
  
  const simulateAIResponse = () => {
    setVoiceState("aiSpeaking");
    
    const aiResponse = "别担心，我先帮你分析一下可能的原因。血糖升高通常与饮食、运动和用药有关。";
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < aiResponse.length) {
        setCurrentAIText(aiResponse.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        
        // 回复完成，保存消息并进入监听状态
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: "ai",
            content: aiResponse,
            timestamp: Date.now()
          }]);
          setCurrentAIText("");
          setVoiceState("listening");
        }, 500);
      }
    }, 80);
  };
  
  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      if (voiceState === "muted") {
        setVoiceState("listening");
      }
    } else {
      setIsMuted(true);
      setVoiceState("muted");
    }
  };
  
  const handleHangup = () => {
    // 挂断后返回页面
    setVoiceState("ended");
    
    // 检查是否从播客页面来
    const returnTo = (location.state as any)?.returnTo;
    const returnToChatModal = (location.state as any)?.returnToChatModal;
    const fromAiHomePage = (location.state as any)?.fromAiHomePage;
    
    if (returnTo) {
      // 从播客页面来的，返回播客页面
      if (returnToChatModal) {
        // 如果需要打开聊天弹窗，传递标志和语音消息
        navigate(returnTo, {
          state: {
            returnToChatModal: true,
            voiceMessages: messages
          }
        });
      } else {
        // 否则只返回播客页面
        navigate(returnTo);
      }
    } else if (fromAiHomePage) {
      // 从AiHomePage来的，返回AiHomePage并传递语音消息
      navigate('/', {
        state: {
          voiceMessages: messages,
          isVoiceEnded: true,
          returnToChatModal: true
        }
      });
    } else {
      // 从其他地方来的，将语音对话消息传递回聊天页面
      navigate(`/chat/${id}`, {
        state: {
          voiceMessages: messages,
          isVoiceEnded: true
        }
      });
    }
  };
  
  // 获取最近3-4条消息用于显示
  const displayMessages = messages.slice(-3);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* 整体容器 */}
      <div className="relative z-10 flex flex-col h-screen max-w-2xl mx-auto w-full">
        
        {/* ① 小暖虚拟形象区 */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4" style={{ height: '160px' }}>
          <div className="relative mb-3">
            <img 
              src={expertAvatar} 
              alt={expertName} 
              className="h-24 w-24 object-contain animate-breathing"
            />
            
            {/* AI说话时的光效 */}
            {voiceState === "aiSpeaking" && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
            )}
          </div>
          
          {/* 小暖名字 */}
          <h2 className="text-2xl font-semibold text-gray-800">{expertName}</h2>
        </div>
        
        {/* ② 对话内容展示区（主视觉区域，占比45-55%） */}
        <div className="flex-1 flex flex-col justify-center px-6 overflow-y-auto scrollbar-hide" style={{ maxHeight: '55vh' }}>
          <div className="space-y-4">
            {displayMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex animate-fadeIn ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] px-5 py-3.5 rounded-3xl shadow-md ${
                  msg.type === "user" 
                    ? "glass-primary rounded-tr-md" 
                    : "glass-card rounded-tl-md"
                }`}>
                  <p className="text-lg leading-relaxed" style={{ lineHeight: '1.5' }}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            
            {/* 当前用户正在说的话（实时识别） */}
            {currentUserText && (
              <div className="flex justify-end animate-fadeIn">
                <div className="max-w-[75%] px-5 py-3.5 rounded-3xl rounded-tr-md glass-primary shadow-md">
                  <p className="text-lg leading-relaxed" style={{ lineHeight: '1.5' }}>
                    {currentUserText}
                    <span className="inline-block w-1 h-5 bg-current ml-1 animate-blink"></span>
                  </p>
                </div>
              </div>
            )}
            
            {/* 当前AI正在说的话（实时生成） */}
            {currentAIText && (
              <div className="flex justify-start animate-fadeIn">
                <div className="max-w-[75%] px-5 py-3.5 rounded-3xl rounded-tl-md glass-card shadow-md">
                  <p className="text-lg leading-relaxed" style={{ lineHeight: '1.5' }}>
                    {currentAIText}
                    <span className="inline-block w-1 h-5 bg-current ml-1 animate-blink"></span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* ③ 声波区 + 提示语 */}
        <div className="flex flex-col items-center justify-center py-6" style={{ height: '120px' }}>
          {/* 动态声波 */}
          <VoiceWave amplitude={waveAmplitude} />
          
          {/* 状态提示语 */}
          <p className="text-sm text-gray-600 text-center">
            {statusText}
          </p>
        </div>
        
        {/* ④ 操作按钮区（静音 / 挂断） */}
        <div className="flex items-center justify-center gap-8 pb-safe pb-8">
          {/* 静音按钮 */}
          <button
            onClick={handleMuteToggle}
            className={`p-4 rounded-full shadow-lg transition-all active:scale-95 ${
              isMuted 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-white/80 hover:bg-white"
            }`}
            aria-label={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? (
              <MicOff className="h-7 w-7 text-white" />
            ) : (
              <Mic className="h-7 w-7 text-gray-700" />
            )}
          </button>
          
          {/* 挂断按钮 */}
          <button
            onClick={handleHangup}
            className="p-5 rounded-full bg-red-500 hover:bg-red-600 shadow-xl transition-all active:scale-95"
            aria-label="挂断"
          >
            <Phone className="h-8 w-8 text-white transform rotate-[135deg]" />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        .animate-breathing {
          animation: breathing 3s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}