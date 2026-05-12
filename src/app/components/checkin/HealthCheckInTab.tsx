import { useState, useEffect } from "react";
import { Plus, Camera, CheckCircle2, Clock, Award, TrendingUp, Calendar, Sparkles, Crown, Trophy, History } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { PhotoVerificationModal } from "./PhotoVerificationModal";
import { AddTaskModal } from "./AddTaskModal";
import { ExtraPointsSection } from "./ExtraPointsSection";
import { EmptyPlanState } from "./EmptyPlanState";
import { CheckInCalendar } from "./CheckInCalendar";
import { WechatMemberSubscriptionModal } from "./WechatMemberSubscriptionModal";
import { PlanUpdateConfirmModal } from "./PlanUpdateConfirmModal";
import { DiagnosisChatModal } from "./DiagnosisChatModal";
import { WeeklyTasksDrawer } from "./WeeklyTasksDrawer";
import { WeekCardsSlider } from "./WeekCardsSlider";
import { usePlan } from "../../contexts/PlanContext";
import type { WeekPlan, PlanRecord } from "../../contexts/PlanContext";

interface Task {
  id: string;
  content: string;
  type: "auto" | "manual";
  points: number;
  status: "pending" | "completed";
  requiresPhoto: boolean;
  photoUrl?: string;
}

