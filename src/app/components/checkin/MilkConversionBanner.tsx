import { useState } from "react";
import { Gift, Sparkles, TrendingUp, Zap } from "lucide-react";
import { WechatMemberSubscriptionModal } from "./WechatMemberSubscriptionModal";

interface MilkConversionBannerProps {
  currentPoints: number;
  isMember: boolean;
  onMembershipChange?: (isMember: boolean) => void;
}

export function MilkConversionBanner({
  currentPoints,
  isMember,
  onMembershipChange
}: MilkConversionBannerProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const MILK_POINTS_REQUIRED = 3000; // 牛奶所需积分
  const NON_MEMBER_DAILY_MAX = 20; // 非会员每日最多积分
  const MEMBER_DAILY_MAX = 60; // 会员每日最多积分（3倍）
  const MEMBER_MULTIPLIER = 3; // 会员积分倍数

  const remainingPoints = Math.max(0, MILK_POINTS_REQUIRED - currentPoints);
  const progress = Math.min((currentPoints / MILK_POINTS_REQUIRED) * 100, 100);

  // 预估天数
  const nonMemberDays = Math.ceil(remainingPoints / NON_MEMBER_DAILY_MAX);
  const memberDays = Math.ceil(remainingPoints / MEMBER_DAILY_MAX);

  const isUnlocked = currentPoints >= MILK_POINTS_REQUIRED;

  const handleSubscribe = () => {
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false);
    if (onMembershipChange) {
      onMembershipChange(true);
    }
  };

  // 已是会员且已解锁，引导去商城兑换
  if (isMember && isUnlocked) {
    return (
      <div className="sticky top-0 z-30 glass-card border-b border-white/10">
        <div className="max-w-2xl mx-auto p-4">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

            <div className="relative py-6 px-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                <div className="text-3xl font-black text-white drop-shadow-lg">
                  🎉 积分已达标！
                </div>
                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
              <div className="text-white/90 text-lg font-semibold mb-4">
                可以去积分商城兑换牛奶啦
              </div>
              <div className="inline-flex items-center gap-2 bg-yellow-300 text-green-700 px-6 py-2 rounded-full text-lg font-black">
                当前积分：{currentPoints}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-30 glass-card border-b border-white/10">
        <div className="max-w-2xl mx-auto p-4">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-orange-400"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

            {/* 主内容 */}
            <div className="relative py-6 px-5">
              {/* 产品展示区 */}
              <div className="flex items-start gap-4 mb-5">
                {/* 牛奶图片 */}
                <div className="relative flex-shrink-0">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl bg-white">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E🥛%3C/text%3E%3C/svg%3E"
                      alt="免费牛奶"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xl whitespace-nowrap border-2 border-white">
                    需 {MILK_POINTS_REQUIRED} 积分
                  </div>
                </div>

                {/* 预估对比 */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1 bg-yellow-300/90 text-red-600 px-2 py-0.5 rounded-full text-xs font-black mb-2">
                    🔥 免费牛奶
                  </div>

                  {/* 非会员预估 */}
                  {!isMember && (
                    <div className="space-y-2 mb-3">
                      <div className="glass-card rounded-xl p-3 bg-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/80 text-sm">非会员速度</span>
                          <span className="text-white/60 text-xs">每日最多 {NON_MEMBER_DAILY_MAX} 分</span>
                        </div>
                        <div className="text-white text-2xl font-black">
                          预计 {nonMemberDays} 天 可领
                        </div>
                      </div>

                      {/* 引导文字 */}
                      <div className="text-center">
                        <div className="text-yellow-200 text-sm font-bold animate-pulse">
                          ⚡ 打卡太慢？0元试用会员加速
                        </div>
                      </div>

                      {/* 会员预估对比 */}
                      <div className="glass-card rounded-xl p-3 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-2 border-yellow-300/50">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-200" />
                            <span className="text-white font-bold text-sm">会员速度</span>
                          </div>
                          <span className="text-yellow-100 text-xs font-bold">3倍积分</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-white/80 text-sm">每日最多</span>
                          <span className="text-white text-2xl font-black">{MEMBER_DAILY_MAX}</span>
                          <span className="text-white/80 text-sm">分</span>
                        </div>
                        <div className="text-yellow-200 text-lg font-black mt-1">
                          最快 {memberDays} 天 可领 🚀
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 会员当前进度 */}
                  {isMember && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 text-sm font-semibold">💰 当前积分</span>
                        <span className="text-white text-lg font-black">{currentPoints}/{MILK_POINTS_REQUIRED}</span>
                      </div>
                      <div className="relative h-3 bg-white/20 rounded-full overflow-hidden border-2 border-white/30">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="text-yellow-100 text-sm font-bold text-center">
                        还需 {remainingPoints} 积分，预计 {memberDays} 天可领
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 转化按钮 - 仅非会员显示 */}
              {!isMember && (
                <button
                  onClick={handleSubscribe}
                  className="w-full relative overflow-hidden rounded-2xl shadow-2xl group hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {/* 金色渐变背景 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>

                  {/* 超强流光 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>

                  {/* 红色边框 */}
                  <div className="absolute inset-0 border-4 border-red-500 rounded-2xl"></div>

                  {/* 按钮内容 */}
                  <div className="relative py-5 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <Gift className="h-9 w-9 text-red-600" />
                      <div className="text-center">
                        <div className="text-4xl font-black text-red-600 drop-shadow-lg leading-none">
                          立即0元10天免费领
                        </div>
                        <div className="text-sm font-bold text-red-700 mt-1">
                          享3倍积分加速 · 最快{memberDays}天领牛奶
                        </div>
                      </div>
                      <Sparkles className="h-9 w-9 text-red-600" />
                    </div>
                  </div>

                  {/* 脉冲光圈 */}
                  <div className="absolute -inset-2 bg-yellow-400/40 rounded-2xl blur-xl animate-pulse"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 微信会员签约弹窗 */}
      {showSubscriptionModal && (
        <WechatMemberSubscriptionModal
          onSuccess={handleSubscriptionSuccess}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </>
  );
}