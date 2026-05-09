import { createContext, useContext, useState, ReactNode } from 'react';

export interface WeekPlan {
  week: number;
  phase: string;
  tasks: string[];
}

export interface PlanRecord {
  id: string;
  startDate: string;   // ISO string
  weeklyPlans: WeekPlan[];
  createdAt: number;
}

interface PlanData {
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
  const [planHistory, setPlanHistory] = useState<PlanRecord[]>([]);

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
