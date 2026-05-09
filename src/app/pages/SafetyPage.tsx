import { useNavigate } from "react-router";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";

export function SafetyPage() {
  const navigate = useNavigate();
  
  const documents = [
    {
      id: 1,
      title: "用户服务协议",
      url: "https://yuntikeji.feishu.cn/wiki/OWyzwQmDeiqp67kKecTcksIxn8e?from=from_copylink",
      icon: "📄"
    },
    {
      id: 2,
      title: "用户隐私协议",
      url: "https://yuntikeji.feishu.cn/wiki/FOTVwVSeziGClWkmJ0dc8HJenQh?from=from_copylink",
      icon: "🔒"
    },
    {
      id: 3,
      title: "会员服务协议",
      url: "https://yuntikeji.feishu.cn/wiki/Sw5bwNLjlisi9IkTjhEc0lkVnFb?from=from_copylink",
      icon: "👑"
    },
    {
      id: 4,
      title: "健康风险告知",
      url: "https://yuntikeji.feishu.cn/wiki/QAYmwJ3s3irMcPk9cqQcyHHJnmd?from=from_copylink",
      icon: "⚕️"
    },
    {
      id: 5,
      title: "社区规范协议",
      url: "https://yuntikeji.feishu.cn/wiki/HJ3mwe59GiR5uvk4Wpuc1thYn5n?from=from_copylink",
      icon: "🤝"
    }
  ];
  
  const handleDocumentClick = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 safe-area-top" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: '1.5px solid rgba(255, 138, 0, 0.2)',
        boxShadow: '0 4px 20px 0 rgba(255, 138, 0, 0.1), 0 1px 4px 0 rgba(255, 138, 0, 0.06)'
      }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 100 }}>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full flex items-center justify-center glass-button hover:bg-white/50 transition-all active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 text-gray-800" style={{ pointerEvents: 'none' }} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">隐私与安全</h1>
          </div>
        </div>
      </div>
      
      <div className="pt-24 px-4 max-w-2xl mx-auto pb-8 relative z-10">
        {/* Header section */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 glass-primary rounded-2xl">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium">相关协议与声明</h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            请仔细阅读以下协议和声明，了解您在使用暖伴时的权利与义务。
          </p>
        </div>

        {/* Document list */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDocumentClick(doc.url)}
              className="w-full glass-card rounded-3xl p-6 hover:shadow-xl transition-all duration-300 active:scale-98 group"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl glass-primary flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {doc.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-medium mb-1">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">点击查看详情</p>
                </div>
                
                {/* Arrow icon */}
                <div className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform">
                  <ExternalLink className="h-5 w-5" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Contact info */}
        <div className="glass-button rounded-2xl p-5 text-center mt-6">
          <p className="text-base text-muted-foreground mb-2">
            如有隐私或安全方面的疑问
          </p>
          <p className="text-lg font-medium text-primary">
            请联系我们：privacy@nuanban.com
          </p>
        </div>
      </div>
    </div>
  );
}
