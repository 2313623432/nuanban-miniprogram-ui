import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ShareButtonProps {
  content: string;
  title?: string;
  contentType?: "chat" | "podcast" | "post" | "other";
  className?: string;
}

export function ShareButton({ content, title, contentType = "other", className = "" }: ShareButtonProps) {
  const [hasSharedToday, setHasSharedToday] = useState(false);

  const handleShare = async () => {
    const shareText = title ? `${title}\n\n${content}` : content;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "分享内容",
          text: shareText
        });

        if (!hasSharedToday) {
          setHasSharedToday(true);
          toast.success("分享成功！获得 2 积分", {
            description: "同一内容每日首次分享可获积分"
          });
        } else {
          toast.success("分享成功");
        }
      } else {
        // 使用兼容性更好的复制方法
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);

          if (!hasSharedToday) {
            setHasSharedToday(true);
            toast.success("内容已复制！获得 2 积分", {
              description: "粘贴分享给好友后积分即时到账"
            });
          } else {
            toast.success("内容已复制到剪贴板");
          }
        } catch (err) {
          document.body.removeChild(textArea);
          toast.error("复制失败，请手动复制");
        }
      }
    } catch (error) {
      console.error("分享失败:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`glass-button rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <Share2 className="h-4 w-4" />
      <span className="text-sm">分享</span>
      {!hasSharedToday && (
        <span className="text-xs px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
          +2积分
        </span>
      )}
    </button>
  );
}
