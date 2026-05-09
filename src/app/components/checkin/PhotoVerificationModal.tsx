import { useState, useRef } from "react";
import { Camera, X, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  content: string;
  points: number;
}

interface PhotoVerificationModalProps {
  task: Task;
  onSubmit: (photo: File) => void;
  onClose: () => void;
}

export function PhotoVerificationModal({ task, onSubmit, onClose }: PhotoVerificationModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("仅支持图片格式");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("图片大小不能超过10MB");
      return;
    }

    setSelectedPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedPhoto) {
      toast.error("请上传照片");
      return;
    }

    setIsValidating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValid = Math.random() > 0.1;

    setIsValidating(false);

    if (isValid) {
      onSubmit(selectedPhoto);
    } else {
      toast.error("照片不清晰或内容不符，请重新拍摄");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-3xl p-6 max-w-md w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">拍照验证</h3>
            <p className="text-sm text-muted-foreground mt-1">{task.content}</p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="glass-card rounded-2xl p-12 border-2 border-dashed border-white/20 cursor-pointer hover:border-primary/50 transition-all text-center"
          >
            <Camera className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="font-medium mb-2">上传验证照片</p>
            <p className="text-sm text-muted-foreground">
              支持 JPG、PNG 格式，大小不超过 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => {
                  setSelectedPhoto(null);
                  setPreviewUrl("");
                }}
                className="absolute top-4 right-4 h-10 w-10 rounded-xl glass-button flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">验证说明</p>
                <ul className="space-y-1">
                  <li>• 照片需清晰可辨，能够证明任务完成</li>
                  <li>• 同一照片不可重复使用</li>
                  <li>• 审核不通过可重新上传</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl glass-button font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedPhoto || isValidating}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? "验证中..." : `提交并获得 ${task.points} 积分`}
          </button>
        </div>
      </div>
    </div>
  );
}
