import { Crown, X } from "lucide-react";
import { useState } from "react";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: "single-month" | "single-year" | "trial-week") => void;
  isRenewal?: boolean;
  expiryDate?: string;
}

export function MembershipModal({ isOpen, onClose, onSuccess, isRenewal, expiryDate }: MembershipModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"single-month" | "single-year" | "trial-week">("single-year");

  if (!isOpen) return null;

  const handlePayment = () => {
    onSuccess(selectedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="rounded-3xl p-6 max-w-md w-full animate-fadeIn backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all active:scale-95"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            {isRenewal ? "会员续费" : "开通会员"}
          </h2>
          <p className="text-gray-600">
            {isRenewal ? "延长会员有效期" : "解锁全部功能"}
          </p>
        </div>

        {/* 续费模式 */}
        {isRenewal && expiryDate && (
          <div className="rounded-2xl p-4 mb-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <p className="text-sm text-gray-700 text-center">
              当前会员到期日期：<span className="font-semibold text-gray-800">{expiryDate}</span>
            </p>
            <p className="text-xs text-gray-600 text-center mt-1">
              续费后将在此日期基础上累加有效期
            </p>
          </div>
        )}

        {/* 年付超值 */}
        <div
          onClick={() => setSelectedPlan("single-year")}
          className={`rounded-2xl p-5 mb-3 cursor-pointer transition-all relative overflow-hidden ${
            selectedPlan === "single-year"
              ? "bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-primary shadow-lg"
              : "bg-gray-50 border-2 border-transparent"
          }`}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
            立省70元
          </div>
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                selectedPlan === "single-year"
                  ? "border-primary bg-primary"
                  : "border-gray-400"
              }`}
            >
              {selectedPlan === "single-year" && (
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">年付超值</span>
                <span className="text-2xl font-bold text-primary">¥168</span>
              </div>
              <p className="text-sm text-gray-600">365天有效期，到期不自动续费</p>
              <p className="text-sm text-orange-600 mt-1 font-medium">
                相当于仅需¥14/月
              </p>
            </div>
          </div>
        </div>

        {/* 月付标准 */}
        <div
          onClick={() => setSelectedPlan("single-month")}
          className={`rounded-2xl p-5 mb-3 cursor-pointer transition-all ${
            selectedPlan === "single-month"
              ? "bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-primary shadow-lg"
              : "bg-gray-50 border-2 border-transparent"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                selectedPlan === "single-month"
                  ? "border-primary bg-primary"
                  : "border-gray-400"
              }`}
            >
              {selectedPlan === "single-month" && (
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">月付标准</span>
                <span className="text-2xl font-bold text-primary">¥19.9</span>
              </div>
              <p className="text-sm text-gray-600">30天有效期，到期不自动续费</p>
            </div>
          </div>
        </div>

        {/* 周付体验 */}
        <div
          onClick={() => setSelectedPlan("trial-week")}
          className={`rounded-2xl p-5 mb-5 cursor-pointer transition-all relative overflow-hidden ${
            selectedPlan === "trial-week"
              ? "bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-primary shadow-lg"
              : "bg-gray-50 border-2 border-transparent"
          }`}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
            低价试享
          </div>
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                selectedPlan === "trial-week"
                  ? "border-primary bg-primary"
                  : "border-gray-400"
              }`}
            >
              {selectedPlan === "trial-week" && (
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">周付体验</span>
                <span className="text-2xl font-bold text-primary">¥5.9</span>
              </div>
              <p className="text-sm text-gray-600">7天有效期，畅享所有功能</p>
            </div>
          </div>
        </div>

        {/* 会员权益 */}
        <div className="rounded-2xl p-5 mb-5 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
          <p className="text-sm font-semibold text-gray-800 mb-3">会员权益：</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
              <p className="text-sm text-gray-700 font-semibold">打卡享2倍积分</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
              <p className="text-sm text-gray-700 font-semibold">无限通话</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
              <p className="text-sm text-gray-700">优先享受专家资源</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
              <p className="text-sm text-gray-700">更多惊喜礼物 敬请期待</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePayment}
          className="w-full py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white transition-all active:scale-98 shadow-lg"
        >
          {isRenewal ? "立即续费" : "成为会员"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
          开通会员即代表同意《会员用户协议》
        </p>
      </div>
    </div>
  );
}
