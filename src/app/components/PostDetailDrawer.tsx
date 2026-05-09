import { useState } from "react";
import { X, ThumbsUp, ThumbsDown, MessageCircle, Image as ImageIcon, Mic, ChevronDown, Trash2 } from "lucide-react";
import { Post, Comment, currentUser } from "@/app/data/community";

interface PostDetailDrawerProps {
  post: Post;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (comment: Comment) => void;
  onDelete?: (postId: string) => void;
}

export function PostDetailDrawer({ post, comments, onClose, onAddComment, onDelete }: PostDetailDrawerProps) {
  const [commentText, setCommentText] = useState("");
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: number }>({});
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [showInputSheet, setShowInputSheet] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // 判断是否是用户自己的帖子
  const isOwnPost = post.author.id === currentUser.id;

  const totalComments = localComments.length;
  const topLevelComments = localComments.filter(c => !c.parentId);

  const getReplies = (commentId: string) => {
    return localComments.filter(c => c.parentId === commentId);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleCommentLike = (commentId: string) => {
    setLocalComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const newIsLiked = !comment.isLiked;
        return {
          ...comment,
          isLiked: newIsLiked,
          likes: newIsLiked ? comment.likes + 1 : comment.likes - 1
        };
      }
      return comment;
    }));
  };

  const handleCommentDislike = (commentId: string) => {
    setLocalComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isCollapsed: true,
          isDisliked: true
        };
      }
      return comment;
    }));
  };

  const handleExpandComment = (commentId: string) => {
    setLocalComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isCollapsed: false,
          isDisliked: false
        };
      }
      return comment;
    }));
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyTo({ commentId, userName });
    setShowInputSheet(true);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    if (replyTo) {
      // 创建二级评论
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        parentId: replyTo.commentId,
        author: currentUser,
        replyToUser: replyTo.userName,
        content: commentText,
        images: commentImages,
        createdAt: "刚刚",
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
      };
      
      setLocalComments(prev => [newComment, ...prev]);
      onAddComment(newComment);
    } else {
      // 创建一级评论
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        author: currentUser,
        content: commentText,
        images: commentImages,
        createdAt: "刚刚",
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
      };
      
      setLocalComments(prev => [newComment, ...prev]);
      onAddComment(newComment);
    }

    setCommentText("");
    setCommentImages([]);
    setReplyTo(null);
    setShowInputSheet(false);
  };

  const handleImageUpload = () => {
    const colors = ['%23FFE5B4', '%23E0F2FE', '%23F0FDF4'];
    const emojis = ['📷', '🖼️', '🎨'];
    const index = commentImages.length % 3;
    const mockImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='${colors[index]}'/%3E%3Ctext x='50%25' y='50%25' font-size='100' text-anchor='middle' dy='.3em'%3E${emojis[index]}%3C/text%3E%3C/svg%3E`;
    setCommentImages([...commentImages, mockImage]);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setCommentText(commentText + "这是语音转文字的内容");
        setIsRecording(false);
      }, 2000);
    }
  };

  const removeCommentImage = (index: number) => {
    setCommentImages(prev => prev.filter((_, i) => i !== index));
  };

  const loadMoreReplies = (parentId: string) => {
    const currentCount = expandedReplies[parentId] || 3;
    setExpandedReplies(prev => ({
      ...prev,
      [parentId]: currentCount + 5
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    // 删除评论及其所有回复
    setLocalComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    setCommentToDelete(null);
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    // 判断是否是用户自己的评论
    const isOwnComment = comment.author.id === currentUser.id;
    
    if (comment.isCollapsed) {
      return (
        <div key={comment.id} className={`py-4 px-5 border-b border-gray-200/30 last:border-b-0 ${isReply ? 'pl-16 bg-white/30' : ''}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">该评论已被折叠</p>
            <button
              onClick={() => handleExpandComment(comment.id)}
              className="px-4 py-1.5 rounded-full glass-button text-sm hover:bg-white/50 transition-colors"
            >
              展开评论
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={comment.id} className={`relative py-4 px-5 border-b border-gray-200/30 last:border-b-0 ${isReply ? 'pl-16 bg-white/30' : ''}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50 shadow-md"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h5 className="text-base font-medium">{comment.author.name}</h5>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
            </div>
            {!isReply && <p className="text-sm text-muted-foreground">{comment.author.bio}</p>}
          </div>
        </div>

        {comment.replyToUser && (
          <div className="mb-2 ml-13">
            <span className="text-sm text-primary">回复 @{comment.replyToUser}</span>
          </div>
        )}

        <p className="text-base text-foreground leading-relaxed mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>

        {comment.images && comment.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
            {comment.images.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden aspect-square cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={img}
                  alt={`图片${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 mt-3">
          <button
            onClick={() => handleCommentLike(comment.id)}
            className={`flex items-center gap-2 transition-colors hover:text-primary active:scale-95 ${
              comment.isLiked ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ThumbsUp className={`h-5 w-5 ${comment.isLiked ? 'fill-primary' : ''}`} />
            <span className="text-sm">{comment.likes}</span>
          </button>

          {/* 点踩按钮 - AI评论和非自己的评论都显示 */}
          {(comment.author.isAI || !isOwnComment) && (
            <button
              onClick={() => handleCommentDislike(comment.id)}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors active:scale-95"
            >
              <ThumbsDown className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => handleReply(comment.id, comment.author.name)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">回复</span>
          </button>

          {/* 删除按钮 - 只在用户自己的评论上显示 */}
          {isOwnComment && !comment.author.isAI && (
            <button
              onClick={() => setCommentToDelete(comment.id)}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors active:scale-95 ml-auto"
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-sm">删除</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div 
        className="w-full max-h-[85vh] glass-header rounded-t-3xl shadow-2xl animate-slideUp flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200/30">
          <div className="flex justify-center flex-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6">
            {/* Post content */}
            <div className="glass-card rounded-3xl overflow-hidden mb-6">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-medium">{post.author.name}</h4>
                    <p className="text-sm text-muted-foreground">{post.author.bio} · {post.createdAt}</p>
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-3">{post.title}</h3>
                <p className="text-base text-foreground leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {post.images.map((img, index) => (
                      <div key={index} className="relative rounded-xl overflow-hidden aspect-square">
                        <img src={img} alt={`图片${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors hover:text-primary active:scale-95 ${
                      isLiked ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <ThumbsUp className={`h-6 w-6 ${isLiked ? 'fill-primary' : ''}`} />
                    <span className="text-lg">{likes}</span>
                  </button>

                  <button
                    onClick={() => setShowInputSheet(true)}
                    className="flex items-center gap-2 text-muted-foreground ml-auto hover:text-primary transition-colors active:scale-95"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-lg">回复</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4 px-2">全部评论 ({totalComments})</h3>
              
              {topLevelComments.length === 0 ? (
                <div className="glass-card rounded-3xl p-8 text-center">
                  <p className="text-lg text-muted-foreground">暂无评论</p>
                  <p className="text-base text-muted-foreground mt-2">快来发表你的看法吧</p>
                </div>
              ) : (
                <div className="glass-card rounded-3xl overflow-hidden">
                  {topLevelComments.map((comment, index) => {
                    const replies = getReplies(comment.id);
                    const visibleCount = expandedReplies[comment.id] || 3;
                    const visibleReplies = replies.slice(0, visibleCount);
                    const hasMoreReplies = replies.length > visibleCount;

                    return (
                      <div key={comment.id}>
                        {renderComment(comment)}
                        
                        {visibleReplies.length > 0 && (
                          <div>
                            {visibleReplies.map(reply => renderComment(reply, true))}

                            {hasMoreReplies && (
                              <div className="px-5 py-3 border-b border-gray-200/30 pl-16 bg-white/30">
                                <button
                                  onClick={() => loadMoreReplies(comment.id)}
                                  className="px-4 py-2 rounded-2xl glass-button text-sm text-primary hover:bg-white/50 transition-colors flex items-center gap-1"
                                >
                                  <span>查看更多回复</span>
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input sheet or fixed input */}
        {showInputSheet ? (
          <div className="flex-shrink-0 border-t border-gray-200/30 bg-white/80 backdrop-blur-xl p-6">
            <div className="max-w-2xl mx-auto">
              {replyTo && (
                <div className="mb-3 p-3 bg-orange-50 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    回复 <span className="text-primary font-medium">@{replyTo.userName}</span>
                  </p>
                </div>
              )}

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyTo ? `回复 @${replyTo.userName}` : "说点什么吧~"}
                className="w-full glass-card rounded-2xl px-5 py-3 text-base bg-transparent focus:outline-none resize-none min-h-[100px] mb-3"
                autoFocus
              />

              {commentImages.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {commentImages.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img src={img} alt="" className="w-20 h-20 rounded-xl object-cover" />
                      <button
                        onClick={() => removeCommentImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleVoiceInput}
                  className={`w-12 h-12 rounded-xl glass-button flex items-center justify-center transition-colors active:scale-95 ${
                    isRecording ? 'bg-red-500 text-white' : 'hover:bg-white/50'
                  }`}
                >
                  <Mic className="h-6 w-6" />
                </button>
                <button
                  onClick={handleImageUpload}
                  className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
                >
                  <ImageIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => {
                    setShowInputSheet(false);
                    setReplyTo(null);
                    setCommentText("");
                    setCommentImages([]);
                  }}
                  className="px-6 py-3 rounded-2xl glass-button hover:bg-white/50 transition-colors active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 border-t border-gray-200/30 bg-white/80 backdrop-blur-xl p-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="说点什么吧~"
                  className="flex-1 glass-card rounded-2xl px-5 py-3 text-base bg-transparent focus:outline-none"
                  onFocus={() => setShowInputSheet(true)}
                  readOnly
                />
                <button
                  onClick={() => setShowInputSheet(true)}
                  className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
                >
                  <Mic className="h-6 w-6 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setShowInputSheet(true)}
                  className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 删除评论确认对话框 */}
        {commentToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setCommentToDelete(null)}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-medium mb-3">确认删除</h3>
              <p className="text-lg text-muted-foreground mb-6">
                确定要删除这条评论吗？相关的回复也会一并删除。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCommentToDelete(null)}
                  className="flex-1 px-6 py-3 rounded-2xl glass-button text-lg font-medium hover:bg-gray-100/50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteComment(commentToDelete)}
                  className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-lg font-medium hover:bg-red-600 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}