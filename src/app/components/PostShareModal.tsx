import { X } from "lucide-react";
import { Post } from "@/app/data/community";
import { useNavigate } from "react-router";

interface PostShareModalProps {
  post: Post;
  onClose: () => void;
}

export function PostShareModal({ post, onClose }: PostShareModalProps) {
  const navigate = useNavigate();

  // 处理正文预览（最多两行）
  const contentPreview = post.content;

  // 判断是否有图片
  const hasImage = post.images && post.images.length > 0;
  const firstImage = hasImage ? post.images[0] : null;

  const handleCardClick = () => {
    onClose();
    navigate(`/zhiyin/post/${post.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>

      {/* 分享卡片 */}
      <div className="relative w-full max-w-sm">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* 微信分享卡片样式 */}
        <div
          onClick={handleCardClick}
          className="bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-all active:scale-98"
        >
          {/* 头部：暖伴logo和标语 */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">暖</span>
            </div>
            <span className="text-base font-medium text-gray-800">暖伴-您身边的健康专家</span>
          </div>

          {/* 内容区域 */}
          <div className="p-4">
            {/* 帖子正文预览（最多2行） */}
            <p className="text-base text-gray-600 leading-relaxed mb-3 line-clamp-2">
              {contentPreview}
            </p>

            {/* 图片或文字框 */}
            {hasImage ? (
              // 有图片：显示第一张图
              <div className="rounded-xl overflow-hidden aspect-video bg-gray-100">
                <img
                  src={firstImage}
                  alt="帖子配图"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // 无图片：显示正文文字框
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                  {post.content}
                </p>
              </div>
            )}
          </div>

          {/* 底部：微信小程序标识 */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center">
                <span className="text-white text-xs font-bold">小</span>
              </div>
              <span className="text-sm text-gray-600">微信小程序</span>
            </div>
          </div>
        </div>

        {/* 提示文字 */}
        <p className="text-center text-white text-sm mt-4 opacity-90">
          点击卡片查看详情
        </p>
      </div>
    </div>
  );
}