import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { recentBooks, experts } from "@/app/data/experts";

export function BooksPage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [showExpertModal, setShowExpertModal] = useState(false);
  
  const handleBookClick = (bookId: string) => {
    setSelectedBook(bookId);
    setShowExpertModal(true);
  };
  
  const selectedBookData = recentBooks.find(b => b.id === selectedBook);
  const correspondingExperts = selectedBookData 
    ? experts.filter(expert => selectedBookData.expertIds?.includes(expert.id))
    : [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 glass-header z-10 safe-area-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 glass-button hover:bg-primary/25 rounded-full transition-all"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-medium">我的图书</h1>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-base mb-1 truncate">{book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">进度: {book.progress}%</p>
              <p className="text-xs text-muted-foreground">{book.lastRead}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Expert Modal */}
      {showExpertModal && correspondingExperts.length > 0 && selectedBookData && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowExpertModal(false)}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-md w-full animate-fadeIn max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium mb-2">{selectedBookData.title}</h2>
              <p className="text-sm text-muted-foreground">对应专家</p>
            </div>
            
            <div className="space-y-3 mb-4">
              {correspondingExperts.map((expert) => (
                <div
                  key={expert.id}
                  className="glass-button rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white/50 shadow-md"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-base">{expert.name}</h4>
                        <span className="text-xs text-muted-foreground">{expert.gender}</span>
                        <span className="px-2 py-0.5 glass-button rounded-full text-xs">
                          {expert.dialect}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{expert.description}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowExpertModal(false);
                        navigate(`/call/${expert.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 glass-primary rounded-xl font-medium shadow-md transition-all active:scale-95"
                    >
                      <Phone className="h-5 w-5" />
                      拨打
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowExpertModal(false);
                        navigate(`/chat/${expert.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 glass-button hover:bg-secondary/30 rounded-xl font-medium shadow-md transition-all active:scale-95"
                    >
                      <MessageCircle className="h-5 w-5" />
                      聊天
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowExpertModal(false)}
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