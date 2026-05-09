import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TabBar } from "@/app/components/layout/TabBar";
import { PostCard } from "@/app/components/PostCard";
import { PostComposerSheet } from "@/app/components/PostComposerSheet";
import { PostDetailDrawer } from "@/app/components/PostDetailDrawer";
import { currentUser, mockPosts, categories, Post, mockComments, Comment } from "@/app/data/community";
import { History, Plus } from "lucide-react";

export function ZhiyinPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("recommend");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);

  // 从 localStorage 读取用户信息
  const [userInfo] = useState(() => {
    const saved = localStorage.getItem('user-profile');
    if (saved) {
      const profile = JSON.parse(saved);
      return {
        avatar: profile.avatar || currentUser.avatar,
        bio: profile.bio || currentUser.bio
      };
    }
    return { avatar: currentUser.avatar, bio: currentUser.bio };
  });

  // 从 localStorage 读取隐藏的帖子ID列表
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('zhiyin-hidden-posts');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 确认对话框状态
  const [postToClose, setPostToClose] = useState<{ id: string; isOwner: boolean } | null>(null);

  // 点踩确认对话框状态
  const [postToDislike, setPostToDislike] = useState<string | null>(null);
  
  // 从 localStorage 读取用户发的帖子并合并
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedUserPosts = localStorage.getItem('zhiyin-user-posts');
    const userPosts: Post[] = savedUserPosts ? JSON.parse(savedUserPosts) : [];
    // 合并用户发的帖子和系统帖子
    return [...userPosts, ...mockPosts];
  });
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // 从 localStorage 读取评论并合并
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>(() => {
    const savedComments = localStorage.getItem('zhiyin-comments');
    const userComments: { [key: string]: Comment[] } = savedComments ? JSON.parse(savedComments) : {};
    // 合并用户评论和系统评论
    const merged: { [key: string]: Comment[] } = { ...mockComments };
    Object.keys(userComments).forEach(postId => {
      merged[postId] = [...(userComments[postId] || []), ...(mockComments[postId] || [])];
    });
    return merged;
  });

  // 使用 localStorage 持久化已读状态，新用户默认未读
  const [hasReadMessages, setHasReadMessages] = useState(() => {
    const saved = localStorage.getItem('zhiyin-has-read-messages');
    return saved === 'true';
  });

  // 当 hasReadMessages 改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('zhiyin-has-read-messages', String(hasReadMessages));
  }, [hasReadMessages]);

  // 计算未读消息数（这里假设所有AI回复都是未读的）
  const unreadCount = hasReadMessages ? 0 : Object.values(comments).flat().filter(c => c.isAI).length;

  // 根据分类过滤帖子，并排除隐藏的帖子
  const filteredPosts = selectedCategory === "recommend"
    ? posts.filter(p => !hiddenPostIds.includes(p.id))
    : selectedCategory === "personal"
    ? posts.filter(p => p.author.id === currentUser.id && !hiddenPostIds.includes(p.id))
    : posts.filter(p => p.category === selectedCategory && !hiddenPostIds.includes(p.id));

  // 按时间戳排序（从新到旧）
  let sortedPosts = [...filteredPosts].sort((a, b) => {
    const timeA = a.timestamp || 0;
    const timeB = b.timestamp || 0;
    return timeB - timeA; // 降序排列
  });

  // 如果在推荐页且有新发布的帖子，将其置顶
  if (selectedCategory === "recommend" && newPostId) {
    const newPostIndex = sortedPosts.findIndex(p => p.id === newPostId);
    if (newPostIndex > 0) {
      const [newPost] = sortedPosts.splice(newPostIndex, 1);
      sortedPosts.unshift(newPost);
    }
  }

  const handleCreatePost = (title: string, content: string, images: string[], editPostId?: string) => {
    if (editPostId) {
      // 编辑模式
      const updatedPosts = posts.map(p => {
        if (p.id === editPostId) {
          return {
            ...p,
            title,
            content,
            images,
            editedAt: Date.now(),
            editedAtText: "刚刚"
          };
        }
        return p;
      });
      setPosts(updatedPosts);

      // 更新 localStorage 中的用户帖子
      const savedUserPosts = localStorage.getItem('zhiyin-user-posts');
      if (savedUserPosts) {
        const userPosts: Post[] = JSON.parse(savedUserPosts);
        const updatedUserPosts = userPosts.map(p => {
          if (p.id === editPostId) {
            return {
              ...p,
              title,
              content,
              images,
              editedAt: Date.now(),
              editedAtText: "刚刚"
            };
          }
          return p;
        });
        localStorage.setItem('zhiyin-user-posts', JSON.stringify(updatedUserPosts));
      }

      // 编辑成功后不显示成功页，直接返回
      return;
    }

    // 新建模式
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        ...currentUser,
        avatar: userInfo.avatar,
        bio: userInfo.bio
      },
      title,
      content,
      images,
      category: "personal",
      createdAt: "刚刚",
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      commentCount: 0
    };

    // 更新 posts 列表
    setPosts([newPost, ...posts]);

    // 只保存用户发的帖子到 localStorage
    const savedUserPosts = localStorage.getItem('zhiyin-user-posts');
    const userPosts: Post[] = savedUserPosts ? JSON.parse(savedUserPosts) : [];
    localStorage.setItem('zhiyin-user-posts', JSON.stringify([newPost, ...userPosts]));

    // 显示发布成功页面
    setNewPostId(newPost.id);
    setShowSuccessPage(true);

    // 1.5秒后自动跳转到推荐页
    setTimeout(() => {
      setShowSuccessPage(false);
      setSelectedCategory("recommend");
    }, 1500);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/zhiyin/post/${postId}`);
  };

  const handleReplyClick = (post: Post) => {
    setSelectedPost(post);
  };

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsComposerOpen(true);
  };

  const handleAddComment = (comment: Comment) => {
    setComments(prev => ({
      ...prev,
      [selectedPost!.id]: [comment, ...(prev[selectedPost!.id] || [])]
    }));
    
    // 更新帖子的评论数
    setPosts(prev => prev.map(p => 
      p.id === selectedPost!.id 
        ? { ...p, commentCount: p.commentCount + 1 }
        : p
    ));
  };

  // 处理关闭/删除帖子请求
  const handleClosePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isOwner = post.author.id === currentUser.id;
    setPostToClose({ id: postId, isOwner });
  };

  // 处理点踩帖子请求
  const handleDislikePost = (postId: string) => {
    setPostToDislike(postId);
  };

  // 确认点踩帖子
  const confirmDislikePost = () => {
    if (!postToDislike) return;

    // 将帖子加入隐藏列表
    const newHiddenIds = [...hiddenPostIds, postToDislike];
    setHiddenPostIds(newHiddenIds);
    localStorage.setItem('zhiyin-hidden-posts', JSON.stringify(newHiddenIds));

    setPostToDislike(null);
  };

  // 确认关闭/删除帖子
  const confirmClosePost = () => {
    if (!postToClose) return;
    
    const { id, isOwner } = postToClose;
    
    if (isOwner) {
      // 删除自己的帖子
      setPosts(prev => prev.filter(p => p.id !== id));
      
      // 同时删除该帖子的所有评论
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[id];
        return newComments;
      });
      
      // 从 localStorage 中删除
      const savedUserPosts = localStorage.getItem('zhiyin-user-posts');
      if (savedUserPosts) {
        const userPosts: Post[] = JSON.parse(savedUserPosts);
        const updatedPosts = userPosts.filter(p => p.id !== id);
        localStorage.setItem('zhiyin-user-posts', JSON.stringify(updatedPosts));
      }
    } else {
      // 隐藏系统帖子
      const newHiddenIds = [...hiddenPostIds, id];
      setHiddenPostIds(newHiddenIds);
      localStorage.setItem('zhiyin-hidden-posts', JSON.stringify(newHiddenIds));
    }
    
    setPostToClose(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="pt-6 px-4 max-w-2xl mx-auto relative z-10">
        {/* Post input box with history button */}
        <div className="glass-card rounded-3xl p-4 mb-6 transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* History button with unread badge */}
            <button
              onClick={() => {
                setHasReadMessages(true);
                navigate('/zhiyin/messages');
              }}
              className="relative w-12 h-12 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95 flex-shrink-0"
            >
              <History className="h-6 w-6" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1 shadow-md">
                  <span className="text-white text-xs font-bold leading-none">{unreadCount > 99 ? '99+' : unreadCount}</span>
                </div>
              )}
            </button>

            {/* Input area */}
            <div
              onClick={() => setIsComposerOpen(true)}
              className="flex-1 glass-button rounded-2xl px-4 py-3 text-base text-muted-foreground hover:bg-white/50 transition-colors cursor-pointer"
            >
              随时分享你的问题或者日常感悟~
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-base font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'glass-primary text-white shadow-lg'
                    : 'glass-button text-foreground hover:bg-white/50'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts list */}
        <div className="space-y-5">
          {sortedPosts.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center">
              <p className="text-xl text-muted-foreground mb-3">暂无内容</p>
              <p className="text-base text-muted-foreground">
                {selectedCategory === "personal" ? "快来发布你的第一条内容吧" : "敬请期待更多精彩内容"}
              </p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post.id)}
                onReplyClick={() => handleReplyClick(post)}
                onClose={handleClosePost}
                onEdit={handleEditPost}
                onDislike={handleDislikePost}
                currentUserId={currentUser.id}
              />
            ))
          )}
        </div>
      </div>

      <TabBar />
      <PostComposerSheet
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleCreatePost}
        editPost={editingPost}
      />
      {selectedPost && (
        <PostDetailDrawer
          post={selectedPost}
          comments={comments[selectedPost.id] || []}
          onClose={() => setSelectedPost(null)}
          onAddComment={handleAddComment}
        />
      )}

      {/* 发布成功假页面 */}
      {showSuccessPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3]">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-medium text-foreground">发布成功</h2>
          </div>
        </div>
      )}

      {/* 确认对话框 */}
      {postToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPostToClose(null)}
          ></div>

          {/* Dialog */}
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 animate-slide-up">
            <h3 className="text-2xl font-medium mb-3">
              {postToClose.isOwner ? '确认删除' : '确认关闭'}
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              {postToClose.isOwner
                ? '确定要删除这条帖子吗？删除后将无法恢复，相关评论也会一并删除。'
                : '确定要关闭这条帖子吗？关闭后将不再显示。'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPostToClose(null)}
                className="flex-1 px-6 py-3 rounded-2xl glass-button text-lg font-medium hover:bg-gray-100/50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmClosePost}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-lg font-medium hover:bg-red-600 transition-colors shadow-lg"
              >
                {postToClose.isOwner ? '删除' : '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 点踩确认对话框 */}
      {postToDislike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPostToDislike(null)}
          ></div>

          {/* Dialog */}
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 animate-slide-up">
            <h3 className="text-2xl font-medium mb-3">确认不感兴趣</h3>
            <p className="text-lg text-muted-foreground mb-6">
              确定对这条帖子不感兴趣吗？确认后该帖子将从您的信息流中隐藏。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPostToDislike(null)}
                className="flex-1 px-6 py-3 rounded-2xl glass-button text-lg font-medium hover:bg-gray-100/50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDislikePost}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-lg font-medium hover:bg-red-600 transition-colors shadow-lg"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}