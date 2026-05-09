import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Plus, Edit3 } from "lucide-react";
import { memoryCategories, mockMemories, Memory, MemoryCategoryId, formatMemoryTime } from "@/app/data/memory";

export function MemoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") as MemoryCategoryId | null;
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategoryId>(
    categoryFromUrl || "identity"
  );
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // 从localStorage读取记忆并合并
  const [memories, setMemories] = useState<Memory[]>(() => {
    const savedMemories = localStorage.getItem('user-memories');
    const userMemories: Memory[] = savedMemories ? JSON.parse(savedMemories) : [];
    const deletedRaw = localStorage.getItem('deleted-mock-memories');
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    const filteredMock = mockMemories.filter(m => !deletedIds.includes(m.id));
    return [...userMemories, ...filteredMock];
  });

  // 当URL参数变化时更新选中的类目
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // 当记忆变化时重新读取
  useEffect(() => {
    const savedMemories = localStorage.getItem('user-memories');
    const userMemories: Memory[] = savedMemories ? JSON.parse(savedMemories) : [];
    const deletedRaw = localStorage.getItem('deleted-mock-memories');
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    const filteredMock = mockMemories.filter(m => !deletedIds.includes(m.id));
    setMemories([...userMemories, ...filteredMock]);
  }, [selectedCategory]); // 当类目切换时重新读取数据

  // 当前类目下的记忆，按时间倒序（从近到远）
  const currentMemories = memories
    .filter(m => m.category === selectedCategory)
    .sort((a, b) => b.timestamp - a.timestamp);

  // 处理手势滑动
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // 滑动阈值

    if (Math.abs(diff) > threshold) {
      const currentIndex = memoryCategories.findIndex(c => c.id === selectedCategory);
      
      if (diff > 0 && currentIndex < memoryCategories.length - 1) {
        // 向左滑动，切换到下一个类目
        setSelectedCategory(memoryCategories[currentIndex + 1].id);
      } else if (diff < 0 && currentIndex > 0) {
        // 向右滑动，切换到上一个类目
        setSelectedCategory(memoryCategories[currentIndex - 1].id);
      }
    }
  };

  const handleAddMemory = () => {
    navigate(`/memory/add?category=${selectedCategory}`);
  };

  const handleEditMemory = (memoryId: string) => {
    navigate(`/memory/edit/${memoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-header border-b-0 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-medium">我的记忆</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddMemory}
              className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 glass-header border-b-0 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {memoryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-2xl text-base font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'glass-primary text-white shadow-lg'
                    : 'glass-button text-foreground hover:bg-white/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory List */}
      <div 
        className="max-w-2xl mx-auto px-4 pt-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentMemories.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <p className="text-xl text-muted-foreground mb-3">暂无记忆</p>
            <p className="text-base text-muted-foreground mb-6">
              点击右上角 + 号添加记忆
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => handleEditMemory(memory.id)}
                className="glass-card rounded-3xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
              >
                <div className="text-sm text-muted-foreground mb-3">
                  {formatMemoryTime(memory.timestamp)}
                </div>
                <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                  {memory.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}