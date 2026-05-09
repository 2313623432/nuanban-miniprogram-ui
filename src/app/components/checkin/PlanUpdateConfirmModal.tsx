import { X, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

interface PlanUpdateConfirmModalProps {
  newTasksCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PlanUpdateConfirmModal({ newTasksCount, onConfirm, onCancel }: PlanUpdateConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative glass-card rounded-3xl p-6 max-w-md w-full space-y-5">
        {/* 标题行 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/15 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">更新打卡计划？</h3>
              <p className="text-xs text-muted-foreground mt-0.5">AI已为您生成新方案</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="h-9 w-9 rounded-xl glass-button flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 变更说明 */}
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm">新增 <span className="font-bold text-foreground">{newTasksCount}</span> 个AI打卡任务，立即生效</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm">手动添加的任务<span className="font-medium text-foreground">不受影响</span></span>
          </div>
          <div className="flex items-center gap-2.5 pt-1 border-t border-primary/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">当日未完成的旧AI任务将被替换</span>
          </div>
        </div>

        {/* 积分上限提示 */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex items-start gap-2.5">
          <span className="text-base mt-0.5">💡</span>
          <div className="text-xs text-muted-foreground leading-relaxed">
            每日打卡积分上限：普通用户 <span className="font-bold text-foreground">20</span> 积分 · 会员 <span className="font-bold text-primary">60</span> 积分（3倍加速）<br />
            连续打卡奖励独立计算，不占上限
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl glass-button font-medium"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            确认更新
          </button>
        </div>
      </div>
    </div>
  );
}