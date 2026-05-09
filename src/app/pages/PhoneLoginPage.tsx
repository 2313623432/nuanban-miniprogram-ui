import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import logoImage from "figma:asset/260c0d5ec8642957c775a3190f6d09608b778461.png";

export function PhoneLoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
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
  
  const handleLoginOrRegister = () => {
    if (agreed && phone && code) {
      navigate("/");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-20 safe-area-top">
        <div className="max-w-md mx-auto px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full relative z-10 pt-20">
        {/* Logo and Brand */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <img 
              src={logoImage} 
              alt="暖伴 Logo" 
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>
          <h2 className="text-3xl mb-2 text-foreground" style={{ fontWeight: 600 }}>手机号登录</h2>
          <p className="text-lg text-muted-foreground">首次登录将自动注册账号</p>
        </div>
        
        {/* Login Form Card */}
        <div className="glass-card rounded-3xl p-8 space-y-6">
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
            onClick={handleLoginOrRegister}
            disabled={!agreed || !phone || !code}
            className="w-full h-16 text-2xl rounded-2xl glass-primary hover:opacity-90 transition-opacity"
          >
            登录/注册
          </Button>
        </div>
        
        <div className="text-center mt-8 text-base text-muted-foreground">
          <p>暖伴，让健康管理更简单</p>
        </div>
      </div>
    </div>
  );
}