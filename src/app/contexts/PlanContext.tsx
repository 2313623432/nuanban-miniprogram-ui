import { createContext, useContext, useState, ReactNode } from 'react';

export interface WeekPlan {
  week: number;
  phase: string;
  tasks: string[];
}

export interface PlanRecord {
  id: string;
  title: string;        // 八个字以内的计划标题
  startDate: string;   // ISO string
  weeklyPlans: WeekPlan[];
  createdAt: number;
}

interface PlanData {
  title: string;        // 八个字以内的计划标题
  tasks: string[];
  weeklyPlans?: WeekPlan[];
  startDate: string;
  createdAt: number;
}

interface PlanContextType {
  planData: PlanData | null;
  planHistory: PlanRecord[];
  setPlanData: (data: PlanData) => void;
  addToPlanHistory: (record: PlanRecord) => void;
  hasPlan: boolean;
  clearPlan: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [planData, setPlanDataState] = useState<PlanData | null>(null);
  const SEED_HISTORY: PlanRecord[] = [
    {
      id: "seed-1",
      title: "控糖调理计划",
      startDate: "2026-03-15T00:00:00.000Z",
      createdAt: 1741996800000,
      weeklyPlans: [
        { week: 1, phase: "适应期", tasks: ["餐后1小时测量血糖并记录","三餐控制主食摄入，选择低GI食物","晚上10点前放下手机，做10分钟拉伸","每天早晨快走30分钟（心率保持适中）","每天喝水1500-2000ml"] },
        { week: 2, phase: "稳定期", tasks: ["餐后1小时测量血糖并记录","三餐控制主食摄入，选择低GI食物","晚上10点前放下手机，做10分钟拉伸","每天早晨快走30分钟（心率保持适中）","每天喝水1500-2000ml"] },
        { week: 3, phase: "提升期", tasks: ["餐后1小时测量血糖并记录","三餐控制主食摄入，选择低GI食物","晚上10点前放下手机，做10分钟拉伸","每天早晨快走30分钟（心率保持适中）","增加10分钟有氧运动，强化体能"] },
        { week: 4, phase: "总结期", tasks: ["餐后1小时测量血糖并记录","三餐控制主食摄入，选择低GI食物","晚上10点前放下手机，做10分钟拉伸","回顾月度健康数据记录","制定下月健康改进目标"] },
      ],
    },
    {
      id: "seed-2",
      title: "安眠调理计划",
      startDate: "2026-02-05T00:00:00.000Z",
      createdAt: 1738713600000,
      weeklyPlans: [
        { week: 1, phase: "适应期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","保持规律作息，每天7-8小时睡眠","每天喝水1500-2000ml"] },
        { week: 2, phase: "稳定期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","保持规律作息，每天7-8小时睡眠","每天喝水1500-2000ml"] },
        { week: 3, phase: "提升期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","保持规律作息，每天7-8小时睡眠","增加10分钟有氧运动，强化体能"] },
        { week: 4, phase: "总结期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","回顾月度健康数据记录","制定下月健康改进目标"] },
      ],
    },
    {
      id: "seed-3",
      title: "降压调理计划",
      startDate: "2026-01-10T00:00:00.000Z",
      createdAt: 1736467200000,
      weeklyPlans: [
        { week: 1, phase: "适应期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","每天早晨快走30分钟（心率保持适中）","每天喝水1500-2000ml"] },
        { week: 2, phase: "稳定期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","每天早晨快走30分钟（心率保持适中）","每天喝水1500-2000ml"] },
        { week: 3, phase: "提升期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","每天早晨快走30分钟（心率保持适中）","增加10分钟有氧运动，强化体能"] },
        { week: 4, phase: "总结期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","晚上10点前放下手机，做10分钟拉伸","回顾月度健康数据记录","制定下月健康改进目标"] },
      ],
    },
    {
      id: "seed-4",
      title: "减脂调理计划",
      startDate: "2025-12-20T00:00:00.000Z",
      createdAt: 1734652800000,
      weeklyPlans: [
        { week: 1, phase: "适应期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","每天快走或慢跑30分钟","保持规律作息，每天7-8小时睡眠","每天喝水1500-2000ml"] },
        { week: 2, phase: "稳定期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","每天快走或慢跑30分钟","保持规律作息，每天7-8小时睡眠","每天喝水1500-2000ml"] },
        { week: 3, phase: "提升期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","每天快走或慢跑30分钟","保持规律作息，每天7-8小时睡眠","增加10分钟有氧运动，强化体能"] },
        { week: 4, phase: "总结期", tasks: ["每天记录健康数据（血压/体重）","均衡饮食，减少油腻和高盐食物","每天快走或慢跑30分钟","回顾月度健康数据记录","制定下月健康改进目标"] },
      ],
    },
  ];

  const [planHistory, setPlanHistory] = useState<PlanRecord[]>(SEED_HISTORY);

  const setPlanData = (data: PlanData) => {
    setPlanDataState(data);
  };

  const addToPlanHistory = (record: PlanRecord) => {
    setPlanHistory(prev => {
      // 避免重复添加（按 id 判断）
      if (prev.some(r => r.id === record.id)) return prev;
      // 最新的放最前
      return [record, ...prev];
    });
  };

  const clearPlan = () => {
    setPlanDataState(null);
  };

  const hasPlan = !!planData;

  return (
    <PlanContext.Provider value={{ planData, planHistory, setPlanData, addToPlanHistory, hasPlan, clearPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
