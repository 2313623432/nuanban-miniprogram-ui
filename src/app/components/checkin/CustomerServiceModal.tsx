import { X, Headphones, Users } from "lucide-react";
import { useState } from "react";

interface CustomerServiceModalProps {
  onClose: () => void;
}

export function CustomerServiceModal({ onClose }: CustomerServiceModalProps) {
  const [selectedTab, setSelectedTab] = useState<"customer" | "community">("customer");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 animate-in zoom-in-95 slide-in-from-bottom-4">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 rounded-xl glass-button flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">联系我们</h2>
          <p className="text-sm text-muted-foreground">
            选择您需要的服务
          </p>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSelectedTab("customer")}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              selectedTab === "customer"
                ? "glass-button text-primary shadow-md border-2 border-primary/20"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            咨询客服
          </button>
          <button
            onClick={() => setSelectedTab("community")}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              selectedTab === "community"
                ? "glass-button text-primary shadow-md border-2 border-primary/20"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            加入社群
          </button>
        </div>

        {selectedTab === "customer" ? (
          <>
            {/* 客服二维码 */}
            <div className="text-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
                <Headphones className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">咨询客服</h3>
              <p className="text-sm text-muted-foreground">
                如果您有任何付费、退费等问题<br />请扫码咨询客服
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23fff'/%3E%3Ctext x='50%25' y='35%25' font-size='48' text-anchor='middle' fill='%2307C160'%3E%F0%9F%92%AC%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' fill='%23666'%3E客服二维码%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='12' text-anchor='middle' fill='%23999'%3E付费/退费咨询%3C/text%3E%3C/svg%3E"
                  alt="客服二维码"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">服务时间</span>
                <span className="font-medium">工作日 9:00-18:00</span>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-white/10">
                客服可协助处理：付费问题、退费问题、商品发货、物流查询、会员权益等
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 社群二维码 */}
            <div className="text-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                <Users className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">加入用户社群</h3>
              <p className="text-sm text-muted-foreground">
                认识志同道合的朋友<br />友好交流使用体验
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23fff'/%3E%3Ctext x='50%25' y='35%25' font-size='48' text-anchor='middle' fill='%2310B981'%3E%F0%9F%91%A5%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' fill='%23666'%3E社群二维码%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='12' text-anchor='middle' fill='%23999'%3E暖伴用户交流群%3C/text%3E%3C/svg%3E"
                  alt="社群二维码"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h4 className="text-sm font-semibold mb-2 text-green-700 dark:text-green-600">社群福利</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 与其他用户交流健康经验</li>
                <li>• 分享使用心得和技巧</li>
                <li>• 获取第一手产品更新资讯</li>
                <li>• 参与社群专属活动</li>
              </ul>
            </div>
          </>
        )}

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl glass-button font-medium"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
