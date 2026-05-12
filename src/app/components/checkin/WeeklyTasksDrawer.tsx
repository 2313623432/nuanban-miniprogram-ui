import { useState } from "react";
import { X, CheckCircle2, Lock, Zap, Calendar, ChevronDown } from "lucide-react";
import type { PlanRecord } from "../../contexts/PlanContext";
import { formatWeekDateRange } from "./WeekCardsSlider";

interface WeeklyTasksDrawerProps {
  planHistory: PlanRecord[];
  currentPlanId?: string;
  onClose: () => void;
}

const PHASE = {
  1: { emoji: "🌱", text: "text-green-500",  dot: "bg-green-500",  badge: "bg-green-500/12 text-green-600"  },
  2: { emoji: "💪", text: "text-blue-500",   dot: "bg-blue-500",   badge: "bg-blue-500/12 text-blue-600"    },
  3: { emoji: "🚀", text: "text-orange-500", dot: "bg-orange-500", badge: "bg-orange-500/12 text-orange-600" },
  4: { emoji: "🏆", text: "text-purple-500", dot: "bg-purple-500", badge: "bg-purple-500/12 text-purple-600" },
} as const;

const WEEK_CN = ["一", "二", "三", "四"];

function fmtDate(d: Date) { return `${d.getMonth() + 1}.${d.getDate()}`; }
function planRange(iso: string) {
  const s = new Date(iso); const e = new Date(s); e.setDate(e.getDate() + 27);
  return `${fmtDate(s)} — ${fmtDate(e)}`;
}

// ── 单周行 ───────────────────────────────────────────────
function WeekRow({ wp, startDate, isLast }: {
  wp: { week: number; phase: string; tasks: string[] };
  startDate: Date;
  isLast: boolean;
}) {
  const now      = Date.now();
  const ws       = startDate.getTime() + (wp.week - 1) * 7 * 86400000;
  const we       = ws + 7 * 86400000 - 1;
  const isFuture = now < ws;
  const isPast   = now > we;
  const isCurrent = !isFuture && !isPast;
  const ph = PHASE[wp.week as 1|2|3|4];

  return (
    <div className="relative flex gap-4">
      {/* 左侧 dot + 竖线 */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 22 }}>
        <div className={`relative z-10 mt-1 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCurrent ? `${ph.dot} shadow-md` : isPast ? "bg-green-500/20 border border-green-500/40" : "bg-white/8 border border-white/15"
        }`}>
          {isCurrent  && <div className="h-2 w-2 rounded-full bg-white" />}
          {isPast     && <CheckCircle2 className="h-3 w-3 text-green-500" />}
          {isFuture   && <Lock className="h-3 w-3 text-muted-foreground" />}
        </div>
        {!isLast && <div className="flex-1 w-px bg-white/10 my-1" />}
      </div>

      {/* 内容 */}
      <div className={`flex-1 pb-5 ${isFuture ? "opacity-45" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-sm">{ph.emoji}</span>
          <span className={`font-semibold text-sm ${isCurrent ? ph.text : "text-foreground/80"}`}>
            第{WEEK_CN[wp.week - 1]}周
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${ph.badge}`}>{wp.phase}</span>
          <span className="text-xs text-muted-foreground">{formatWeekDateRange(startDate, wp.week)}</span>
          {isCurrent && (
            <span className={`text-xs font-medium ${ph.text} flex items-center gap-0.5`}>
              <Zap className="h-3 w-3" />进行中
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {wp.tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`mt-[7px] h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                isPast ? "bg-green-500/60" : isCurrent ? ph.dot + " opacity-70" : "bg-white/20"
              }`} />
              <span className={`text-sm leading-relaxed ${
                isPast ? "text-muted-foreground line-through decoration-muted-foreground/40" :
                isFuture ? "text-muted-foreground/55" : "text-foreground/85"
              }`}>{task}</span>
              {!isFuture && (
                <span className={`ml-auto flex-shrink-0 text-xs font-medium mt-0.5 ${isPast ? "text-green-500/50" : ph.text}`}>
                  +3
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 单份计划区块（仅用于历史Tab）────────────────────────
function PlanBlock({ record, index, total, expanded, onToggle }: {
  record: PlanRecord; index: number; total: number;
  expanded: boolean; onToggle: () => void;
}) {
  const startDate = new Date(record.startDate);
  const weeks = [...record.weeklyPlans].sort((a, b) => b.week - a.week);
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center gap-2.5 px-5 pt-4 pb-2.5 hover:bg-white/5 transition-colors"
      >
        <div className="h-6 w-6 rounded-lg bg-white/8 flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
          {total - index}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold">{record.title}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Calendar className="h-3 w-3" />{planRange(record.startDate)}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <>
          <div className="h-px bg-border/15 mx-5 mb-2" />
          <div className="px-5 pt-2">
            {weeks.map((wp, wi) => (
              <WeekRow key={wp.week} wp={wp} startDate={startDate} isLast={wi === weeks.length - 1} />
            ))}
          </div>
        </>
      )}
      {index < total - 1 && <div className="mx-5 mt-1 mb-1 h-px bg-border/15" />}
    </div>
  );
}

// ── 主组件 ───────────────────────────────────────────────
export function WeeklyTasksDrawer({ planHistory, onClose }: WeeklyTasksDrawerProps) {
  const [tab, setTab] = useState<"current" | "history">("current");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // 从新到旧
  const sorted = [...planHistory].sort((a, b) => b.createdAt - a.createdAt);
  const currentPlan = sorted[0] ?? null;
  const historyPlans = sorted.slice(1); // 排除当前

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
          <span className="font-bold">计划任务</span>
          <button onClick={onClose} className="h-8 w-8 rounded-xl glass-button flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab 切换 */}
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

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">

          {/* ── 当前计划 Tab ── */}
          {tab === "current" && (
            <>
              {!currentPlan ? (
                <div className="py-20 text-center text-muted-foreground">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm">暂无进行中的计划</p>
                  <p className="text-xs mt-1 opacity-60">完成AI评估后，计划将显示在这里</p>
                </div>
              ) : (() => {
                const startDate = new Date(currentPlan.startDate);
                // 4→3→2→1 = 未来→当前→过去
                const weeks = [...currentPlan.weeklyPlans].sort((a, b) => b.week - a.week);
                return (
                  <div>
                    {/* 计划信息行 */}
                    <div className="flex items-center gap-2 px-5 pt-4 pb-2.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{currentPlan.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">进行中</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Calendar className="h-3 w-3" />{planRange(currentPlan.startDate)}
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-border/15 mx-5 mb-2" />
                    {/* 图例 */}
                    <div className="flex items-center gap-4 px-5 py-2">
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
                    <div className="px-5 pt-2">
                      {weeks.map((wp, wi) => (
                        <WeekRow key={wp.week} wp={wp} startDate={startDate} isLast={wi === weeks.length - 1} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* ── 历史计划 Tab ── */}
          {tab === "history" && (
            <>
              {historyPlans.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <div className="text-4xl mb-3">🗂️</div>
                  <p className="text-sm">暂无历史计划</p>
                  <p className="text-xs mt-1 opacity-60">完成更多计划后，历史记录将显示在这里</p>
                </div>
              ) : (
                historyPlans.map((record, i) => (
                  <PlanBlock
                    key={record.id}
                    record={record}
                    index={i}
                    total={historyPlans.length}
                    expanded={expandedIds.has(record.id)}
                    onToggle={() => toggleExpand(record.id)}
                  />
                ))
              )}
            </>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
