import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Package,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Truck,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bell,
  Award,
  Crown,
  Loader,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

type LogisticsStatus = "pending" | "shipped" | "in_transit" | "delivered" | "signed";

interface TrackingEvent {
  id: string;
  time: string;
  location: string;
  description: string;
}

interface LogisticsInfo {
  company: string;
  trackingNumber: string;
  status: LogisticsStatus;
  events: TrackingEvent[];
}

interface OrderInfo {
  id: string;
  giftName: string;
  giftImage: string;
  points: number;
  date: string;
  category: "virtual" | "physical" | "health";
  status: "pending" | "shipped" | "completed" | "signed" | "cancelled";
  cancelReason?: string;
  productLink?: string;
  logistics?: LogisticsInfo;
  address?: {
    name: string;
    phone: string;
    address: string;
  };
}

const STATUS_LABELS: Record<LogisticsStatus, string> = {
  pending: "待发货",
  shipped: "已发货",
  in_transit: "运输中",
  delivered: "已送达",
  signed: "已签收",
};

const STATUS_COLORS: Record<LogisticsStatus, string> = {
  pending: "text-yellow-500",
  shipped: "text-blue-500",
  in_transit: "text-orange-500",
  delivered: "text-emerald-500",
  signed: "text-green-600",
};

const STATUS_BG: Record<LogisticsStatus, string> = {
  pending: "bg-yellow-50",
  shipped: "bg-blue-50",
  in_transit: "bg-orange-50",
  delivered: "bg-emerald-50",
  signed: "bg-green-50",
};

