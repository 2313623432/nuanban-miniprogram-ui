import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import logoImage from "figma:asset/260c0d5ec8642957c775a3190f6d09608b778461.png";
import { ArrowLeft } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  
  const handleGetCode = () => {
    if (phone.length === 11) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const handleRegister = () => {
    if (agreed && phone && code && username) {
      // 注册成功后跳转到首页
      navigate("/");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Back Button */}
      <div className="p-4 relative z-10">
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-foreground hover:text-primary glass-button px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">返回登录</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img 
              src={logoImage} 
              alt="暖伴 Logo" 
              className="w-28 h-28 object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl mb-2 text-foreground" style={{ fontWeight: 600 }}>暖伴</h1>
          <p className="text-lg text-muted-foreground">注册新账号，开启健康陪伴</p>
        </div>
        
        {/* Register Form Card */}
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <h2 className="text-center text-2xl mb-4">创建账号</h2>
          
          <div>
            <label className="block mb-3 text-lg">用户名</label>
            <Input
              type="text"
              placeholder="请输入您的姓名或昵称"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-16 text-xl rounded-2xl glass-input px-5"
            />
          </div>
          
          <div>
            <label className="block mb-3 text-lg">手机号</label>
            <Input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-16 text-xl rounded-2xl glass-input px-5"
              maxLength={11}
            />
          </div>
          
          <div>
            <label className="block mb-3 text-lg">验证码</label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-16 text-xl rounded-2xl glass-input px-5 flex-1"
                maxLength={6}
              />
              <Button
                onClick={handleGetCode}
                disabled={phone.length !== 11 || countdown > 0}
                className="h-16 px-6 text-lg rounded-2xl whitespace-nowrap min-w-[120px] glass-button hover:bg-primary/25"
                variant="outline"
              >
                {countdown > 0 ? `${countdown}秒` : "获取验证码"}
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-3 py-2">
            <Checkbox 
              id="agreement" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="h-6 w-6 mt-1"
            />
            <label htmlFor="agreement" className="text-base text-muted-foreground cursor-pointer leading-relaxed">
              我已阅读并同意
              <span className="text-primary mx-1">《用户协议》</span>
              和
              <span className="text-primary mx-1">《隐私政策》</span>
            </label>
          </div>
          
          <Button
            onClick={handleRegister}
            disabled={!agreed || !phone || !code || !username}
            className="w-full h-16 text-2xl rounded-2xl glass-primary hover:opacity-90 transition-opacity"
          >
            立即注册
          </Button>
          
          <div className="text-center pt-2">
            <button 
              onClick={() => navigate("/login")}
              className="text-lg text-primary hover:text-primary/80"
            >
              已有账号？立即登录
            </button>
          </div>
        </div>
        
        <div className="text-center mt-8 text-base text-muted-foreground">
          <p>暖伴，让健康管理更简单</p>
        </div>
      </div>
    </div>
  );
}