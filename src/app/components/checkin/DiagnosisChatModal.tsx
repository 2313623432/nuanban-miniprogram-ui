import { useState, useRef, useEffect } from "react";
import { X, Send, Loader, CheckCircle2, Calendar, Mic, Keyboard, ChevronLeft, ChevronRight } from "lucide-react";
import type { WeekPlan } from "../../contexts/PlanContext";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
}

interface DiagnosisChatModalProps {
  isRediagnosis: boolean;
  onAcceptPlan: (weeklyPlans: WeekPlan[]) => void;
  onClose: () => void;
}

type DiagnosisStep = "ask_problem" | "ask_disease" | "generate_plan" | "confirm_plan";

// ── 阶段样式 ──
const PHASE_STYLES: Record<number, {
  emoji: string; text: string; bg: string; badge: string; border: string; dot: string;
}> = {
  1: { emoji: "🌱", text: "text-green-600",  bg: "bg-green-500/10",  badge: "bg-green-500/15 text-green-600",  border: "border-green-500/30",  dot: "bg-green-500" },
  2: { emoji: "💪", text: "text-blue-600",   bg: "bg-blue-500/10",   badge: "bg-blue-500/15 text-blue-600",   border: "border-blue-500/30",   dot: "bg-blue-500"  },
  3: { emoji: "🚀", text: "text-orange-600", bg: "bg-orange-500/10", badge: "bg-orange-500/15 text-orange-600", border: "border-orange-500/30", dot: "bg-orange-500"},
  4: { emoji: "🏆", text: "text-purple-600", bg: "bg-purple-500/10", badge: "bg-purple-500/15 text-purple-600", border: "border-purple-500/30", dot: "bg-purple-500"},
};

const WEEK_NAMES = ["一", "二", "三", "四"];

