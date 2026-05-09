# AI 建议生成健康计划功能说明

## 功能概述

用户可以通过首页健康工具的 AI 对话获取健康建议，并将建议中的可执行任务自动生成为健康计划。系统支持首次创建和更新已有计划两种场景，确保用户健康习惯的持续优化。

## 一、完整流程

### 1.1 主流程图

```
用户使用首页健康工具
        ↓
获取完整 AI 健康建议
        ↓
点击「创建健康计划」/「更新健康计划」按钮
        ↓
系统提取可执行动作
        ↓
    是否已有计划？
     ├─ 否（首次创建）→ 直接创建计划 → 任务立即加入 → 当日即可打卡
     └─ 是（已有计划）→ 弹出确认弹窗
              ↓
         用户二次确认
              ↓
          确认更新？
           ├─ 是 → 新任务暂存 → 次日 00:00 生效 → 覆盖冲突任务
           └─ 否 → 取消更新 → 不修改原计划
```

### 1.2 详细步骤

**步骤 1：获取 AI 建议**
- 用户从首页任意健康工具（睡眠分析、饮食建议等）获取完整 AI 健康建议
- 建议内容包含可执行的健康动作

**步骤 2：查看建议卡片**
- 建议底部显示 `AIAdviceCard` 组件
- 组件展示：
  - AI 健康建议内容
  - 来源工具名称标签
  - 操作按钮（「创建健康计划」或「更新健康计划」）

**步骤 3：点击按钮**
- 系统自动提取建议中的可执行任务
- 检测用户计划状态

**步骤 4：系统实时校验**

**4.1 首次创建任务：**
- 条件：`hasExistingPlan = false`
- 行为：
  - 直接展示「创建健康计划」按钮（带 Plus 图标）
  - 点击后任务立即加入当前计划
  - 提示：「任务已加入当前计划，今日即可打卡」
  - 自动跳转至健行页面

**4.2 已有进行中的计划：**
- 条件：`hasExistingPlan = true`
- 行为：
  - 展示「更新健康计划」按钮（带 CheckCircle2 图标）
  - 点击后弹出二次确认弹窗
  - 显示新任务数量和生效时间
  - 说明更新规则

**步骤 5：用户二次确认操作**

**5.1 点击「确认更新」：**
- 新任务暂存系统
- 次日 00:00 自动生效
- 与原计划冲突的任务被覆盖
- 提示：「更新成功，新任务次日生效」
- 跳转至健行页面

**5.2 点击「取消」：**
- 终止计划更新流程
- 不修改原有进行中的计划
- 不生成新任务
- 提示：「已取消计划更新」

**步骤 6：多次更新处理**
- 当日内用户多次触发计划更新
- 系统仅保留最后一次确认更新的任务内容
- 之前的待生效任务被覆盖

**步骤 7：次日自动生效**
- 次日 00:00，系统自动执行
- 将最新的任务内容同步至当前计划
- 生成当日打卡任务
- 用户可立即开始打卡

## 二、核心组件

### 2.1 AIAdviceCard 组件

**功能：**
展示 AI 健康建议，并提供创建/更新计划的入口。

**参数：**
```typescript
interface AIAdviceCardProps {
  advice: string;           // AI 建议内容
  toolName: string;         // 来源工具名称
  hasExistingPlan?: boolean; // 是否已有计划（默认 false）
  onAccept?: () => void;    // 接受回调
}
```

**使用示例：**
```tsx
import { AIAdviceCard } from "./components/checkin/AIAdviceCard";

// 首次创建场景
<AIAdviceCard 
  advice="建议每晚11点前入睡，每日运动30分钟..."
  toolName="睡眠分析"
  hasExistingPlan={false}
/>

// 更新计划场景
<AIAdviceCard 
  advice="建议增加冥想练习，每日饮水2000ml..."
  toolName="健康评估"
  hasExistingPlan={true}
/>
```

