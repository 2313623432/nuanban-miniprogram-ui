import { useState, useRef } from "react";
import { Download } from "lucide-react";
import wechatLogo from "figma:asset/667e7fc3b19f62b1d1f1468a589d3d89f9fb3443.png";
import nuanbanLogo from "figma:asset/dca20a644d1a3df2b38908904f303b821eadf00a.png";
import qrCode from "figma:asset/df6e69acd034548309dd62f3bc70dd58bb37fe04.png";
import { toast } from "sonner";

interface PodcastShareImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  bookTitle: string;
  styleTitle: string;
  bookCover: string;
}

export function PodcastShareImagePreview({
  isOpen,
  onClose,
  userName,
  bookTitle,
  styleTitle,
  bookCover,
}: PodcastShareImagePreviewProps) {
  const imagePreviewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // 格式化当前时间
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 下载图片
  const handleDownloadImage = async () => {
    if (!imagePreviewRef.current) return;

    setIsGenerating(true);
    try {
      // 动态导入 html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(imagePreviewRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // 转换为图片并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `暖伴推荐_${bookTitle}_${getCurrentTime()}.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("图片已保存");
        }
      });
    } catch (error) {
      console.error("生成图片失败:", error);
      toast.error("生成图片失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  // 分享给朋友
  const handleShareToFriend = () => {
    toast.success("分享功能将在微信小程序环境中可用");
    console.log("分享给朋友");
  };

  // 分享到朋友圈
  const handleShareToMoments = () => {
    toast.success("分享功能将在微信小程序环境中可用");
    console.log("分享到朋友圈");
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* 图片预览区域 - 可滚动 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div
              ref={imagePreviewRef}
              className="rounded-2xl p-6 space-y-6"
              style={{ 
                background: 'linear-gradient(to bottom right, rgb(255, 247, 237), rgb(254, 243, 199))'
              }}
            >
              {/* 头部：推荐标题 */}
              <div style={{ borderBottom: '1px solid rgb(254, 215, 170)', paddingBottom: '20px' }}>
                <div className="flex items-center justify-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md"
                    style={{ background: 'linear-gradient(to bottom right, rgb(251, 146, 60), rgb(245, 158, 11))' }}
                  >
                    {userName.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-semibold" style={{ color: 'rgb(251, 146, 60)' }}>
                    {userName}为您推荐
                  </h3>
                </div>
              </div>

              {/* 图书封面 */}
              <div className="flex justify-center">
                <img 
                  src={bookCover} 
                  alt={bookTitle}
                  className="w-full max-w-[280px] rounded-2xl shadow-2xl"
                  style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                />
              </div>

              {/* 图书信息 */}
              <div className="text-center" style={{ paddingBottom: '20px', borderBottom: '1px solid rgb(254, 215, 170)' }}>
                <p className="text-lg font-semibold" style={{ color: 'rgb(31, 41, 55)' }}>
                  {bookTitle} | {styleTitle}
                </p>
              </div>

              {/* 底部：品牌信息和二维码 */}
              <div className="flex items-center justify-between">
                {/* 标语 */}
                <div className="text-left">
                  <p className="text-xl font-semibold" style={{ color: 'rgb(251, 146, 60)' }}>
                    暖伴
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    您身边的健康养生专家
                  </p>
                </div>
                
                {/* 二维码 */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ background: 'white' }}
                  >
                    <img 
                      src={qrCode} 
                      alt="暖伴二维码" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                    长按一起收听吧
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                onClick={handleShareToFriend}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <img src={wechatLogo} alt="微信" className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  发送给朋友
                </span>
              </button>

              <button
                onClick={handleShareToMoments}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" fill="white" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  分享到朋友圈
                </span>
              </button>

              <button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white hover:bg-gray-100 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {isGenerating ? "生成中..." : "下载图片"}
                </span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-all active:scale-95 font-medium text-gray-700"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </>
  );
}