/** 计算某周的日期范围（从今日起）*/
function getWeekDateRange(weekNum: number): string {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() + (weekNum - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
  return `${fmt(start)}-${fmt(end)}`;
}

/** 从基础任务生成4周计划 */
function generateWeeklyPlans(baseTasks: string[]): WeekPlan[] {
  return [
    {
      week: 1, phase: "适应期",
      tasks: baseTasks,
    },
    {
      week: 2, phase: "稳定期",
      tasks: baseTasks,
    },
    {
      week: 3, phase: "提升期",
      tasks: [...baseTasks.slice(0, 4), "增加10分钟有氧运动，强化体能"],
    },
    {
      week: 4, phase: "总结期",
      tasks: [...baseTasks.slice(0, 3), "回顾月度健康数据记录", "制定下月健康改进目标"],
    },
  ];
}

export function DiagnosisChatModal({ isRediagnosis, onAcceptPlan, onClose }: DiagnosisChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<DiagnosisStep>("ask_problem");
  const [userProblem, setUserProblem] = useState("");
  const [userDisease, setUserDisease] = useState("");
  const [generatedWeeklyPlans, setGeneratedWeeklyPlans] = useState<WeekPlan[]>([]);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("text");
  const [activeWeek, setActiveWeek] = useState(0); // 0-indexed

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始问候
  useEffect(() => {
    const greeting: Message = {
      id: "greeting",
      type: "ai",
      content: isRediagnosis
        ? "您好！我来帮您重新制定健康打卡计划 🌿\n\n为了制定更适合您现状的方案，请先告诉我：\n\n最近您最想调理或改善的健康问题是什么？\n例如：血糖控制、睡眠不好、体力下降、食欲不振等"
        : "您好！我是您的健康管理专家 🌿\n\n为了给您制定最合适的养生计划，请先告诉我：\n\n您主要想调理什么问题呢？\n例如：睡眠不好、血压偏高、消化不良、容易疲劳等",
    };
    setMessages([greeting]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, planGenerated]);

  const addAiMessage = (content: string) => {
    setIsTyping(false);
    const msg: Message = { id: Date.now().toString(), type: "ai", content };
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), type: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setTimeout(() => processStep(text), 1400);
  };

  const processStep = (userInput: string) => {
    if (step === "ask_problem") {
      setUserProblem(userInput);
      setStep("ask_disease");
      addAiMessage(
        `好的，我了解了 ✅\n\n您提到的「${userInput}」是很多老年朋友都面临的问题，我会针对性地为您设计方案。\n\n接下来请告诉我：\n\n您有没有已确诊的基础疾病？\n例如：2型糖尿病、高血压、高血脂、无等\n\n这样我可以制定更安全、更合适的调理方案。`
      );
    } else if (step === "ask_disease") {
      setUserDisease(userInput);
      setStep("generate_plan");
      setTimeout(() => {
        const baseTasks = generateBaseTasks(userProblem, userInput);
        const weekly = generateWeeklyPlans(baseTasks);
        setGeneratedWeeklyPlans(weekly);
        setPlanGenerated(true);
        setActiveWeek(0);
        addAiMessage(buildAnalysis(userProblem, userInput));
        setTimeout(() => {
          setStep("confirm_plan");
          addAiMessage(
            "以上就是我为您制定的个性化28天4周打卡计划 📋\n\n• 如果满意，请点击下方「接受并开始打卡」\n• 如果需要调整，请告诉我您想改变哪些内容"
          );
        }, 800);
      }, 600);
    } else if (step === "confirm_plan") {
      const wantsChange = /修改|调整|不|重新|换|改/.test(userInput);
      if (wantsChange) {
        setStep("generate_plan");
        setIsTyping(false);
        setTimeout(() => {
          const baseTasks = generateBaseTasks(userProblem, userDisease, userInput);
          const weekly = generateWeeklyPlans(baseTasks);
          setGeneratedWeeklyPlans(weekly);
          setActiveWeek(0);
          addAiMessage(buildAnalysis(userProblem, userDisease, userInput));
          setTimeout(() => {
            setStep("confirm_plan");
            addAiMessage("我已根据您的要求重新调整了计划 ✨\n\n请问现在这个方案可以吗？");
          }, 800);
        }, 1400);
      } else {
        addAiMessage("太好了！请点击「接受并开始打卡」按钮，系统会为您创建每日打卡任务 💪\n\n坚持执行计划，您的健康状况一定会逐步改善！");
        setIsTyping(false);
      }
    }
  };

  const buildAnalysis = (problem: string, disease: string, modification?: string): string => {
    let intro = `根据您想改善「${problem}」`;
    if (disease && !["无", "没有", "none"].includes(disease.toLowerCase())) {
      intro += `，以及您有「${disease}」的情况`;
    }
    if (modification) intro += `，结合您的调整意见「${modification}」`;
    intro += `，我为您制定以下28天4周打卡计划：`;
    return intro;
  };

  const generateBaseTasks = (problem: string, disease: string, modification?: string): string[] => {
    const hasDiabetes     = /糖尿病|血糖/.test(disease + problem);
    const hasHypertension = /高血压|血压/.test(disease + problem);
    const hasSleepIssue   = /睡眠|失眠/.test(problem);
    const wantsExercise   = modification ? /运动|走路|锻炼/.test(modification) : false;
    return [
      hasDiabetes ? "餐后1小时测量血糖并记录" : "每天记录健康数据（血压/体重）",
      hasDiabetes ? "三餐控制主食摄入，选择低GI食物" : "均衡饮食，减少油腻和高盐食物",
      (hasSleepIssue || !wantsExercise) ? "晚上10点前放下手机，做10分钟拉伸" : "每天快走或慢跑30分钟",
      hasDiabetes || hasHypertension ? "每天早晨快走30分钟（心率保持适中）" : "保持规律作息，每天7-8小时睡眠",
      "每天喝水1500-2000ml，养成喝温水习惯",
    ].slice(0, 5);
  };

  /** 滚动到指定周 */
  const scrollToWeek = (idx: number) => {
    const el = cardScrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveWeek(idx);
  };

  const handleAccept = () => {
    if (generatedWeeklyPlans.length > 0) {
      onAcceptPlan(generatedWeeklyPlans);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3]">
      {/* 顶部导航 */}
      <div className="glass-header border-b border-white/20 px-5 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg flex-shrink-0">
          🌿
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base">AI健康专家</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
            <span>{isRediagnosis ? "重新制定打卡计划" : "个性化健康方案"}</span>
          </div>
        </div>
        <button onClick={onClose} className="h-9 w-9 rounded-xl glass-button flex items-center justify-center">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.type === "ai" && (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm flex-shrink-0 mt-1">
                🌿
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
              msg.type === "ai"
                ? "glass-card rounded-tl-sm"
                : "bg-gradient-to-br from-primary to-secondary text-white rounded-tr-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* ── 4周计划滑动卡片 ── */}
        {planGenerated && generatedWeeklyPlans.length > 0 && (
          <div className="glass-card rounded-3xl overflow-hidden border border-primary/20 mx-1">
            {/* 标题行 */}
            <div className="px-4 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">AI生成的28天4周计划</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">左右滑动</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => scrollToWeek(Math.max(0, activeWeek - 1))}
                    disabled={activeWeek === 0}
                    className="h-6 w-6 rounded-lg glass-button flex items-center justify-center disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => scrollToWeek(Math.min(3, activeWeek + 1))}
                    disabled={activeWeek === 3}
                    className="h-6 w-6 rounded-lg glass-button flex items-center justify-center disabled:opacity-30"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* 横向滑动卡片区 */}
            <div
              ref={cardScrollRef}
              className="flex overflow-x-auto scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / el.offsetWidth);
                setActiveWeek(Math.min(Math.max(idx, 0), 3));
              }}
            >
              {generatedWeeklyPlans.map((wp) => {
                const st = PHASE_STYLES[wp.week];
                return (
                  <div
                    key={wp.week}
                    className="flex-none w-full p-4 space-y-3"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* 周头部 */}
                    <div className={`flex items-center justify-between p-3 rounded-2xl ${st.bg} border ${st.border}`}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{st.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${st.text}`}>
                              第{WEEK_NAMES[wp.week - 1]}周
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${st.badge}`}>
                              {wp.phase}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {getWeekDateRange(wp.week)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-xl ${st.badge}`}>
                        {wp.week}/4
                      </div>
                    </div>

                    {/* 任务列表 */}
                    <div className="space-y-2">
                      {wp.tasks.map((task, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${st.bg}`}>
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${st.badge}`}>
                            {i + 1}
                          </div>
                          <span className="text-sm flex-1 leading-snug">{task}</span>
                          <span className={`text-xs font-medium flex-shrink-0 ${st.text}`}>+3积分</span>
                        </div>
                      ))}
                    </div>

                    {/* 周底部信息 */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-white/10">
                      <span>{wp.tasks.length}项每日任务</span>
                      <span className={`font-medium ${st.text}`}>
                        最高 {wp.tasks.length * 3 * 7} 积分/周
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 分页点 */}
            <div className="flex justify-center gap-1.5 pb-3">
              {generatedWeeklyPlans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToWeek(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeWeek ? "w-5 bg-primary" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI正在输入 */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm flex-shrink-0 mt-1">
              🌿
            </div>
            <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <Loader className="h-3.5 w-3.5 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground ml-1">正在思考中...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 接受计划按钮 */}
      {planGenerated && step === "confirm_plan" && (
        <div className="px-4 pb-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle2 className="h-5 w-5" />
            {isRediagnosis ? "接受新计划并更新" : "接受并开始打卡"}
          </button>
        </div>
      )}

      {/* 输入区 */}
      <div className="glass-header border-t border-white/20 px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInputMode(m => m === "voice" ? "text" : "voice")}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center flex-shrink-0"
          >
            {inputMode === "voice" ? <Keyboard className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {inputMode === "text" ? (
            <div className="flex-1 flex items-center gap-2 glass-card rounded-2xl px-4 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="请输入您的回答..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                disabled={isTyping}
              />
            </div>
          ) : (
            <div className="flex-1 glass-card rounded-2xl px-4 py-2.5 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">按住说话（语音输入）</span>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}