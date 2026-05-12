import { useState, useEffect } from "react";
import { CheckCircle2, Crown, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useMembership } from "../contexts/MembershipContext";
import { usePlan } from "../contexts/PlanContext";
import { PlanUpdateConfirmModal } from "./checkin/PlanUpdateConfirmModal";

interface AIAdviceCardProps {
  serviceName: string;
  analysis: string;
  plan: string;
  onCreatePlan?: (title: string, tasks: string[]) => void;
}

function generateTitle(serviceName: string): string {
  const keywords: Record<string, string> = {
    "血糖": "血糖", "糖尿病": "控糖", "高血压": "降压", "血压": "稳压",
    "睡眠": "安眠", "失眠": "安眠", "运动": "运动", "减肥": "减脂",
    "饮食": "饮食", "关节": "关节", "颈椎": "颈椎", "腰椎": "护腰",
    "心脏": "养心", "肠胃": "养胃", "情绪": "情绪", "疲劳": "抗疲劳",
    "食谱": "饮食", "养生": "养生", "按摩": "按摩", "艾灸": "艾灸",
  };
  for (const [k, v] of Object.entries(keywords)) {
    if (serviceName.includes(k)) return `${v}调理计划`;
  }
  return "健康调理计划";
}

export function AIAdviceCard({ serviceName, analysis, plan, onCreatePlan }: AIAdviceCardProps) {
  const { isMember } = useMembership();
  const { hasPlan: hasExistingPlan } = usePlan();
  const [showPlanModal, setShowPlanModal] = useState(false);

  // 组件加载时检查现有计划
  useEffect(() => {
    console.log('🔄 [AIAdviceCard] 组件加载，检查计划缓存:', hasExistingPlan ? '有计划' : '无计划');
  }, [hasExistingPlan]);

  // 从计划文本中提取可执行任务
  const extractTasks = (planText: string): string[] => {
    const tasks: string[] = [];
    
    // 匹配各种格式的任务描述
    const patterns = [
      /•\s*([^•\n]+)/g, // 匹配 • 开头的任务
      /\d+\.\s*([^\n]+)/g, // 匹配数字开头的任务
      /【([^】]+)】/g, // 匹配中文括号内的任务
    ];

    patterns.forEach(pattern => {
      const matches = planText.matchAll(pattern);
      for (const match of matches) {
        const task = match[1].trim();
        // 过滤掉过长或过短的文本，以及标题性文字
        if (task.length > 5 && task.length < 50 && !task.includes('建议') && !task.includes('注意')) {
          tasks.push(task);
        }
      }
    });

    // 如果没有提取到任务，返回默认任务
    if (tasks.length === 0) {
      return [
        "按照AI建议执行健康计划",
        "记录每日健康数据",
        "定期复查健康状况",
        "保持良好作息习惯",
        "注意饮食均衡"
      ];
    }

    // 最多返回5个任务
    return tasks.slice(0, 5);
  };

  const handleAcceptAdvice = () => {
    setShowPlanModal(true);
  };

  const handleConfirmUpdate = () => {
    const tasks = extractTasks(plan);
    const title = generateTitle(serviceName);

    if (onCreatePlan) {
      onCreatePlan(title, tasks);
    }

    setShowPlanModal(false);
  };

  const handleCancelUpdate = () => {
    setShowPlanModal(false);
    toast.info("已取消计划更新");
  };

  return (
    <>
      <div className="space-y-4">
        {/* 分析部分 */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold">专业分析</h3>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {analysis}
            </pre>
          </div>
        </div>

        {/* 健康计划 - 所有人可见 */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">健康计划</h3>
          </div>
          <div className="prose prose-sm max-w-none mb-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {plan}
            </pre>
          </div>

          {/* 接受打卡计划按钮 */}
          <button
            onClick={handleAcceptAdvice}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            接受打卡计划
          </button>
        </div>
      </div>

      {/* 计划更新确认弹窗 */}
      {showPlanModal && (
        <PlanUpdateConfirmModal
          newTasksCount={extractTasks(plan).length}
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
    </>
  );
}
