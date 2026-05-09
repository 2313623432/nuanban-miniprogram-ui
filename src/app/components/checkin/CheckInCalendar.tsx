import { X, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

interface CheckInCalendarProps {
  onClose: () => void;
}

export function CheckInCalendar({ onClose }: CheckInCalendarProps) {
  const [checkedDates] = useState<string[]>([
    "2026-05-01",
    "2026-05-02",
    "2026-05-03",
    "2026-05-05",
    "2026-05-06",
    "2026-05-07",
  ]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const isCheckedIn = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return checkedDates.includes(dateStr);
  };

  const isToday = (day: number) => day === currentDay;

  // 判断是否是"缺卡"：今天之前的日期且没有打卡记录
  const isMissed = (day: number) => {
    if (day >= currentDay) return false;
    return !isCheckedIn(day);
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const checkedCount = checkedDates.filter(date =>
    date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
  ).length;

  // 计算本月缺卡天数（今天之前）
  const missedCount = Array.from({ length: currentDay - 1 }, (_, i) => i + 1)
    .filter(d => !isCheckedIn(d)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 animate-in zoom-in-95 slide-in-from-bottom-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 rounded-xl glass-button flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-1">打卡日历</h2>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>{currentYear}年{currentMonth + 1}月</span>
            <span className="text-green-600 font-medium">✓ 已打卡 {checkedCount} 天</span>
            {missedCount > 0 && (
              <span className="text-red-500 font-medium">✗ 缺卡 {missedCount} 天</span>
            )}
          </div>
        </div>

        {/* 日历 */}
        <div className="glass-card rounded-2xl p-4 mb-4">
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const checked = isCheckedIn(day);
              const todayDay = isToday(day);
              const missed = isMissed(day);

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative text-sm font-medium transition-all ${
                    todayDay
                      ? "glass-button border-2 border-primary"
                      : checked
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md"
                      : missed
                      ? "glass-button border border-red-400/30 bg-red-500/5"
                      : "glass-button text-muted-foreground"
                  }`}
                >
                  <span className={`relative z-10 text-xs font-bold ${missed ? 'text-muted-foreground' : ''}`}>
                    {day}
                  </span>
                  {checked && (
                    <CheckCircle2 className="absolute top-0.5 right-0.5 h-3 w-3 text-white" />
                  )}
                  {missed && (
                    <span className="text-red-500 text-[8px] font-bold leading-none mt-0.5">缺卡</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 图例说明 */}
        <div className="glass-card rounded-2xl p-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">已打卡</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg glass-button border-2 border-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{currentDay}</span>
            </div>
            <span className="text-sm text-muted-foreground">今天</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg glass-button border border-red-400/30 bg-red-500/5 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xs text-muted-foreground font-bold leading-none">1</span>
              <span className="text-red-500 text-[7px] font-bold leading-none">缺卡</span>
            </div>
            <span className="text-sm text-red-500 font-medium">缺卡</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg glass-button flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-muted-foreground">1</span>
            </div>
            <span className="text-sm text-muted-foreground">未来</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl glass-button font-medium"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
