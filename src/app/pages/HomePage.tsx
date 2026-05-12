import { Header } from "@/app/components/layout/Header";
import { TabBar } from "@/app/components/layout/TabBar";
import { experts, recentBooks } from "@/app/data/experts";
import { useNavigate } from "react-router";
import { useState } from "react";
import { BookOpen, ChevronRight, MessageCircle, Phone } from "lucide-react";
import { useMembership } from "@/app/contexts/MembershipContext";
import { MembershipModal } from "@/app/components/MembershipModal";

export function HomePage() {
  const navigate = useNavigate();
  const { isMember, activateMembership } = useMembership();
  const [selectedBook, setSelectedBook] = useState(recentBooks[0]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // 根据选中的书找到对应的专家列表
  const correspondingExperts = experts.filter(expert => 
    selectedBook.expertIds?.includes(expert.id)
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Safe area for content */}
      <div className="pt-6 px-4 max-w-2xl mx-auto relative z-10">
        {/* Welcome header with enhanced design */}
        <div className="glass-card rounded-3xl p-6 mb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full"></div>
          <h2 className="text-2xl font-medium mb-2 relative z-10">欢迎来到暖伴</h2>
          <p className="text-base text-muted-foreground relative z-10">选择您的专属健康顾问</p>
        </div>
        
        {/* Learning History Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              学习记录
            </h3>
            <button 
              onClick={() => navigate('/books')}
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              更多
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Horizontal scrollable book list */}
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide mb-4">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className={`flex-shrink-0 w-32 cursor-pointer transition-all ${
                  selectedBook.id === book.id ? 'scale-105' : 'scale-100 opacity-70'
                }`}
              >
                <div className={`relative rounded-2xl overflow-hidden shadow-lg ${
                  selectedBook.id === book.id ? 'ring-4 ring-primary/50' : ''
                }`}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-xs font-medium truncate">{book.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* All Expert cards */}
        <div>
          <h3 className="text-lg font-medium mb-4">对应专家</h3>
          <div className="space-y-5">
            {correspondingExperts.map((expert, index) => (
              <div
                key={expert.id}
                className="glass-card rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/expert/${expert.id}`)}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: 'translateZ(0)' // Enable 3D acceleration
                }}
              >
                {/* Card highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                
                <div className="flex gap-4 relative z-10">
                  {/* Enhanced Avatar with glow */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-20 h-20 rounded-full object-cover relative z-10 ring-4 ring-white/50 shadow-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-medium">{expert.name}</h3>
                      <span className="text-base text-muted-foreground">
                        {expert.gender}
                      </span>
                      <span className="px-3 py-1 glass-button rounded-full text-sm shadow-sm">
                        {expert.dialect}
                      </span>
                    </div>
                    
                    <p className="text-base text-muted-foreground mb-3 leading-relaxed">
                      {expert.description}
                    </p>
                    
                    {/* Expertise tags with enhanced styling */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {expert.expertise.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 glass-button rounded-xl text-sm shadow-sm hover:shadow-md transition-shadow"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action buttons with enhanced 3D effect */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isMember) {
                            setShowMemberModal(true);
                          } else {
                            navigate(`/call/${expert.id}`);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 h-14 glass-primary rounded-2xl font-medium hover:opacity-95 active:scale-98 transition-all shadow-lg hover:shadow-xl"
                      >
                        <Phone className="h-5 w-5" />
                        <span className="text-lg">拨打</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat/${expert.id}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 h-14 glass-button hover:bg-secondary/30 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg active:scale-98"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-lg">聊天</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <TabBar />
      <MembershipModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSuccess={(plan) => activateMembership(plan)}
      />
    </div>
  );
}