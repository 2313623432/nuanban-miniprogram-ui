import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WechatSubscriptionModalProps {
  giftName: string;
  giftImage: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function WechatSubscriptionModal({
  giftName,
  giftImage,
  onSuccess,
  onClose
}: WechatSubscriptionModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    if (!agreed) {
      toast.error("请先阅读并同意服务协议");
      return;
    }

    setIsProcessing(true);

    // 模拟微信自动续费签约流程
    setTimeout(() => {
      toast.success("签约成功！", {
        description: "已开通3天免费会员体验"
      });

      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-3xl max-w-md w-full overflow-hidden">
        {/* 顶部关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-xl glass-button flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 头部展示区 */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-orange-400"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

          <div className="relative py-8 px-6 text-center">
            {/* 产品图 */}
            <div className="inline-block relative mb-4">
              <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white mx-auto">
                <img
                  src={giftImage}
                  alt={giftName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-black px-3 py-1 rounded-full shadow-xl border-2 border-white animate-bounce">
                🔥 免费
              </div>
            </div>

            {/* 超大标题 */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-7xl font-black text-white drop-shadow-2xl">0元</span>
                <span className="text-3xl font-black text-yellow-100 drop-shadow-lg">免费领</span>
              </div>
              <div className="text-2xl font-bold text-white/95 drop-shadow-md">
                {giftName}
              </div>
              <div className="text-sm text-white/80">
                价值89元实物礼品 · 包邮到家
              </div>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-6">
          {/* 会员权益 */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-center text-lg">🎁 会员专属权益</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🥛", text: `免费领${giftName}` },
                { icon: "⚡", text: "打卡积分×1.5" },
                { icon: "🎵", text: "专属AI语音" },
                { icon: "✨", text: "更多福利" }
              ].map((item, index) => (
                <div key={index} className="glass-card rounded-xl p-3 text-center text-sm">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="font-medium">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 协议勾选 */}
          <div className="glass-card rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-5 w-5 rounded border-2 border-primary/30 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                />
              </div>
              <div className="flex-1 text-sm leading-relaxed">
                <span className="text-muted-foreground">
                  我已阅读并同意
                </span>
                <button className="text-primary font-medium mx-1 underline">
                  《会员服务协议》
                </button>
                <span className="text-muted-foreground">和</span>
                <button className="text-primary font-medium mx-1 underline">
                  《自动续费协议》
                </button>
              </div>
            </label>

            {/* 续费说明 - 清晰可见 */}
            <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-500 leading-relaxed">
                <strong>续费说明：</strong>3天免费期结束后自动按<span className="font-bold">29元/月</span>续费，可随时在「我的-会员中心」取消自动续费
              </p>
            </div>
          </div>

          {/* 签约按钮 */}
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full relative overflow-hidden rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {/* 金色渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>

            {/* 流光动画 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>

            {/* 多重边框 */}
            <div className="absolute inset-0 border-4 border-red-500 rounded-2xl"></div>

            {/* 按钮内容 */}
            <div className="relative py-5 px-6">
              <div className="text-center">
                <div className="text-4xl font-black text-red-600 drop-shadow-lg leading-none">
                  {isProcessing ? "签约中..." : "立即签约 · 0元免费领"}
                </div>
                <div className="text-sm font-bold text-red-700 mt-1">
                  👆 3天免费体验会员 · 可随时取消
                </div>
              </div>
            </div>

            {/* 脉冲光圈 */}
            <div className="absolute -inset-2 bg-yellow-400/30 rounded-2xl blur-xl animate-pulse"></div>
          </button>

          {/* 取消按钮 */}
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            暂不领取
          </button>
        </div>
      </div>
    </div>
  );
}
