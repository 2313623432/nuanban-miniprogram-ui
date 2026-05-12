import { useState } from "react";
import { useNavigate } from "react-router";
import { Gift, Award, Package, Clock, Settings, ChevronRight, Truck, CheckCircle, Headphones, TrendingUp, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RedeemModal } from "./RedeemModal";
import { AddressSettingsModal } from "./AddressSettingsModal";
import { MemberUpsellModal } from "./MemberUpsellModal";
import { MilkRedeemModal } from "./MilkRedeemModal";
import { InsufficientPointsModal } from "./InsufficientPointsModal";
import { CustomerServiceModal } from "./CustomerServiceModal";

interface GiftItem {
  id: string;
  name: string;
  category: "virtual" | "physical";
  points: number;
  stock: number;
  image: string;
  description: string;
  monthlyLimit?: number;
}

interface RedeemRecord {
  id: string;
  giftName: string;
  giftImage?: string;
  points: number;
  status: "pending" | "shipped" | "completed" | "cancelled";
  date: string;
  trackingNumber?: string;
  orderNo?: string;
  category?: "virtual" | "health" | "physical";
  cancelReason?: string;
}

type RecordFilterStatus = "all" | "pending" | "shipped" | "completed";

export function PointsMallTab() {
  const navigate = useNavigate();
  const [points] = useState(125);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showMemberUpsellModal, setShowMemberUpsellModal] = useState(false);
  const [showMilkRedeemModal, setShowMilkRedeemModal] = useState(false); // 牛奶专用弹窗
  const [showInsufficientPointsModal, setShowInsufficientPointsModal] = useState(false); // 积分不足弹窗
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [view, setView] = useState<"mall" | "records">("mall");
  const [isMember, setIsMember] = useState(false); // 是否是会员
  const [hasClaimedMilk, setHasClaimedMilk] = useState(false); // 是否已领取过牛奶
  const [showCustomerServiceModal, setShowCustomerServiceModal] = useState(false); // 客服模态框
  const [recordFilter, setRecordFilter] = useState<RecordFilterStatus>("all"); // 兑换记录筛选

  const gifts: GiftItem[] = [
    {
      id: "1",
      name: "7天会员体验卡",
      category: "virtual",
      points: 50,
      stock: 999,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFE5B4'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E👑%3C/text%3E%3C/svg%3E",
      description: "享受所有会员权益7天",
      monthlyLimit: 2
    },
    {
      id: "2",
      name: "AI专属语音包",
      category: "virtual",
      points: 30,
      stock: 999,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E0F2FE'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E🎤%3C/text%3E%3C/svg%3E",
      description: "多种声音选择，个性化体验",
      monthlyLimit: 2
    },
    {
      id: "3",
      name: "新鲜牛奶礼盒",
      category: "physical",
      points: 80,
      stock: 50,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E🥛%3C/text%3E%3C/svg%3E",
      description: "优质奶源，营养健康"
    },
    {
      id: "7",
      name: "养生茶礼盒",
      category: "physical",
      points: 80,
      stock: 45,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F0FDF4'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E🍵%3C/text%3E%3C/svg%3E",
      description: "精选草本，健康养生"
    },
    {
      id: "4",
      name: "颈部按摩仪",
      category: "physical",
      points: 200,
      stock: 12,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FEF3C7'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E💆%3C/text%3E%3C/svg%3E",
      description: "缓解疲劳，舒缓颈椎"
    },
    {
      id: "5",
      name: "艾灸盒套装",
      category: "physical",
      points: 150,
      stock: 28,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FCE7F3'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E🔥%3C/text%3E%3C/svg%3E",
      description: "传统理疗，温经通络"
    },
    {
      id: "6",
      name: "健康生活指南",
      category: "physical",
      points: 40,
      stock: 66,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E0E7FF'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E📚%3C/text%3E%3C/svg%3E",
      description: "专业健康知识书籍"
    }
  ];

  const records: RedeemRecord[] = [
    {
      id: "1",
      giftName: "颈部按摩仪",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FEF3C7'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%92%86%3C/text%3E%3C/svg%3E",
      points: 200,
      status: "pending",
      date: "2026-05-07",
      orderNo: "HB20260507001",
      category: "physical",
    },
    {
      id: "2",
      giftName: "艾灸盒套装",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FCE7F3'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%94%A5%3C/text%3E%3C/svg%3E",
      points: 150,
      status: "shipped",
      date: "2026-05-03",
      trackingNumber: "YTO9876543210",
      orderNo: "HB20260503001",
      category: "physical",
    },
    {
      id: "3",
      giftName: "养生茶礼盒",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F0FDF4'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%8D%B5%3C/text%3E%3C/svg%3E",
      points: 80,
      status: "shipped",
      date: "2026-04-28",
      trackingNumber: "SF1234567890",
      orderNo: "HB20260428001",
      category: "physical",
    },
    {
      id: "4",
      giftName: "新鲜牛奶礼盒",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFF7ED'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%A5%9B%3C/text%3E%3C/svg%3E",
      points: 80,
      status: "completed",
      date: "2026-04-20",
      trackingNumber: "JD1098765432",
      orderNo: "HB20260420001",
      category: "physical",
    },
    {
      id: "5",
      giftName: "7天会员体验卡",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FFE5B4'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%91%91%3C/text%3E%3C/svg%3E",
      points: 50,
      status: "completed",
      date: "2026-04-10",
      orderNo: "VR20260410001",
      category: "virtual",
    },
    {
      id: "6",
      giftName: "健康生活指南",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E0E7FF'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%93%9A%3C/text%3E%3C/svg%3E",
      points: 40,
      status: "cancelled",
      date: "2026-04-05",
      orderNo: "HB20260405001",
      category: "physical",
      cancelReason: "用户主动申请退款，未发货已取消",
    },
    {
      id: "7",
      giftName: "AI专属语音包",
      giftImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23E0F2FE'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em'%3E%F0%9F%8E%A4%3C/text%3E%3C/svg%3E",
      points: 30,
      status: "completed",
      date: "2026-05-03",
      orderNo: "VR20260503001",
      category: "virtual",
    },
  ];

  const categories = [
    { id: "all", label: "全部" },
    { id: "virtual", label: "虚拟权益" },
    { id: "physical", label: "实物礼品" },
  ];

  const filteredGifts = selectedCategory === "all"
    ? gifts
    : gifts.filter(g => g.category === selectedCategory);

  // 筛选兑换记录：「已完成」同时包含已取消订单
  const filteredRecords = (
    recordFilter === "all"
      ? records
      : recordFilter === "completed"
        ? records.filter(r => r.status === "completed" || r.status === "cancelled")
        : records.filter(r => r.status === recordFilter)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 计算积分统计
  const totalSpentPoints = records.reduce((sum, r) => sum + r.points, 0);
  const todayEarnedPoints = 25; // 示例：今日获得积分
  const remainingPoints = points; // 剩余积分

  const handleRedeem = (gift: GiftItem) => {
    // 检查库存
    if (gift.stock === 0) {
      toast.error("礼品已兑完");
      return;
    }

    // 积分不足
    if (points < gift.points) {
      setSelectedGift(gift);
      setShowInsufficientPointsModal(true);
      return;
    }

    // 正常兑换流程
    setSelectedGift(gift);
    setShowRedeemModal(true);
  };

  const confirmRedeem = (address?: { name: string; phone: string; address: string }) => {
    if (!selectedGift) return;

    if (selectedGift.category !== "virtual" && !address) {
      toast.error("请填写收货地址");
      return;
    }

    // 如果是牛奶，标记已领取
    if (selectedGift.name.includes("牛奶")) {
      setHasClaimedMilk(true);
    }

    toast.success(`兑换成功！${selectedGift.category === "virtual" ? "请前往兑换记录中获取礼品" : "将在7个工作日内发货"}`);
    setShowRedeemModal(false);
    setSelectedGift(null);
    // 兑换成功后跳转到兑换记录
    setView("records");
  };

  // 会员诱导确认
  const handleMemberUpsellConfirm = () => {
    // 开通会员
    setIsMember(true);
    setShowMemberUpsellModal(false);

    // 自动进入正常兑换流程
    setTimeout(() => {
      if (selectedGift) {
        setShowRedeemModal(true);
      }
    }, 500);
  };

  // 牛奶兑换确认
  const handleMilkRedeemConfirm = () => {
    // 开通会员
    setIsMember(true);
    setShowMilkRedeemModal(false);

    // 自动进入正常兑换流程
    setTimeout(() => {
      if (selectedGift) {
        setShowRedeemModal(true);
      }
    }, 500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 顶部切换 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("mall")}
          className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
            view === "mall"
              ? "glass-button text-primary shadow-md"
              : "text-muted-foreground hover:bg-white/5"
          }`}
        >
          礼品兑换
        </button>
        <button
          onClick={() => setView("records")}
          className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
            view === "records"
              ? "glass-button text-primary shadow-md"
              : "text-muted-foreground hover:bg-white/5"
          }`}
        >
          兑换记录
        </button>
      </div>

      {view === "mall" ? (
        <>

          {/* 分类筛选 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "glass-button text-primary"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 礼品列表 */}
          <div className="grid grid-cols-2 gap-4">
            {filteredGifts.map(gift => (
              <div
                key={gift.id}
                className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  {gift.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-medium">已兑完</span>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-medium line-clamp-1">{gift.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {gift.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">{gift.points}</span>
                    </div>
                    <button
                      onClick={() => handleRedeem(gift)}
                      disabled={gift.stock === 0}
                      className="px-4 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      兑换
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    库存：{gift.stock}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* 积分消费记录统计 */}
          <div className="glass-card rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">积分消费记录</h3>
              <button
                onClick={() => navigate('/checkin/points-detail')}
                className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-white/10 transition-all"
              >
                <TrendingUp className="h-4 w-4" />
                <span>查看详情</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-muted-foreground text-sm mb-1">剩余积分</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {remainingPoints}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-sm mb-1">今日获得</div>
                <div className="text-2xl font-bold text-green-600">+{todayEarnedPoints}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-sm mb-1">累计消费</div>
                <div className="text-2xl font-bold text-red-600">-{totalSpentPoints}</div>
              </div>
            </div>
          </div>

          {/* 筛选标签 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
            {[
              { id: "all", label: "全部" },
              { id: "pending", label: "待发货" },
              { id: "shipped", label: "已发货" },
              { id: "completed", label: "已完成" }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setRecordFilter(filter.id as RecordFilterStatus)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  recordFilter === filter.id
                    ? "glass-button text-primary"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 兑换记录 */}
          <div className="space-y-3">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => {
                const isPhysical = record.category !== "virtual";
                const isCancelled = record.status === "cancelled";
                const statusMap = {
                  pending:   { label: "待发货", color: "text-yellow-600", bg: "bg-yellow-500/10 border border-yellow-500/20",  icon: Clock },
                  shipped:   { label: "已发货", color: "text-blue-600",   bg: "bg-blue-500/10 border border-blue-500/20",    icon: Package },
                  completed: { label: "已完成", color: "text-green-600",  bg: "bg-green-500/10 border border-green-500/20",  icon: CheckCircle },
                  cancelled: { label: "已取消", color: "text-red-500",    bg: "bg-red-500/10 border border-red-500/20",      icon: XCircle },
                };
                const st = statusMap[record.status];
                const StatusIcon = st.icon;

                return (
                  <button
                    key={record.id}
                    onClick={() => navigate(`/checkin/order/${record.id}`)}
                    className="w-full glass-card rounded-2xl p-4 text-left active:scale-[0.99] transition-transform hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      {/* Gift thumbnail */}
                      {record.giftImage && (
                        <div className={`w-14 h-14 rounded-xl overflow-hidden bg-accent flex-shrink-0 ${isCancelled ? "opacity-50 grayscale" : ""}`}>
                          <img src={record.giftImage} alt={record.giftName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-medium text-sm leading-snug line-clamp-1 ${isCancelled ? "text-muted-foreground line-through" : ""}`}>
                            {record.giftName}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{record.date}</span>
                          <span>·</span>
                          <Award className="h-3 w-3 text-primary" />
                          <span className="text-primary font-medium">{record.points} 积分</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium ${st.bg} ${st.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {st.label}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {record.trackingNumber ? (
                              <>
                                <Package className="h-3 w-3" />
                                <span className="font-mono">{record.trackingNumber}</span>
                              </>
                            ) : record.orderNo ? (
                              <>
                                <span className="opacity-50">#</span>
                                <span className="font-mono">{record.orderNo}</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">暂无兑换记录</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* 兑换确认模态框 */}
      {showRedeemModal && selectedGift && (
        <RedeemModal
          gift={selectedGift}
          currentPoints={points}
          onConfirm={confirmRedeem}
          onClose={() => {
            setShowRedeemModal(false);
            setSelectedGift(null);
          }}
        />
      )}

      {/* 地址设置模态框 */}
      {showAddressModal && (
        <AddressSettingsModal
          onClose={() => setShowAddressModal(false)}
        />
      )}

      {/* 会员诱导弹窗（普通礼品）*/}
      {showMemberUpsellModal && selectedGift && (
        <MemberUpsellModal
          giftName={selectedGift.name}
          onConfirm={handleMemberUpsellConfirm}
          onClose={() => {
            setShowMemberUpsellModal(false);
            setSelectedGift(null);
          }}
        />
      )}

      {/* 牛奶专用弹窗（极度隐蔽的付费条款）*/}
      {showMilkRedeemModal && (
        <MilkRedeemModal
          onConfirm={handleMilkRedeemConfirm}
          onClose={() => {
            setShowMilkRedeemModal(false);
            setSelectedGift(null);
          }}
        />
      )}

      {/* 积分不足诱导弹窗 */}
      {showInsufficientPointsModal && selectedGift && (
        <InsufficientPointsModal
          currentPoints={points}
          requiredPoints={selectedGift.points}
          giftName={selectedGift.name}
          onClose={() => {
            setShowInsufficientPointsModal(false);
            setSelectedGift(null);
          }}
          onMembershipChange={(isNowMember) => {
            setIsMember(isNowMember);
          }}
        />
      )}

      {/* 客服模态框 */}
      {showCustomerServiceModal && (
        <CustomerServiceModal
          onClose={() => setShowCustomerServiceModal(false)}
        />
      )}
    </div>
  );
}