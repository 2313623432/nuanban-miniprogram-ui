import { Home, BookOpen, User, Users, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router";

export function TabBar() {
  const location = useLocation();

  const tabs = [
    { path: "/", icon: Home, label: "首页" },
    { path: "/lectures", icon: BookOpen, label: "伴学" },
    { path: "/checkin", icon: CheckCircle2, label: "计划" },
    { path: "/zhiyin", icon: Users, label: "知音" },
    { path: "/profile", icon: User, label: "我的" }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-header border-t-0 border-b-0 shadow-2xl z-50 safe-area-bottom">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-20 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path ||
            (tab.path === "/zhiyin" && location.pathname.startsWith("/zhiyin")) ||
            (tab.path === "/checkin" && location.pathname.startsWith("/checkin"));
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-16 transition-all rounded-2xl relative group ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {/* Active indicator with glow */}
              {isActive && (
                <div className="absolute inset-0 glass-button rounded-2xl shadow-md"></div>
              )}
              
              {/* Icon with enhanced styling */}
              <div className="relative z-10">
                <Icon className={`h-7 w-7 mb-1 transition-transform group-active:scale-90 ${
                  isActive ? "fill-primary/20" : ""
                }`} />
                {isActive && (
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl"></div>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-sm font-medium relative z-10 transition-all ${
                isActive ? "scale-105" : ""
              }`}>
                {tab.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}