import { Calendar, ArrowRight, Sparkles } from "lucide-react";

interface EmptyPlanStateProps {
  isFirstTime: boolean;
  onGoToHome: () => void;
}

export function EmptyPlanState({ isFirstTime, onGoToHome }: EmptyPlanStateProps) {
  return (
    <div className="p-6">
      <div className="glass-card rounded-3xl p-12 text-center space-y-6">
        {/* 图标 */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
            {!isFirstTime && (
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* 文案 */}
        <div className="space-y-3">
          {isFirstTime ? (
            <>
              <h3 className="text-2xl font-bold">当前还没有创建计划</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                开始全面诊断，获取专业的每日养生计划
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>AI专家会根据你的情况制定专属计划</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold">当前阶段任务已完成</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                开始全面诊断，获取新的养生计划
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>恭喜完成30天健康计划！</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 引导按钮 */}
        <div className="pt-4">
          <button
            onClick={onGoToHome}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <span>开始诊断</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 底部说明 */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-sm text-muted-foreground leading-relaxed">
            💡 与AI健康专家对话，描述你的健康状况<br />
            专家会为你生成个性化的30天打卡计划
          </p>
        </div>
      </div>
    </div>
  );
}