import { useState } from "react";
import { useNavigate } from "react-router";
import { Phone, MessageSquare, Clock } from "lucide-react";
import { TabBar } from "@/app/components/layout/TabBar";
import { experts } from "@/app/data/experts";

export function ConversationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"phone" | "text">("phone");
  
  // 模拟通话记录
  const phoneRecords = [
    {
      id: "1",
      expertId: "1",
      type: "incoming" as const,
      duration: "5:32",
      time: "今天 10:32",
      answered: true
    },
    {
      id: "2",
      expertId: "2",
      type: "outgoing" as const,
      duration: "12:45",
      time: "昨天 15:20",
      answered: true
    },
    {
      id: "3",
      expertId: "3",
      type: "incoming" as const,
      duration: "0:00",
      time: "1月13日",
      answered: false
    },
    {
      id: "4",
      expertId: "4",
      type: "outgoing" as const,
      duration: "8:15",
      time: "1月12日",
      answered: true
    }
  ];
  
  // 模拟文字会话数据
  const textConversations = [
    {
      id: "1",
      expertId: "1",
      lastMessage: "好的，记得按时服药",
      time: "10:32",
      unread: 2
    },
    {
      id: "2",
      expertId: "2",
      lastMessage: "你今天感觉咋样？",
      time: "昨天",
      unread: 0
    },
    {
      id: "3",
      expertId: "3",
      lastMessage: "明天记得吃点清淡的",
      time: "1月13日",
      unread: 1
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="pt-6 px-4 max-w-2xl mx-auto relative z-10">
        {/* Tab switcher */}
        <div className="flex gap-3 mb-6 p-1.5 glass-card rounded-2xl shadow-lg">
          <button
            onClick={() => setActiveTab("phone")}
            className={`flex-1 py-3.5 rounded-xl text-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "phone"
                ? "glass-primary shadow-md"
                : "text-muted-foreground hover:bg-primary/10"
            }`}
          >
            <Phone className="h-5 w-5" />
            电话
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-3.5 rounded-xl text-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "text"
                ? "glass-primary shadow-md"
                : "text-muted-foreground hover:bg-primary/10"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            文字
          </button>
        </div>
        
        {/* Phone Records Tab */}
        {activeTab === "phone" && (
          <div className="space-y-3 animate-fadeIn">
            {phoneRecords.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📞</div>
                <p className="text-xl text-muted-foreground mb-4">还没有通话记录</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 glass-primary rounded-2xl text-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  去选专家
                </button>
              </div>
            ) : (
              phoneRecords.map((record) => {
                const expert = experts.find((e) => e.id === record.expertId);
                if (!expert) return null;
                
                return (
                  <div
                    key={record.id}
                    onClick={() => navigate(`/call/${expert.id}`)}
                    className="glass-card rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-xl transition-all"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
                      />
                      {/* Call type indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                        record.type === "incoming" ? "bg-green-500" : "bg-primary"
                      }`}>
                        <Phone className={`h-3 w-3 text-white ${
                          record.type === "incoming" ? "" : "transform rotate-90"
                        }`} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-medium">{expert.name}</h3>
                        <span className="text-sm text-muted-foreground">{record.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!record.answered && (
                          <span className="text-destructive text-sm">网络异常</span>
                        )}
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base text-muted-foreground">
                          {record.answered ? record.duration : "网络异常"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Call again button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/call/${expert.id}`);
                      }}
                      className="p-3 glass-button hover:bg-primary/25 rounded-full transition-all shadow-sm active:scale-95"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
        
        {/* Text Conversations Tab */}
        {activeTab === "text" && (
          <div className="space-y-3 animate-fadeIn">
            {textConversations.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl text-muted-foreground mb-4">还没有会话记录</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 glass-primary rounded-2xl text-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  去选专家
                </button>
              </div>
            ) : (
              textConversations.map((conv) => {
                const expert = experts.find((e) => e.id === conv.expertId);
                if (!expert) return null;
                
                return (
                  <div
                    key={conv.id}
                    onClick={() => navigate(`/chat/${expert.id}`)}
                    className="glass-card rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-xl transition-all"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
                      />
                      {conv.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-medium">{expert.name}</h3>
                        <span className="text-sm text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-base text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      
      <TabBar />
    </div>
  );
}