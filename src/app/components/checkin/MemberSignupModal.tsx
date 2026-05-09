import { useState } from "react";
import { X, Gift, CheckCircle2, AlertCircle, FileText, MapPin } from "lucide-react";
import { toast } from "sonner";

interface MemberSignupModalProps {
  isNewUser: boolean;
  onClose: () => void;
}

export function MemberSignupModal({ isNewUser, onClose }: MemberSignupModalProps) {
  const [step, setStep] = useState<"signup" | "address">("signup");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const handleSignup = () => {
    if (!agreedToTerms) {
      toast.error("请先阅读并同意相关协议");
      return;
    }

    // 模拟微信代扣授权
    toast.success("微信代扣授权成功", {
      description: "正在开通会员..."
    });

    setTimeout(() => {
      toast.success(isNewUser ? "3天免费会员已开通！" : "首月会员已开通！", {
        description: "请填写收货地址领取免费牛奶"
      });
      setStep("address");
    }, 1500);
  };

  const handleSubmitAddress = () => {
    if (!address.name.trim() || !address.phone.trim() || !address.address.trim()) {
      toast.error("请填写完整的收货信息");
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(address.phone)) {
      toast.error("请输入正确的手机号");
      return;
    }

    toast.success("牛奶兑换成功！", {
      description: "将在7个工作日内包邮发货"
    });

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (step === "address") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative glass-card rounded-3xl p-6 max-w-md w-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">填写收货地址</h3>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-start gap-3 bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-600 dark:text-green-400 mb-1">
                会员开通成功！
              </p>
              <p className="text-green-600/80 dark:text-green-400/80">
                {isNewUser ? "已获得3天免费会员体验" : "已开通首月8元会员"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="收货人姓名"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
            />
            <input
              type="tel"
              placeholder="手机号"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
            />
            <textarea
              placeholder="详细地址"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">配送说明</p>
            <ul className="space-y-1">
              <li>• 7个工作日内包邮发货</li>
              <li>• 仅支持中国大陆地区配送</li>
              <li>• 物流信息将同步至积分商城</li>
            </ul>
          </div>

          <button
            onClick={handleSubmitAddress}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium"
          >
            确认提交
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-3xl p-6 max-w-md w-full space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 glass-card z-10 -m-6 p-6 mb-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
              <Gift className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {isNewUser ? "立即开通会员 领免费牛奶" : "8元首月会员 领免费牛奶"}
              </h3>
              <p className="text-sm text-muted-foreground">限时福利活动</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 主要福利展示 */}
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
              {isNewUser ? "0 元开通 3 天会员" : "8 元首月会员"}
            </div>
            <div className="text-2xl font-semibold text-orange-500">
              免费领 10 枚鸡蛋
            </div>
          </div>

          <div className="h-40 rounded-xl overflow-hidden mb-4">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='80' text-anchor='middle' dy='.3em'%3E🥛%3C/text%3E%3C/svg%3E"
              alt="免费牛奶"
              className="w-full h-full object-cover"
            />
          </div>

          {isNewUser && (
            <div className="glass-card rounded-xl p-3 bg-white/5 text-sm text-center">
              <p className="text-muted-foreground">
                3 天免费期结束后，自动按 <span className="text-orange-500 font-semibold">29 元 / 月</span> 续费
              </p>
            </div>
          )}
        </div>

        {/* 会员权益说明 */}
        <div className="space-y-3">
          <h4 className="font-semibold">会员权益</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              "打卡积分×1.2倍",
              "专属AI语音包",
              "无限次健康咨询",
              "会员专属礼品"
            ].map((benefit, index) => (
              <div key={index} className="glass-card rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 自动续费说明 */}
        {isNewUser && (
          <div className="glass-card rounded-2xl p-4 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-600 dark:text-blue-400">
              <p className="font-medium mb-1">自动续费说明</p>
              <ul className="space-y-1 text-blue-600/80 dark:text-blue-400/80">
                <li>• 前3天完全免费，无任何费用</li>
                <li>• 免费期到期前24小时，将推送微信提醒</li>
                <li>• 到期后自动按29元/月续费，可随时取消</li>
                <li>• 可在「我的-会员管理」中管理续费</li>
              </ul>
            </div>
          </div>
        )}

        {/* 配送说明 */}
        <div className="glass-card rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            <span>配送说明</span>
          </div>
          <ul className="space-y-1 text-muted-foreground ml-6">
            <li>• 签约成功后立即发放兑换资格</li>
            <li>• 7个工作日内包邮发货</li>
            <li>• 仅支持中国大陆地区配送</li>
            <li>• 单用户仅可领取1次，不可重复领取</li>
          </ul>
        </div>

        {/* 协议勾选 */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground flex-1">
              我已阅读并同意
              <button className="text-primary hover:underline mx-1">《会员服务协议》</button>
              和
              <button className="text-primary hover:underline ml-1">《自动续费代扣协议》</button>
            </span>
          </label>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl glass-button font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSignup}
            disabled={!agreedToTerms}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNewUser ? "立即开通并领取" : "8元开通并领取"}
          </button>
        </div>

        {/* 底部风控提示 */}
        <div className="text-xs text-center text-muted-foreground">
          同一设备、同一微信账号仅可领取1次牛奶
        </div>
      </div>
    </div>
  );
}