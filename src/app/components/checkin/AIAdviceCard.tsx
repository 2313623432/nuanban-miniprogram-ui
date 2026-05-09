import { useState } from "react";
import { CheckCircle2, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { PlanUpdateConfirmModal } from "./PlanUpdateConfirmModal";

interface AIAdviceCardProps {
  advice: string;
  toolName: string;
  hasExistingPlan?: boolean; // 是否已有进行中的计划
  onAccept?: () => void;
}

export function AIAdviceCard({
  advice,
  toolName,
  hasExistingPlan = false,
  onAccept
}: AIAdviceCardProps) {
  const navigate = useNavigate();
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);

  const extractTasksFromAdvice = (text: string): string[] => {
    const tasks: string[] = [];

    if (text.includes("睡眠") || text.includes("入睡")) {
      tasks.push("晚上11点前入睡");
    }

    if (text.includes("运动") || text.includes("锻炼")) {
      tasks.push("完成30分钟有氧运动");
    }

    if (text.includes("饮食") || text.includes("营养")) {
      tasks.push("摄入足量蔬菜水果");
    }

    if (text.includes("喝水") || text.includes("补水")) {
      tasks.push("饮水达到2000ml");
    }

    if (text.includes("冥想") || text.includes("放松")) {
      tasks.push("冥想10分钟");
    }

    return tasks.slice(0, 5);
  };

  const handleAcceptAdvice = () => {
    const tasks = extractTasksFromAdvice(advice);

    if (tasks.length === 0) {
      toast.error("该建议暂无可执行任务");
      return;
    }

    setExtractedTasks(tasks);

    // 判断是否已有计划
    if (hasExistingPlan) {
      // 已有计划：弹出二次确认弹窗
      setShowUpdateConfirmModal(true);
    } else {
      // 首次创建：直接加入计划
      handleCreatePlan(tasks);
    }
  };

  const handleCreatePlan = (tasks: string[]) => {
    toast.success(`已生成 ${tasks.length} 条健行任务！`, {
      description: "任务已加入当前计划，今日即可打卡"
    });

    if (onAccept) {
      onAccept();
    }

    setTimeout(() => {
      navigate("/checkin");
    }, 1000);
  };

  const handleConfirmUpdate = () => {
    setShowUpdateConfirmModal(false);

    if (onAccept) {
      onAccept();
    }

    setTimeout(() => {
      navigate("/checkin");
    }, 500);
  };

  const handleCancelUpdate = () => {
    setShowUpdateConfirmModal(false);
    toast.info("已取消计划更新");
  };

  // 按钮文案和图标
  const buttonText = hasExistingPlan ? "更新健康计划" : "创建健康计划";
  const ButtonIcon = hasExistingPlan ? CheckCircle2 : Plus;

  return (
    <>
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">AI 健康建议</h3>
              <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">
                来自{toolName}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {advice}
            </p>
          </div>
        </div>

        <button
          onClick={handleAcceptAdvice}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <ButtonIcon className="h-5 w-5" />
          {buttonText}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          {hasExistingPlan
            ? "更新后新任务将于次日 00:00 生效，今日任务不受影响"
            : "系统将自动提取可执行动作，生成今日健行任务"}
        </p>
      </div>

      {/* 计划更新确认弹窗 */}
      {showUpdateConfirmModal && (
        <PlanUpdateConfirmModal
          newTasksCount={extractedTasks.length}
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
    </>
  );
}
