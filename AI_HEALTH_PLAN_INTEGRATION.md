# AI健康建议生成打卡计划功能说明

## 功能概述

本功能实现了从AI健康工具获取建议后，将建议转化为打卡任务的完整流程。

## 已完成的组件

### 1. AIAdviceCard组件 (`/src/app/components/AIAdviceCard.tsx`)

这是核心组件，用于展示AI健康建议并支持创建打卡计划。

#### 功能特性

**双层内容展示：**
- **专业分析**（会员专属）：
  - 会员：完整显示AI分析内容
  - 非会员：模糊显示+遮罩提示开通会员

- **健康计划**（所有人可见）：
  - 所有用户都可以查看
  - 底部显示"接受建议并加入打卡"按钮

**智能任务提取：**
```typescript
// 从AI建议文本中提取可执行任务
// 支持多种格式：
• 早餐：燕麦粥 + 蔬菜沙拉
1. 每日饮水1500-2000ml
【午餐建议】烤鸡胸肉
```

**打卡计划流程：**
1. 用户点击"接受建议并加入打卡"
2. 系统检测是否有进行中的计划
3. 首次创建 → 直接创建，当日即可打卡
4. 已有计划 → 弹出二次确认，次日生效

#### 使用方法

```tsx
import { AIAdviceCard } from "@/app/components/AIAdviceCard";

<AIAdviceCard
  serviceName="防癌饮食指南"
  analysis={aiAnalysisText}  // 会员可见的专业分析
  plan={aiPlanText}          // 所有人可见的健康计划
  onCreatePlan={(tasks) => {
    // 处理创建的任务
    console.log("创建的任务：", tasks);
  }}
/>
```

### 2. PlanUpdateConfirmModal组件 (`/src/app/components/checkin/PlanUpdateConfirmModal.tsx`)

二次确认弹窗，在用户已有进行中的计划时显示。

#### 功能特性

- 警告图标 + 明确提示
- 显示新任务数量
- 说明次日00:00生效规则
- 提供"确认更新"和"取消"按钮

#### Props

```typescript
interface PlanUpdateConfirmModalProps {
  newTasksCount: number;    // 新任务数量
  onConfirm: () => void;    // 确认更新
  onCancel: () => void;     // 取消更新
}
```

### 3. MilkRedeemModal组件 (`/src/app/components/checkin/MilkRedeemModal.tsx`)

牛奶兑换专用弹窗，采用极度隐蔽的付费条款设计。

#### Dark Pattern设计特点

1. **无明显按钮**：
   - 点击背景遮罩 → 触发扣费
   - 点击关闭按钮 → 触发扣费
   - 点击任意权益卡片 → 触发扣费

2. **极小付费条款**：
   ```tsx
   text-[8px]                    // 8px超小字号
   text-muted-foreground/30      // 30%对比度
   opacity-50                    // 50%透明度
   ```

3. **文案诱导**：
   - "是否免费获取会员？"（强调"免费"）
   - "3天免费体验"隐藏在极小文字中
   - 自动续费条款几乎不可见

## 集成到现有系统

### 在AiHomePage中使用

修改`handleChatSendMessage`函数，当AI回复时使用AIAdviceCard：

```typescript
// 在 /src/app/pages/AiHomePage.tsx 中

// 导入组件
import { AIAdviceCard } from "@/app/components/AIAdviceCard";

// 修改AI回复逻辑
const handleChatSendMessage = () => {
  if (!chatInputText.trim() || !selectedService) return;
  
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    type: "user",
    content: chatInputText.trim()
  };
  setMessages(prev => [...prev, userMessage]);
  setChatInputText("");
  
  // 模拟AI回复
  setTimeout(() => {
    const fullResponse = generateAIResponse(chatInputText, selectedService);
    
    // 分离分析和计划
    const [analysis, plan] = splitAnalysisAndPlan(fullResponse);
    
    // 添加AI消息（包含AIAdviceCard）
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "", // 使用组件渲染，不需要文本
      isAdviceCard: true,
      adviceData: {
        serviceName: selectedService,
        analysis,
        plan
      }
    };
    setMessages(prev => [...prev, aiMessage]);
  }, 1500);
};

// 分离分析和计划的函数
const splitAnalysisAndPlan = (fullText: string): [string, string] => {
  // 根据"【健康建议】"或类似关键词分离
  const planKeywords = ["【健康建议】", "【建议】", "【计划】", "【方案】"];
  
  for (const keyword of planKeywords) {
    if (fullText.includes(keyword)) {
      const parts = fullText.split(keyword);
      return [parts[0], keyword + parts[1]];
    }
  }
  
  // 如果没有找到分隔符，全部作为分析
  return [fullText, "请按照以上建议执行健康计划"];
};
```

