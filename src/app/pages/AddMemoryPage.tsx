import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { memoryCategories, Memory, MemoryCategoryId, formatMemoryTime } from "@/app/data/memory";

export function AddMemoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultCategory = (searchParams.get("category") || "other") as MemoryCategoryId;
  
  const [category, setCategory] = useState<MemoryCategoryId>(defaultCategory);
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) {
      alert("请输入记忆内容");
      return;
    }

    const timestamp = Date.now();
    const newMemory: Memory = {
      id: `memory-${timestamp}`,
      category,
      content: content.trim(),
      createdAt: formatMemoryTime(timestamp),
      timestamp
    };

    // 保存到localStorage
    const savedMemories = localStorage.getItem('user-memories');
    const userMemories: Memory[] = savedMemories ? JSON.parse(savedMemories) : [];
    localStorage.setItem('user-memories', JSON.stringify([newMemory, ...userMemories]));

    // 跳转到该记忆所属的类目
    navigate(`/memory?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3]">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-header border-b-0 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(`/memory?category=${category}`)}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-medium">新增记忆</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="glass-card rounded-3xl p-6 mb-6">
          {/* Category Selector */}
          <div className="mb-6">
            <label className="block text-base font-medium mb-3">类目</label>
            <div className="flex flex-wrap gap-2">
              {memoryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-base transition-all ${
                    category === cat.id
                      ? 'glass-primary text-white shadow-md'
                      : 'glass-button text-foreground hover:bg-white/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-base font-medium">内容</label>
              <span className={`text-sm ${content.length >= 100 ? "text-red-400" : "text-muted-foreground"}`}>
                {content.length}/100
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setContent(e.target.value);
                }
              }}
              placeholder="请输入记忆内容..."
              className="w-full glass-card rounded-2xl px-5 py-4 text-lg resize-none border-0 focus:outline-none min-h-[200px] bg-white/30 focus:bg-white/50 transition-colors"
              maxLength={100}
              autoFocus
            />
            <div className="mt-2 text-sm text-muted-foreground">
              提示：请输入你希望AI长期记忆的内容
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="w-full glass-primary rounded-2xl py-4 text-white text-lg font-medium hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}