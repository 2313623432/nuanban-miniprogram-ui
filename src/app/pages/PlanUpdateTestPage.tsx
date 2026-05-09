import { useState } from "react";
import { CheckCircle2, Calendar, AlertCircle, X, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function PlanUpdateTestPage() {
  const navigate = useNavigate();
  const [showPlanCard, setShowPlanCard] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("A");

  // 模拟的计划内容
  const mockPlans = {
    A: `【早餐建议】
• 燕麦粥+鸡蛋+苹果
• 全麦面包+牛奶
• 豆浆+包子

【午餐建议】
• 糙米饭+清蒸鱼+青菜
• 鸡胸肉沙拉
• 杂粮饭+豆腐`,
    B: `【运动计划】
• 每天快走30分钟
• 每周游泳2次
• 睡前拉伸10分钟

【饮食调整】
• 减少油炸食品
• 多吃蔬菜水果
• 控制盐分摄入`
  };

  const handleResetPlanClick = () => {
    // 模拟重新诊断，显示新计划
    setShowPlanCard(true);
    toast.info("已生成新的健康计划");
  };

  const handleAcceptPlan = () => {
    // 直接显示二次确认弹窗
    console.log('⚠️ 显示二次确认弹窗');
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = () => {
    const newPlan = currentPlan === "A" ? "B" : "A";
    setCurrentPlan(newPlan);
    setShowConfirmModal(false);
    setShowPlanCard(false);
    toast.success("计划更新成功！", {
      description: "新任务已立即生效，可以开始打卡了"
    });
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
    toast.info("已取消计划更新");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 glass-card border-b border-white/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/checkin')}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">二次确认测试页面</h1>
            <p className="text-sm text-muted-foreground">点击按钮测试弹窗功能</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 当前计划卡片 */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">当前计划</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              计划 {currentPlan}
            </span>
          </div>

          <div className="glass-card rounded-2xl p-4 mb-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {mockPlans[currentPlan as keyof typeof mockPlans]}
            </pre>
          </div>

          <button
            onClick={handleResetPlanClick}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-foreground font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            重新诊断（模拟）
          </button>
        </div>

        {/* 新计划卡片（点击重新诊断后显示）*/}
        {showPlanCard && (
          <div className="glass-card rounded-3xl p-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">新的健康计划</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
                计划 {currentPlan === "A" ? "B" : "A"}
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4 border-2 border-primary/30">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {mockPlans[currentPlan === "A" ? "B" : "A"]}
              </pre>
            </div>

            <button
              onClick={handleAcceptPlan}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              接受打卡计划
            </button>
          </div>
        )}

        {/* 说明卡片 */}
        <div className="glass-card rounded-2xl p-4 bg-blue-500/5 border border-blue-500/20">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            测试说明
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>1. 点击"重新诊断（模拟）"查看新计划</li>
            <li>2. 点击"接受打卡计划"触发二次确认</li>
            <li>3. 弹窗会显示"是否更新计划？"</li>
            <li>4. 点击"确认更新"完成计划切换</li>
            <li>5. 可以重复测试多次</li>
          </ul>
        </div>
      </div>

      {/* 二次确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancelUpdate} />

          <div className="relative glass-card rounded-3xl p-6 max-w-md w-full space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">是否更新计划？</h3>
                  <p className="text-sm text-muted-foreground">您已有进行中的健康计划</p>
                </div>
              </div>
              <button
                onClick={handleCancelUpdate}
                className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 警告提示 */}
            <div className="glass-card rounded-2xl p-5 bg-yellow-500/10 border-2 border-yellow-500/30 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-bold text-lg text-foreground">
                    确认更新计划吗？
                  </p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>• 本次将添加 <span className="font-bold text-foreground">5</span> 个新任务</li>
                    <li>• 新任务将<span className="font-bold text-primary">立即生效</span>，可以开始打卡</li>
                    <li>• 当日未完成的AI任务将被替换</li>
                    <li>• 手动添加的任务不受影响</li>
                  </ul>
                  <p className="text-xs text-yellow-700 dark:text-yellow-500 font-medium pt-2">
                    ⚠️ 此操作将覆盖原有计划，请谨慎确认
                  </p>
                </div>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <p className="text-sm font-medium">💡 打卡积分上限</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                • 非会员：每日打卡最多获得 <span className="font-bold">20</span> 积分<br />
                • 会员：每日打卡最多获得 <span className="font-bold text-primary">60</span> 积分<br />
                • 连续打卡奖励独立发放，不计入上限
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelUpdate}
                className="flex-1 py-3 rounded-2xl glass-button font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium"
              >
                确认更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}