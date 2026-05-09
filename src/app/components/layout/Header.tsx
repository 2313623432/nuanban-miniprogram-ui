import { ArrowLeft, Search, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
}

export function Header({ title = "暖伴", showBack, showSearch, showSettings, onBack }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // 定义返回路由映射
      const backRoutes: Record<string, string> = {
        '/expert': '/',
        '/chat': '/',
        '/call': '/',
        '/conversations': '/',
        '/lectures': '/',
        '/profile': '/',
        '/memory': '/profile',
        '/knowledge': '/profile',
        '/safety': '/profile',
      };
      
      // 查找匹配的路由前缀
      const matchedRoute = Object.keys(backRoutes).find(route => 
        location.pathname.startsWith(route)
      );
      
      if (matchedRoute) {
        navigate(backRoutes[matchedRoute]);
      } else {
        navigate(-1);
      }
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 glass-header z-50 safe-area-top">
      <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
              aria-label="返回"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <button className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95" aria-label="搜索">
              <Search className="h-6 w-6" />
            </button>
          )}
          {showSettings && (
            <button 
              onClick={() => navigate("/settings")}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
              aria-label="设置"
            >
              <Settings className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}