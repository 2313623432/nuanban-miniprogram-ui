import { useState } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface AddTaskModalProps {
  onSubmit: (content: string) => void;
  onClose: () => void;
}

export function AddTaskModal({ onSubmit, onClose }: AddTaskModalProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error("请输入任务内容");
      return;
    }

    if (trimmedContent.length > 20) {
      toast.error("任务内容不能超过20个字");
      return;
    }

    onSubmit(trimmedContent);
    setContent("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-3xl p-6 max-w-md w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">添加自定义任务</h3>
            <p className="text-sm text-muted-foreground mt-1">
              手动任务默认奖励 1 积分
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              任务内容 <span className="text-muted-foreground">({content.length}/20)</span>
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 20))}
              placeholder="例如：冥想10分钟"
              className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
              autoFocus
            />
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">温馨提示</p>
            <ul className="space-y-1">
              <li>• 单日最多添加 3 条手动任务</li>
              <li>• 任务有效期至当日 24:00</li>
              <li>• 删除后不可恢复</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl glass-button font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            添加任务
          </button>
        </div>
      </div>
    </div>
  );
}
