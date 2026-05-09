import { useState } from "react";
import { Gift, Lock, Sparkles, Clock } from "lucide-react";
import { WechatSubscriptionModal } from "./WechatSubscriptionModal";
import { AddressSettingsModal, type Address } from "./AddressSettingsModal";

interface GiftItem {
  id: string;
  name: string;
  points: number;
  image: string;
  description: string;
  monthlyLimit?: number;
  redeemedCount?: number; // 已兑换次数
}

interface TopConversionBannerProps {
  totalEarnedPoints: number;
  isMember: boolean;
  onMembershipChange?: (isMember: boolean) => void;
}

// 强转化型会员专属礼品池
const CONVERSION_GIFTS: GiftItem[] = [
  {
    id: "milk-1",
    name: "免费牛奶",
    points: 100,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E🥛%3C/text%3E%3C/svg%3E",
    description: "优质奶源，营养健康",
    monthlyLimit: 1,
    redeemedCount: 0
  },
  {
    id: "gift-3",
    name: "颈部按摩仪",
    points: 200,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FEF3C7'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E💆%3C/text%3E%3C/svg%3E",
    description: "缓解疲劳，舒缓颈椎",
    monthlyLimit: 1,
    redeemedCount: 0
  },
  {
    id: "gift-4",
    name: "艾灸盒套装",
    points: 150,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FCE7F3'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E🔥%3C/text%3E%3C/svg%3E",
    description: "传统理疗，温经通络",
    monthlyLimit: 1,
    redeemedCount: 0
  }
];

