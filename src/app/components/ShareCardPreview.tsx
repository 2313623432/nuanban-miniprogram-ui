import { useNavigate } from "react-router";
import nuanbanLogo from "figma:asset/dca20a644d1a3df2b38908904f303b821eadf00a.png";

interface Message {
  id: string;
  type: "user" | "expert";
  content?: string;
}

interface ShareCardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  expertName?: string;
  userName?: string;
}

export function ShareCardPreview({
  isOpen,
  onClose,
  messages,
  expertName = "暖伴",
  userName = "用户",
}: ShareCardPreviewProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewFull = () => {
    // 将消息数据存储到 sessionStorage，用于全文页面展示
    sessionStorage.setItem("sharedMessages", JSON.stringify(messages));
    sessionStorage.setItem("sharedExpertName", expertName);
    navigate("/shared-conversation");
  };

  // 只显示前几条消息，最多3条
  const previewMessages = messages.slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          handleViewFull();
        }}
        style={{ cursor: "pointer" }}
      >
        {/* 头部：暖伴名称和Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <img 
            src={nuanbanLogo} 
            alt="暖伴" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-lg font-semibold text-gray-800">{expertName}</span>
        </div>

        {/* 中间：对话预览标题 */}
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-base font-medium text-gray-800">
            快来看看我和{expertName}聊了啥~
          </h3>
        </div>

        {/* 对话内容预览 */}
        <div className="px-4 pb-3 max-h-[280px] overflow-hidden">
          <div className="space-y-3">
            {previewMessages.map((msg) => (
              <div key={msg.id}>
                {msg.type === "user" ? (
                  <div className="flex justify-end">
                    <div 
                      className="rounded-2xl px-4 py-2.5 max-w-[85%]"
                      style={{ 
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      }}
                    >
                      <p className="text-sm leading-relaxed text-white">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <img 
                      src={nuanbanLogo} 
                      alt={expertName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                    />
                    <div 
                      className="rounded-2xl px-4 py-2.5 max-w-[75%]"
                      style={{ background: "rgb(243, 244, 246)" }}
                    >
                      <p className="text-sm leading-relaxed text-gray-800">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 查看更多遮罩 */}
          {messages.length > 3 && (
            <div className="relative mt-2">
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </div>
          )}
        </div>

        {/* 查看全文按钮 */}
        <div className="px-4 pb-3">
          <button 
            className="w-full py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 transition-all active:scale-95 text-white text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleViewFull();
            }}
          >
            查看更多
          </button>
        </div>

        {/* 底部：小程序标识 */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <span className="text-xs text-gray-500">微信小程序</span>
        </div>
      </div>
    </div>
  );
}