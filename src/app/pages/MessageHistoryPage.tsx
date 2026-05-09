import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { mockComments, mockPosts } from "@/app/data/community";

interface MessageHistoryItem {
  id: string;
  postId: string;
  postTitle: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  timestamp: number;
}

interface LikeNotification {
  id: string;
  postId: string;
  postTitle: string;
  postContent: string;
  postImage?: string;
  likedBy: {
    name: string;
    avatar: string;
  };
  timestamp: number;
  createdAt: string;
}

// 模拟点赞数据
const mockLikes: LikeNotification[] = [
  {
    id: "like-1",
    postId: "post-1",
    postTitle: "",
    postContent: "春天来了，推荐大家多喝菊花枸杞茶，清肝明目，很适合这个季节",
    likedBy: {
      name: "秀琴",
      avatar: "https://images.unsplash.com/photo-1765248149215-b0c913b904fd?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 30,
    createdAt: "30分钟前"
  },
  {
    id: "like-2",
    postId: "post-2",
    postTitle: "",
    postContent: "今天学到了一个小妙招：泡脚的时候加点生姜，祛湿效果特别好",
    likedBy: {
      name: "国强",
      avatar: "https://images.unsplash.com/photo-1766758196087-44d9031b991c?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 120,
    createdAt: "2小时前"
  },
  {
    id: "like-3",
    postId: "post-3",
    postTitle: "",
    postContent: "最近天气干燥，大家记得多喝水，我每天早上都会喝一杯温蜂蜜水",
    postImage: "https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?w=800",
    likedBy: {
      name: "建华",
      avatar: "https://images.unsplash.com/photo-1706025090996-63717544be2d?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 180,
    createdAt: "3小时前"
  },
  {
    id: "like-4",
    postId: "post-4",
    postTitle: "",
    postContent: "分享一个助眠小方法：睡前用热水泡脚15分钟，配合按摩涌泉穴，睡得特别香",
    likedBy: {
      name: "静雅",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 240,
    createdAt: "4小时前"
  },
  {
    id: "like-5",
    postId: "post-5",
    postTitle: "",
    postContent: "今天做了红枣银耳汤，养颜又补气血，姐妹们可以试试",
    postImage: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800",
    likedBy: {
      name: "文博",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 26,
    createdAt: "昨天"
  },
  {
    id: "like-6",
    postId: "post-6",
    postTitle: "",
    postContent: "春天容易犯困，推荐喝点薄荷柠檬水，提神醒脑又好喝",
    likedBy: {
      name: "梅香",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    createdAt: "昨天"
  },
  {
    id: "like-7",
    postId: "post-7",
    postTitle: "",
    postContent: "今天在公园看到好多人打太极，我也想学习一下，有没有人一起",
    likedBy: {
      name: "国强",
      avatar: "https://images.unsplash.com/photo-1766758196087-44d9031b991c?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 50,
    createdAt: "2天前"
  },
  {
    id: "like-8",
    postId: "post-8",
    postTitle: "",
    postContent: "分享一个去火的食疗方：莲子百合粥，清心安神，特别适合春天",
    postImage: "https://images.unsplash.com/photo-1505576633371-ea5ca1d70f3b?w=800",
    likedBy: {
      name: "秀琴",
      avatar: "https://images.unsplash.com/photo-1765248149215-b0c913b904fd?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    createdAt: "3天前"
  },
  {
    id: "like-9",
    postId: "post-9",
    postTitle: "",
    postContent: "今天去爬山了，呼吸新鲜空气，整个人都神清气爽",
    postImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    likedBy: {
      name: "建华",
      avatar: "https://images.unsplash.com/photo-1706025090996-63737544be2d?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    createdAt: "4天前"
  },
  {
    id: "like-10",
    postId: "post-10",
    postTitle: "",
    postContent: "春季养肝正当时，推荐多吃青菜和水果，少吃辛辣油腻",
    likedBy: {
      name: "静雅",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    createdAt: "5天前"
  },
  {
    id: "like-11",
    postId: "post-11",
    postTitle: "",
    postContent: "今天早上做了八段锦，感觉整个人精神了很多",
    likedBy: {
      name: "建华",
      avatar: "https://images.unsplash.com/photo-1706025090996-63737544be2d?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 144,
    createdAt: "6天前"
  },
  {
    id: "like-12",
    postId: "post-12",
    postTitle: "",
    postContent: "推荐一个养胃的好习惯：每天早上空腹喝一杯温水",
    likedBy: {
      name: "秀琴",
      avatar: "https://images.unsplash.com/photo-1765248149215-b0c913b904fd?w=400"
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 168,
    createdAt: "7天前"
  }
];

export function MessageHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"messages" | "likes">("messages");
  const [displayedMessagesCount, setDisplayedMessagesCount] = useState(10);
  const [displayedLikesCount, setDisplayedLikesCount] = useState(10);

  // 收集所有AI回复消息
  const allMessages: MessageHistoryItem[] = [];

  Object.entries(mockComments).forEach(([postId, comments]) => {
    const post = mockPosts.find(p => p.id === postId);
    if (!post) return;

    comments.forEach(comment => {
      if (comment.isAI) {
        allMessages.push({
          id: comment.id,
          postId: postId,
          postTitle: post.title || post.content.slice(0, 30) + "...",
          author: {
            name: comment.author.name,
            avatar: comment.author.avatar
          },
          content: comment.content,
          createdAt: comment.createdAt,
          timestamp: comment.timestamp || 0
        });
      }
    });
  });

  // 按时间排序（最新在前）
  const sortedMessages = allMessages.sort((a, b) => b.timestamp - a.timestamp);
  const sortedLikes = [...mockLikes].sort((a, b) => b.timestamp - a.timestamp);

  // 显示的消息和点赞
  const displayedMessages = sortedMessages.slice(0, displayedMessagesCount);
  const displayedLikes = sortedLikes.slice(0, displayedLikesCount);

  const handleMessageClick = (postId: string) => {
    navigate(`/zhiyin/post/${postId}`);
  };

  const handleLoadMoreMessages = () => {
    setDisplayedMessagesCount(prev => prev + 10);
  };

  const handleLoadMoreLikes = () => {
    setDisplayedLikesCount(prev => prev + 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3]">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-header border-b-0 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/50 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-medium">消息中心</h1>
          <div className="w-10"></div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-2.5 rounded-2xl text-base font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "messages"
                ? "glass-primary text-white shadow-lg"
                : "glass-button text-foreground hover:bg-white/50"
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span>历史消息</span>
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 py-2.5 rounded-2xl text-base font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "likes"
                ? "glass-primary text-white shadow-lg"
                : "glass-button text-foreground hover:bg-white/50"
            }`}
          >
            <Heart className="h-5 w-5" />
            <span>点赞消息</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-6">
        {activeTab === "messages" ? (
          <>
            {displayedMessages.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-primary" />
                </div>
                <p className="text-xl text-muted-foreground mb-2">暂无消息</p>
                <p className="text-base text-muted-foreground">AI专家的回复会在这里显示</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message.postId)}
                    className="glass-card rounded-3xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={message.author.avatar}
                          alt={message.author.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 shadow-md"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name and time */}
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-medium">{message.author.name}</h4>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">{message.createdAt}</span>
                        </div>

                        {/* Post title */}
                        <p className="text-sm text-muted-foreground mb-2">
                          回复了「{message.postTitle}」
                        </p>

                        {/* Message preview */}
                        <p className="text-base text-foreground line-clamp-2 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load more button */}
                {displayedMessagesCount < sortedMessages.length && (
                  <button
                    onClick={handleLoadMoreMessages}
                    className="w-full py-4 rounded-2xl glass-button text-base font-medium hover:bg-white/50 transition-colors"
                  >
                    加载更多
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {displayedLikes.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400/20 to-pink-400/20 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-red-400" />
                </div>
                <p className="text-xl text-muted-foreground mb-2">暂无点赞</p>
                <p className="text-base text-muted-foreground">当有人喜欢你的内容时，会在这里显示</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedLikes.map((like) => (
                  <div
                    key={like.id}
                    onClick={() => handleMessageClick(like.postId)}
                    className="glass-card rounded-3xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={like.likedBy.avatar}
                          alt={like.likedBy.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                          <Heart className="h-3.5 w-3.5 text-white" fill="currentColor" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name and time */}
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-medium">{like.likedBy.name}</h4>
                          <span className="text-sm text-muted-foreground">赞了你</span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">{like.createdAt}</span>
                        </div>

                        {/* Post preview */}
                        <div className="flex gap-3">
                          <p className="flex-1 text-base text-muted-foreground line-clamp-2 leading-relaxed">
                            {like.postContent}
                          </p>
                          {like.postImage && (
                            <img
                              src={like.postImage}
                              alt="帖子配图"
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load more button */}
                {displayedLikesCount < sortedLikes.length && (
                  <button
                    onClick={handleLoadMoreLikes}
                    className="w-full py-4 rounded-2xl glass-button text-base font-medium hover:bg-white/50 transition-colors"
                  >
                    加载更多
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