export function HealthCheckInTab() {
  const navigate = useNavigate();
  const { planData: globalPlanData, hasPlan: globalHasPlan, setPlanData: setPlanDataContext, planHistory, addToPlanHistory } = usePlan();

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const loadTodayPoints = () => {
    try {
      const dailyPointsData = localStorage.getItem('dailyCheckInPoints');
      if (dailyPointsData) {
        const data = JSON.parse(dailyPointsData);
        const today = getTodayDateString();
        if (data.date === today) {
          return { checkInPoints: data.checkInPoints || 0, extraPoints: data.extraPoints || 0 };
        }
      }
    } catch (error) {
      console.error("加载今日积分失败:", error);
    }
    return { checkInPoints: 0, extraPoints: 0 };
  };

  const saveTodayPoints = (checkInPoints: number, extraPoints: number) => {
    try {
      const data = { date: getTodayDateString(), checkInPoints, extraPoints };
      localStorage.setItem('dailyCheckInPoints', JSON.stringify(data));
    } catch (error) {
      console.error("保存今日积分失败:", error);
    }
  };

  const initialTodayPoints = loadTodayPoints();

  /** 根据开始日期计算当前第几周（1-4） */
  const computeCurrentWeek = (startDate: Date): number => {
    const daysSince = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    return Math.min(Math.floor(daysSince / 7) + 1, 4);
  };

  /** 根据基础任务生成4周计划 */
  const generateWeeklyPlans = (baseTasks: string[]): WeekPlan[] => [
    {
      week: 1,
      phase: "适应期",
      tasks: baseTasks,
    },
    {
      week: 2,
      phase: "稳定期",
      tasks: baseTasks,
    },
    {
      week: 3,
      phase: "提升期",
      tasks: [...baseTasks.slice(0, 4), "增加10分钟有氧运动，强化体能"],
    },
    {
      week: 4,
      phase: "总结期",
      tasks: [...baseTasks.slice(0, 3), "回顾月度健康数据记录", "制定下月健康改进目标"],
    },
  ];

  const loadPlanFromContext = () => {
    if (globalPlanData && globalHasPlan) {
      const startDate = new Date(globalPlanData.startDate);
      const weekNum = computeCurrentWeek(startDate);
      const weekly: WeekPlan[] = globalPlanData.weeklyPlans?.length
        ? globalPlanData.weeklyPlans
        : generateWeeklyPlans(globalPlanData.tasks);
      const currentWeekTasks = weekly[weekNum - 1]?.tasks || globalPlanData.tasks;
      return {
        hasPlan: true,
        weeklyPlans: weekly,
        currentWeek: weekNum,
        tasks: currentWeekTasks.map((content: string, index: number) => ({
          id: `auto-${index + 1}`,
          content,
          type: "auto" as const,
          points: 2,
          status: "pending" as const,
          requiresPhoto: false
        })),
        startDate,
      };
    }
    return null;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [points, setPoints] = useState(125);
  const [todayPoints, setTodayPoints] = useState(initialTodayPoints.checkInPoints + initialTodayPoints.extraPoints);
  const [todayCheckInPoints, setTodayCheckInPoints] = useState(initialTodayPoints.checkInPoints);
  const [todayExtraPoints, setTodayExtraPoints] = useState(initialTodayPoints.extraPoints);
  const [consecutiveDays, setConsecutiveDays] = useState(5);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [planStartDate, setPlanStartDate] = useState(new Date());
  const [isFirstTimePlan, setIsFirstTimePlan] = useState(true);
  const [showNewPlanPreview, setShowNewPlanPreview] = useState(false);
  const [newPlanPreviewTasks, setNewPlanPreviewTasks] = useState<string[]>([]);
  const [showPlanUpdateModal, setShowPlanUpdateModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [pendingNewTasks, setPendingNewTasks] = useState<string[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeekPlan[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string>("");
  const [pendingWeeklyPlans, setPendingWeeklyPlans] = useState<WeekPlan[]>([]);
  const [pendingPlanTitle, setPendingPlanTitle] = useState("");

  const MEMBER_MULTIPLIER = 2;
  const NON_MEMBER_DAILY_CHECKIN_LIMIT = 20;
  const MEMBER_DAILY_CHECKIN_LIMIT = 40;
  const PLAN_DURATION_DAYS = 28;

  // 实时时钟
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedPlan = loadPlanFromContext();
    if (savedPlan && savedPlan.tasks && savedPlan.tasks.length > 0) {
      setTasks(savedPlan.tasks);
      setHasPlan(true);
      setPlanStartDate(savedPlan.startDate);
      setIsFirstTimePlan(false);
      setWeeklyPlans(savedPlan.weeklyPlans);
      setCurrentWeek(savedPlan.currentWeek);
    }
  }, [globalPlanData, globalHasPlan]);

  const calculateRemainingDays = () => {
    if (!hasPlan) return 0;
    const today = new Date();
    const endDate = new Date(planStartDate);
    endDate.setDate(endDate.getDate() + PLAN_DURATION_DAYS);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const remainingDays = calculateRemainingDays();
  const isPlanExpired = hasPlan && remainingDays <= 0;

  const handleCompleteTask = (task: Task) => {
    if (task.requiresPhoto) {
      setSelectedTask(task);
      setShowPhotoModal(true);
    } else {
      completeTask(task.id);
    }
  };

  const completeTask = (taskId: string, photoUrl?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: "completed" as const, photoUrl } : t
    ));

    let earnedPoints = task.points;
    const dailyLimit = isMember ? MEMBER_DAILY_CHECKIN_LIMIT : NON_MEMBER_DAILY_CHECKIN_LIMIT;

    if (isMember) {
      earnedPoints = task.points * MEMBER_MULTIPLIER;
    }

    if (todayCheckInPoints >= dailyLimit) {
      toast.success("打卡成功！", { description: "您当日的打卡积分已上限，明天再来吧" });
      const allCompleted = tasks.every(t => t.id === taskId || t.status === "completed");
      if (allCompleted) {
        setTimeout(() => {
          toast.success("今日任务全部完成！连续打卡天数 +1");
          setConsecutiveDays(consecutiveDays + 1);
        }, 500);
      }
      return;
    }

    const remaining = dailyLimit - todayCheckInPoints;
    if (earnedPoints > remaining) earnedPoints = remaining;

    const newCheckInPoints = todayCheckInPoints + earnedPoints;
    const newTodayPoints = todayPoints + earnedPoints;

    setPoints(points + earnedPoints);
    setTodayPoints(newTodayPoints);
    setTodayCheckInPoints(newCheckInPoints);
    saveTodayPoints(newCheckInPoints, todayExtraPoints);

    if (isMember) {
      toast.success(`打卡成功！获得 ${earnedPoints} 积分（会员3倍）`);
    } else {
      toast.success(`打卡成功！获得 ${earnedPoints} 积分`);
    }

    const allCompleted = tasks.every(t => t.id === taskId || t.status === "completed");
    if (allCompleted) {
      setTimeout(() => {
        const newConsecutiveDays = consecutiveDays + 1;
        setConsecutiveDays(newConsecutiveDays);
        let bonusPoints = 0;
        let bonusMessage = "";
        if (newConsecutiveDays === 7)  { bonusPoints = 20;  bonusMessage = "连续打卡7天！额外奖励 20 积分"; }
        else if (newConsecutiveDays === 14) { bonusPoints = 50;  bonusMessage = "连续打卡14天！额外奖励 50 积分"; }
        else if (newConsecutiveDays === 21) { bonusPoints = 80;  bonusMessage = "连续打卡21天！额外奖励 80 积分"; }
        else if (newConsecutiveDays === 28) { bonusPoints = 100; bonusMessage = "连续打卡28天！额外奖励 100 积分"; }
        if (bonusPoints > 0) {
          setPoints(points + bonusPoints);
          setTodayPoints(todayPoints + bonusPoints);
          toast.success(bonusMessage, { description: "坚持就是胜利！继续加油" });
        } else {
          toast.success("今日任务全部完成！连续打卡天数 +1");
        }
      }, 500);
    }
  };

  const handlePhotoSubmit = (photo: File) => {
    if (selectedTask) {
      const photoUrl = URL.createObjectURL(photo);
      completeTask(selectedTask.id, photoUrl);
      setShowPhotoModal(false);
      setSelectedTask(null);
    }
  };

  const handleAddTask = (content: string) => {
    if (tasks.length >= 8) { toast.error("单日任务总数不能超过8条"); return; }
    const manualTaskCount = tasks.filter(t => t.type === "manual").length;
    if (manualTaskCount >= 3) { toast.error("单日手动任务不能超过3条"); return; }
    const newTask: Task = {
      id: Date.now().toString(),
      content,
      type: "manual",
      points: 2,
      status: "pending",
      requiresPhoto: false
    };
    setTasks([...tasks, newTask]);
    setShowAddTaskModal(false);
    toast.success("任务添加成功");
  };

  const handleExtraTaskComplete = (earnedPoints: number) => {
    const newExtraPoints = todayExtraPoints + earnedPoints;
    const newTodayPoints = todayPoints + earnedPoints;
    setPoints(points + earnedPoints);
    setTodayPoints(newTodayPoints);
    setTodayExtraPoints(newExtraPoints);
    saveTodayPoints(todayCheckInPoints, newExtraPoints);
  };

  const handleGoToHome = () => {
    navigate('/', { state: { openDiagnosis: true, serviceTitle: "定制养生食谱" } });
  };

  const handleResetPlanClick = () => {
    setShowDiagnosisModal(true);
  };

  const handleDiagnosisAccept = (title: string, incoming: WeekPlan[]) => {
    setShowDiagnosisModal(false);
    if (hasPlan) {
      setPendingPlanTitle(title);
      setPendingWeeklyPlans(incoming);
      setShowPlanUpdateModal(true);
    } else {
      applyNewPlan(title, incoming);
    }
  };

  const applyNewPlan = (title: string, weekly: WeekPlan[]) => {
    const startDate = new Date();
    const planId = `plan-${Date.now()}`;

    const newAutoTasks = weekly[0].tasks.map((content, index) => ({
      id: `auto-${Date.now()}-${index}`,
      content,
      type: "auto" as const,
      points: 2,
      status: "pending" as const,
      requiresPhoto: false
    }));

    setTasks(newAutoTasks);
    setWeeklyPlans(weekly);
    setCurrentWeek(1);
    setCurrentPlanId(planId);
    setPlanStartDate(startDate);
    setHasPlan(true);
    setIsFirstTimePlan(false);

    // 保存到 Context
    setPlanDataContext({
      title,
      tasks: weekly[0].tasks,
      weeklyPlans: weekly,
      startDate: startDate.toISOString(),
      createdAt: Date.now(),
    });

    // 加入历史记录
    addToPlanHistory({
      id: planId,
      title,
      startDate: startDate.toISOString(),
      weeklyPlans: weekly,
      createdAt: Date.now(),
    });

    toast.success("计划创建成功！快来开始打卡吧 🎉");
  };

  useEffect(() => {
    const handlePlanCreated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const planData = customEvent.detail;
      if (planData && planData.tasks) {
        const weekly: WeekPlan[] = planData.weeklyPlans?.length
          ? planData.weeklyPlans
          : generateWeeklyPlans(planData.tasks);
        const startDate = new Date(planData.startDate);
        const weekNum = computeCurrentWeek(startDate);
        const currentWeekTasks = weekly[weekNum - 1]?.tasks || planData.tasks;
        const planId = planData.id || `plan-${planData.createdAt || Date.now()}`;

        if (hasPlan) {
          setNewPlanPreviewTasks(currentWeekTasks);
          setShowNewPlanPreview(true);
          toast.info("AI专家已为您生成新计划", { description: "请查看新计划后确认是否接受" });
        } else {
          const newAutoTasks = currentWeekTasks.map((content: string, index: number) => ({
            id: `auto-${Date.now()}-${index}`,
            content,
            type: "auto" as const,
            points: 2,
            status: "pending" as const,
            requiresPhoto: false
          }));
          setTasks(newAutoTasks);
          setHasPlan(true);
          setPlanStartDate(startDate);
          setWeeklyPlans(weekly);
          setCurrentWeek(weekNum);
          setCurrentPlanId(planId);
          setIsFirstTimePlan(false);
          // 加入历史
          addToPlanHistory({ id: planId, title: planData.title || "健康调理计划", startDate: startDate.toISOString(), weeklyPlans: weekly, createdAt: Date.now() });
        }
      }
    };
    window.addEventListener('planCreated', handlePlanCreated);
    return () => window.removeEventListener('planCreated', handlePlanCreated);
  }, [hasPlan, tasks]);

  const showEmptyState = !hasPlan || isPlanExpired || tasks.length === 0;

  // 连续打卡时间轴辅助
  const milestones = [
    { day: 7,  reward: 20,  label: "7天",  percent: (7  / 28) * 100 },
    { day: 14, reward: 50,  label: "14天", percent: (14 / 28) * 100 },
    { day: 21, reward: 80,  label: "21天", percent: (21 / 28) * 100 },
    { day: 28, reward: 100, label: "28天", percent: 100 },
  ];

  const progressPercent = Math.min((consecutiveDays / 28) * 100, 100);

  const formatCurrentTime = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}/${m}/${d} ${h}:${min}:${s}`;
  };

  return (
    <div className="space-y-6">
      {/* 诊断聊天弹窗 */}
      {showDiagnosisModal && (
        <DiagnosisChatModal
          isRediagnosis={hasPlan}
          onAcceptPlan={handleDiagnosisAccept}
          onClose={() => setShowDiagnosisModal(false)}
        />
      )}

      {showEmptyState ? (
        <EmptyPlanState
          isFirstTime={!hasPlan || isFirstTimePlan}
          onGoToHome={() => setShowDiagnosisModal(true)}
        />
      ) : (
        <div className="p-6 space-y-6">

          {/* 积分总览卡片 */}
          <div className="glass-card rounded-3xl p-5 space-y-4">
            <div className="space-y-3">
              {/* 积分 + 今日获得 */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-muted-foreground text-sm mb-1">我的积分</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {points}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>今日 +{todayPoints}</span>
                </div>
              </div>

              {/* 计划剩余天数 */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>当前计划还剩 {remainingDays} 天</span>
              </div>

              {/* 快捷操作 */}
              <div className="flex gap-2 pt-1 flex-wrap">
                <button
                  onClick={() => setShowCalendar(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>打卡日历</span>
                </button>

                {/* 小历史按钮 */}
                <button
                  onClick={() => setShowHistoryDrawer(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  <History className="h-3.5 w-3.5 text-primary" />
                  <span>计划记录</span>
                </button>

                {!isMember && (
                  <button
                    onClick={() => setShowMemberModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-xs font-medium text-orange-600 dark:text-orange-400 hover:from-orange-500/20 hover:to-red-500/20 transition-all"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    <span>立即开通会员 · 享3倍打卡积分</span>
                  </button>
                )}
                {isMember && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Crown className="h-3.5 w-3.5" />
                    <span>会员 · 3倍积分加速中</span>
                  </div>
                )}
              </div>
            </div>

            {/* 打卡积分进度 */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">今日打卡积分</span>
                {isMember ? (
                  <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
                    <Crown className="h-3 w-3" />3倍加速中
                  </span>
                ) : (
                  <span className="text-xs font-medium">
                    {todayCheckInPoints}/{NON_MEMBER_DAILY_CHECKIN_LIMIT}
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    !isMember && todayCheckInPoints >= NON_MEMBER_DAILY_CHECKIN_LIMIT
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-primary to-secondary'
                  }`}
                  style={{
                    width: isMember
                      ? `${Math.min((todayCheckInPoints / MEMBER_DAILY_CHECKIN_LIMIT) * 100, 100)}%`
                      : `${Math.min((todayCheckInPoints / NON_MEMBER_DAILY_CHECKIN_LIMIT) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* ─── 连续打卡奖励时间轴 ─── */}
            <div className="pt-3 border-t border-white/10 space-y-4">
              {/* 标题行 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">连续打卡奖励</span>
                  {consecutiveDays > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      第 {consecutiveDays} 天
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                  {formatCurrentTime(currentTime)}
                </span>
              </div>

              {/* 进度条 */}
              <div className="relative h-2 bg-white/10 rounded-full mx-1">
                {/* 已完成段 */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-400 to-primary transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
                {/* 里程碑节点 */}
                {milestones.map((m) => {
                  const reached = consecutiveDays >= m.day;
                  return (
                    <div
                      key={m.day}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${m.percent}%` }}
                    >
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        reached
                          ? 'bg-green-400 border-green-300 shadow-md shadow-green-400/40'
                          : 'bg-white/20 border-white/30'
                      }`}>
                        {reached && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
                {/* 当前位置光标 */}
                {consecutiveDays > 0 && consecutiveDays < 28 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                    style={{ left: `${progressPercent}%` }}
                  >
                    <div className="h-4 w-4 rounded-full bg-primary border-2 border-white shadow-lg shadow-primary/50 animate-pulse" />
                  </div>
                )}
              </div>

              {/* 里程碑卡片 */}
              <div className="grid grid-cols-4 gap-2">
                {milestones.map((m) => {
                  const reached = consecutiveDays >= m.day;
                  const diff = m.day - consecutiveDays;
                  return (
                    <div
                      key={m.day}
                      className={`rounded-2xl p-3 text-center transition-all ${
                        reached
                          ? 'bg-green-500/10 border border-green-500/25'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`text-xl mb-1 ${reached ? '' : 'grayscale opacity-60'}`}>
                        {m.day === 7 ? '🥉' : m.day === 14 ? '🥇' : m.day === 21 ? '🥈' : '🏆'}
                      </div>
                      <div className={`text-xs font-bold ${reached ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {m.label}
                      </div>
                      <div className={`text-xs mt-0.5 font-medium ${reached ? 'text-green-500' : 'text-primary'}`}>
                        +{m.reward}积分
                      </div>
                      <div className="text-xs mt-1">
                        {reached ? (
                          <span className="text-green-500 font-medium">✓ 已获得</span>
                        ) : diff <= 3 ? (
                          <span className="text-primary font-bold">差{diff}天</span>
                        ) : (
                          <span className="text-muted-foreground">差{diff}天</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 激励文案 */}
              {consecutiveDays < 28 && (() => {
                const next = milestones.find(m => consecutiveDays < m.day);
                if (!next) return null;
                const diff = next.day - consecutiveDays;
                return (
                  <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-sm">🎯</span>
                    <span className="text-xs text-muted-foreground">
                      再坚持 <span className="text-primary font-bold">{diff}</span> 天解锁
                      <span className="text-primary font-bold"> +{next.reward}积分</span> 奖励
                    </span>
                  </div>
                );
              })()}
              {consecutiveDays >= 28 && (
                <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-sm">🏆</span>
                  <span className="text-xs text-green-500 font-medium">已完成所有连续打卡里程碑！</span>
                </div>
              )}
            </div>
          </div>

          {/* ── 本次计划·4周卡片滑动 ── */}
          {weeklyPlans.length > 0 && (
            <WeekCardsSlider
              weeklyPlans={weeklyPlans}
              currentWeek={currentWeek}
              planStartDate={planStartDate}
            />
          )}

          {/* 今日任务 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">今日任务</h2>
                <span className="text-sm text-muted-foreground">
                  {tasks.filter(t => t.status === "completed").length}/{tasks.length}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  第{currentWeek}周·{weeklyPlans[currentWeek - 1]?.phase || "适应期"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPlanClick}
                  className="glass-button px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  重新制定计划
                </button>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="glass-button px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  添加
                </button>
              </div>
            </div>

            {/* 任务列表 */}
            {tasks.length > 0 && (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const dailyLimit = isMember ? MEMBER_DAILY_CHECKIN_LIMIT : NON_MEMBER_DAILY_CHECKIN_LIMIT;
                  const isCompleted = task.status === "completed";
                  const isLimited = !isCompleted && (dailyLimit - todayCheckInPoints) === 0;

                  return (
                    <div
                      key={task.id}
                      className={`glass-card rounded-2xl p-4 flex items-center justify-between transition-all ${
                        isCompleted
                          ? 'opacity-60 bg-green-500/5 border border-green-500/20'
                          : 'group hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-green-500/20'
                            : 'bg-gradient-to-br from-primary/20 to-secondary/20'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : task.requiresPhoto ? (
                            <Camera className="h-6 w-6 text-primary" />
                          ) : (
                            <Clock className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {task.content}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {isCompleted ? (
                              <span className="text-xs text-green-500 font-medium">✓ 已完成 · +{task.points}积分</span>
                            ) : (
                              <>
                                <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">
                                  {task.type === "auto" ? "AI任务" : "手动任务"}
                                </span>
                                {isLimited && (
                                  <span className="text-xs text-muted-foreground">已达上限</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {!isCompleted && (
                        <button
                          onClick={() => handleCompleteTask(task)}
                          className="glass-button px-5 py-2 rounded-xl text-sm font-medium group-hover:scale-105 transition-transform"
                        >
                          完成
                        </button>
                      )}
                      {isCompleted && task.photoUrl && (
                        <img
                          src={task.photoUrl}
                          alt="验证照片"
                          className="h-10 w-10 rounded-xl object-cover ml-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {tasks.length === 0 && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">暂无打卡任务</p>
                <button
                  onClick={() => setShowDiagnosisModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Sparkles className="h-5 w-5" />
                  开始AI制定任务
                </button>
              </div>
            )}
          </div>

          {/* 邀请好友赚积分 */}
          <ExtraPointsSection
            isMember={isMember}
            todayExtraPoints={todayExtraPoints}
            onComplete={handleExtraTaskComplete}
            onInvite={() => toast.info("邀请功能即将上线，敬请期待！")}
            inviteCount={3}
            invitePoints={150}
          />

          {/* 照片验证模态框 */}
          {showPhotoModal && selectedTask && (
            <PhotoVerificationModal
              task={selectedTask}
              onSubmit={handlePhotoSubmit}
              onClose={() => { setShowPhotoModal(false); setSelectedTask(null); }}
            />
          )}

          {/* 添加任务模态框 */}
          {showAddTaskModal && (
            <AddTaskModal
              onSubmit={handleAddTask}
              onClose={() => setShowAddTaskModal(false)}
            />
          )}

          {/* 打卡日历 */}
          {showCalendar && <CheckInCalendar onClose={() => setShowCalendar(false)} />}

          {/* 会员开通弹窗 */}
          {showMemberModal && (
            <WechatMemberSubscriptionModal
              onSuccess={() => { setIsMember(true); setShowMemberModal(false); }}
              onClose={() => setShowMemberModal(false)}
            />
          )}

          {/* 二次确认弹窗 */}
          {showPlanUpdateModal && (
            <PlanUpdateConfirmModal
              newTasksCount={pendingWeeklyPlans.length > 0 ? pendingWeeklyPlans[0].tasks.length : 5}
              onConfirm={() => {
                const weekly = pendingWeeklyPlans.length > 0
                  ? pendingWeeklyPlans
                  : generateWeeklyPlans(newPlanPreviewTasks);
                const title = pendingPlanTitle || "健康调理计划";
                const startDate = new Date();
                const planId = `plan-${Date.now()}`;
                const newAutoTasks = weekly[0].tasks.map((content, index) => ({
                  id: `auto-${Date.now()}-${index}`,
                  content,
                  type: "auto" as const,
                  points: 2,
                  status: "pending" as const,
                  requiresPhoto: false
                }));
                const manualTasks = tasks.filter(t => t.type === "manual");
                setTasks([...newAutoTasks, ...manualTasks]);
                setWeeklyPlans(weekly);
                setCurrentWeek(1);
                setCurrentPlanId(planId);
                setPlanStartDate(startDate);
                setPlanDataContext({
                  title,
                  tasks: weekly[0].tasks,
                  weeklyPlans: weekly,
                  startDate: startDate.toISOString(),
                  createdAt: Date.now(),
                });
                addToPlanHistory({ id: planId, title, startDate: startDate.toISOString(), weeklyPlans: weekly, createdAt: Date.now() });
                setShowPlanUpdateModal(false);
                setShowNewPlanPreview(false);
                setNewPlanPreviewTasks([]);
                setPendingNewTasks([]);
                setPendingWeeklyPlans([]);
                setPendingPlanTitle("");
                toast.success("计划更新成功！", { description: "新任务已立即生效，快来开始打卡吧" });
              }}
              onCancel={() => {
                setShowPlanUpdateModal(false);
                setPendingNewTasks([]);
                setPendingWeeklyPlans([]);
                setPendingPlanTitle("");
                toast.info("已取消计划更新");
              }}
            />
          )}

          {/* 历史任务抽屉 */}
          {showHistoryDrawer && (
            <WeeklyTasksDrawer
              planHistory={planHistory}
              currentPlanId={currentPlanId}
              onClose={() => setShowHistoryDrawer(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}