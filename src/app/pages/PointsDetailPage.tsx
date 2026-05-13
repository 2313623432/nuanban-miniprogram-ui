import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingDown, Calendar, Award, Gift, Filter, X } from "lucide-react";

interface PointsRecord {
  id: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  date: string;
  time: string;
}

export function PointsDetailPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "earn" | "spend">("all");

  // 时间筛选
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const records: PointsRecord[] = [
    // 2026年5月
    { id: "1",  type: "earn",  amount: 9,  description: "打卡任务：早餐后散步30分钟",  date: "2026-05-07", time: "08:30" },
    { id: "2",  type: "earn",  amount: 9,  description: "打卡任务：午餐后测血糖",       date: "2026-05-07", time: "13:20" },
    { id: "3",  type: "earn",  amount: 9,  description: "打卡任务：晚餐控制主食摄入",   date: "2026-05-07", time: "19:45" },
    { id: "10", type: "earn",  amount: 20, description: "连续打卡3天奖励",              date: "2026-05-07", time: "20:00" },
    { id: "4",  type: "spend", amount: 80, description: "兑换：养生茶礼盒",             date: "2026-05-06", time: "15:30" },
    { id: "5",  type: "earn",  amount: 9,  description: "打卡任务：早餐后散步30分钟",  date: "2026-05-06", time: "08:15" },
    { id: "6",  type: "earn",  amount: 9,  description: "打卡任务：午餐后测血糖",       date: "2026-05-06", time: "13:10" },
    { id: "7",  type: "earn",  amount: 50, description: "邀请好友注册成功",             date: "2026-05-05", time: "16:20" },
    { id: "8",  type: "spend", amount: 50, description: "兑换：7天会员体验卡",          date: "2026-05-05", time: "10:00" },
    { id: "9",  type: "earn",  amount: 9,  description: "打卡任务：早餐后散步30分钟",  date: "2026-05-05", time: "08:25" },
    // 2026年4月
    { id: "11", type: "earn",  amount: 9,  description: "打卡任务：晨间快走30分钟",     date: "2026-04-28", time: "07:50" },
    { id: "12", type: "earn",  amount: 9,  description: "打卡任务：午餐控糖饮食",       date: "2026-04-28", time: "12:30" },
    { id: "13", type: "earn",  amount: 20, description: "连续打卡7天奖励",              date: "2026-04-28", time: "20:00" },
    { id: "14", type: "spend", amount: 30, description: "兑换：健康食谱电子书",         date: "2026-04-25", time: "14:20" },
    { id: "15", type: "earn",  amount: 9,  description: "打卡任务：晚间拉伸放松",       date: "2026-04-25", time: "21:00" },
    { id: "16", type: "spend", amount: 100,description: "兑换：智能体脂秤",             date: "2026-04-20", time: "11:30" },
    // 2026年3月
    { id: "17", type: "earn",  amount: 9,  description: "打卡任务：记录三餐饮食",       date: "2026-03-30", time: "19:00" },
    { id: "18", type: "earn",  amount: 9,  description: "打卡任务：喝水2000ml",         date: "2026-03-30", time: "10:00" },
    { id: "19", type: "earn",  amount: 50, description: "邀请好友注册成功",             date: "2026-03-28", time: "17:30" },
    { id: "20", type: "spend", amount: 60, description: "兑换：血糖仪试纸套装",         date: "2026-03-15", time: "09:45" },
  ];

  // 可用的年份列表
  const availableYears = useMemo(() => {
    const years = new Set(records.map(r => r.date.slice(0, 4)));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, []);

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    let result = records;

    // 自定义时间段
    if (showCustom && customStart && customEnd) {
      result = result.filter(r => r.date >= customStart && r.date <= customEnd);
    } else {
      // 年份筛选
      if (selectedYear !== "all") {
        result = result.filter(r => r.date.startsWith(selectedYear));
      }
      // 月份筛选
      if (selectedMonth !== "all") {
        const ym = selectedYear !== "all" ? selectedYear : "2026";
        result = result.filter(r => r.date.startsWith(`${ym}-${selectedMonth.padStart(2, "0")}`));
      }
    }

    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedYear, selectedMonth, customStart, customEnd, showCustom]);

  const groupByDate = (recs: PointsRecord[]) =>
    recs.reduce((groups, record) => {
      const date = record.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(record);
      return groups;
    }, {} as Record<string, PointsRecord[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "今天";
    if (date.toDateString() === yesterday.toDateString()) return "昨天";
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getDayStats = (dateRecords: PointsRecord[]) => {
    const earned = dateRecords.filter(r => r.type === "earn").reduce((s, r) => s + r.amount, 0);
    const spent = dateRecords.filter(r => r.type === "spend").reduce((s, r) => s + r.amount, 0);
    return { earned, spent, net: earned - spent };
  };

  // 合并打卡记录（用于"全部"和"收入"tab）
  const mergeCheckInRecords = (dateRecords: PointsRecord[]) => {
    const checkInRecords = dateRecords.filter(r => r.description.includes("打卡任务"));
    const otherRecords   = dateRecords.filter(r => !r.description.includes("打卡任务"));
    return { checkInRecords, otherRecords };
  };

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedMonth("all");
    setCustomStart("");
    setCustomEnd("");
    setShowCustom(false);
  };

  const hasActiveFilter = selectedYear !== "all" || selectedMonth !== "all" || (showCustom && customStart && customEnd);

  // 渲染"全部"tab：打卡合并，日期头显示收支
  const renderAllTab = () => {
    const grouped = groupByDate(filteredRecords);
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) return <EmptyState />;

    return (
      <div className="space-y-4">
        {sortedDates.map(date => {
          const dateRecords = grouped[date];
          const { earned, spent } = getDayStats(dateRecords);
          const { checkInRecords, otherRecords } = mergeCheckInRecords(dateRecords);
          const checkInTotal = checkInRecords.reduce((s, r) => s + r.amount, 0);

          return (
            <div key={date} className="space-y-2">
              {/* 日期标题 — 显示收入和支出 */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatDate(date)}</span>
                    <span className="text-sm text-muted-foreground">{date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {earned > 0 && (
                      <span className="text-green-600 font-medium">收入 +{earned}</span>
                    )}
                    {spent > 0 && (
                      <span className="text-red-600 font-medium">支出 -{spent}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 打卡任务合并行 */}
              {checkInTotal > 0 && (
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-0.5">打卡积分</div>
                    <div className="text-xs text-muted-foreground">共 {checkInRecords.length} 项打卡</div>
                  </div>
                  <span className="text-green-600 font-bold text-base flex-shrink-0">+{checkInTotal}</span>
                </div>
              )}

              {/* 其他记录逐条列出 */}
              {otherRecords.map(record => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染"支出"tab
  const renderSpendTab = () => {
    const spendRecords = filteredRecords.filter(r => r.type === "spend");
    const grouped = groupByDate(spendRecords);
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) return <EmptyState />;

    return (
      <div className="space-y-4">
        {sortedDates.map(date => {
          const dateRecords = grouped[date];
          const { spent } = getDayStats(dateRecords);
          return (
            <div key={date} className="space-y-2">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatDate(date)}</span>
                  </div>
                  <span className="text-red-600 font-medium text-sm">支出 -{spent} 积分</span>
                </div>
              </div>
              {dateRecords.map(record => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染"收入"tab
  const renderEarnTab = () => {
    const earnRecords = filteredRecords.filter(r => r.type === "earn");
    const grouped = groupByDate(earnRecords);
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) return <EmptyState />;

    return (
      <div className="space-y-4">
        {sortedDates.map(date => {
          const dateRecords = grouped[date];
          const { earned } = getDayStats(dateRecords);
          const { checkInRecords, otherRecords } = mergeCheckInRecords(dateRecords);
          const checkInTotal = checkInRecords.reduce((s, r) => s + r.amount, 0);

          return (
            <div key={date} className="space-y-2">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatDate(date)}</span>
                  </div>
                  <span className="text-green-600 font-medium text-sm">+{earned} 积分</span>
                </div>
              </div>

              {checkInTotal > 0 && (
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-0.5">打卡积分</div>
                    <div className="text-xs text-muted-foreground">共 {checkInRecords.length} 项打卡</div>
                  </div>
                  <span className="text-green-600 font-bold text-base flex-shrink-0">+{checkInTotal}</span>
                </div>
              )}

              {otherRecords.map(record => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-6">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 glass-header border-b border-white/10 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold flex-1">积分明细</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* 筛选标签 */}
        <div className="flex gap-2">
          {(["all", "earn", "spend"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                filter === tab
                  ? "glass-button text-primary shadow-md"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {tab === "all" ? "全部" : tab === "earn" ? "收入" : "支出"}
            </button>
          ))}
        </div>

        {/* 时间筛选栏 */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4 text-primary" />
              <span>时间筛选</span>
            </div>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <X className="h-3 w-3" />清除筛选
              </button>
            )}
          </div>

          {/* 年份 + 月份选择 */}
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); setShowCustom(false); }}
              disabled={showCustom}
              className="flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium focus:outline-none focus:border-primary/50 disabled:opacity-40"
            >
              <option value="all">全部年份</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={e => { setSelectedMonth(e.target.value); setShowCustom(false); }}
              disabled={showCustom}
              className="flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium focus:outline-none focus:border-primary/50 disabled:opacity-40"
            >
              <option value="all">全部月份</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
              ))}
            </select>
          </div>

          {/* 自定义时间段切换 */}
          <div className="border-t border-white/10 pt-3">
            <button
              onClick={() => {
                setShowCustom(!showCustom);
                if (!showCustom) {
                  setSelectedYear("all");
                  setSelectedMonth("all");
                } else {
                  setCustomStart("");
                  setCustomEnd("");
                }
              }}
              className={`text-xs font-medium transition-colors ${showCustom ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {showCustom ? "关闭自定义时间段" : "自定义时间段"}
            </button>

            {showCustom && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="date"
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                  max="2026-12-31"
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
                  placeholder="开始日期"
                />
                <span className="text-xs text-muted-foreground flex-shrink-0">至</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)}
                  max="2026-12-31"
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
                  placeholder="结束日期"
                />
              </div>
            )}

            {/* 自定义时间段快捷预设 */}
            {showCustom && (
              <div className="flex gap-2 mt-2">
                {([
                  { label: "最近7天", getRange: () => { const s = new Date(); s.setDate(s.getDate() - 7); return { s, e: new Date() }; } },
                  { label: "最近30天", getRange: () => { const s = new Date(); s.setDate(s.getDate() - 30); return { s, e: new Date() }; } },
                  { label: "本月", getRange: () => { const s = new Date(); s.setDate(1); return { s, e: new Date() }; } },
                ] as const).map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const { s, e } = preset.getRange();
                      setCustomStart(s.toISOString().slice(0, 10));
                      setCustomEnd(e.toISOString().slice(0, 10));
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 筛选结果提示 */}
        {(showCustom && customStart && customEnd) && (
          <div className="text-center text-xs text-muted-foreground">
            {formatDateFull(customStart)} — {formatDateFull(customEnd)} · 共 {filteredRecords.length} 条记录
          </div>
        )}

        {/* 内容 */}
        {filter === "all" && renderAllTab()}
        {filter === "earn" && renderEarnTab()}
        {filter === "spend" && renderSpendTab()}
      </div>
    </div>
  );
}

function RecordItem({ record }: { record: { id: string; type: "earn" | "spend"; amount: number; description: string; time: string } }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        record.type === "earn" ? "bg-green-500/10" : "bg-red-500/10"
      }`}>
        {record.type === "earn" ? (
          record.description.includes("邀请") ? (
            <Gift className="h-5 w-5 text-green-600" />
          ) : (
            <Award className="h-5 w-5 text-green-600" />
          )
        ) : (
          <TrendingDown className="h-5 w-5 text-red-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium mb-0.5 line-clamp-1 text-sm">{record.description}</div>
        <div className="text-xs text-muted-foreground">{record.time}</div>
      </div>
      <div className={`text-base font-bold flex-shrink-0 ${
        record.type === "earn" ? "text-green-600" : "text-red-600"
      }`}>
        {record.type === "earn" ? "+" : "-"}{record.amount}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card rounded-2xl p-12 text-center">
      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground">暂无积分记录</p>
    </div>
  );
}
