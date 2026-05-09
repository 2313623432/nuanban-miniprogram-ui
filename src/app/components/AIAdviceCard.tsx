import { useState, useEffect } from "react";
import { CheckCircle2, Crown, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useMembership } from "../contexts/MembershipContext";
import { usePlan } from "../contexts/PlanContext";
import { PlanUpdateConfirmModal } from "./checkin/PlanUpdateConfirmModal";

interface AIAdviceCardProps {
  serviceName: string;
  analysis: string; // 会员可见的分析
  plan: string; // 所有人可见的计划
  onCreatePlan?: (tasks: string[]) => void;
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
    const tasks = extractTasks(plan);

    console.log('🔍 [AIAdviceCard] 检查现有计划:', hasExistingPlan ? '有计划' : '无计划');
    console.log('📋 [AIAdviceCard] 是否有现有计划:', hasExistingPlan);

    if (hasExistingPlan) {
      // 有进行中的计划，显示二次确认弹窗
      console.log('⚠️ [AIAdviceCard] 显示二次确认弹窗');
      setShowPlanModal(true);
    } else {
      // 首次创建，直接加入打卡
      console.log('✅ [AIAdviceCard] 首次创建，直接加入打卡');
      createPlanImmediately(tasks);
    }
  };

  const createPlanImmediately = (tasks: string[]) => {
    console.log('✨ [AIAdviceCard] 首次创建计划，任务数:', tasks.length);
    // 直接创建计划
    if (onCreatePlan) {
      console.log('📞 [AIAdviceCard] 调用 onCreatePlan 回调');
      onCreatePlan(tasks);
    } else {
      console.warn('⚠️ [AIAdviceCard] onCreatePlan 回调未定义');
    }
    toast.success(`健康计划已创建！`, {
      description: `已添加 ${tasks.length} 个打卡任务，今日即可开始打卡`
    });
  };

  const handleConfirmUpdate = () => {
    const tasks = extractTasks(plan);
    console.log('🔄 [AIAdviceCard] 确认更新计划，任务数:', tasks.length);

    // 更新任务，立即生效
    if (onCreatePlan) {
      console.log('📞 [AIAdviceCard] 调用 onCreatePlan 回调（更新）');
      onCreatePlan(tasks);
    } else {
      console.warn('⚠️ [AIAdviceCard] onCreatePlan 回调未定义');
    }

    setShowPlanModal(false);
    toast.success("计划更新成功！", {
      description: "新任务已立即生效，可以开始打卡了"
    });
  };

  const handleCancelUpdate = () => {
    setShowPlanModal(false);
    toast.info("已取消计划更新");
  };

  return (
    <>
      <div className="space-y-4">
        {/* 分析部分 - 仅会员可见 */}
        {isMember ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">专业分析</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {analysis}
              </pre>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">专业分析</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                会员专属
              </span>
            </div>
            <div className="relative">
              <div className="blur-sm select-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                  {analysis.slice(0, 100)}...
                </pre>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-card px-6 py-3 rounded-xl border border-primary/30">
                  <p className="text-sm font-medium text-primary">
                    开通会员查看完整分析
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
