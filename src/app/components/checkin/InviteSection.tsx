import { useState, useRef } from "react";
import { Gift, Copy, Share2, QrCode, Award, Download, Image } from "lucide-react";
import { toast } from "sonner";
import wechatLogo from "figma:asset/667e7fc3b19f62b1d1f1468a589d3d89f9fb3443.png";

export function InviteSection() {
  const [inviteCode] = useState("HEALTH2026");
  const [inviteCount] = useState(3);
  const [earnedPoints] = useState(150);
  const [showShareImage, setShowShareImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const shareImageRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    // 使用兼容性更好的复制方法
    const textArea = document.createElement("textarea");
    textArea.value = inviteCode;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("邀请码已复制");
    } catch (err) {
      document.body.removeChild(textArea);
      toast.error("复制失败，请手动复制");
    }
  };

  const handleSharePoster = () => {
    setShowShareImage(true);
  };

  // 下载分享图片
  const handleDownloadImage = async () => {
    if (!shareImageRef.current) return;

    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(shareImageRef.current, {
        scale: 2,
        backgroundColor: "#FFF5E6",
        logging: false,
        useCORS: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("生成图片失败");
          setIsGenerating(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `暖伴邀请-${inviteCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("图片已保存，快去分享吧！");
        setIsGenerating(false);
      });
    } catch (error) {
      console.error("生成图片失败:", error);
      toast.error("生成图片失败，请重试");
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    const shareText = `我在使用这个健康打卡小程序，一起来养成健康习惯吧！使用我的邀请码 ${inviteCode} 注册，你我都能获得积分奖励哦~`;

    if (navigator.share) {
      navigator.share({
        title: "邀请你一起健康打卡",
        text: shareText
      }).then(() => {
        toast.success("分享成功！+2积分");
      }).catch(() => {});
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
        toast.success("分享内容已复制，粘贴发送给好友吧");
      } catch (err) {
        document.body.removeChild(textArea);
        toast.error("复制失败，请手动复制");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 邀请统计 */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">邀请好友</h3>
          <div className="flex items-center gap-2 glass-button px-4 py-2 rounded-xl">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-sm">双方各得积分</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
              {inviteCount}
            </div>
            <div className="text-sm text-muted-foreground">已邀请人数</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
              {earnedPoints}
            </div>
            <div className="text-sm text-muted-foreground">累计获得积分</div>
          </div>
        </div>

        {/* 邀请码 */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="text-sm text-muted-foreground text-center">我的专属邀请码</div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-3xl font-mono font-bold tracking-wider">
              {inviteCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="glass-button h-12 w-12 rounded-xl flex items-center justify-center"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleShare}
            className="py-3 rounded-2xl glass-button flex items-center justify-center gap-2 font-medium"
          >
            <Share2 className="h-5 w-5" />
            分享文字
          </button>
          <button
            onClick={handleSharePoster}
            className="py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center gap-2 font-medium"
          >
            <Image className="h-5 w-5" />
            生成分享图
          </button>
        </div>

        {/* 奖励说明 */}
        <div className="mt-4 glass-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Award className="h-4 w-4 text-primary" />
            <span>邀请奖励</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            <li>• 邀请人获得：50积分/人</li>
            <li>• 被邀请人获得：30积分（注册即得）</li>
            <li>• 邀请无上限，多邀多得</li>
          </ul>
        </div>
      </div>

      {/* 风控提示 */}
      <div className="glass-card rounded-3xl p-6 bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          ⚠️ 系统会自动检测异常行为，恶意刷积分将被冻结账户
        </p>
      </div>

      {/* 分享图片预览模态框 */}
      {showShareImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareImage(false)}
          />

          <div className="relative w-full max-w-md glass-card rounded-3xl p-6 animate-in zoom-in-95">
            {/* 分享图片内容 */}
            <div
              ref={shareImageRef}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 mb-6"
              style={{ width: "375px", margin: "0 auto" }}
            >
              {/* 顶部标题 */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  暖伴
                </h1>
                <p className="text-sm text-gray-600">专为老年人设计的糖尿病陪伴应用</p>
              </div>

              {/* 邀请信息 */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    我在使用暖伴健康管理
                  </div>
                  <p className="text-sm text-gray-600">
                    AI专家陪伴·健康打卡·知识分享
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-2">我的邀请码</div>
                    <div className="text-2xl font-mono font-bold tracking-wider text-primary">
                      {inviteCode}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold">
                  <Gift className="h-4 w-4" />
                  <span>注册即得30积分·邀请人得50积分</span>
                </div>
              </div>

              {/* 二维码区域 */}
              <div className="bg-white rounded-2xl p-4 text-center shadow-lg">
                <div className="inline-block p-3 bg-gray-100 rounded-xl mb-2">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">长按识别二维码加入暖伴</p>
              </div>

              {/* 底部微信logo */}
              <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
                <img src={wechatLogo} alt="微信" className="h-5 w-5" />
                <span className="text-xs text-gray-500">微信小程序</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareImage(false)}
                className="flex-1 py-3 rounded-2xl glass-button font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  "生成中..."
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    保存图片
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
