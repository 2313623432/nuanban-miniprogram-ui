import { useNavigate } from "react-router";
import { Play } from "lucide-react";
import nuanbanLogo from "figma:asset/dca20a644d1a3df2b38908904f303b821eadf00a.png";

interface PodcastShareCardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  styleTitle: string;
  bookCover: string;
  podcastStyle: string;
  userName?: string;
}

export function PodcastShareCardPreview({
  isOpen,
  onClose,
  bookTitle,
  styleTitle,
  bookCover,
  podcastStyle,
  userName = "用户",
}: PodcastShareCardPreviewProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCardClick = () => {
    // 点击卡片跳转到对应的播客播放页
    navigate(`/podcast/${podcastStyle}`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        style={{ cursor: "pointer" }}
      >
        {/* Header - Logo and Brand */}
        <div className="bg-gradient-to-br from-[#FF8A00] to-[#FFC24B] px-4 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={nuanbanLogo} 
              alt="暖伴" 
              className="w-14 h-14 rounded-xl shadow-md"
            />
            <h2 className="text-xl font-semibold text-white">暖伴</h2>
          </div>
          <p className="text-sm text-white/90 ml-[68px] -mt-0.5">{userName}邀请您听~</p>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Book Title and Style */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
              {bookTitle} | {styleTitle}
            </h3>
          </div>
          
          {/* Book Cover with Play Button */}
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
            <img 
              src={bookCover} 
              alt={bookTitle}
              className="w-full h-64 object-cover"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm">
                <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          
          {/* Footer - Mini Program Text */}
          <div>
            <p className="text-xs text-gray-400">微信小程序</p>
          </div>
        </div>
      </div>
    </div>
  );
}