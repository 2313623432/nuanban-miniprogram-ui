import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { recentBooks } from "@/app/data/experts";

type PodcastStyle = "simple" | "deep" | "humor" | "local";

export function BooksLecturesPage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);
  
  const handleBack = () => {
    // Navigate back to lectures page
    console.log("Back button clicked, navigating to /lectures");
    navigate("/lectures");
  };
  
  const podcastStyles: Array<{
    id: PodcastStyle;
    title: string;
    description: string;
    duration: string;
    avatar: string;
  }> = [
    {
      id: "simple",
      title: "王专家-简洁讲解",
      description: "资深健康养生专家，精准抓住重点",
      duration: "5分钟",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%234F46E5'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E👨‍⚕️%3C/text%3E%3C/svg%3E"
    },
    {
      id: "local",
      title: "李中医-专业讲解",
      description: "行业多年靠谱中医，专业答疑解惑",
      duration: "8分钟",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%2310B981'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E👨‍🔬%3C/text%3E%3C/svg%3E"
    },
    {
      id: "humor",
      title: "刘老师-幽默解读",
      description: "会讲段子的好老师，轻松讲清门道",
      duration: "15分钟",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23F59E0B'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E👩‍🏫%3C/text%3E%3C/svg%3E"
    },
    {
      id: "deep",
      title: "老张老陈-深度解读",
      description: "两位养生的搭档，分享自身心得",
      duration: "20分钟",
      avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%2306B6D4'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E👥%3C/text%3E%3C/svg%3E"
    }
  ];
  
  const handleBookClick = (bookId: string) => {
    setSelectedBook(bookId);
    setShowStyleModal(true);
  };
  
  const selectedBookData = recentBooks.find(b => b.id === selectedBook);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 glass-header z-50 safe-area-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium">选择图书</h1>
          </div>
        </div>
      </div>
      
      <div className="pt-20 px-4 max-w-2xl mx-auto pb-8 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {recentBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className="glass-card rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all active:scale-95"
            >
              <div className="relative rounded-xl overflow-hidden mb-3 shadow-md">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className="font-medium text-base mb-2">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.lastRead}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Style Selection Modal */}
      {showStyleModal && selectedBookData && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowStyleModal(false)}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-md w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium mb-2">{selectedBookData.title}</h2>
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