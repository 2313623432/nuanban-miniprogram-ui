import { Post } from "@/app/data/community";
import { ThumbsUp, ThumbsDown, MessageCircle, X, Share2, Edit } from "lucide-react";
import { useState } from "react";
import { PostShareModal } from "./PostShareModal";

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onLike?: (postId: string) => void;
  onDislike?: (postId: string) => void;
  onReplyClick?: () => void;
  onClose?: (postId: string) => void;
  onEdit?: (post: Post) => void;
  currentUserId?: string;
}

export function PostCard({ post, onClick, onLike, onDislike, onReplyClick, onClose, onEdit, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(post.isDisliked || false);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [showShareModal, setShowShareModal] = useState(false);

  // 添加安全检查
  if (!post || !post.author) {
    return null;
  }

  // 判断是否是用户自己的帖子
  const isOwnPost = currentUserId && post.author.id === currentUserId;

  // 格式化编辑时间
  const formatEditedTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;

    // 超过24小时显示月-日
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      setIsLiked(true);
      setLikes(likes + 1);
      if (isDisliked) {
        setIsDisliked(false);
        setDislikes(dislikes - 1);
      }
    }
    
    onLike?.(post.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 点踩帖子需要二次确认，直接调用回调
    onDislike?.(post.id);
  };

  // 处理内容预览（最多两行，超出显示"...全文"）
  const MAX_CONTENT_LENGTH = 60; // 约两行的字符数
  const needsTruncation = post.content.length > MAX_CONTENT_LENGTH;
  const previewContent = needsTruncation 
    ? post.content.slice(0, MAX_CONTENT_LENGTH) 
    : post.content;

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Card highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

      {/* User info section */}
      <div className="flex items-start gap-3 mb-4 relative z-10">
        <div className="relative flex-shrink-0">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 shadow-md"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-medium">{post.author.name}</h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">{post.author.bio}</p>
            <span className="text-sm text-muted-foreground">·</span>
            <p className="text-sm text-muted-foreground">{post.createdAt}</p>
            {(post as any).editedAt && (
              <>
                <span className="text-sm text-muted-foreground">·</span>
                <p className="text-sm text-muted-foreground">
                  编辑于 {(post as any).editedAtText || formatEditedTime((post as any).editedAt)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="relative z-10 mb-4">
        {post.title && (
          <h3 className="text-xl font-medium mb-2">{post.title}</h3>
        )}
        <p className="text-base text-foreground leading-relaxed">
          {previewContent}
          {needsTruncation && (
            <span className="text-muted-foreground">...全文</span>
          )}
        </p>
      </div>

      {/* Images grid */}
      {post.images && post.images.length > 0 && (
        <div className="relative z-10 mb-4 grid gap-2 grid-cols-3">
          {post.images.slice(0, 3).map((img, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden aspect-square"
            >
              <img
                src={img}
                alt={`图片${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* 如果是第3张图且总数超过3张，显示"+N" */}
              {index === 2 && post.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    +{post.images.length - 3}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interaction section */}
      <div className="flex items-center gap-6 relative z-10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all ${
            isLiked ? 'text-primary' : 'text-muted-foreground'
          } hover:text-primary active:scale-95`}
        >
          <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-primary' : ''}`} />
          <span className="text-base">{likes}</span>
        </button>

        <button
          onClick={handleDislike}
          className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors active:scale-95"
        >
          <ThumbsDown className="h-5 w-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplyClick?.();
          }}
          className="flex items-center gap-2 text-muted-foreground ml-auto hover:text-primary transition-colors active:scale-95"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-base">{post.commentCount}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShareModal(true);
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors active:scale-95"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Edit and Delete buttons - 只在用户自己的帖子上显示 */}
      {isOwnPost && (
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          {/* Edit button */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 shadow-md active:scale-95"
            >
              <Edit className="h-5 w-5" />
            </button>
          )}

          {/* Delete button */}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(post.id);
              }}
              className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50/80 transition-all duration-200 shadow-md active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Share modal */}
      {showShareModal && (
        <PostShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}