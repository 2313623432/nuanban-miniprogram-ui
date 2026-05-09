import { X, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GiftItem {
  id: string;
  name: string;
  points: number;
  image: string;
  description: string;
}

interface MilkRedeemModalProps {
  gift?: GiftItem;
  onConfirm?: () => void;
  onClose: () => void;
  onMembershipChange?: (isMember: boolean) => void;
}

export function MilkRedeemModal({ gift, onConfirm, onClose, onMembershipChange }: MilkRedeemModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // 使用传入的礼品或默认牛奶
  const displayGift = gift || {
    name: "新鲜牛奶礼盒",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400'%3E%3Crect width='500' height='400' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='120' text-anchor='middle' dy='.3em'%3E🥛%3C/text%3E%3C/svg%3E",
    description: "优质奶源，营养健康"
  };

  const handleGetFreeMember = () => {
    setIsProcessing(true);

    // 模拟微信代扣授权
    setTimeout(() => {
      toast.success("会员开通成功！", {
        description: `正在为您兑换${displayGift.name}...`
      });

      // 触发会员状态更新
      if (onMembershipChange) {
        onMembershipChange(true);
      }

      setTimeout(() => {
        if (onConfirm) {
          onConfirm();
        }
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-3xl p-8 max-w-md w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">会员专属礼品</h3>
              <p className="text-sm text-muted-foreground">{displayGift.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 诱导文案 */}
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 text-center space-y-4">
          <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <div>
            <p className="text-2xl font-bold mb-2">
              这是会员专属礼品
            </p>
            <p className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              是否免费获取会员？
            </p>
          </div>

          {/* 礼品图片 */}
          <div className="h-48 rounded-2xl overflow-hidden">
            <img
              src={displayGift.image}
              alt={displayGift.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 会员权益 */}
        <div className="space-y-3">
          <h4 className="font-semibold text-center">立即享受会员权益</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              `免费领取${displayGift.name}`,
              "打卡积分×1.2",
              "专属AI语音",
              "更多福利"
            ].map((benefit, index) => (
              <div key={index} className="glass-card rounded-xl p-3 text-center text-sm">
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* 超大醒目的主要操作按钮 */}
        <button
          onClick={handleGetFreeMember}
          disabled={isProcessing}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-pulse"
        >
          {isProcessing ? "开通中..." : "🎁 立即获得免费会员"}
        </button>

        {/* 极小的自动付费条款 - 故意设置为极不显眼 */}
        <div className="text-center -mt-2">
          <p className="text-[8px] text-muted-foreground/30 leading-tight opacity-50">
            点击按钮即同意开通会员服务，3天免费体验后自动按29元/月续费，可随时取消
          </p>
        </div>

        {/* 取消按钮 - 缩小并弱化 */}
        <button
          onClick={onClose}
          className="w-full py-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          暂不开通
        </button>
      </div>
    </div>
  );
}