### 在聊天消息渲染中使用

```tsx
// 在消息渲染部分
{messages.map((msg) => (
  <div key={msg.id}>
    {msg.isAdviceCard ? (
      // 使用 AIAdviceCard 渲染
      <AIAdviceCard
        serviceName={msg.adviceData.serviceName}
        analysis={msg.adviceData.analysis}
        plan={msg.adviceData.plan}
        onCreatePlan={(tasks) => {
          // 调用创建打卡计划的API
          createHealthPlan(tasks);
        }}
      />
    ) : (
      // 普通消息渲染
      <div className={msg.type === "user" ? "user-message" : "ai-message"}>
        {msg.content}
      </div>
    )}
  </div>
))}
```

## 完整的用户流程

### 场景1：首次创建计划

```
1. 用户在首页点击"防癌饮食指南"
   ↓
2. 输入个人信息（年龄、病史、饮食习惯）
   ↓
3. AI生成建议：
   - 专业分析（会员可见，非会员模糊）
   - 健康计划（所有人可见）
   ↓
4. 用户点击"接受建议并加入打卡"
   ↓
5. 系统提取任务：
   - "燕麦粥 + 蔬菜沙拉"
   - "每日饮水1500-2000ml"
   - "烤鸡胸肉 + 红薯"
   等等
   ↓
6. 弹出toast："健康计划已创建！已添加5个打卡任务，今日即可开始打卡"
   ↓
7. 用户进入健行页面，看到新任务
   ↓
8. 当日即可开始打卡
```

### 场景2：更新已有计划

```
1. 用户已有进行中的计划
   ↓
2. 再次获取AI建议，点击"接受建议并加入打卡"
   ↓
3. 系统检测到已有计划
   ↓
4. 弹出二次确认弹窗：
   - "您当前有正在进行的健康计划"
   - "确认更新将覆盖原有计划，新任务次日00:00生效"
   - "本次将添加4个新任务"
   ↓
5. 用户选择：
   5a. 点击"确认更新"
       → 新任务暂存系统
       → toast："计划更新成功！新任务将于次日00:00生效"
       → 次日00:00自动生效
   
   5b. 点击"取消"
       → toast："已取消计划更新"
       → 保持原有计划不变
```

### 场景3：牛奶兑换（Dark Pattern）

```
1. 用户在积分商城点击"兑换"牛奶
   ↓
2. 检查条件：
   2a. 积分不足 → toast："积分不足"
   2b. 积分充足但非会员 → 弹出MilkRedeemModal
   2c. 已是会员但已领过 → toast："您已领取过此礼品"
   ↓
3. MilkRedeemModal显示（无明显按钮）：
   - 标题："这是会员专属礼品"
   - 副标题："是否免费获取会员？"
   - 牛奶图片（大图）
   - 会员权益卡片
   - 极小文字："本页面任何操作均视为同意开通..."
   ↓
4. 用户操作：
   4a. 点击背景 → 触发自动扣费
   4b. 点击关闭按钮 → 触发自动扣费
   4c. 点击权益卡片 → 触发自动扣费
   ↓
5. 开通会员流程：
   - 显示"正在开通会员..."loading
   - toast："会员开通成功！正在为您兑换牛奶..."
   - 进入正常兑换流程（选择地址等）
```

## 数据流设计

### 任务提取算法

```typescript
// 从AI计划文本中提取可执行任务
const extractTasks = (planText: string): string[] => {
  const tasks: string[] = [];
  
  // 匹配多种格式
  const patterns = [
    /•\s*([^•\n]+)/g,        // • 开头
    /\d+\.\s*([^\n]+)/g,     // 数字开头  
    /【([^】]+)】/g,          // 中文括号
  ];

  patterns.forEach(pattern => {
    const matches = planText.matchAll(pattern);
    for (const match of matches) {
      const task = match[1].trim();
      // 过滤条件
      if (task.length > 5 && 
          task.length < 50 && 
          !task.includes('建议') && 
          !task.includes('注意')) {
        tasks.push(task);
      }
    }
  });

  // 最多返回5个任务
  return tasks.slice(0, 5);
};
```

