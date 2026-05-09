import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Smartphone, MessageSquare } from "lucide-react";
import logoImage from "figma:asset/260c0d5ec8642957c775a3190f6d09608b778461.png";

export function LoginPage() {
  const navigate = useNavigate();
  
  const handleWechatLogin = () => {
    // 微信一键登录，直接跳转到首页
    navigate("/");
  };
  
  const handlePhoneLogin = () => {
    // 跳转到手机号登录页面
    navigate("/phone-login");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <img 
              src={logoImage} 
              alt="暖伴 Logo" 
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl mb-3 text-foreground" style={{ fontWeight: 600 }}>暖伴</h1>
          <p className="text-xl text-muted-foreground">糖尿病健康陪伴助手</p>
        </div>
        
        {/* Login Options Card */}
        <div className="glass-card rounded-3xl p-8 space-y-5">
          <h2 className="text-center text-2xl mb-6">欢迎使用暖伴</h2>
          
          {/* WeChat Login Button */}
          <Button
            onClick={handleWechatLogin}
            className="w-full h-16 text-xl rounded-2xl glass-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
          >
            <MessageSquare className="h-6 w-6" />
            微信一键登录
          </Button>
          
          {/* Phone Login Button */}
          <Button
            onClick={handlePhoneLogin}
            className="w-full h-16 text-xl rounded-2xl glass-button hover:bg-primary/25 transition-all flex items-center justify-center gap-3"
            variant="outline"
          >
            <Smartphone className="h-6 w-6" />
            手机号登录
          </Button>
        </div>
        
        <div className="text-center mt-8 text-base text-muted-foreground">
          <p>暖伴，让健康管理更简单</p>
        </div>
      </div>
    </div>
  );
}