export function TopConversionBanner({
  totalEarnedPoints,
  isMember,
  onMembershipChange
}: TopConversionBannerProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [remainingQuota] = useState(Math.floor(Math.random() * 15) + 5);
  const [redeemedGiftIds, setRedeemedGiftIds] = useState<string[]>([]); // 已兑换的礼品ID

  // 动态匹配礼品规则 - 只有兑换后才切换到下一个
  const getDisplayGift = (): GiftItem => {
    // ①优先未兑换的礼品
    const availableGifts = CONVERSION_GIFTS.filter(
      gift => !redeemedGiftIds.includes(gift.id)
    );

    if (availableGifts.length === 0) {
      // 若全部礼品均已兑换，则重新循环展示（选第一个）
      return CONVERSION_GIFTS[0];
    }

    // ②在未兑换的礼品中，选择「所需积分-当前累计积分」差值最小且为正数者
    const giftsWithPositiveDiff = availableGifts.filter(
      gift => gift.points > totalEarnedPoints
    );

    if (giftsWithPositiveDiff.length > 0) {
      // 找差值最小的
      return giftsWithPositiveDiff.reduce((min, gift) => {
        const minDiff = min.points - totalEarnedPoints;
        const giftDiff = gift.points - totalEarnedPoints;
        return giftDiff < minDiff ? gift : min;
      });
    }

    // 若找不到正差值，则选所需积分最贵的礼品
    return availableGifts.reduce((max, gift) =>
      gift.points > max.points ? gift : max
    );
  };

  const displayGift = getDisplayGift();
  const isUnlocked = totalEarnedPoints >= displayGift.points;
  const remainingPoints = Math.max(0, displayGift.points - totalEarnedPoints);
  const daysRemaining = remainingPoints > 0 ? Math.ceil(remainingPoints / 15) : 0; // 假设每天可获15积分，达标时为0

  const handleClick = () => {
    if (!isUnlocked) return;
    setSelectedGift(displayGift);
    setShowSubscriptionModal(true);
  };

  // 签约成功后的回调
  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false);

    // 开通会员
    if (onMembershipChange) {
      onMembershipChange(true);
    }

    // 跳转到地址填写
    setShowAddressModal(true);
  };

  // 地址填写成功后的回调
  const handleAddressSubmit = (address: Address) => {
    setShowAddressModal(false);

    // 标记当前礼品已兑换
    if (selectedGift) {
      setRedeemedGiftIds([...redeemedGiftIds, selectedGift.id]);
    }

    // 7工作日内发货提示
    setTimeout(() => {
      import("sonner").then(({ toast }) => {
        toast.success("兑换成功！", {
          description: `礼品将在7个工作日内发货至：${address.address.substring(0, 20)}...`
        });
      });
    }, 500);
  };

  // 已是会员，不显示转化横幅
  if (isMember) {
    return null;
  }

  return (
    <>
      <div className="sticky top-0 z-30 glass-card border-b border-white/10">
        <div className="max-w-2xl mx-auto p-4">
          {/* 未达标状态 - 参考拼多多风格 */}
          {!isUnlocked ? (
            <div className="space-y-3">
              {/* 主卡片 */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                {/* 红橙渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-orange-400"></div>

                {/* 流光动画 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

                {/* 卡片内容 */}
                <div className="relative py-6 px-5">
                  <div className="flex items-start gap-4">
                    {/* 左侧产品图 */}
                    <div className="relative flex-shrink-0">
                      <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl bg-white">
                        <img
                          src={displayGift.image}
                          alt={displayGift.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 积分角标 */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xl whitespace-nowrap border-2 border-white">
                        仅需 {displayGift.points} 金
                      </div>
                    </div>

                    {/* 右侧信息 */}
                    <div className="flex-1 pt-1">
                      {/* 小标签 */}
                      <div className="inline-flex items-center gap-1 bg-yellow-300/90 text-red-600 px-2 py-0.5 rounded-full text-xs font-black mb-2">
                        🔥 免费
                      </div>

                      {/* 超大倒计时 */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-white text-lg font-bold">还有</span>
                          <span className="text-white text-6xl font-black leading-none drop-shadow-2xl">
                            {daysRemaining}
                          </span>
                          <span className="text-white text-lg font-bold">天</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-white text-2xl font-black drop-shadow-lg">
                            0元领{displayGift.name}！
                          </span>
                          <span className="text-2xl">🥛</span>
                        </div>
                      </div>

                      {/* 进度条 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white/90 text-xs font-semibold">⏰ 积分进度</span>
                          <span className="text-white text-sm font-black">{totalEarnedPoints}/{displayGift.points}</span>
                        </div>
                        <div className="relative h-2.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all duration-1000 shadow-lg"
                            style={{ width: `${Math.min((totalEarnedPoints / displayGift.points) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* 激励提示 */}
                      <div className="mt-2 flex items-center gap-1.5 text-yellow-100">
                        <span className="text-sm">🚀</span>
                        <span className="text-sm font-bold">
                          明日上午就可到账！
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 底部激励文案 */}
                  <div className="mt-4 flex items-center justify-center gap-3 text-white/95 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>今日打卡 5分</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/60"></div>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      <span>全部 +100 积分奖励</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部附加说明 */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-100/80 px-4 py-2 rounded-full">
                  <Sparkles className="h-4 w-4" />
                  <span>每日打卡最高可获 60 积分 · 共需打卡 {Math.ceil(remainingPoints / 20)} 次</span>
                </div>
              </div>
            </div>
          ) : (
            /* 达标状态 - 参考图片设计 */
            <div className="space-y-3">
              {/* 礼品展示卡片 */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                {/* 红橙渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-orange-400"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

                <div className="relative py-6 px-5">
                  <div className="flex items-start gap-4">
                    {/* 左侧产品图 */}
                    <div className="relative flex-shrink-0">
                      <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl bg-white">
                        <img
                          src={displayGift.image}
                          alt={displayGift.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 已解锁角标 */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-xl whitespace-nowrap border-2 border-white">
                        ✓ 已解锁
                      </div>
                    </div>

                    {/* 右侧信息 */}
                    <div className="flex-1 pt-1">
                      {/* 小标签 */}
                      <div className="inline-flex items-center gap-1 bg-yellow-300/90 text-red-600 px-2 py-0.5 rounded-full text-xs font-black mb-2">
                        🔥 免费领取
                      </div>

                      {/* 超大0元 */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-white text-7xl font-black leading-none drop-shadow-2xl">
                            0元
                          </span>
                          <span className="text-white text-2xl font-bold">免费领</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-white text-xl font-bold drop-shadow-lg">
                            价值89元实物礼品
                          </span>
                        </div>
                      </div>

                      {/* 提示信息 */}
                      <div className="flex items-center gap-1.5 text-yellow-100">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-bold">
                          点击下方按钮立即领取
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 超大黄色按钮 - 参考图片样式 */}
              <button
                onClick={handleClick}
                className="w-full relative overflow-hidden rounded-2xl shadow-2xl group hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {/* 金色渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>

                {/* 超强流光 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>

                {/* 红色边框 */}
                <div className="absolute inset-0 border-4 border-red-500 rounded-2xl"></div>

                {/* 按钮内容 */}
                <div className="relative py-6 px-6">
                  <div className="flex items-center justify-center gap-3">
                    {/* 礼物图标 */}
                    <Gift className="h-10 w-10 text-red-600" />

                    {/* 超大文字 */}
                    <div className="text-center">
                      <div className="text-5xl font-black text-red-600 drop-shadow-lg leading-none">
                        0元 免费领
                      </div>
                    </div>

                    {/* 闪电图标 */}
                    <Sparkles className="h-10 w-10 text-red-600" />
                  </div>
                </div>

                {/* 脉冲光圈 */}
                <div className="absolute -inset-2 bg-yellow-400/40 rounded-2xl blur-xl animate-pulse"></div>
              </button>

              {/* 底部说明 */}
              <div className="text-center text-xs text-muted-foreground">
                3天免费体验 · 可随时取消
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 微信自动续费签约弹窗 */}
      {showSubscriptionModal && selectedGift && (
        <WechatSubscriptionModal
          giftName={selectedGift.name}
          giftImage={selectedGift.image}
          onSuccess={handleSubscriptionSuccess}
          onClose={() => {
            setShowSubscriptionModal(false);
            setSelectedGift(null);
          }}
        />
      )}

      {/* 地址填写弹窗 */}
      {showAddressModal && (
        <AddressSettingsModal
          onClose={() => setShowAddressModal(false)}
          onSave={handleAddressSubmit}
        />
      )}
    </>
  );
}