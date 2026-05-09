import { useRef, useState } from "react";
import { CheckCircle2, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import type { WeekPlan } from "../../contexts/PlanContext";

interface WeekCardsSliderProps {
  weeklyPlans: WeekPlan[];
  currentWeek: number;
  planStartDate: Date;
}

const PHASE_STYLES: Record<number, {
  bg: string; activeBorder: string; text: string; badge: string; dot: string; emoji: string;
}> = {
  1: { bg: "bg-green-500/10",  activeBorder: "border-green-500/50",  text: "text-green-600",  badge: "bg-green-500/15 text-green-600",  dot: "bg-green-500",  emoji: "🌱" },
  2: { bg: "bg-blue-500/10",   activeBorder: "border-blue-500/50",   text: "text-blue-600",   badge: "bg-blue-500/15 text-blue-600",   dot: "bg-blue-500",   emoji: "💪" },
  3: { bg: "bg-orange-500/10", activeBorder: "border-orange-500/50", text: "text-orange-600", badge: "bg-orange-500/15 text-orange-600", dot: "bg-orange-500", emoji: "🚀" },
  4: { bg: "bg-purple-500/10", activeBorder: "border-purple-500/50", text: "text-purple-600", badge: "bg-purple-500/15 text-purple-600", dot: "bg-purple-500", emoji: "🏆" },
};

export function formatWeekDateRange(startDate: Date, weekNum: number): string {
  const s = new Date(startDate);
  s.setDate(s.getDate() + (weekNum - 1) * 7);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
  return `${fmt(s)}-${fmt(e)}`;
}

export function WeekCardsSlider({ weeklyPlans, currentWeek, planStartDate }: WeekCardsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(currentWeek - 1);

  const scrollTo = (idx: number) => {
    const el = scrollRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIdx(idx);
  };

  return (
    <div className="space-y-3">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">本次计划</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            28天 · 4周
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
            className="h-7 w-7 rounded-lg glass-button flex items-center justify-center disabled:opacity-30"
            disabled={activeIdx === 0}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(weeklyPlans.length - 1, activeIdx + 1))}
            className="h-7 w-7 rounded-lg glass-button flex items-center justify-center disabled:opacity-30"
            disabled={activeIdx === weeklyPlans.length - 1}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 横向滑动卡片 */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const cardWidth = el.scrollWidth / weeklyPlans.length;
          const idx = Math.round(el.scrollLeft / cardWidth);
          setActiveIdx(Math.min(Math.max(idx, 0), weeklyPlans.length - 1));
        }}
      >
        {weeklyPlans.map((wp) => {
          const style = PHASE_STYLES[wp.week] || PHASE_STYLES[1];
          const isCurrent = wp.week === currentWeek;
          const isPast    = wp.week < currentWeek;
          const isFuture  = wp.week > currentWeek;
          const dateRange = formatWeekDateRange(planStartDate, wp.week);

          return (
            <div
              key={wp.week}
              className={`flex-none w-44 glass-card rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                isCurrent
                  ? `${style.bg} ${style.activeBorder}`
                  : isPast
                    ? "border-white/10 opacity-70"
                    : "border-white/10 opacity-60"
              }`}
              style={{ scrollSnapAlign: "start" }}
              onClick={() => scrollTo(wp.week - 1)}
            >
              {/* 周 + emoji */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{style.emoji}</span>
                  <span className={`text-sm font-bold ${isCurrent ? style.text : "text-foreground"}`}>
                    第{["一","二","三","四"][wp.week - 1]}周
                  </span>
                </div>
                {isPast && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />}
                {isFuture && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
              </div>

              {/* 日期范围 */}
              <div className="text-xs text-muted-foreground mb-2">{dateRange}</div>

              {/* 阶段标签 */}
              <div className={`text-xs font-medium px-2 py-0.5 rounded-lg inline-block mb-2 ${style.badge}`}>
                {wp.phase}
              </div>

              {/* 任务数 */}
              <div className="text-xs text-muted-foreground">
                {wp.tasks.length} 项任务
              </div>

              {/* 状态 */}
              <div className="mt-2 pt-2 border-t border-white/10">
                {isCurrent && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${style.text}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${style.dot} animate-pulse`} />
                    进行中
                  </div>
                )}
                {isPast && <div className="text-xs text-green-500 font-medium">✓ 已完成</div>}
                {isFuture && <div className="text-xs text-muted-foreground">未开始</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* 点位指示器 */}
      <div className="flex justify-center gap-1.5">
        {weeklyPlans.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIdx ? "w-5 bg-primary" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
