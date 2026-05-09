import { useEffect } from "react";
import { useNavigate } from "react-router";
import logoImage from "figma:asset/260c0d5ec8642957c775a3190f6d09608b778461.png";

export function SplashPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 模拟启动延迟,实际可检查登录状态
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-20 w-80 h-80 bg-secondary/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="text-center space-y-8 animate-fadeIn relative z-10">
        <div className="inline-block mb-4">
          <img 
            src={logoImage} 
            alt="暖伴 Logo" 
            className="w-40 h-40 object-contain drop-shadow-2xl animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>
        
        <h1 className="text-6xl text-primary" style={{ fontWeight: 600, fontFamily: "system-ui, -apple-system" }}>
          暖伴
        </h1>
        
        <p className="text-2xl text-foreground/80">
          糖尿病疗法 · 伴读与陪聊
        </p>
        
        {/* Loading indicator */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-center px-6">
        <p className="text-base text-muted-foreground leading-relaxed">
          非医疗诊断，仅作阅读与健康知识辅助
        </p>
      </div>
    </div>
  );
}