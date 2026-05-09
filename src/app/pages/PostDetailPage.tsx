import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Image as ImageIcon, Mic, Send, X, ChevronDown, Share2, Trash2, Edit } from "lucide-react";
import { mockPosts, mockComments, currentUser, Comment, communityAIUsers } from "@/app/data/community";
import { PostShareModal } from "@/app/components/PostShareModal";
import { PostComposerSheet } from "@/app/components/PostComposerSheet";

export function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  
  // 从 localStorage 读取用户发的帖子
  const savedUserPosts = localStorage.getItem('zhiyin-user-posts');
  const userPosts: any[] = savedUserPosts ? JSON.parse(savedUserPosts) : [];
  const allPosts = [...userPosts, ...mockPosts];
  
  const post = allPosts.find(p => p.id === postId);

  // 判断是否是自己的帖子
  const isOwnPost = post?.author?.id === currentUser.id;

  // 删除帖子确认状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // 删除评论确认状态
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  // 编辑帖子状态
  const [isEditingPost, setIsEditingPost] = useState(false);
  // 点踩帖子确认状态
  const [showDislikeConfirm, setShowDislikeConfirm] = useState(false);
  
  // 从 localStorage 读取评论并合并
  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem('zhiyin-comments');
    const allCommentsMap: { [key: string]: Comment[] } = savedComments ? JSON.parse(savedComments) : {};
    const userComments = allCommentsMap[postId || ""] || [];
    const systemComments = mockComments[postId || ""] || [];
    return [...userComments, ...systemComments];
  });
  const [commentText, setCommentText] = useState("");
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(post?.isDisliked || false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [dislikes, setDislikes] = useState(post?.dislikes || 0);

  // 图片预览状态
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 展开的回复列表（记录每个一级评论显示多少条回复）
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: number }>({});

  // 当评论变化时，保存用户评论到 localStorage
  useEffect(() => {
    // 只保存用户评论（非系统评论）
    const userComments = comments.filter(c => !mockComments[postId || ""]?.some(mc => mc.id === c.id));
    if (userComments.length > 0) {
      const savedComments = localStorage.getItem('zhiyin-comments');
      const allCommentsMap: { [key: string]: Comment[] } = savedComments ? JSON.parse(savedComments) : {};
      allCommentsMap[postId || ""] = userComments;
      localStorage.setItem('zhiyin-comments', JSON.stringify(allCommentsMap));
    }
  }, [comments, postId]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">帖子不存在</p>
      </div>
    );
  }

  // 获取一级评论
  const topLevelComments = comments.filter(c => !c.parentId).sort((a, b) => {
    // 按时间戳排序（从新到旧）
    const timeA = a.timestamp || 0;
    const timeB = b.timestamp || 0;
    return timeB - timeA;
  });

  // 获取某个一级评论的二级回复
  const getReplies = (parentId: string) => {
    return comments.filter(c => c.parentId === parentId).sort((a, b) => {
      // 二级回复也按时间戳排序（从新到旧）
      const timeA = a.timestamp || 0;
      const timeB = b.timestamp || 0;
      return timeB - timeA;
    });
  };

  // 计算总评论数（一级+二级）
  const totalComments = comments.length;

  const handleLike = () => {
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
  };

  const handleDislike = () => {
    // 显示点踩确认对话框
    setShowDislikeConfirm(true);
  };

  // 确认点踩帖子
  const confirmDislikePost = () => {
    if (!postId) return;

    // 将帖子加入隐藏列表
    const hiddenPosts = localStorage.getItem('zhiyin-hidden-posts');
    const hiddenIds: string[] = hiddenPosts ? JSON.parse(hiddenPosts) : [];
    hiddenIds.push(postId);
    localStorage.setItem('zhiyin-hidden-posts', JSON.stringify(hiddenIds));

    setShowDislikeConfirm(false);
    // 返回上一页
    navigate(-1);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const currentLikes = comment.likes || 0;
        const currentDislikes = comment.dislikes || 0;
        const isCurrentlyLiked = comment.isLiked || false;
        const isCurrentlyDisliked = comment.isDisliked || false;

        if (isCurrentlyLiked) {
          return {
            ...comment,
            isLiked: false,
            likes: currentLikes - 1
          };
        } else {
          return {
            ...comment,
            isLiked: true,
            likes: currentLikes + 1,
            isDisliked: false,
            dislikes: isCurrentlyDisliked ? currentDislikes - 1 : currentDislikes
          };
        }
      }
      return comment;
    }));
  };

  const handleCommentDislike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        // 点踩会折叠评论
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
    setComments(prev => prev.map(comment => {
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
    setShowReplyModal(true);
    setCommentText("");
    setCommentImages([]);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setShowReplyModal(false);
    setCommentText("");
    setCommentImages([]);
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
        timestamp: Date.now(),
        isAI: false,
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
      };

      setComments([newComment, ...comments]);
      handleCancelReply();
    } else {
      // 创建一级评论
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        author: currentUser,
        content: commentText,
        images: commentImages,
        createdAt: "刚刚",
        timestamp: Date.now(),
        isAI: false,
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
      };

      setComments([newComment, ...comments]);

      // 模拟AI回复（1-3个AI专家作为二级评论）
      const numAIReplies = Math.floor(Math.random() * 3) + 1;
      const aiReplies: Comment[] = [];
      
      const aiResponses = [
        "从中医角度看，您说得很有道理。建议配合适当的运动，效果会更好。",
        "我也有类似的经验，确实很有效果。不过要注意因人而异，建议循序渐进。",
        "补充一点，要注意饮食搭配，不能只依赖单一方法。",
        "这个方法确实不错，我也推荐给我的家人了。",
        "感谢分享！我会试试看的。"
      ];

      setTimeout(() => {
        for (let i = 0; i < numAIReplies; i++) {
          const randomAI = communityAIUsers[Math.floor(Math.random() * communityAIUsers.length)];
          const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
          
          aiReplies.push({
            id: `ai-comment-${Date.now()}-${i}`,
            postId: post.id,
            parentId: newComment.id,
            author: randomAI,
            replyToUser: currentUser.name,
            content: randomResponse,
            createdAt: "刚刚",
            timestamp: Date.now() + i * 100, // 确保每个AI回复有不同的时间戳
            isAI: true,
            likes: 0,
            dislikes: 0,
            isLiked: false,
            isDisliked: false
          });
        }
        
        setComments(prev => [...aiReplies, ...prev]);
      }, 1000 + Math.random() * 2000);

      setCommentText("");
      setCommentImages([]);
      handleCancelReply();
    }
  };

  const handleImageUpload = () => {
    const mockImage = `https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&t=${Date.now()}`;
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

  // 删除帖子
  const handleDeletePost = () => {
    if (!postId) return;
    
    // 从 localStorage 中删除帖子
    const savedPosts = localStorage.getItem('zhiyin-user-posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.filter((p: any) => p.id !== postId);
      localStorage.setItem('zhiyin-user-posts', JSON.stringify(updatedPosts));
    }
    
    // 删除相关评论
    const savedComments = localStorage.getItem('zhiyin-comments');
    if (savedComments) {
      const allCommentsMap = JSON.parse(savedComments);
      delete allCommentsMap[postId];
      localStorage.setItem('zhiyin-comments', JSON.stringify(allCommentsMap));
    }
    
    setShowDeleteConfirm(false);
    navigate(-1);
  };

  // 删除评论
  const handleDeleteComment = (commentId: string) => {
    // 删除评论及其所有回复
    setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    setCommentToDelete(null);
  };

  // 编辑帖子
  const handleEditPost = (title: string, content: string, images: string[], editPostId?: string) => {
    if (!editPostId || !post) return;

    // 更新帖子内容
    const updatedPost = {
      ...post,
      title,
      content,
      images,
      editedAt: Date.now(),
      editedAtText: "刚刚"
    };

    // 更新 localStorage 中的用户帖子
    const savedPosts = localStorage.getItem('zhiyin-user-posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: any) =>
        p.id === editPostId ? updatedPost : p
      );
      localStorage.setItem('zhiyin-user-posts', JSON.stringify(updatedPosts));
    }

    setIsEditingPost(false);
    // 刷新页面以显示更新后的内容
    window.location.reload();
  };

  // 格式化编辑时间
  const formatEditedTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;

    // 超过24小时显示月-日
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    // 判断是否是自己的评论
    const isOwnComment = comment.author.id === currentUser.id;

    if (comment.isCollapsed) {
      // 折叠状态
      return (
        <div key={comment.id} className={`py-4 px-5 border-b border-gray-200/30 last:border-b-0 ${isReply ? 'pl-16 bg-white/30' : ''}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">该评论已被折叠</p>
            <button
              onClick={() => handleExpandComment(comment.id)}
              className="px-4 py-1.5 rounded-full glass-button text-sm hover:bg-white/50 transition-colors"
            >
              展开
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={comment.id} className={`py-4 px-5 border-b border-gray-200/30 last:border-b-0 ${isReply ? 'pl-16 bg-white/30' : ''}`}>
        {/* Comment author */}
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

        {/* 回复提示 */}
        {comment.replyToUser && (
          <div className="mb-2 ml-13">
            <span className="text-sm text-primary">回复 @{comment.replyToUser}</span>
          </div>
        )}

        {/* Comment content */}
        <p className="text-base text-foreground leading-relaxed mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Comment images */}
        {comment.images && comment.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
            {comment.images.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setPreviewImage(img)}
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

        {/* Comment interaction */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={() => handleCommentLike(comment.id)}
            className={`flex items-center gap-1.5 transition-all ${
              comment.isLiked ? 'text-primary' : 'text-muted-foreground'
            } hover:text-primary active:scale-95`}
          >
            <ThumbsUp className={`h-5 w-5 ${comment.isLiked ? 'fill-primary' : ''}`} />
            <span className="text-sm">{comment.likes || 0}</span>
          </button>

          {/* 点踩按钮 - AI评论和非自己的评论都显示 */}
          {(comment.author.isAI || !isOwnComment) && (
            <button
              onClick={() => handleCommentDislike(comment.id)}
              className="flex items-center gap-1.5 transition-all text-muted-foreground hover:text-red-500 active:scale-95"
            >
              <ThumbsDown className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => handleReply(comment.parentId || comment.id, comment.author.name)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">回复</span>
          </button>

          {/* 删除按钮 - 只在用户自己的评论上显示，AI评论不能删除 */}
          {isOwnComment && !comment.author.isAI && (
            <button
              onClick={() => setCommentToDelete(comment.id)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors active:scale-95 ml-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-header border-b-0 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-medium">帖子详情</h1>
          <div className="flex items-center gap-2">
            {/* 编辑和删除按钮 - 只在自己的帖子上显示 */}
            {isOwnPost && (
              <>
                <button
                  onClick={() => setIsEditingPost(true)}
                  className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors active:scale-95"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Post content */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          {/* User info */}
          <div className="flex items-start gap-3 mb-4">
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

          {/* Post title and content */}
          {post.title && (
            <h2 className="text-2xl font-medium mb-3">{post.title}</h2>
          )}
          <p className="text-lg text-foreground leading-relaxed mb-4 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              post.images.length === 1 ? 'grid-cols-1' :
              post.images.length === 2 ? 'grid-cols-2' :
              post.images.length === 4 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {post.images.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setPreviewImage(img)}
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

          {/* Interaction buttons */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-200/50">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all ${
                isLiked ? 'text-primary' : 'text-muted-foreground'
              } hover:text-primary active:scale-95`}
            >
              <ThumbsUp className={`h-6 w-6 ${isLiked ? 'fill-primary' : ''}`} />
              <span className="text-lg">{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors active:scale-95"
            >
              <ThumbsDown className="h-6 w-6" />
            </button>

            <button
              onClick={() => setShowReplyModal(true)}
              className="flex items-center gap-2 text-muted-foreground ml-auto hover:text-primary transition-colors active:scale-95"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-lg">回复</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
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
                    {/* 一级评论 */}
                    {renderComment(comment)}
                    
                    {/* 二级回复 */}
                    {visibleReplies.length > 0 && (
                      <>
                        {visibleReplies.map(reply => renderComment(reply, true))}
                      </>
                    )}

                    {/* 查看更多回复按钮 */}
                    {hasMoreReplies && (
                      <div className="px-5 py-3 border-b border-gray-200/30 pl-16 bg-white/30">
                        <button
                          onClick={() => loadMoreReplies(comment.id)}
                          className="px-4 py-2 rounded-2xl glass-button text-sm text-primary hover:bg-white/50 transition-colors flex items-center gap-1"
                        >
                          <span>展开{replies.length - visibleCount}条回复</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed comment input - 仅在未打开回复框时显示 */}
      {!showReplyModal && (
        <div className="fixed bottom-0 left-0 right-0 glass-header border-t-0 shadow-2xl z-50 safe-area-bottom">
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="说点什么吧~"
                className="flex-1 glass-card rounded-2xl px-5 py-3 text-base bg-transparent focus:outline-none"
                onFocus={() => setShowReplyModal(true)}
                readOnly
              />
              <button
                onClick={() => setShowReplyModal(true)}
                className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
              >
                <Mic className="h-6 w-6 text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowReplyModal(true)}
                className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal - 从底部弹出 */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={handleCancelReply}>
          <div 
            className="w-full glass-header rounded-t-3xl shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto p-6">
              {/* 顶部拖动条 */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="mb-4 flex items-center gap-3 px-5 py-4 glass-primary rounded-2xl">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-lg">正在录音...</span>
                </div>
              )}

              {/* Image preview */}
              {commentImages.length > 0 && (
                <div className="mb-4 flex gap-3 overflow-x-auto">
                  {commentImages.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={img} alt={`图片${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeCommentImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="glass-card rounded-2xl p-4 mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={replyTo ? `回复 @${replyTo.userName}` : "说点什么吧~"}
                  className="w-full bg-transparent text-lg resize-none border-0 focus:outline-none min-h-[120px]"
                  autoFocus
                />
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={handleImageUpload}
                    className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-white/50 transition-colors"
                  >
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </button>
                  
                  <button
                    onClick={handleVoiceInput}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isRecording 
                        ? 'glass-primary' 
                        : 'glass-button hover:bg-white/50'
                    }`}
                  >
                    <Mic className={`h-6 w-6 ${isRecording ? 'text-white' : 'text-muted-foreground'}`} />
                  </button>
                </div>

                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className="px-8 py-3 rounded-xl glass-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity text-base"
                >
                  <span className="text-white font-medium">发送</span>
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={previewImage}
            alt="预览"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <PostShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Edit Post Modal */}
      {isEditingPost && (
        <PostComposerSheet
          isOpen={isEditingPost}
          onClose={() => setIsEditingPost(false)}
          onSubmit={handleEditPost}
          editPost={post}
        />
      )}

      {/* 删除帖子确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 animate-slide-up">
            <h3 className="text-2xl font-medium mb-3">确认删除</h3>
            <p className="text-lg text-muted-foreground mb-6">
              确定要删除这条帖子吗？删除后将无法恢复，相关评论也会一并删除。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 rounded-2xl glass-button text-lg font-medium hover:bg-gray-100/50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-lg font-medium hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除评论确认对话框 */}
      {commentToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommentToDelete(null)}
          ></div>
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 animate-slide-up">
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

      {/* 点踩帖子确认对话框 */}
      {showDislikeConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDislikeConfirm(false)}
          ></div>
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 animate-slide-up">
            <h3 className="text-2xl font-medium mb-3">确认不感兴趣</h3>
            <p className="text-lg text-muted-foreground mb-6">
              确定对这条帖子不感兴趣吗？确认后该帖子将从您的信息流中隐藏。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDislikeConfirm(false)}
                className="flex-1 px-6 py-3 rounded-2xl glass-button text-lg font-medium hover:bg-gray-100/50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDislikePost}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-lg font-medium hover:bg-red-600 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}