// Mock order database
const MOCK_ORDERS: Record<string, OrderInfo> = {
  "5": {
    id: "5",
    giftName: "7天会员体验卡",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFE5B4'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%91%91%3C/text%3E%3C/svg%3E",
    points: 50,
    date: "2026-04-20",
    category: "virtual",
    status: "completed",
    productLink: "https://nuanban.app/activate-member?code=M7K9X2R4",
  },
  "1": {
    id: "1",
    giftName: "颈部按摩仪",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FEF3C7'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%92%86%3C/text%3E%3C/svg%3E",
    points: 200,
    date: "2026-05-05",
    category: "health",
    status: "pending",
    address: { name: "李建国", phone: "136****6666", address: "上海市浦东新区张江镇科苑路 88号 嘉宝苑 5栋 1203室" },
    logistics: { company: "", trackingNumber: "", status: "pending", events: [] },
  },
  "2": {
    id: "2",
    giftName: "艾灸盒套装",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FCE7F3'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%94%A5%3C/text%3E%3C/svg%3E",
    points: 150,
    date: "2026-05-03",
    category: "physical",
    status: "shipped",
    address: { name: "赵红梅", phone: "155****7777", address: "四川省成都市武侯区天府大道 996号 蓝光公馆 2栋 1508" },
    logistics: {
      company: "圆通速递",
      trackingNumber: "YTO9876543210",
      status: "shipped",
      events: [
        { id: "e1", time: "2026-05-04 14:20", location: "成都武侯揽投部", description: "快件已揽收，等待发出" },
        { id: "e2", time: "2026-05-03 09:30", location: "暖伴健康商城", description: "您的兑换订单已确认，正在打包中" },
      ],
    },
  },
  "3": {
    id: "3",
    giftName: "养生茶礼盒",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F0FDF4'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%8D%B5%3C/text%3E%3C/svg%3E",
    points: 80,
    date: "2026-04-18",
    category: "health",
    status: "shipped",
    address: { name: "王秀兰", phone: "138****8888", address: "北京市朝阳区望京街道望京花园西区 3号楼 401室" },
    logistics: {
      company: "顺丰速运",
      trackingNumber: "SF1234567890",
      status: "in_transit",
      events: [
        { id: "e1", time: "2026-04-21 09:32", location: "北京朝阳区望京揽投部", description: "快件已由快递员派送，正在配送中" },
        { id: "e2", time: "2026-04-21 06:45", location: "北京朝阳区分拨中心", description: "快件已到达北京朝阳区分拨中心，正在分拣中" },
        { id: "e3", time: "2026-04-20 22:18", location: "北京顺义转运中心", description: "快件已离开北京顺义转运中心，发往北京朝阳区" },
        { id: "e4", time: "2026-04-20 17:05", location: "上海浦东转运中心", description: "快件已离开上海浦东转运中心，发往北京" },
        { id: "e5", time: "2026-04-20 13:20", location: "上海仓储中心", description: "商品已完成出库，交由顺丰速运" },
        { id: "e6", time: "2026-04-18 16:40", location: "暖伴健康商城", description: "您的兑换订单已审核通过，正在打包中" },
      ],
    },
  },
  "4": {
    id: "4",
    giftName: "新鲜牛奶礼盒",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%A5%9B%3C/text%3E%3C/svg%3E",
    points: 80,
    date: "2026-04-10",
    category: "physical",
    status: "signed",
    address: { name: "张翠花", phone: "152****2222", address: "广东省深圳市南山区科技园南区科发路 18号 荔园公寓 7栋 2105" },
    logistics: {
      company: "京东物流",
      trackingNumber: "JD1098765432",
      status: "signed",
      events: [
        { id: "e1", time: "2026-04-12 14:23", location: "深圳南山科技园收发室", description: "快件已签收，签收人：本人。感谢使用京东物流" },
        { id: "e2", time: "2026-04-12 10:05", location: "深圳南山区桃源揽投部", description: "快递员[吴师傅 138****1234]正在派送，请保持电话畅通" },
        { id: "e3", time: "2026-04-12 07:30", location: "深圳南山转运站", description: "快件已到达深圳南山转运站，正在安排派送" },
        { id: "e4", time: "2026-04-11 23:10", location: "广州华南分拨中心", description: "快件已离开广州华南分拨中心" },
        { id: "e5", time: "2026-04-11 18:45", location: "广州华南分拨中心", description: "快件已到达广州华南分拨中心，正在分拣" },
        { id: "e6", time: "2026-04-10 22:15", location: "暖伴健康仓储中心", description: "订单已出库，交由京东物流" },
        { id: "e7", time: "2026-04-10 15:30", location: "暖伴健康商城", description: "您的兑换订单已确认，安排发货中" },
      ],
    },
  },
  "7": {
    id: "7",
    giftName: "AI专属语音包",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E0F2FE'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%8E%A4%3C/text%3E%3C/svg%3E",
    points: 30,
    date: "2026-05-03",
    category: "virtual",
    status: "completed",
    productLink: "https://nuanban.app/voice-pack/ai-custom",
  },
  "6": {
    id: "6",
    giftName: "健康生活指南",
    giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E0E7FF'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%93%9A%3C/text%3E%3C/svg%3E",
    points: 40,
    date: "2026-04-05",
    category: "physical",
    status: "cancelled",
    cancelReason: "用户主动申请退款，未发货已取消",
    address: { name: "陈美华", phone: "139****3333", address: "浙江省杭州市西湖区文三路 178号 紫金广场 B座 1601" },
  },
};

