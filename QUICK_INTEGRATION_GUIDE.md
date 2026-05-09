# AI健康建议快速集成指南

## 问题现状

目前AI建议功能已创建组件但未在AiHomePage中展示。

## 解决方案

### 步骤1：修改handleChatSendMessage函数

在`/src/app/pages/AiHomePage.tsx`的`handleChatSendMessage`函数中，将AI回复改为建议卡片格式：

```typescript
// 在聊天模态框中发送消息
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
  
  // 模拟AI回复 - 使用建议卡片格式
  setTimeout(() => {
    const fullResponse = generateAIResponse(chatInputText, selectedService);
    
    // 新增：将回复拆分为分析和计划
    const splitResponse = splitAnalysisAndPlan(fullResponse);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "", // 不需要content，因为用组件渲染
      isAdviceCard: true, // 标记为建议卡片
      adviceData: {
        serviceName: selectedService,
        analysis: splitResponse.analysis,
        plan: splitResponse.plan
      }
    };
    setMessages(prev => [...prev, aiMessage]);
  }, 1500);
};
```

### 步骤2：添加分割函数

在AiHomePage.tsx中添加以下函数（放在handleChatSendMessage之前）：

```typescript
// 将AI回复拆分为分析和计划
const splitAnalysisAndPlan = (fullText: string): { analysis: string; plan: string } => {
  // 查找计划部分的关键词
  const planKeywords = [
    "【早餐建议】",
    "【午餐建议】",
    "【晚餐建议】",
    "【日常注意】",
    "【调理方案】",
    "【生活调理】",
    "【健康建议】",
    "一、",
    "二、"
  ];
  
  // 找到第一个计划关键词的位置
  let splitIndex = -1;
  let foundKeyword = "";
  
  for (const keyword of planKeywords) {
    const index = fullText.indexOf(keyword);
    if (index !== -1 && (splitIndex === -1 || index < splitIndex)) {
      splitIndex = index;
      foundKeyword = keyword;
    }
  }
  
  if (splitIndex === -1) {
    // 没找到分割点，全部作为分析，计划为空
    return {
      analysis: fullText,
      plan: "请按照以上建议执行健康计划"
    };
  }
  
  // 分割文本
  const analysis = fullText.substring(0, splitIndex).trim();
  const plan = fullText.substring(splitIndex).trim();
  
  return { analysis, plan };
};
```

### 步骤3：在消息渲染中使用AIAdviceCard

在聊天模态框的消息渲染部分（大约第1000行附近），修改AI消息的渲染逻辑：

找到这段代码：
```typescript
{message.type === "ai" && (
  <div className="flex-1">
    <div className="rounded-2xl p-4 max-w-[85%] bg-gray-100">
      {message.isLocked && !isMember && !unlockedMessages.has(message.id) ? (
        // ... 锁定内容
      ) : (
        // ... 正常内容
      )}
    </div>
  </div>
)}
```

替换为：
```typescript
{message.type === "ai" && (
  <div className="flex-1">
    {/* 判断是否是建议卡片 */}
    {message.isAdviceCard && message.adviceData ? (
      // 使用AIAdviceCard渲染
      <AIAdviceCard
        serviceName={message.adviceData.serviceName}
        analysis={message.adviceData.analysis}
        plan={message.adviceData.plan}
        onCreatePlan={(tasks) => {
          // 创建打卡计划
          console.log("创建任务：", tasks);
          // TODO: 调用API创建打卡任务
          toast.success(`已创建${tasks.length}个打卡任务！`);
        }}
      />
    ) : (
      // 普通AI消息（原有逻辑）
      <div className="rounded-2xl p-4 max-w-[85%] bg-gray-100">
        {message.isLocked && !isMember && !unlockedMessages.has(message.id) ? (
          <div className="relative">
            {message.imageUrl && (
              <div className="mb-3">
                <img
                  src={message.imageUrl}
                  alt="上传的图片"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            )}
            
            <div className="relative max-h-32 overflow-hidden">
              <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                {message.content.split('\\n').slice(0, 8).join('\\n')}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent"></div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-300">
              <button
                onClick={() => {
                  if (freeUnlockCount < 3) {
                    // 免费解锁
                    setUnlockedMessages(prev => new Set([...prev, message.id]));
                    setFreeUnlockCount(prev => prev + 1);
                  } else {
                    // 显示付费弹窗
                    setShowMemberModal(true);
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2"
              >
                <Crown className="h-5 w-5 text-white" />
                <span className="text-base font-semibold text-white">
                  {freeUnlockCount < 3 
                    ? `免费解锁内容（${freeUnlockCount + 1}/3）`
                    : "成为会员解锁内容"
                  }
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {message.imageUrl && (
              <div className="mb-3">
                <img
                  src={message.imageUrl}
                  alt="上传的图片"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            )}
            
            <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
              {renderTextWithReferences(message.content)}
            </p>
            
            {/* AI消息操作按钮 - 仅在非转发模式下显示 */}
            {!forwardMode && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => toggleLike(message.id)}
                  className={`p-2 rounded-lg transition-all active:scale-95 ${
                    message.liked 
                      ? "bg-orange-100 text-orange-500" 
                      : "bg-white/80 hover:bg-white text-gray-600"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => toggleDislike(message.id)}
                  className={`p-2 rounded-lg transition-all active:scale-95 ${
                    message.disliked 
                      ? "bg-red-100 text-red-500" 
                      : "bg-white/80 hover:bg-white text-gray-600"
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleCopyMessage(message.content, message.id)}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all active:scale-95 flex items-center gap-1"
                >
                  {copiedMessage === message.id ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500">已复制</span>
                    </>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={() => handleForwardMessage(message.id)}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 transition-all active:scale-95"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )}
  </div>
)}
```

## 测试流程

完成修改后，测试流程如下：

1. 打开应用，进入AI首页
2. 点击"防癌饮食指南"卡片
3. 输入"我今年50岁，有家族病史，平时饮食不规律"
4. 等待AI回复
5. 应该看到：
   - 顶部：模糊的"专业分析"（非会员）/ 完整分析（会员）
   - 底部：完整的"健康计划"
   - 大按钮："接受建议并加入打卡"
6. 点击"接受建议并加入打卡"
7. 如果是首次，应该看到toast："已创建X个打卡任务！"
8. 如果已有计划，应该弹出二次确认窗口

## 注意事项

1. **AI回复格式**：确保generateAIResponse返回的文本包含明确的分段（如【早餐建议】等），这样splitAnalysisAndPlan才能正确分割

2. **打卡任务创建**：onCreatePlan回调中需要实现真正的API调用，目前只是console.log

3. **样式适配**：AIAdviceCard已经是响应式设计，但需要确保在聊天窗口中不会超出屏幕

4. **会员权限**：
   - 会员：看到完整分析
   - 非会员：分析部分模糊显示
   - 所有人都能看到健康计划和"接受建议"按钮

## 快速验证

修改后立即验证的最简单方法：

```bash
# 1. 保存所有文件
# 2. 刷新浏览器
# 3. 点击任意"去定制"类型的服务（如防癌饮食指南）
# 4. 输入任意内容发送
# 5. 查看AI回复是否是建议卡片格式
```

如果出现问题，检查：
- [ ] 是否导入了AIAdviceCard组件
- [ ] Message接口是否添加了isAdviceCard和adviceData字段
- [ ] splitAnalysisAndPlan函数是否正确实现
- [ ] 消息渲染逻辑是否正确判断isAdviceCard

## 完整集成所需时间

预计15-30分钟即可完成集成和测试。
