import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingDown, Calendar, Award, Gift } from "lucide-react";

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

  const records: PointsRecord[] = [
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
  ];

  // 按日期分组（用于"全部"和"支出"tab）
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

  const getDayStats = (dateRecords: PointsRecord[]) => {
    const earned = dateRecords.filter(r => r.type === "earn").reduce((s, r) => s + r.amount, 0);
    const spent = dateRecords.filter(r => r.type === "spend").reduce((s, r) => s + r.amount, 0);
    return { earned, spent, net: earned - spent };
  };

  // 计算每日剩余积分（用于"全部"tab）
  // 当前总积分125，从最新往前倒推
  const computeDayBalance = () => {
    const allRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
    const dateGroups = groupByDate(allRecords);
    const sortedDates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));

    let runningBalance = 125; // 当前余额（最新日期末尾）
    const balanceMap: Record<string, number> = {};

    for (const date of sortedDates) {
      balanceMap[date] = runningBalance;
      const { net } = getDayStats(dateGroups[date]);
      runningBalance -= net; // 往前推
    }
    return balanceMap;
  };

  const dayBalanceMap = computeDayBalance();

  // 渲染"全部"tab：每天显示剩余积分，展示所有明细
  const renderAllTab = () => {
    const grouped = groupByDate(records);
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    return (
      <div className="space-y-4">
        {sortedDates.map(date => {
          const dateRecords = grouped[date];
          const balance = dayBalanceMap[date] ?? 0;
          return (
            <div key={date} className="space-y-2">
              {/* 日期标题 - 显示剩余积分 */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatDate(date)}</span>
                    <span className="text-sm text-muted-foreground">{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">剩余</span>
                    <span className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {balance}
                    </span>
                    <span className="text-xs text-muted-foreground">积分</span>
                  </div>
                </div>
              </div>
              {/* 明细 */}
              {dateRecords.map(record => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染"支出"tab：只展示支出记录，日期头只显示支出额度
  const renderSpendTab = () => {
    const spendRecords = records.filter(r => r.type === "spend");
    const grouped = groupByDate(spendRecords);
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    return (
      <div className="space-y-4">
        {sortedDates.map(date => {
          const dateRecords = grouped[date];
          const { spent } = getDayStats(dateRecords);
          return (
            <div key={date} className="space-y-2">
              {/* 日期标题 - 只显示支出 */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatDate(date)}</span>
                  </div>
                  <span className="text-red-600 font-medium text-sm">-{spent} 积分</span>
                </div>
              </div>
              {dateRecords.map(record => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          );
        })}
        {spendRecords.length === 0 && <EmptyState />}
      </div>
    );
  };

  // 渲染"收入"tab：日期头显示当日总收入，打卡任务合并为一条，其余逐条列出
  const renderEarnTab = () => {
    const earnRecords = records.filter(r => r.type === "earn");
    const grouped = groupByDate(earnRecords);
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    return (
      <div className="space-y-4">
        {sortedDates.map(date => {
          const dateRecords = grouped[date];
          const { earned } = getDayStats(dateRecords);

          // 打卡任务合并
          const checkInRecords = dateRecords.filter(r => r.description.includes("打卡任务"));
          const otherRecords   = dateRecords.filter(r => !r.description.includes("打卡任务"));
          const checkInTotal   = checkInRecords.reduce((s, r) => s + r.amount, 0);

          return (
            <div key={date} className="space-y-2">
              {/* 日期标题 */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatDate(date)}</span>
                  </div>
                  <span className="text-green-600 font-medium text-sm">+{earned} 积分</span>
                </div>
              </div>

              {/* 打卡任务合并行 */}
              {checkInTotal > 0 && (
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-0.5">打卡任务</div>
                    <div className="text-xs text-muted-foreground">共 {checkInRecords.length} 项打卡</div>
                  </div>
                  <span className="text-green-600 font-bold text-base flex-shrink-0">+{checkInTotal}</span>
                </div>
              )}

              {/* 其他收入逐条列出 */}
              {otherRecords.map(record => (
                <RecordItem key={record.id} record={record} />
              ))}
            </div>
          );
        })}
        {earnRecords.length === 0 && <EmptyState />}
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