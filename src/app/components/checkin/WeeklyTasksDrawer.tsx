import { useState, useRef } from "react";
import { X, CheckCircle2, Lock, Zap, Calendar, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import type { PlanRecord } from "../../contexts/PlanContext";
import { formatWeekDateRange } from "./WeekCardsSlider";

interface WeeklyTasksDrawerProps {
  planHistory: PlanRecord[];
  currentPlanId?: string;
  onClose: () => void;
}

const PHASE_STYLES: Record<number, {
  emoji: string; bg: string; border: string; text: string; badge: string; dot: string;
}> = {
  1: { emoji: "🌱", bg: "bg-green-500/5",  border: "border-green-500/25",  text: "text-green-600",  badge: "bg-green-500/10 text-green-600",  dot: "bg-green-500"  },
  2: { emoji: "💪", bg: "bg-blue-500/5",   border: "border-blue-500/25",   text: "text-blue-600",   badge: "bg-blue-500/10 text-blue-600",   dot: "bg-blue-500"   },
  3: { emoji: "🚀", bg: "bg-orange-500/5", border: "border-orange-500/25", text: "text-orange-600", badge: "bg-orange-500/10 text-orange-600", dot: "bg-orange-500" },
  4: { emoji: "🏆", bg: "bg-purple-500/5", border: "border-purple-500/25", text: "text-purple-600", badge: "bg-purple-500/10 text-purple-600", dot: "bg-purple-500" },
};

const WEEK_CN = ["一", "二", "三", "四"];

function fmtDate(d: Date) { return `${d.getMonth() + 1}.${d.getDate()}`; }
function planRange(iso: string) {
  const s = new Date(iso); const e = new Date(s); e.setDate(e.getDate() + 27);
  return `${fmtDate(s)} — ${fmtDate(e)}`;
}

// ── 全宽周卡片（当前计划 & 历史详情共用）─────────────────
function WeekCardsFull({ weeks, startDate }: { weeks: { week: number; phase: string; tasks: string[] }[]; startDate: Date }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const now = Date.now();

  const scrollTo = (idx: number) => {
    const el = scrollRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIdx(idx);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 图例 */}
      <div className="flex items-center gap-4 px-5 py-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>进行中
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3.5 w-3.5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
          </div>已完成
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3.5 w-3.5 rounded-full bg-white/8 border border-white/15 flex items-center justify-center">
            <Lock className="h-2.5 w-2.5 text-muted-foreground" />
          </div>未解锁
        </div>
      </div>

      {/* 横向滑动卡片 — 占满宽度 */}
      <div
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto scrollbar-hide px-3"
        style={{ scrollSnapType: "x mandatory" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const idx = Math.round(el.scrollLeft / el.clientWidth);
          setActiveIdx(Math.min(Math.max(idx, 0), weeks.length - 1));
        }}
      >
        {weeks.map((wp) => {
          const st = PHASE_STYLES[wp.week] || PHASE_STYLES[1];
          const ws = startDate.getTime() + (wp.week - 1) * 7 * 86400000;
          const we = ws + 7 * 86400000 - 1;
          const isFuture = now < ws;
          const isPast = now > we;
          const isCurrent = !isFuture && !isPast;
          const dateRange = formatWeekDateRange(startDate, wp.week);

          return (
            <div
              key={wp.week}
              className={`flex-none w-[calc(100%-6px)] mr-3 rounded-2xl border-2 p-5 flex flex-col ${st.bg} ${st.border} ${isFuture ? "opacity-60" : ""}`}
              style={{ scrollSnapAlign: "center" }}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{st.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${st.text}`}>
                        第{WEEK_CN[wp.week - 1]}周
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${st.badge}`}>
                        {wp.phase}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{dateRange}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <span className={`text-xs font-medium ${st.text} flex items-center gap-1`}>
                      <Zap className="h-3 w-3" />进行中
                    </span>
                  )}
                  {isPast && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {isFuture && <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>

              {/* 任务列表 */}
              <div className="flex-1 space-y-3">
                {wp.tasks.map((task, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${st.bg}`}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${st.badge}`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm flex-1 leading-relaxed ${
                      isPast ? "text-muted-foreground line-through" :
                      isFuture ? "text-muted-foreground/55" : "text-foreground/85"
                    }`}>{task}</span>
                    {!isFuture && (
                      <span className={`text-xs font-medium flex-shrink-0 mt-0.5 ${isPast ? "text-green-500/50" : st.text}`}>
                        +2
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 mt-2 border-t border-white/10">
                <span>{wp.tasks.length}项每日任务</span>
                <span className={`font-medium ${st.text}`}>最高 {wp.tasks.length * 2 * 7} 积分/周</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分页 + 左右箭头 */}
      <div className="flex items-center justify-center gap-3 py-3 flex-shrink-0">
        <button
          onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
          disabled={activeIdx === 0}
          className="h-7 w-7 rounded-lg glass-button flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <div className="flex gap-1.5">
          {weeks.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIdx ? "w-5 bg-primary" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => scrollTo(Math.min(weeks.length - 1, activeIdx + 1))}
          disabled={activeIdx === weeks.length - 1}
          className="h-7 w-7 rounded-lg glass-button flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── 主组件 ───────────────────────────────────────────────
export function WeeklyTasksDrawer({ planHistory, onClose }: WeeklyTasksDrawerProps) {
  const [tab, setTab] = useState<"current" | "history">("current");
  const [historyDetailId, setHistoryDetailId] = useState<string | null>(null);

  const sorted = [...planHistory].sort((a, b) => b.createdAt - a.createdAt);
  const currentPlan = sorted[0] ?? null;
  const historyPlans = sorted.slice(1);

  const viewingHistoryPlan = historyDetailId
    ? historyPlans.find(p => p.id === historyDetailId) ?? null
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mt-10 flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 40px)", background: "var(--background)", borderRadius: "24px 24px 0 0" }}>

        {/* 拖拽条 */}
        <div className="flex justify-center pt-3 pb-0.5 flex-shrink-0">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/20 flex-shrink-0">
          {viewingHistoryPlan ? (
            <>
              <button
                onClick={() => setHistoryDetailId(null)}
                className="flex items-center gap-1.5 text-sm text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回</span>
              </button>
              <span className="font-bold text-sm">{viewingHistoryPlan.title}</span>
            </>
          ) : (
            <>
              <span className="font-bold">计划任务</span>
              {tab === "history" && historyPlans.length > 0 && (
                <span className="text-xs text-muted-foreground">{historyPlans.length} 条历史</span>
              )}
            </>
          )}
          <button onClick={onClose} className="h-8 w-8 rounded-xl glass-button flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab 切换 — 仅在列表视图显示 */}
        {!viewingHistoryPlan && (
          <div className="flex gap-1 p-3 border-b border-border/15 flex-shrink-0">
            <button
              onClick={() => setTab("current")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === "current" ? "glass-button text-primary shadow-sm" : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              当前任务
            </button>
            <button
              onClick={() => setTab("history")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === "history" ? "glass-button text-primary shadow-sm" : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              历史计划
              {historyPlans.length > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-muted-foreground">
                  {historyPlans.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* 内容区 */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* ── 历史详情视图 ── */}
          {viewingHistoryPlan && (
            <WeekCardsFull
              weeks={[...viewingHistoryPlan.weeklyPlans].sort((a, b) => a.week - b.week)}
              startDate={new Date(viewingHistoryPlan.startDate)}
            />
          )}

          {/* ── 当前计划 Tab ── */}
          {!viewingHistoryPlan && tab === "current" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {!currentPlan ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-sm">暂无进行中的计划</p>
                    <p className="text-xs mt-1 opacity-60">完成AI评估后，计划将显示在这里</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* 计划标题 */}
                  <div className="flex items-center gap-2 px-5 pt-3 pb-1 flex-shrink-0">
                    <span className="text-sm font-semibold">{currentPlan.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">进行中</span>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{planRange(currentPlan.startDate)}
                    </span>
                  </div>
                  <WeekCardsFull
                    weeks={[...currentPlan.weeklyPlans].sort((a, b) => a.week - b.week)}
                    startDate={new Date(currentPlan.startDate)}
                  />
                </>
              )}
            </div>
          )}

          {/* ── 历史计划 Tab ── */}
          {!viewingHistoryPlan && tab === "history" && (
            <div className="flex-1 overflow-y-auto">
              {historyPlans.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <div className="text-4xl mb-3">🗂️</div>
                  <p className="text-sm">暂无历史计划</p>
                  <p className="text-xs mt-1 opacity-60">完成更多计划后，历史记录将显示在这里</p>
                </div>
              ) : (
                historyPlans.map((record, i) => (
                  <button
                    key={record.id}
                    onClick={() => setHistoryDetailId(record.id)}
                    className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors border-b border-border/10"
                  >
                    <div className="h-7 w-7 rounded-lg bg-white/8 flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                      {historyPlans.length - i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold">{record.title}</span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="h-3 w-3" />{planRange(record.startDate)}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))
              )}
              <div className="h-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