**状态逻辑：**
```typescript
const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
const [extractedTasks, setExtractedTasks] = useState<string[]>([]);

const handleAcceptAdvice = () => {
  const tasks = extractTasksFromAdvice(advice);
  
  if (hasExistingPlan) {
    // 已有计划：弹出确认弹窗
    setShowUpdateConfirmModal(true);
  } else {
    // 首次创建：直接创建
    handleCreatePlan(tasks);
  }
};
```

### 2.2 PlanUpdateConfirmModal 组件

**功能：**
用户已有计划时，弹出二次确认弹窗，说明更新规则。

**参数：**
```typescript
interface PlanUpdateConfirmModalProps {
  newTasksCount: number;  // 新任务数量
  onConfirm: () => void;  // 确认更新
  onCancel: () => void;   // 取消更新
}
```

**展示内容：**
- 新任务数量
- 生效时间（明天 00:00）
- 任务类型（AI 智能任务）
- 更新规则说明：
  - 新任务次日生效
  - 冲突任务被覆盖
  - 今日任务不受影响
  - 多次更新仅保留最后一次

## 三、任务提取逻辑

### 3.1 提取规则

系统通过关键词匹配，从 AI 建议中提取可执行任务：

```typescript
const extractTasksFromAdvice = (text: string): string[] => {
  const tasks: string[] = [];

  if (text.includes("睡眠") || text.includes("入睡")) {
    tasks.push("晚上11点前入睡");
  }

  if (text.includes("运动") || text.includes("锻炼")) {
    tasks.push("完成30分钟有氧运动");
  }

  if (text.includes("饮食") || text.includes("营养")) {
    tasks.push("摄入足量蔬菜水果");
  }

  if (text.includes("喝水") || text.includes("补水")) {
    tasks.push("饮水达到2000ml");
  }

  if (text.includes("冥想") || text.includes("放松")) {
    tasks.push("冥想10分钟");
  }

  return tasks.slice(0, 5); // 最多提取 5 条任务
};
```

### 3.2 任务类型

提取的任务统一标记为：
- 类型：`auto`（自动任务）
- 积分：3 积分/条
- 需要照片验证：`requiresPhoto: true`

## 四、数据流转

### 4.1 首次创建流程

```
点击「创建健康计划」
        ↓
提取任务（3-5 条）
        ↓
生成任务对象
        ↓
加入当前计划
        ↓
任务状态：pending
        ↓
用户可立即打卡
```

### 4.2 更新计划流程

```
点击「更新健康计划」
        ↓
弹出确认弹窗
        ↓
显示新任务信息
        ↓
用户点击「确认更新」
        ↓
新任务暂存至系统
        ↓
标记生效时间：次日 00:00
        ↓
次日定时任务执行
        ↓
对比新旧任务
        ↓
覆盖冲突任务
        ↓
生成当日打卡任务
```

### 4.3 状态字段

**计划状态：**
- `hasExistingPlan`: boolean - 是否已有计划
- `planId`: string - 当前计划 ID
- `planStatus`: "active" | "pending" | "completed" - 计划状态

**任务状态：**
- `taskId`: string - 任务 ID
- `content`: string - 任务内容
- `type`: "auto" | "manual" - 任务类型
- `status`: "pending" | "completed" - 完成状态
- `effectiveDate`: string - 生效日期（格式：YYYY-MM-DD）

**待生效任务：**
- `pendingTasks`: Task[] - 待次日生效的任务列表
- `lastUpdateTime`: string - 最后更新时间
- `effectiveTime`: string - 生效时间（次日 00:00）

## 五、边界情况处理

### 5.1 无可执行任务

**场景：**
AI 建议中没有可提取的任务关键词

**处理：**
- 提示：「该建议暂无可执行任务」
- 不创建计划
- 不跳转页面

### 5.2 任务提取上限

**场景：**
AI 建议包含多个可执行动作

