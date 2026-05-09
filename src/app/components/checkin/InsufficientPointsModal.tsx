import { X, Zap, TrendingUp, Gift } from "lucide-react";
import { WechatMemberSubscriptionModal } from "./WechatMemberSubscriptionModal";
import { useState } from "react";

interface InsufficientPointsModalProps {
  currentPoints: number;
  requiredPoints: number;
  giftName: string;
  onClose: () => void;
  onMembershipChange?: (isMember: boolean) => void;
}

export function InsufficientPointsModal({
  currentPoints,
  requiredPoints,
  giftName,
  onClose,
  onMembershipChange
}: InsufficientPointsModalProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const deficit = requiredPoints - currentPoints;
  const MEMBER_MULTIPLIER = 3;

  // 会员加速计算
  const normalDaysNeeded = Math.ceil(deficit / 20); // 非会员每日最多20分
  const memberDaysNeeded = Math.ceil(deficit / 60); // 会员每日最多60分（3倍）

  const handleSubscribe = () => {
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false);
    if (onMembershipChange) {
      onMembershipChange(true);
    }
    onClose();
  };

  if (showSubscriptionModal) {
    return (
      <WechatMemberSubscriptionModal
        onSuccess={handleSubscriptionSuccess}
        onClose={() => setShowSubscriptionModal(false)}
      />
    );
  }

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
            {/* 图标 */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* 标题 */}
            <div className="space-y-2 mb-6">
              <h3 className="text-3xl font-black text-white drop-shadow-lg">
                当前积分不足
              </h3>
              <p className="text-lg text-white/90">
                开通会员立享 <span className="font-black text-yellow-200">3倍</span> 积分加速
              </p>
            </div>

            {/* 积分对比 */}
            <div className="glass-card rounded-2xl p-4 bg-white/10 border-2 border-white/20">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-white/70 text-xs mb-1">当前积分</div>
                  <div className="text-2xl font-black text-white">{currentPoints}</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-200 text-xs mb-1">所需积分</div>
                  <div className="text-2xl font-black text-yellow-200">{requiredPoints}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="text-white text-sm">
                  还差 <span className="font-black text-lg text-yellow-200">{deficit}</span> 积分即可兑换
                </div>
                <div className="text-white/80 text-xs mt-1">
                  {giftName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6 space-y-5">
          {/* 加速对比 */}
          <div className="space-y-3">
            <h4 className="font-bold text-center text-lg flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              会员积分加速
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {/* 非会员 */}
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-muted-foreground text-xs mb-2">普通速度</div>
                <div className="text-sm text-muted-foreground mb-2">20分/天</div>
                <div className="text-2xl font-black text-muted-foreground mb-1">{normalDaysNeeded}</div>
                <div className="text-xs text-muted-foreground">天可兑换</div>
              </div>

              {/* 会员 */}
              <div className="glass-card rounded-xl p-4 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-primary text-xs font-bold">会员加速</span>
                </div>
                <div className="text-sm text-primary font-bold mb-2">60分/天</div>
                <div className="text-2xl font-black text-primary mb-1">{memberDaysNeeded}</div>
                <div className="text-xs text-primary font-bold">天可兑换 🚀</div>
              </div>
            </div>

            {/* 对比说明 */}
            <div className="glass-card rounded-xl p-3 bg-green-500/10 border border-green-500/20 text-center">
              <div className="text-sm font-bold text-green-600 dark:text-green-500">
                会员速度是普通用户的 <span className="text-lg">{MEMBER_MULTIPLIER}</span> 倍！
              </div>
            </div>
          </div>

          {/* 会员权益 */}
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <div className="font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              会员专属权益
            </div>
            <div className="space-y-2 text-sm">
              {[
                { icon: "⚡", text: "所有积分3倍加成", highlight: true },
                { icon: "🎁", text: "快速兑换礼品", highlight: false },
                { icon: "🏆", text: "专属会员勋章", highlight: false }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-2 ${item.highlight ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 超大开通按钮 */}
          <button
            onClick={handleSubscribe}
            className="w-full relative overflow-hidden rounded-2xl shadow-2xl group hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                  立即开通会员
                </div>
                <div className="text-base font-bold text-red-700 mt-2">
                  👆 10天免费体验 · 享3倍积分加速
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
        </div>
      </div>
    </div>
  );
}