function StatusDot({ status, isFirst }: { status: "done" | "current" | "future"; isFirst?: boolean }) {
  if (status === "done") {
    return (
      <div className="w-3 h-3 rounded-full bg-primary/30 ring-2 ring-primary/20 flex-shrink-0 mt-0.5" />
    );
  }
  if (status === "current") {
    return (
      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20 flex-shrink-0 mt-0.5 shadow-md shadow-primary/30" />
    );
  }
  return (
    <div className="w-3 h-3 rounded-full bg-muted border-2 border-border flex-shrink-0 mt-0.5" />
  );
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [isLoadingLogistics, setIsLoadingLogistics] = useState(false);
  const [logisticsError, setLogisticsError] = useState(false);
  const [logisticsDelayed, setLogisticsDelayed] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const pollCountRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const fetchLogistics = useCallback(async (isManual = false) => {
    if (!order?.logistics) return;
    if (order.logistics.status === "signed") return;

    if (isManual) {
      pollCountRef.current = 0;
      setLogisticsError(false);
    }

    setIsLoadingLogistics(true);
    setLogisticsDelayed(false);

    // Simulate network delay occasionally
    const delay = Math.random() > 0.7 ? 3500 : 800;
    await new Promise((res) => setTimeout(res, delay));

    // Simulate failure after 3 polls
    if (!isManual && pollCountRef.current >= 3) {
      setIsLoadingLogistics(false);
      setLogisticsError(true);
      stopPolling();
      return;
    }

    if (delay > 2000) {
      setLogisticsDelayed(true);
      setIsLoadingLogistics(false);
      return;
    }

    setIsLoadingLogistics(false);
    pollCountRef.current += 1;

    // Schedule next poll in 2 hours (simulated as 30s for demo)
    if (order.logistics.status !== "signed") {
      pollTimerRef.current = setTimeout(() => {
        fetchLogistics();
      }, 30000);
    }
  }, [order, stopPolling]);

  useEffect(() => {
    const found = MOCK_ORDERS[orderId || ""];
    if (found) {
      setOrder(found);
    }
  }, [orderId]);

  useEffect(() => {
    if (!order) return;
    if (order.category === "virtual") return;
    if (order.logistics?.status === "signed") return;
    if (order.logistics?.status === "pending") return;

    // Initial fetch on page load
    fetchLogistics();

    return () => stopPolling();
  }, [order?.id]);

  const handleManualRefresh = () => {
    fetchLogistics(true);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      toast.error("请描述您的问题");
      return;
    }
    setFeedbackSubmitted(true);
    toast.success("已提交，客服将在24小时内联系您");
    setTimeout(() => setShowFeedbackModal(false), 1500);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">订单不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 rounded-2xl glass-button text-primary"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const isPhysical = order.category !== "virtual";
  const logistics = order.logistics;
  const events = logistics?.events || [];
  const displayEvents = showAllEvents ? events : events.slice(0, 3);

  const statusConfig = {
    pending:   { icon: Clock,      label: "待处理", color: "text-yellow-500" },
    shipped:   { icon: Truck,      label: "配送中", color: "text-blue-500" },
    completed: { icon: CheckCircle, label: "已完成", color: "text-green-600" },
    signed:    { icon: CheckCircle, label: "已完成", color: "text-green-600" },
    cancelled: { icon: XCircle,    label: "已取消", color: "text-red-500" },
  };
  const orderStatusConfig = statusConfig[order.status];
  const OrderStatusIcon = orderStatusConfig.icon;

  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-header border-b border-border/30">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold flex-1">订单详情</h1>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            order.status === "signed" || order.status === "completed"
              ? "bg-green-100 text-green-700"
              : order.status === "shipped"
              ? "bg-blue-100 text-blue-700"
              : order.status === "cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            <OrderStatusIcon className="h-3.5 w-3.5" />
            {orderStatusConfig.label}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-5 space-y-4">
        {/* Order Info Card */}
        <div className="glass-card rounded-3xl p-5 shadow-sm">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-accent flex-shrink-0">
              <img
                src={order.giftImage}
                alt={order.giftName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base mb-1 leading-snug">{order.giftName}</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                <Clock className="h-3.5 w-3.5" />
                <span>兑换时间：{order.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-primary font-semibold text-base">{order.points} 积分</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>订单编号</span>
              <span className="font-mono text-foreground/80">WB{order.date.replace(/-/g, "")}000{order.id}</span>
            </div>
          </div>
        </div>

        {/* 取消原因 */}
        {isCancelled && (
          <div className="glass-card rounded-3xl p-5 shadow-sm border border-red-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="font-semibold text-base text-red-600 mb-1">订单已取消</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {order.cancelReason || "订单已被取消"}
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  取消时间：{order.date}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Virtual order — claim gift via link */}
        {!isPhysical && !isCancelled && (
          <div className="glass-card rounded-3xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-base">兑换成功</div>
                <div className="text-sm text-muted-foreground mt-0.5">点击下方链接获取，获取礼品</div>
              </div>
            </div>
            {order.productLink ? (
              <a
                href={order.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium text-center hover:bg-primary/15 transition-colors active:scale-[0.98]"
              >
                {order.productLink}
              </a>
            ) : (
              <div className="w-full py-3 px-4 rounded-2xl bg-muted/50 text-center text-sm text-muted-foreground">
                暂无链接，请联系客服获取
              </div>
            )}
          </div>
        )}

        {/* Delivery Address */}
        {isPhysical && order.address && (
          <div className="glass-card rounded-3xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">收货地址</div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-base">{order.address.name}</span>
                  <span className="text-sm text-muted-foreground">{order.address.phone}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{order.address.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logistics Section */}
        {isPhysical && logistics && !isCancelled && (
          <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
            {/* Section Header */}
            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Truck className="h-4.5 w-4.5 text-blue-600" />
                </div>
                <span className="font-semibold text-base">物流信息</span>
              </div>
              {logistics.status !== "pending" && logistics.status !== "signed" && (
                <button
                  onClick={handleManualRefresh}
                  disabled={isLoadingLogistics}
                  className="flex items-center gap-1.5 text-sm text-primary px-3 py-1.5 rounded-xl bg-primary/10 active:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLogistics ? "animate-spin" : ""}`} />
                  刷新
                </button>
              )}
            </div>

            <div className="px-5 pb-5">
              {/* Pending state */}
              {logistics.status === "pending" && (
                <div className="py-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-base text-foreground">待发货，请耐心等待</p>
                    <p className="text-sm text-muted-foreground mt-1.5">商品将在 7 个工作日内安排发货</p>
                  </div>
                  <div className="w-full bg-yellow-50 rounded-2xl p-4 flex items-start gap-3">
                    <Bell className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      发货后将通过微信通知您快递公司和单号，请保持消息通知开启
                    </p>
                  </div>
                </div>
              )}

              {/* Loading state */}
              {logistics.status !== "pending" && isLoadingLogistics && (
                <div className="py-8 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    <Loader className="h-7 w-7 text-blue-500 animate-spin" />
                  </div>
                  <p className="text-sm text-muted-foreground">正在获取最新物流信息...</p>
                </div>
              )}

              {/* Delayed state */}
              {!isLoadingLogistics && logisticsDelayed && (
                <div className="py-6 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                    <Clock className="h-7 w-7 text-orange-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-base">物流信息更新中，请稍后查看</p>
                    <p className="text-sm text-muted-foreground mt-1">数据同步略有延迟，系统将自动更新</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {!isLoadingLogistics && logisticsError && (
                <div className="py-6 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="h-7 w-7 text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-base">物流信息获取失败</p>
                    <p className="text-sm text-muted-foreground mt-1">请下拉页面刷新重试</p>
                  </div>
                  <button
                    onClick={handleManualRefresh}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm shadow-md shadow-primary/20 active:scale-95 transition-transform"
                  >
                    <RefreshCw className="h-4 w-4" />
                    立即重试
                  </button>
                </div>
              )}

              {/* Logistics info — shipped/in transit/delivered/signed */}
              {!isLoadingLogistics && !logisticsDelayed && !logisticsError && logistics.status !== "pending" && (
                <div className="pt-4 space-y-4">
                  {/* Company + Tracking */}
                  <div className="flex items-center justify-between bg-muted/40 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">快递公司</div>
                        <div className="font-semibold text-sm mt-0.5">{logistics.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">快递单号</div>
                      <div className="font-mono text-sm font-medium mt-0.5 text-foreground/80">{logistics.trackingNumber}</div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${STATUS_BG[logistics.status]} ${STATUS_COLORS[logistics.status]}`}>
                    {logistics.status === "signed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                    {STATUS_LABELS[logistics.status]}
                    {logistics.status === "in_transit" && " · 预计明日送达"}
                  </div>

                  {/* Timeline */}
                  {events.length > 0 && (
                    <div className="mt-2">
                      <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[7px] top-5 bottom-5 w-[2px] bg-border/60 rounded-full" />

                        <div className="space-y-0">
                          {displayEvents.map((event, index) => {
                            const isLatest = index === 0;
                            const dotStatus: "done" | "current" | "future" =
                              isLatest ? "current" : "done";

                            return (
                              <div key={event.id} className="relative flex gap-4 pl-1">
                                {/* Dot */}
                                <div className="flex-shrink-0 z-10 mt-3.5">
                                  <StatusDot status={dotStatus} />
                                </div>
                                {/* Content */}
                                <div className={`flex-1 pb-5 ${isLatest ? "" : "opacity-70"}`}>
                                  <div className={`text-xs mb-1 font-medium ${isLatest ? "text-primary" : "text-muted-foreground"}`}>
                                    {event.time}
                                  </div>
                                  <div className={`text-sm font-medium leading-snug ${isLatest ? "text-foreground" : "text-foreground/80"}`}>
                                    {event.description}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {event.location}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Expand toggle */}
                      {events.length > 3 && (
                        <button
                          onClick={() => setShowAllEvents(!showAllEvents)}
                          className="w-full flex items-center justify-center gap-2 py-3 mt-1 text-sm text-primary font-medium rounded-2xl bg-primary/5 active:bg-primary/10 transition-colors"
                        >
                          {showAllEvents ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              收起物流轨迹
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              查看全部 {events.length} 条轨迹
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Signed — completed notice */}
              {logistics.status === "signed" && !isLoadingLogistics && !logisticsDelayed && !logisticsError && (
                <div className="mt-4 bg-green-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-green-800">订单已完成</span>
                  </div>
                  <p className="text-sm text-green-700 pl-8 leading-relaxed">
                    感谢您的信任！如有使用问题，欢迎随时联系我们
                  </p>
                </div>
              )}

              {/* Not received feedback */}
              {logistics.status === "signed" && !isLoadingLogistics && (
                <div className="mt-3">
                  {feedbackSubmitted ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-2xl px-4 py-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      反馈已提交，客服将在24小时内联系您
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground border border-border/50 rounded-2xl bg-white/30 hover:bg-white/50 active:scale-[0.99] transition-all"
                    >
                      <MessageSquare className="h-4 w-4" />
                      未收到货？点此反馈
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Push notification info */}
        {isPhysical && logistics && logistics.status !== "signed" && logistics.status !== "pending" && (
          <div className="glass-card rounded-3xl p-4 flex items-start gap-3 shadow-sm">
            <Bell className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-0.5">微信服务通知</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                包裹状态更新时（已发货、已签收），系统将通过微信服务通知提醒您
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFeedbackModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-background rounded-t-3xl p-6 animate-slideUp shadow-2xl">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">未收到货反馈</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              请描述您遇到的问题，我们将通知客服优先处理
            </p>
            <div className="bg-muted/30 rounded-2xl p-1 mb-4">
              <div className="text-xs text-muted-foreground px-3 pt-2 pb-1">订单：{order.giftName} · {logistics?.trackingNumber}</div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="请描述您的情况，例如：快递显示已签收但实际未收到..."
                className="w-full bg-transparent px-3 pb-3 text-sm resize-none outline-none min-h-[120px] leading-relaxed placeholder:text-muted-foreground/60"
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground text-right px-3 pb-2">{feedbackText.length}/200</div>
            </div>
            <button
              onClick={handleFeedbackSubmit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-base font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
            >
              提交反馈
            </button>
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="w-full py-3 mt-2 text-sm text-muted-foreground"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}