**处理：**
- 仅提取前 5 条任务
- 优先级：睡眠 > 运动 > 饮食 > 喝水 > 冥想

### 5.3 多次更新

**场景：**
用户在同一天内多次点击「更新健康计划」

**处理：**
- 第一次：暂存任务 A
- 第二次：暂存任务 B，覆盖任务 A
- 第三次：暂存任务 C，覆盖任务 B
- 次日 00:00：仅任务 C 生效

### 5.4 当日任务保护

**场景：**
用户更新计划，但今日已有部分任务完成

**处理：**
- 今日任务不受影响
- 已完成的任务保持状态
- 新任务次日才生效
- 提示：「今日任务不受影响，可继续打卡」

### 5.5 冲突任务覆盖

**场景：**
新任务与原计划中的任务内容相同或冲突

**处理：**
- 以新任务为准，覆盖原任务
- 示例：
  - 原任务：「完成20分钟运动」
  - 新任务：「完成30分钟有氧运动」
  - 结果：保留新任务

## 六、用户体验优化

### 6.1 文案设计

**首次创建：**
- 按钮：「创建健康计划」+ Plus 图标
- 提示：「系统将自动提取可执行动作，生成今日健行任务」
- 成功：「已生成 X 条健行任务！任务已加入当前计划，今日即可打卡」

**更新计划：**
- 按钮：「更新健康计划」+ CheckCircle2 图标
- 提示：「更新后新任务将于次日 00:00 生效，今日任务不受影响」
- 成功：「更新成功，新任务次日生效 · 明天00:00将自动更新您的健康计划」

### 6.2 视觉差异

**按钮颜色：**
- 两种场景均使用渐变色按钮（`from-primary to-secondary`）
- 通过图标区分：Plus（创建）vs CheckCircle2（更新）

**弹窗设计：**
- 蓝色提示卡片突出「已有计划」状态
- 绿色对勾强调更新规则
- 明确显示生效时间和任务数量

### 6.3 引导提示

**首次创建后：**
- Toast 提示：「已生成 X 条健行任务！」
- 描述：「任务已加入当前计划，今日即可打卡」
- 1 秒后自动跳转至健行页面

**更新计划后：**
- Toast 提示：「更新成功，新任务次日生效」
- 描述：「明天00:00将自动更新您的健康计划」
- 0.5 秒后跳转至健行页面

**取消更新后：**
- Toast 提示：「已取消计划更新」
- 不跳转，用户可继续浏览

## 七、技术实现

### 7.1 文件清单

**核心组件：**
- `/src/app/components/checkin/AIAdviceCard.tsx` - AI 建议卡片
- `/src/app/components/checkin/PlanUpdateConfirmModal.tsx` - 更新确认弹窗

**状态管理：**
- 使用 React Hooks（useState）管理本地状态
- `hasExistingPlan` 判断是否已有计划
- `extractedTasks` 暂存提取的任务列表

### 7.2 集成示例

**在健康工具页面中使用：**

```tsx
import { useState } from "react";
import { AIAdviceCard } from "../components/checkin/AIAdviceCard";

export function HealthToolPage() {
  const [hasExistingPlan, setHasExistingPlan] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  // 模拟 AI 生成建议
  const handleGetAdvice = async () => {
    const advice = "建议每晚11点前入睡，保持充足睡眠；每日进行30分钟有氧运动...";
    setAiAdvice(advice);
  };

  return (
    <div>
      <button onClick={handleGetAdvice}>获取 AI 建议</button>

      {aiAdvice && (
        <AIAdviceCard
          advice={aiAdvice}
          toolName="睡眠分析"
          hasExistingPlan={hasExistingPlan}
          onAccept={() => {
            setHasExistingPlan(true); // 标记已有计划
          }}
        />
      )}
    </div>
  );
}
```

### 7.3 待 Supabase 实现

