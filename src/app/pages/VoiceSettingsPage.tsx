import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Volume2, Gauge } from "lucide-react";

interface VoiceSettings {
  speed: number; // 0-4: 超慢速、慢速、常速、快速、超快速
  pitch: number; // 0-4: 超低音、低音、正常、高音、超高音
}

interface AllVoiceSettings {
  [voiceId: string]: VoiceSettings;
}

interface VirtualPerson {
  id: string;
  name: string;
  avatar: string;
}

export function VoiceSettingsPage() {
  const navigate = useNavigate();
  
  // 虚拟人列表
  const virtualPersons: VirtualPerson[] = [
    {
      id: "xiaonuan",
      name: "小暖",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
      id: "wang",
      name: "王专家",
      avatar: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1pZGRsZSUyMGFnZWQlMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2ODgyODg0MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "li",
      name: "李中医",
      avatar: "https://images.unsplash.com/photo-1616139041180-d93f6a89cc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbWlkZGxlJTIwYWdlZCUyMHBhbGUlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njg4Mjg4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "liu",
      name: "刘老师",
      avatar: "https://images.unsplash.com/photo-1767499912056-8f9bf8bad682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1pZGRsZSUyMGFnZWQlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODgyODg0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "zhang",
      name: "老张",
      avatar: "https://images.unsplash.com/photo-1765248149444-3d01d93f93e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwbWlkZGxlJTIwYWdlZCUyMGZlbWFsZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODgyODg0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const speedOptions = ["超慢速", "慢速", "常速", "快速", "超快速"];
  const pitchOptions = ["超低音", "低音", "正常", "高音", "超高音"];

  // 默认设置
  const defaultSettings: VoiceSettings = {
    speed: 2, // 默认常速
    pitch: 2  // 默认正常
  };

  // 从 localStorage 读取所有虚拟人的设置
  const [allSettings, setAllSettings] = useState<AllVoiceSettings>(() => {
    const saved = localStorage.getItem('voice-settings-all');
    return saved ? JSON.parse(saved) : {};
  });

  // 当前选中的虚拟人
  const [selectedVoice, setSelectedVoice] = useState<string>(() => {
    const saved = localStorage.getItem('voice-settings-selected');
    return saved || "xiaonuan";
  });

  // 当前虚拟人的设置
  const currentSettings = allSettings[selectedVoice] || defaultSettings;

  const [isPlaying, setIsPlaying] = useState(false);

  // 试听文本
  const previewText = "您好，我是您的健康小助手，很高兴为您服务。";

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem('voice-settings-all', JSON.stringify(allSettings));
    localStorage.setItem('voice-settings-selected', selectedVoice);
  }, [allSettings, selectedVoice]);

  // 播放试听
  const playPreview = () => {
    // 使用 Web Speech API 进行语音合成
    if ('speechSynthesis' in window) {
      // 停止当前播放
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(previewText);
      
      // 设置语速：0.5 (超慢) 到 2 (超快)
      const speedMap = [0.5, 0.75, 1, 1.5, 2];
      utterance.rate = speedMap[currentSettings.speed];
      
      // 设置音高：0.5 (超低) 到 2 (超高)
      const pitchMap = [0.5, 0.75, 1, 1.5, 2];
      utterance.pitch = pitchMap[currentSettings.pitch];
      
      utterance.lang = 'zh-CN';
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeedChange = (value: number) => {
    // 更新当前虚拟人的语速设置
    const newSettings = {
      ...allSettings,
      [selectedVoice]: {
        ...currentSettings,
        speed: value
      }
    };
    setAllSettings(newSettings);
    
    // 自动播放
    setTimeout(() => playPreview(), 100);
  };

  const handlePitchChange = (value: number) => {
    // 更新当前虚拟人的音高设置
    const newSettings = {
      ...allSettings,
      [selectedVoice]: {
        ...currentSettings,
        pitch: value
      }
    };
    setAllSettings(newSettings);
    
    // 自动播放
    setTimeout(() => playPreview(), 100);
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    
    // 自动播放新选中虚拟人的声音
    setTimeout(() => playPreview(), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 safe-area-top" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: '1.5px solid rgba(255, 138, 0, 0.2)',
        boxShadow: '0 4px 20px 0 rgba(255, 138, 0, 0.1), 0 1px 4px 0 rgba(255, 138, 0, 0.06)'
      }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 100 }}>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full flex items-center justify-center glass-button hover:bg-white/50 transition-all active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 text-gray-800" style={{ pointerEvents: 'none' }} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">声音调节</h1>
          </div>
        </div>
      </div>
      
      <div className="pt-24 px-4 max-w-2xl mx-auto pb-8 relative z-10">
        {/* 语速调节 */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 glass-primary rounded-2xl">
              <Gauge className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-medium">语速调节</h2>
              <p className="text-sm text-muted-foreground mt-1">{speedOptions[currentSettings.speed]}</p>
            </div>
          </div>
          
          <div className="px-2">
            {/* 滑动条 */}
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={currentSettings.speed}
              onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF8A00 0%, #FF8A00 ${currentSettings.speed * 25}%, rgba(255, 138, 0, 0.2) ${currentSettings.speed * 25}%, rgba(255, 138, 0, 0.2) 100%)`,
                outline: 'none'
              }}
            />
            
            {/* 刻度标签 */}
            <div className="flex justify-between mt-3 px-1">
              {speedOptions.map((option, index) => (
                <span
                  key={index}
                  className={`text-xs transition-colors ${
                    currentSettings.speed === index ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 音高调节 */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 glass-primary rounded-2xl">
              <Volume2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-medium">音高调节</h2>
              <p className="text-sm text-muted-foreground mt-1">{pitchOptions[currentSettings.pitch]}</p>
            </div>
          </div>
          
          <div className="px-2">
            {/* 滑动条 */}
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={currentSettings.pitch}
              onChange={(e) => handlePitchChange(parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF8A00 0%, #FF8A00 ${currentSettings.pitch * 25}%, rgba(255, 138, 0, 0.2) ${currentSettings.pitch * 25}%, rgba(255, 138, 0, 0.2) 100%)`,
                outline: 'none'
              }}
            />
            
            {/* 刻度标签 */}
            <div className="flex justify-between mt-3 px-1">
              {pitchOptions.map((option, index) => (
                <span
                  key={index}
                  className={`text-xs transition-colors ${
                    currentSettings.pitch === index ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 虚拟人选择 */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-medium mb-5">虚拟人选择</h2>
          
          <div className="grid grid-cols-5 gap-4">
            {virtualPersons.map((person) => (
              <button
                key={person.id}
                onClick={() => handleVoiceChange(person.id)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className={`relative w-16 h-16 rounded-full overflow-hidden ${
                  selectedVoice === person.id 
                    ? 'ring-4 ring-primary shadow-lg' 
                    : 'ring-2 ring-white/50'
                }`}>
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedVoice === person.id && (
                    <div className="absolute inset-0 bg-primary/20"></div>
                  )}
                  
                  {/* 音频播放动效 */}
                  {isPlaying && selectedVoice === person.id && (
                    <>
                      {/* 脉动波纹1 */}
                      <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-75"></div>
                      {/* 脉动波纹2 */}
                      <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse"></div>
                      {/* 音频图标 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-0.5 items-end">
                          <div className="w-1 bg-white rounded-full animate-audio-bar-1" style={{ height: '8px' }}></div>
                          <div className="w-1 bg-white rounded-full animate-audio-bar-2" style={{ height: '12px' }}></div>
                          <div className="w-1 bg-white rounded-full animate-audio-bar-3" style={{ height: '10px' }}></div>
                          <div className="w-1 bg-white rounded-full animate-audio-bar-4" style={{ height: '14px' }}></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  selectedVoice === person.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {person.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* 自定义滑动条样式 */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF8A00;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 138, 0, 0.4);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(255, 138, 0, 0.6);
        }
        
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF8A00;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(255, 138, 0, 0.4);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(255, 138, 0, 0.6);
        }

        /* 音频条动画 */
        @keyframes audio-bar-1 {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        
        @keyframes audio-bar-2 {
          0%, 100% { height: 12px; }
          50% { height: 20px; }
        }
        
        @keyframes audio-bar-3 {
          0%, 100% { height: 10px; }
          50% { height: 18px; }
        }
        
        @keyframes audio-bar-4 {
          0%, 100% { height: 14px; }
          50% { height: 22px; }
        }
        
        .animate-audio-bar-1 {
          animation: audio-bar-1 0.6s ease-in-out infinite;
        }
        
        .animate-audio-bar-2 {
          animation: audio-bar-2 0.6s ease-in-out infinite 0.1s;
        }
        
        .animate-audio-bar-3 {
          animation: audio-bar-3 0.6s ease-in-out infinite 0.2s;
        }
        
        .animate-audio-bar-4 {
          animation: audio-bar-4 0.6s ease-in-out infinite 0.3s;
        }
      `}</style>
    </div>
  );
}