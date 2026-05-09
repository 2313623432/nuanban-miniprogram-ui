# AI建议卡片集成补丁说明

## 已完成的修改

1. ✅ 导入AIAdviceCard组件
2. ✅ Message接口添加isAdviceCard和adviceData字段
3. ✅ 添加splitAnalysisAndPlan函数
4. ✅ 修改handleChatSendMessage函数，生成建议卡片格式的消息

## 需要手动修改的部分

在 `/src/app/pages/AiHomePage.tsx` 第1314行，找到：

```typescript
                          )}\n                        </div>\n                      </div>
```

修改为：

```typescript
                          )}\n                        </div>\n                        )}\n                      </div>
```

也就是在第1314行的 `</div>` 后面、第1315行的 `</div>` 前面，添加一个 `)}` 来关闭三元运算符。

## 验证方法

修改后，打开浏览器控制台，检查是否有语法错误。如果没有错误，尝试：

1. 点击"防癌饮食指南"
2. 输入内容发送
3. 应该看到AI建议卡片显示

## 如果有问题

如果编辑器报错，可以直接在第1315行 `</div>` 之前添加 `)}` 即可。

完整结构应该是：
```
{message.isAdviceCard && message.adviceData ? (
  <AIAdviceCard ... />
) : (
  <div className="rounded-2xl p-4 max-w-[85%] bg-gray-100">
    ...原有内容...
  </div>
)}  <-- 这个是新添加的，用于关闭三元运算符
</div>  <-- 这个是原有的flex-1 div的结束标签
```
