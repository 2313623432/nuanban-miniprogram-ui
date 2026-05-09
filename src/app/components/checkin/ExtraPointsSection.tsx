import { useState } from "react";
import { Play, Share2, CheckCircle2, Lock, Coins, Users } from "lucide-react";
import { toast } from "sonner";

interface ExtraTask {
  id: string;
  type: "video" | "browse" | "share";
  title: string;
  points: number;
  completed: boolean;
}

interface ExtraPointsSectionProps {
  isMember: boolean;
  todayExtraPoints: number;
  onComplete: (points: number) => void;
  onInvite?: () => void; // 邀请回调
  inviteCount?: number; // 已邀请人数
  invitePoints?: number; // 邀请获得的积分
}

export function ExtraPointsSection({
  isMember,
  todayExtraPoints,
  onComplete,
  onInvite,
  inviteCount = 0,
  invitePoints = 0
}: ExtraPointsSectionProps) {
  const MEMBER_MULTIPLIER = 3;
  // 暂时不限制额外积分上限
  const NON_MEMBER_EXTRA_LIMIT = 999999;
  const MEMBER_EXTRA_LIMIT = 999999; // 会员3倍加速

  const limit = isMember ? MEMBER_EXTRA_LIMIT : NON_MEMBER_EXTRA_LIMIT;
  const isLimitReached = false; // 暂时不限制

  const [tasks, setTasks] = useState<ExtraTask[]>([
    { id: "6", type: "share", title: "邀请好友加入暖伴", points: 50, completed: false }, // 邀请固定50积分
  ]);

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // 邀请任务直接跳转到分享页面
    const isInviteTask = task.id === "6";
    if (isInviteTask) {
      if (onInvite) {
        onInvite();
      }
      return;
    }

    // 其他任务的完成逻辑（目前只有邀请任务）
    if (task.completed) return;

    // 模拟任务完成
    setTimeout(() => {
      let earnedPoints = task.points;

      // 会员3倍
      if (isMember) {
        earnedPoints = task.points * MEMBER_MULTIPLIER;
      }

      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      ));

      onComplete(earnedPoints);

      if (isMember) {
        toast.success(`任务完成！获得 ${earnedPoints} 积分（会员3倍）`);
      } else {
        toast.success(`任务完成！获得 ${earnedPoints} 积分`);
      }
    }, 1000);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">邀请好友赚积分</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          已邀请 <span className="font-bold text-primary">{inviteCount}</span> 人 · 共获得 <span className="font-bold text-primary">{invitePoints}</span> 积分
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`glass-card rounded-2xl p-4 flex items-center justify-between group ${
              task.completed ? "opacity-60" : "hover:shadow-lg"
            } transition-all`}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* 图标 */}
              <div className={`h-12 w-12 rounded-xl ${
                task.completed
                  ? "bg-green-500/20"
                  : "bg-gradient-to-br from-primary/20 to-secondary/20"
              } flex items-center justify-center`}>
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Users className="h-6 w-6 text-primary" />
                )}
              </div>

              {/* 任务信息 */}
              <div className="flex-1">
                <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">
                    +{task.points} 积分
                  </span>
                  <span className="text-xs text-muted-foreground">
                    邀请无上限，多邀多得
                  </span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <button
              onClick={() => handleCompleteTask(task.id)}
              className="px-6 py-2 rounded-xl text-sm font-medium transition-transform glass-button group-hover:scale-105"
            >
              去邀请
            </button>
          </div>
        ))}
      </div>

      {/* 邀请说明 */}
      <div className="glass-card rounded-2xl p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
        <div className="space-y-2">
          <div className="font-semibold text-primary">🎁 邀请奖励说明</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 每邀请1位好友注册，您可获得 <span className="text-primary font-semibold">50积分</span></li>
            <li>• 被邀请的好友也可获得 <span className="text-primary font-semibold">30积分</span></li>
            <li>• 邀请人数无上限，多邀多得</li>
            <li>• 好友完成注册并微信授权后积分自动到账</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
