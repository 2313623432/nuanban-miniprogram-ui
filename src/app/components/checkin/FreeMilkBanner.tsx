import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { MemberSignupModal } from "./MemberSignupModal";

interface FreeMilkBannerProps {
  totalEarnedPoints: number;
  isMember: boolean;
  hasSignedUpBefore: boolean;
  hasClaimedMilk: boolean;
}

export function FreeMilkBanner({
  totalEarnedPoints,
  isMember,
  hasSignedUpBefore,
  hasClaimedMilk
}: FreeMilkBannerProps) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [remainingQuota] = useState(Math.floor(Math.random() * 20) + 5); // 模拟剩余名额

  // 已开通会员显示会员专属福利入口
  if (isMember) {
    return (
      <div className="sticky top-0 z-30 glass-card border-b border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center gap-3 shadow-xl">
            <Gift className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold text-white">会员专属福利</span>
          </button>
        </div>
      </div>
    );
  }

  // 已领取过牛奶，不再显示
  if (hasClaimedMilk) {
    return null;
  }

  // 超级吸引人的免费领取按钮
  return (
    <>
      <div className="sticky top-0 z-30 glass-card border-b border-white/10">
        <div className="max-w-2xl mx-auto p-4">
          {/* 庆祝粒子动画 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
            <div className="absolute top-4 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-ping delay-75"></div>
            <div className="absolute top-2 left-2/3 w-2 h-2 bg-red-500 rounded-full animate-ping delay-150"></div>
            <div className="absolute top-6 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-300"></div>
          </div>

          {/* 产品展示卡片 */}
          <div className="relative overflow-hidden rounded-3xl shadow-xl mb-4">
            {/* 红色渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600"></div>

            {/* 流光动画 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

            {/* 光晕效果 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse delay-75"></div>

            {/* 卡片内容 */}
            <div className="relative py-6 px-6">
              <div className="flex items-center justify-center gap-6">
                {/* 左侧牛奶图片 */}
                <div className="relative flex-shrink-0">
                  {/* 外层光晕 */}
                  <div className="absolute -inset-3 bg-yellow-300/60 rounded-full blur-xl animate-pulse"></div>

                  <div className="relative">
                    <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E🥛%3C/text%3E%3C/svg%3E"
                        alt="免费牛奶"
                        className="w-full h-full object-cover"
                      />
                      {/* 闪光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-shimmer"></div>
                    </div>

                    {/* 火爆标签 */}
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-black px-2.5 py-1 rounded-full shadow-xl border-2 border-white animate-bounce">
                      🔥 限量
                    </div>
                  </div>
                </div>

                {/* 右侧文字 */}
                <div className="flex-1 space-y-2">
                  {/* 超大的0元 */}
                  <div className="flex items-baseline gap-3">
                    <div className="text-7xl font-black text-white drop-shadow-2xl leading-none">
                      0元
                    </div>
                    <div className="text-3xl font-black text-yellow-100 drop-shadow-lg">
                      免费领
                    </div>
                  </div>

                  {/* 副标题 */}
                  <div className="text-2xl font-bold text-white/95 drop-shadow-md">
                    🥛 价值89元牛奶礼盒
                  </div>

                  {/* 紧迫感标签 */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="px-3 py-1.5 bg-yellow-400 text-red-600 rounded-full text-xs font-black animate-pulse">
                      仅剩 {remainingQuota} 份
                    </div>
                    <div className="px-3 py-1.5 bg-white/90 text-red-600 rounded-full text-xs font-black">
                      限今日
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 闪烁角标 */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-red-600 px-4 py-1.5 rounded-full text-xs font-black shadow-xl animate-bounce">
              ⚡ 限时免费
            </div>
          </div>

          {/* 超级醒目的独立领取按钮 */}
          <button
            onClick={() => setShowSignupModal(true)}
            className="w-full relative overflow-hidden rounded-2xl shadow-2xl group hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            {/* 金色渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>

            {/* 超强流光 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>

            {/* 多重边框 */}
            <div className="absolute inset-0 border-4 border-red-500 rounded-2xl"></div>
            <div className="absolute inset-1 border-2 border-white/50 rounded-xl animate-pulse"></div>

            {/* 按钮内容 */}
            <div className="relative py-6 px-8">
              <div className="flex items-center justify-center gap-4">
                {/* 礼物图标 */}
                <Gift className="h-10 w-10 text-red-600 animate-bounce" />

                {/* 超大文字 */}
                <div className="text-center">
                  <div className="text-5xl font-black text-red-600 drop-shadow-lg leading-none tracking-tight">
                    0元 免费领
                  </div>
                  <div className="text-sm font-bold text-red-700 mt-1">
                    👆 点击立即领取 · 先到先得
                  </div>
                </div>

                {/* 闪电图标 */}
                <Sparkles className="h-10 w-10 text-red-600 animate-bounce delay-75" />
              </div>
            </div>

            {/* 脉冲光圈 */}
            <div className="absolute -inset-2 bg-yellow-400/30 rounded-2xl blur-xl animate-pulse"></div>
          </button>

          {/* 底部说明 - 弱化 */}
          <div className="mt-3 text-center text-xs text-muted-foreground">
            {hasSignedUpBefore ? "开通会员即可领取" : "体验会员即可领取"}
          </div>
        </div>
      </div>

      {/* 会员签约弹窗 */}
      {showSignupModal && (
        <MemberSignupModal
          isNewUser={!hasSignedUpBefore}
          onClose={() => setShowSignupModal(false)}
        />
      )}
    </>
  );
}