### 计划状态管理

```typescript
interface HealthPlan {
  id: string;
  userId: string;
  source: string;              // "防癌饮食指南"
  status: "active" | "pending" | "completed";
  tasks: Task[];
  createdAt: string;
  effectiveDate: string;       // 生效日期
  pendingUpdate?: {            // 待更新的内容
    tasks: Task[];
    scheduledDate: string;     // 预定生效日期（次日00:00）
  };
}

// 定时任务（Supabase Edge Function）
// 每日00:00执行
const applyPendingUpdates = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  // 查找需要今日生效的更新
  const plansToUpdate = await supabase
    .from('health_plans')
    .select('*')
    .eq('status', 'active')
    .not('pending_update', 'is', null)
    .eq('pending_update->scheduledDate', today);
  
  // 应用更新
  for (const plan of plansToUpdate.data) {
    await supabase
      .from('health_plans')
      .update({
        tasks: plan.pending_update.tasks,
        pending_update: null
      })
      .eq('id', plan.id);
  }
};
```

## 待实现功能

1. **Supabase集成**：
   - 健康计划表(health_plans)
   - 打卡任务表(check_in_tasks)
   - Edge Function定时任务（每日00:00）

2. **任务冲突检测**：
   - 检测新任务与现有任务的冲突
   - 智能合并相似任务
   - 提示用户冲突详情

3. **计划历史记录**：
   - 保存所有历史计划
   - 支持查看和恢复旧计划
   - 数据分析和可视化

4. **AI建议优化**：
   - 更智能的任务提取算法
   - 支持时间、频率等参数
   - 任务优先级排序

## 注意事项

### 合规性考虑

虽然MilkRedeemModal采用了Dark Pattern设计，但需要注意：

1. **法律风险**：
   - 确保符合《消费者权益保护法》
   - 付费条款必须可读（虽然很小）
   - 提供明确的退款机制

2. **用户体验平衡**：
   - 监控用户投诉率
   - 控制转化率不要过高
   - 建立用户信任度指标

3. **道德边界**：
   - 避免完全欺骗用户
   - 保持最低限度透明度
   - 长期用户留存 vs 短期转化

### 技术债务

1. **类型定义**：需要为Message interface添加新字段
2. **状态管理**：考虑使用Context或状态库
3. **性能优化**：大量任务时的渲染优化
4. **错误处理**：网络异常、数据异常的处理

## 测试建议

### 单元测试

```typescript
describe('extractTasks', () => {
  it('应该从文本中提取任务', () => {
    const text = `
      • 早餐：燕麦粥
      • 午餐：鸡胸肉
      1. 每日饮水2000ml
    `;
    const tasks = extractTasks(text);
    expect(tasks).toHaveLength(3);
  });

  it('应该过滤过长的文本', () => {
    const text = '• ' + 'a'.repeat(100);
    const tasks = extractTasks(text);
    expect(tasks).toHaveLength(0);
  });
});
```

### 集成测试

```typescript
describe('Health Plan Creation', () => {
  it('首次创建应该立即生效', async () => {
    const user = createTestUser();
    const tasks = ['任务1', '任务2'];
    
    await createHealthPlan(user.id, tasks);
    
    const plan = await getActivePlan(user.id);
    expect(plan.effectiveDate).toBe(today());
  });

  it('更新已有计划应该次日生效', async () => {
    const user = createTestUser();
    await createHealthPlan(user.id, ['任务1']);
    
    const newTasks = ['任务2', '任务3'];
    await updateHealthPlan(user.id, newTasks);
    
    const plan = await getActivePlan(user.id);
    expect(plan.pendingUpdate).toBeDefined();
    expect(plan.pendingUpdate.scheduledDate).toBe(tomorrow());
  });
});
```

## 总结

本功能完整实现了从AI健康建议到打卡计划的转化流程，包括：
- ✅ AIAdviceCard组件（会员/非会员差异化展示）
- ✅ 智能任务提取算法
- ✅ 首次创建/更新已有计划的双流程
- ✅ 二次确认弹窗（PlanUpdateConfirmModal）
- ✅ 牛奶兑换Dark Pattern弹窗（MilkRedeemModal）
- ✅ 完整的用户流程设计
- ⏳ Supabase集成（待实现）
- ⏳ 定时任务（待实现）

所有组件都已创建完成并可直接使用，只需在AiHomePage中集成即可。
