import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { memoryCategories, mockMemories, Memory, MemoryCategoryId, formatMemoryTime } from "@/app/data/memory";

export function EditMemoryPage() {
  const navigate = useNavigate();
  const { memoryId } = useParams();
  
  const [memory, setMemory] = useState<Memory | null>(null);
  const [category, setCategory] = useState<MemoryCategoryId>("health");
  const [content, setContent] = useState("");

  useEffect(() => {
    // 从localStorage和mock数据中查找记忆
    const savedMemories = localStorage.getItem('user-memories');
    const userMemories: Memory[] = savedMemories ? JSON.parse(savedMemories) : [];
    const allMemories = [...userMemories, ...mockMemories];
    
    const foundMemory = allMemories.find(m => m.id === memoryId);
    if (foundMemory) {
      setMemory(foundMemory);
      setCategory(foundMemory.category);
      setContent(foundMemory.content);
    }
  }, [memoryId]);

  const handleSave = () => {
    if (!content.trim() || !memory) {
      alert("请输入记忆内容");
      return;
    }

    const savedMemories = localStorage.getItem('user-memories');
    const userMemories: Memory[] = savedMemories ? JSON.parse(savedMemories) : [];
    
    // 检查是否为用户创建的记忆
    const isUserMemory = userMemories.some(m => m.id === memoryId);
    
    if (!isUserMemory) {
      // 如果是mock数据，创建新的用户记忆
      const timestamp = Date.now();
      const newMemory: Memory = {
        id: `memory-${timestamp}`,
        category,
        content: content.trim(),
        createdAt: formatMemoryTime(timestamp),
        timestamp
      };
      localStorage.setItem('user-memories', JSON.stringify([newMemory, ...userMemories]));
    } else {
      // 更新现有记忆
      const timestamp = Date.now();
      const updatedMemories = userMemories.map(m => {
        if (m.id === memoryId) {
          return {
            ...m,
            category,
            content: content.trim(),
            createdAt: formatMemoryTime(timestamp),
            timestamp
          };
        }
        return m;
      });
      localStorage.setItem('user-memories', JSON.stringify(updatedMemories));
    }

    // 跳转到该记忆所属的类目
    navigate(`/memory?category=${category}`);
  };

  const handleDelete = () => {
    if (!confirm("确定要删除这条记忆吗？")) {
      return;
    }

    const savedMemories = localStorage.getItem('user-memories');
    const userMemories: Memory[] = savedMemories ? JSON.parse(savedMemories) : [];

    const isUserMemory = userMemories.some(m => m.id === memoryId);

    if (isUserMemory) {
      // 删除用户自己创建的记忆
      const updatedMemories = userMemories.filter(m => m.id !== memoryId);
      localStorage.setItem('user-memories', JSON.stringify(updatedMemories));
    } else {
      // 删除系统记忆：将其 ID 记录到黑名单
      const deletedRaw = localStorage.getItem('deleted-mock-memories');
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedIds.includes(memoryId!)) {
        deletedIds.push(memoryId!);
      }
      localStorage.setItem('deleted-mock-memories', JSON.stringify(deletedIds));
    }

    navigate(`/memory?category=${category}`);
  };

  if (!memory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] flex items-center justify-center">
        <p className="text-xl text-muted-foreground">记忆不存在</p>
      </div>
    );
  }

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
          <h1 className="text-xl font-medium">编辑记忆</h1>
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
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!content.trim()}
              className="flex-1 glass-primary rounded-2xl py-4 text-white text-lg font-medium hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
            <button
              onClick={handleDelete}
              className="px-6 glass-button rounded-2xl py-4 text-red-500 text-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-5 w-5" />
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}