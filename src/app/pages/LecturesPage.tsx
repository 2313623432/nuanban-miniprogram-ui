import { useState } from "react";
import { useNavigate } from "react-router";
import { Play, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { TabBar } from "@/app/components/layout/TabBar";
import { recentBooks } from "@/app/data/experts";

type PodcastStyle = "simple" | "deep" | "humor" | "local";

export function LecturesPage() {
  const navigate = useNavigate();
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [showStyleModal, setShowStyleModal] = useState(false);
  
  const selectedBook = recentBooks[selectedBookIndex];
  
  const podcastStyles: Array<{
    id: PodcastStyle;
    title: string;
    description: string;
    duration: string;
    tags: string[];
    avatar: string;
  }> = [
    {
      id: "simple",
      title: "王专家-简洁讲解",
      description: "资深健康养生专家，精准抓住重点",
      duration: "5分钟",
      tags: ["随时提问", "温暖女声"],
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dy='.3em'%3E👩‍⚕️%3C/text%3E%3C/svg%3E"
    },
    {
      id: "local",
      title: "李中医-专业讲解",
      description: "行业多年靠谱中医，专业答疑解惑",
      duration: "8分钟",
      tags: ["河南方言", "随时提问"],
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23E0F2FE'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dy='.3em'%3E👨‍⚕️%3C/text%3E%3C/svg%3E"
    },
    {
      id: "humor",
      title: "刘老师-幽默解读",
      description: "会讲段子的好老师，轻松讲清门道",
      duration: "15分钟",
      tags: ["四川方言", "随时提问"],
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23FEF3C7'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dy='.3em'%3E👨‍🏫%3C/text%3E%3C/svg%3E"
    },
    {
      id: "deep",
      title: "老张老陈-深度解读",
      description: "两位养生的好搭档，分享自身心得",
      duration: "20分钟",
      tags: ["男女对话", "随时提问"],
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23FCE7F3'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dy='.3em'%3E👥%3C/text%3E%3C/svg%3E"
    }
  ];
  
  const handlePrevBook = () => {
    setSelectedBookIndex((prev) => (prev === 0 ? recentBooks.length - 1 : prev - 1));
  };
  
  const handleNextBook = () => {
    setSelectedBookIndex((prev) => (prev === recentBooks.length - 1 ? 0 : prev + 1));
  };
  
  const handleMoreBooks = () => {
    navigate('/books-lectures');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="pt-6 px-4 max-w-2xl mx-auto relative z-10">
        {/* Book Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              选择图书
            </h3>
            <button 
              onClick={handleMoreBooks}
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              更多
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Carousel with arrows */}
          <div className="relative flex items-center justify-center gap-4">
            {/* Left Arrow */}
            <button
              onClick={handlePrevBook}
              className="p-3 glass-button hover:glass-primary rounded-full shadow-lg transition-all active:scale-95 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {/* Book Display - showing 3 books */}
            <div className="flex-1 flex items-center justify-center gap-4 overflow-hidden">
              {[-1, 0, 1].map((offset) => {
                const index = (selectedBookIndex + offset + recentBooks.length) % recentBooks.length;
                const book = recentBooks[index];
                const isCenter = offset === 0;
                
                return (
                  <div
                    key={book.id}
                    className={`transition-all duration-300 ${
                      isCenter 
                        ? 'w-40 scale-110 opacity-100' 
                        : 'w-32 scale-90 opacity-50'
                    }`}
                  >
                    <div className={`relative rounded-2xl overflow-hidden shadow-lg ${
                      isCenter ? 'ring-4 ring-primary/50' : ''
                    }`}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium truncate">{book.title}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Right Arrow */}
            <button
              onClick={handleNextBook}
              className="p-3 glass-button hover:glass-primary rounded-full shadow-lg transition-all active:scale-95 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Podcast Styles */}
        <h3 className="text-lg font-medium mb-4">选择讲解风格</h3>
        <div className="space-y-4">
          {podcastStyles.map((style) => {
            return (
              <div
                key={style.id}
                onClick={() => navigate(`/podcast/${style.id}`)}
                className="glass-card rounded-3xl p-6 cursor-pointer hover:shadow-2xl transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                
                <div className="flex items-center gap-5 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative z-10 shadow-lg group-hover:scale-105 transition-transform">
                      <img
                        src={style.avatar}
                        alt={style.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-medium mb-1">{style.title}</h4>
                    <p className="text-base text-muted-foreground mb-2">{style.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {style.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 glass-button rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                      <span className="px-3 py-1 glass-button rounded-full text-sm">
                        时长: {style.duration}
                      </span>
                    </div>
                  </div>
                  
                  <button className="p-4 glass-primary rounded-full shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                    <Play className="h-6 w-6 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <TabBar />
      
      {/* Style Selection Modal */}
      {showStyleModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowStyleModal(false)}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-md w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium mb-2">{selectedBook.title}</h2>
              <p className="text-sm text-muted-foreground">选择讲解风格</p>
            </div>
            
            <div className="space-y-3 mb-4">
              {podcastStyles.map((style) => {
                return (
                  <button
                    key={style.id}
                    onClick={() => {
                      setShowStyleModal(false);
                      navigate(`/podcast/${style.id}`);
                    }}
                    className="w-full glass-button hover:glass-primary rounded-2xl p-4 transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={style.avatar}
                        alt={style.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-base">{style.title}</h4>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{style.duration}</span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowStyleModal(false)}
              className="w-full py-3 glass-button hover:bg-primary/10 rounded-2xl text-base"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}