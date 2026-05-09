import { useState } from "react";
import { TabBar } from "../components/layout/TabBar";
import { HealthCheckInTab } from "../components/checkin/HealthCheckInTab";
import { PointsMallTab } from "../components/checkin/PointsMallTab";

export function CheckInPage() {
  const [activeTab, setActiveTab] = useState<"checkin" | "mall">("checkin");

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部标签切换 */}
      <div className="sticky top-0 z-40 glass-header border-b-0 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("checkin")}
              className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                activeTab === "checkin"
                  ? "glass-button text-primary shadow-md"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              健康打卡
            </button>
            <button
              onClick={() => setActiveTab("mall")}
              className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                activeTab === "mall"
                  ? "glass-button text-primary shadow-md"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              积分商城
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-2xl mx-auto">
        {activeTab === "checkin" ? <HealthCheckInTab /> : <PointsMallTab />}
      </div>

      <TabBar />
    </div>
  );
}
