import { useParams, useNavigate } from "react-router";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { experts } from "@/app/data/experts";

export function ExpertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const expert = experts.find((e) => e.id === id);
  
  if (!expert) {
    return <div>专家未找到</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-32 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Enhanced Custom Header */}
      <div className="fixed top-0 left-0 right-0 glass-header z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
              aria-label="返回"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium">{expert.name}</h1>
          </div>
        </div>
      </div>
      
      {/* Content with safe area */}
      <div className="pt-20 px-4 max-w-2xl mx-auto relative z-10">
        {/* Enhanced expert profile section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="relative inline-block mb-4">
            {/* Glow effect behind avatar */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-2xl scale-110 animate-pulse"></div>
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-32 h-32 rounded-full object-cover relative z-10 ring-4 ring-white/50 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full border-4 border-white shadow-xl flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-medium mb-2">{expert.name}</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-lg text-muted-foreground">{expert.gender}</span>
            <span className="px-4 py-1.5 glass-button rounded-full shadow-sm">
              {expert.dialect}
            </span>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap">
            {expert.personality.map((trait, index) => (
              <span
                key={index}
                className="px-4 py-2 glass-button text-primary rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        {/* Enhanced content sections */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h3 className="text-xl font-medium">擅长领域</h3>
            </div>
            <div className="space-y-3">
              {expert.expertise.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 glass-button rounded-xl hover:bg-primary/20 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-br from-primary to-secondary rounded-full flex-shrink-0 shadow-sm"></div>
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h3 className="text-xl font-medium">适合咨询的问题</h3>
            </div>
            <div className="space-y-3">
              {expert.sampleQuestions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 glass-button rounded-2xl text-lg leading-relaxed hover:bg-primary/20 transition-colors shadow-sm"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-header border-b-0 p-4 shadow-2xl z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={() => navigate(`/chat/${expert.id}`)}
            className="flex-1 flex items-center justify-center gap-2 h-16 glass-button hover:bg-secondary/30 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-xl">文字聊天</span>
          </button>
          
          <button
            onClick={() => navigate(`/call/${expert.id}`)}
            className="flex-1 flex items-center justify-center gap-2 h-16 glass-primary rounded-2xl font-medium hover:opacity-95 transition-all shadow-lg hover:shadow-xl active:scale-98"
          >
            <Phone className="h-6 w-6" />
            <span className="text-xl">拨打聊天</span>
          </button>
        </div>
      </div>
    </div>
  );
}