**当前模拟功能：**
- ✅ AI 建议展示
- ✅ 任务提取逻辑
- ✅ 首次创建/更新判断
- ✅ 确认弹窗交互
- ✅ Toast 提示

**后端需实现：**
- ❌ 计划状态持久化
- ❌ 任务暂存与定时生效
- ❌ 冲突任务检测与覆盖
- ❌ 次日 00:00 定时任务
- ❌ 多次更新去重逻辑
- ❌ 任务同步至打卡列表

## 八、定时任务设计

### 8.1 定时任务执行

**触发时间：**
- 每日 00:00:00（服务器时间）

**执行逻辑：**
```typescript
async function dailyPlanUpdateTask() {
  // 1. 查询所有有待生效任务的用户
  const usersWithPendingTasks = await getPendingTaskUsers();

  for (const user of usersWithPendingTasks) {
    // 2. 获取用户的待生效任务
    const pendingTasks = user.pendingTasks;

    // 3. 获取当前计划的任务
    const currentTasks = user.currentPlan.tasks;

    // 4. 对比并覆盖冲突任务
    const updatedTasks = mergeAndOverrideTasks(currentTasks, pendingTasks);

    // 5. 更新当前计划
    await updateUserPlan(user.id, updatedTasks);

    // 6. 清空待生效任务
    await clearPendingTasks(user.id);

    // 7. 推送通知（可选）
    await sendNotification(user.id, "您的健康计划已更新，快去打卡吧！");
  }
}
```

### 8.2 冲突检测规则

**判断标准：**
- 任务内容包含相同关键词
- 任务类型均为 `auto`
- 任务时间范围重叠

**示例：**
- 原任务：「完成20分钟运动」
- 新任务：「完成30分钟有氧运动」
- 判断：均包含「运动」关键词
- 结果：新任务覆盖原任务

## 九、使用说明

### 9.1 测试流程

**场景 1：首次创建计划**
1. 进入任意健康工具页面
2. 使用 `AIAdviceCard` 组件，设置 `hasExistingPlan={false}`
3. 点击「创建健康计划」按钮
4. 查看 Toast 提示「已生成 X 条健行任务！」
5. 自动跳转至健行页面

**场景 2：更新已有计划**
1. 设置 `hasExistingPlan={true}`
2. 点击「更新健康计划」按钮
3. 弹出确认弹窗，查看新任务信息
4. 点击「确认更新」
5. 查看 Toast 提示「更新成功，新任务次日生效」
6. 跳转至健行页面

**场景 3：取消更新**
1. 点击「更新健康计划」按钮
2. 弹出确认弹窗
3. 点击「取消」
4. 查看 Toast 提示「已取消计划更新」
5. 停留在当前页面

### 9.2 状态调试

**快速测试首次创建：**
```typescript
<AIAdviceCard
  advice="建议每晚11点前入睡，每日运动30分钟，摄入足量蔬菜水果"
  toolName="健康评估"
  hasExistingPlan={false} // 首次创建
/>
```

**快速测试更新计划：**
```typescript
<AIAdviceCard
  advice="建议增加冥想练习，每日饮水2000ml"
  toolName="饮食建议"
  hasExistingPlan={true} // 已有计划
/>
```

## 十、总结

此功能通过智能提取 AI 建议中的可执行任务，帮助用户快速建立和优化健康计划。支持首次创建和更新两种场景，确保用户体验流畅，同时保护当日任务不受影响。

**核心优势：**
1. 自动化：无需手动输入任务，AI 自动提取
2. 智能判断：区分首次创建和更新场景
3. 保护机制：当日任务不受影响，次日生效
4. 用户友好：清晰提示，二次确认，防止误操作

**后续优化：**
1. 连接 Supabase 实现数据持久化
2. 添加定时任务实现次日自动生效
3. 优化冲突检测算法
4. 支持自定义任务模板
5. 添加计划历史记录查看
