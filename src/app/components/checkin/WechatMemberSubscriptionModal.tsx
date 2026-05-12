import { X, Zap, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WechatMemberSubscriptionModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function WechatMemberSubscriptionModal({
  onSuccess,
  onClose
}: WechatMemberSubscriptionModalProps) {
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
        description: "已开通10天免费会员，享2倍积分加速"
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

          <div className="relative py-8 px-6 text-center">
            {/* 超大标题 */}
            <div className="space-y-3 mb-6">
              <div className="space-y-2">
                <div className="text-4xl font-black text-white drop-shadow-2xl leading-tight">
                  立即开通会员
                </div>
                <div className="text-2xl font-bold text-yellow-100 drop-shadow-lg">
                  享2倍打卡积分加速
                </div>
                <div className="text-base font-medium text-white/85">
                  快速积累积分 · 兑换健康好礼
                </div>
              </div>
            </div>

            {/* 核心权益对比 */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="glass-card rounded-xl p-3 bg-white/10">
                <div className="text-white/70 text-xs mb-1">普通用户</div>
                <div className="text-white text-lg font-bold">20分/天</div>
                <div className="text-white/60 text-xs">需150天</div>
              </div>
              <div className="glass-card rounded-xl p-3 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 border-2 border-yellow-300/50">
                <div className="text-yellow-200 text-xs mb-1 font-bold">会员加速</div>
                <div className="text-white text-lg font-black">40分/天</div>
                <div className="text-yellow-100 text-xs font-bold">仅需50天 🚀</div>
              </div>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-5">
          {/* 会员权益 */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-center text-lg flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              会员专属权益
            </h4>
            <div className="space-y-2">
              {[
                { icon: "⚡", text: "所有积分2倍加成", highlight: true },
                { icon: "🎁", text: "快速兑换牛奶礼品", highlight: false },
                { icon: "🏆", text: "专属会员勋章", highlight: false },
                { icon: "✨", text: "更多福利陆续上线", highlight: false }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-xl ${item.highlight ? 'bg-primary/10' : ''}`}>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className={`text-sm ${item.highlight ? 'font-bold text-primary' : ''}`}>{item.text}</span>
                  {item.highlight && <Check className="h-4 w-4 text-primary ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* 自动续费说明 - 醒目展示 */}
          <div className="glass-card rounded-2xl p-4 bg-orange-500/10 border-2 border-orange-500/30">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                ⚠️
              </div>
              <div className="flex-1 text-sm leading-relaxed">
                <div className="font-bold text-orange-600 dark:text-orange-500 mb-1 text-base">
                  自动续费规则
                </div>
                <div className="text-orange-700 dark:text-orange-400">
                  10天免费期结束后，自动按 <span className="font-black text-lg">29元/月</span> 续费
                </div>
                <div className="text-orange-600 dark:text-orange-500 mt-2 text-xs">
                  可随时在「我的 - 会员管理」取消自动续费
                </div>
              </div>
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
                  className="h-6 w-6 rounded border-2 border-primary/30 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                />
              </div>
              <div className="flex-1 text-base leading-relaxed">
                <span className="text-foreground">
                  我已阅读并同意
                </span>
                <button className="text-primary font-bold mx-1 underline">
                  《会员服务协议》
                </button>
                <span className="text-foreground">和</span>
                <button className="text-primary font-bold mx-1 underline">
                  《自动续费代扣协议》
                </button>
              </div>
            </label>
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
                <div className="text-3xl font-black text-red-600 drop-shadow-lg leading-none">
                  {isProcessing ? "开通中..." : "立即开通会员"}
                </div>
                <div className="text-base font-bold text-red-700 mt-2">
                  享2倍打卡积分加速
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
            暂不开通
          </button>

          {/* 底部提示 */}
          <div className="text-center text-xs text-muted-foreground">
            同一设备/微信账号仅可领取1次免费试用
          </div>
        </div>
      </div>
    </div>
  );
}