import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Mic, Send, Camera, ImagePlus } from "lucide-react";
import { currentUser } from "@/app/data/community";
import { Post } from "@/app/data/community";
import { containsSensitiveWords } from "@/app/utils/contentModeration";
import { toast } from "sonner";

interface PostComposerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, images: string[], editPostId?: string) => void;
  editPost?: Post | null;
}

export function PostComposerSheet({ isOpen, onClose, onSubmit, editPost }: PostComposerSheetProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 预加载编辑内容
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || "");
      setContent(editPost.content || "");
      setImages(editPost.images || []);
    } else {
      // 新建模式，清空内容
      setTitle("");
      setContent("");
      setImages([]);
    }
  }, [editPost, isOpen]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    // 敏感词检测
    if (containsSensitiveWords(title) || containsSensitiveWords(content)) {
      toast.error("请勿发布违规内容");
      return;
    }

    onSubmit(title, content, images, editPost?.id);
    setTitle("");
    setContent("");
    setImages([]);
    onClose();
  };

  const handleImageButtonClick = () => {
    // 检查是否超过9张
    if (images.length >= 9) {
      toast.error("最多只能上传9张图片");
      return;
    }
    // 显示选择框
    setShowImagePicker(true);
  };

  const handleTakePhoto = async () => {
    setShowImagePicker(false);
    setShowCamera(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("无法访问摄像头", err);
      toast.error("无法访问摄像头");
      setShowCamera(false);
    }
  };

  const handleChooseFromAlbum = () => {
    setShowImagePicker(false);
    
    // 模拟从相册选择图片
    setTimeout(() => {
      // 检查剩余可上传数量
      const remainingSlots = 9 - images.length;
      if (remainingSlots <= 0) {
        toast.error("最多只能上传9张图片");
        return;
      }
      
      // 模拟选择1-3张图片
      const numToAdd = Math.min(Math.floor(Math.random() * 3) + 1, remainingSlots);
      const colors = ['%23FFE5B4', '%23E0F2FE', '%23F0FDF4', '%23FEF3C7', '%23FCE7F3', '%23E0E7FF'];
      const emojis = ['🌸', '🌿', '🍃', '☀️', '🌺', '🌼'];
      const mockImages = Array.from({ length: numToAdd }, (_, i) => {
        const colorIndex = (Date.now() + i) % colors.length;
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='${colors[colorIndex]}'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dy='.3em'%3E${emojis[colorIndex]}%3C/text%3E%3C/svg%3E`;
      });

      setImages([...images, ...mockImages]);
      toast.success(`已选择${numToAdd}张图片`);
    }, 500);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        
        // 检查是否超过9张
        if (images.length >= 9) {
          toast.error("最多只能上传9张图片");
          stopCamera();
          return;
        }
        
        setImages([...images, dataURL]);
        toast.success("拍照成功");
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    const stream = streamRef.current;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // 模拟语音识别
    if (!isRecording) {
      setTimeout(() => {
        setContent(content + "这是语音转文字的内容示例");
        setIsRecording(false);
      }, 2000);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Sheet */}
        <div className="relative w-full max-w-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <h2 className="text-2xl font-medium">{editPost ? "编辑内容" : "发布内容"}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-gray-100/50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User info */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 shadow-md"
              />
              <div>
                <h3 className="text-lg font-medium">{currentUser.name}</h3>
              </div>
            </div>

            {/* Title input */}
            <input
              type="text"
              placeholder="标题（可选）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-medium mb-4 px-4 py-3 glass-card rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            {/* Content textarea */}
            <textarea
              placeholder="上百位健康顾问在线提供养生建议~"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 text-lg px-4 py-3 glass-card rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />

            {/* Voice recording indicator */}
            {isRecording && (
              <div className="mt-4 flex items-center gap-3 px-4 py-3 glass-primary rounded-2xl">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-base">正在录音...</span>
              </div>
            )}

            {/* Image preview */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src={img}
                      alt={`图片${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer toolbar */}
          <div className="p-6 border-t border-gray-200/50">
            <div className="flex items-center gap-4">
              {/* Toolbar buttons */}
              <button
                onClick={handleImageButtonClick}
                className="w-12 h-12 rounded-2xl glass-button flex items-center justify-center hover:bg-gray-100/50 transition-colors"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </button>
              
              <button
                onClick={handleVoiceInput}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  isRecording 
                    ? 'glass-primary text-white' 
                    : 'glass-button hover:bg-gray-100/50'
                }`}
              >
                <Mic className={`h-6 w-6 ${isRecording ? 'text-white' : 'text-muted-foreground'}`} />
              </button>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="ml-auto flex items-center gap-2 px-6 h-12 glass-primary rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
              >
                <Send className="h-5 w-5 text-white" />
                <span className="text-lg text-white">发送</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowImagePicker(false)}
          ></div>
          
          <div className="relative w-full bg-white rounded-t-3xl p-6 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4 text-center">选择图片</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleTakePhoto}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-medium text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                <Camera className="h-6 w-6" />
                <span>拍照</span>
              </button>
              
              <button
                onClick={handleChooseFromAlbum}
                className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-medium text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <ImagePlus className="h-6 w-6" />
                <span>从相册选择</span>
              </button>
              
              <button
                onClick={() => setShowImagePicker(false)}
                className="w-full py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-lg transition-all active:scale-95"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute top-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={stopCamera}
                  className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 transition-all active:scale-95"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/30">
                  <p className="text-white text-sm font-medium">拍照 ({images.length}/9)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/80 backdrop-blur-xl p-6 border-t border-white/20">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={captureImage}
                  className="w-20 h-20 rounded-full bg-white border-4 border-orange-400 hover:border-orange-500 transition-all active:scale-95 shadow-2xl flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </button>
              </div>
              
              <p className="text-center text-white/70 mt-4 text-sm">
                点击拍照
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}