import { useNavigate } from "react-router";
import { bookInfo } from "@/app/data/experts";
import { Search, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";

export function KnowledgePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Custom Header */}
      <div className="fixed top-0 left-0 right-0 glass-header z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium">知识库</h1>
          </div>
        </div>
      </div>
      
      <div className="pt-20 px-4 max-w-2xl mx-auto pb-8 relative z-10">
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex gap-5 mb-5">
            <img
              src={bookInfo.cover}
              alt={bookInfo.title}
              className="w-32 h-44 object-cover rounded-2xl shadow-lg flex-shrink-0 ring-2 ring-primary/20"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-medium mb-2">{bookInfo.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-base text-green-600 font-medium">{bookInfo.status}</span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                {bookInfo.description}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索书里内容"
              className="w-full h-14 pl-14 pr-4 glass-input rounded-2xl text-lg outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
        
        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="text-xl font-medium mb-4">章节目录</h3>
          <div className="space-y-2">
            {bookInfo.chapters.map((chapter) => (
              <button
                key={chapter.id}
                className="w-full flex items-center justify-between p-4 bg-accent/30 hover:bg-accent/50 rounded-2xl transition-colors"
              >
                <div className="text-left">
                  <div className="text-base font-medium mb-1">{chapter.title}</div>
                  <div className="text-sm text-muted-foreground">页码 {chapter.pages}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-6">
          <h3 className="text-lg font-medium mb-3 text-primary">💡 引用说明</h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            AI回答会标注来源页码，帮助你快速找到原文。所有内容都来自这本已入库的《糖尿病疗法》。
          </p>
        </div>
      </div>
    </div>
  );
}