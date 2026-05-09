import { useNavigate } from "react-router";
import { Home, MoreHorizontal, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import nuanbanLogo from "figma:asset/dca20a644d1a3df2b38908904f303b821eadf00a.png";

interface Message {
  id: string;
  type: "user" | "expert";
  content?: string;
}

export function SharedConversationPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [expertName, setExpertName] = useState("暖伴");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // 从 sessionStorage 获取分享的消息
    const storedMessages = sessionStorage.getItem("sharedMessages");
    const storedExpertName = sessionStorage.getItem("sharedExpertName");

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    if (storedExpertName) {
      setExpertName(storedExpertName);
    }

    // 格式化时间
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setCurrentTime(formatted);
  }, []);

  const handleStartChat = () => {
    // 跳转到首页
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleClose = () => {
    // 关闭页面，返回上一页或首页
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={handleGoHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <Home className="w-5 h-5 text-gray-700" />
          </button>

          <h1 className="text-lg font-semibold text-gray-800">暖伴</h1>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
              <MoreHorizontal className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
              <Minus className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              className="w-6 h-6 rounded-full border-2 border-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
              onClick={handleClose}
            >
              <span className="text-xs font-bold text-gray-700">×</span>
            </button>
          </div>
        </div>
      </div>

      {/* 时间戳 */}
      <div className="text-center py-3">
        <span className="text-xs text-gray-400">{currentTime}</span>
      </div>

      {/* 对话内容 */}
      <div className="px-4 pb-32 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === "user" ? (
              <div className="flex justify-end items-end gap-2">
                <span className="text-sm text-gray-500 mb-1">Bailey Li</span>
                <div 
                  className="rounded-2xl px-4 py-3 max-w-[75%]"
                  style={{ 
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  }}
                >
                  <p className="text-base leading-relaxed text-white">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <img 
                  src={nuanbanLogo} 
                  alt={expertName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">{expertName}</div>
                  <div 
                    className="rounded-2xl px-4 py-3 max-w-[85%] bg-white shadow-sm"
                  >
                    <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  {/* 复制按钮 */}
                  <div className="mt-2 flex justify-end">
                    <button className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors active:scale-95">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-4 safe-area-inset-bottom">
        <button
          onClick={handleStartChat}
          className="w-full py-4 rounded-full bg-gray-800 hover:bg-gray-900 transition-all active:scale-95 shadow-lg flex items-center justify-center"
        >
          <span className="text-base font-semibold text-white">开始对话</span>
        </button>
      </div>
    </div>
  );
}