import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TabBar } from "@/app/components/layout/TabBar";
import {
  ChevronRight,
  User,
  Crown,
  Type,
  Volume2,
  Brain,
  Shield,
  LogOut,
  Headset,
  Users,
  X
} from "lucide-react";
import { MembershipModal } from "@/app/components/MembershipModal";
import { useMembership } from "@/app/contexts/MembershipContext";
import { loadUserProfile, UserProfile } from "@/app/utils/userProfile";

export function ProfilePage() {
  const navigate = useNavigate();
  const { isMember, memberExpiryDate, activateMembership } = useMembership();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactTab, setContactTab] = useState<"customer" | "community">("customer");

  // 从 localStorage 读取用户信息
  const [userInfo, setUserInfo] = useState<UserProfile>(loadUserProfile);

  // 每次进入页面时刷新（从编辑页返回后更新）
  useEffect(() => {
    setUserInfo(loadUserProfile());
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="pt-4 px-4 max-w-2xl mx-auto relative z-10 safe-area-top">

        {/* User Profile Card */}
        <div className="glass-card rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="flex items-start gap-4 relative z-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-lg"></div>
              <img
                src={userInfo.avatar}
                alt="用户头像"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white/50 shadow-xl relative z-10"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-xl font-semibold mb-1">{userInfo.name}</h3>
              <p className="text-base text-muted-foreground">
                {userInfo.age}岁 · {userInfo.gender}
              </p>
              {userInfo.bio ? (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                  {userInfo.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/50 mt-2 italic">
                  点击右侧按钮添加个人简介～
                </p>
              )}
            </div>

            {/* Edit button */}
            <button
              onClick={() => navigate('/profile/edit')}
              className="p-3 glass-button hover:bg-primary/25 rounded-2xl transition-all active:scale-95 shadow-lg flex-shrink-0"
            >
              <User className="h-5 w-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Membership Card */}
        <div
          onClick={() => setShowMemberModal(true)}
          className={`glass-card rounded-3xl p-6 mb-6 cursor-pointer overflow-hidden relative shadow-2xl ${
            isMember ? "border-2 border-primary/40" : ""
          } transition-all hover:shadow-3xl active:scale-[0.98]`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl shadow-lg ${isMember ? "glass-primary" : "glass-button"}`}>
                <Crown className={`h-7 w-7 ${isMember ? "text-white" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {isMember ? "会员已激活" : "开通会员"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isMember ? "畅享随时随地的阅读陪伴" : "限时免费体验"}
                </p>
              </div>
              {isMember && (
                <span className="text-sm font-medium text-primary mr-2">续费</span>
              )}
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="glass-card rounded-3xl overflow-hidden mb-6 shadow-2xl">
          <button
            onClick={() => navigate('/settings/font')}
            className="w-full flex items-center justify-between p-5 hover:bg-primary/10 transition-all border-b border-border"
          >
            <div className="flex items-center gap-4">
              <Type className="h-6 w-6 text-primary" />
              <span className="text-lg">字体大小</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base text-muted-foreground">大</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>

          <button
            onClick={() => navigate('/settings/voice')}
            className="w-full flex items-center justify-between p-5 hover:bg-primary/10 transition-all border-b border-border"
          >
            <div className="flex items-center gap-4">
              <Volume2 className="h-6 w-6 text-primary" />
              <span className="text-lg">声音调节</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/memory')}
            className="w-full flex items-center justify-between p-5 hover:bg-primary/10 transition-all border-b border-border"
          >
            <div className="flex items-center gap-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg">聊天记忆</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/safety')}
            className="w-full flex items-center justify-between p-5 hover:bg-primary/10 transition-all border-b border-border"
          >
            <div className="flex items-center gap-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg">隐私与安全</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/checkin/address-settings')}
            className="w-full flex items-center justify-between p-5 hover:bg-primary/10 transition-all border-b border-border"
          >
            <div className="flex items-center gap-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg">地址设置</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setShowContactModal(true)}
            className="w-full flex items-center justify-between p-5 hover:bg-primary/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <Headset className="h-6 w-6 text-primary" />
              <span className="text-lg">联系我们</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="px-8 py-4 glass-button hover:bg-destructive/20 text-destructive rounded-2xl text-lg border-2 border-destructive/30 flex items-center gap-2 mx-auto shadow-lg transition-all active:scale-95"
          >
            <LogOut className="h-5 w-5" />
            退出登录
          </button>
        </div>
      </div>

      <TabBar />

      {/* Membership Modal */}
      <MembershipModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSuccess={(plan) => activateMembership(plan)}
        isRenewal={isMember}
        expiryDate={isMember ? memberExpiryDate : undefined}
      />

      {/* Contact Us Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="glass-card rounded-3xl p-6 max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-xl glass-button flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 标题 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">联系我们</h2>
              <p className="text-sm text-muted-foreground">
                选择您需要的服务
              </p>
            </div>

            {/* 标签切换 */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setContactTab("customer")}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                  contactTab === "customer"
                    ? "glass-button text-primary shadow-md border-2 border-primary/20"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                咨询客服
              </button>
              <button
                onClick={() => setContactTab("community")}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                  contactTab === "community"
                    ? "glass-button text-primary shadow-md border-2 border-primary/20"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                加入社群
              </button>
            </div>

            {contactTab === "customer" ? (
              <>
                {/* 客服二维码 */}
                <div className="text-center mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
                    <Headset className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">咨询客服</h3>
                  <p className="text-sm text-muted-foreground">
                    如果您有任何付费、退费等问题<br />请扫码咨询客服
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 mb-4">
                  <div className="aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23fff'/%3E%3Ctext x='50%25' y='35%25' font-size='48' text-anchor='middle' fill='%2307C160'%3E%F0%9F%92%AC%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' fill='%23666'%3E客服二维码%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='12' text-anchor='middle' fill='%23999'%3E付费/退费咨询%3C/text%3E%3C/svg%3E"
                      alt="客服二维码"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">服务时间</span>
                    <span className="font-medium">工作日 9:00-18:00</span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-white/10">
                    客服可协助处理：付费问题、退费问题、商品发货、物流查询、会员权益等
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 社群二维码 */}
                <div className="text-center mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">加入用户社群</h3>
                  <p className="text-sm text-muted-foreground">
                    认识志同道合的朋友<br />友好交流使用体验
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 mb-4">
                  <div className="aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23fff'/%3E%3Ctext x='50%25' y='35%25' font-size='48' text-anchor='middle' fill='%2310B981'%3E%F0%9F%91%A5%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' fill='%23666'%3E社群二维码%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='12' text-anchor='middle' fill='%23999'%3E暖伴用户交流群%3C/text%3E%3C/svg%3E"
                      alt="社群二维码"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <h4 className="text-sm font-semibold mb-2 text-green-700 dark:text-green-600">社群福利</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 与其他用户交流健康经验</li>
                    <li>• 分享使用心得和技巧</li>
                    <li>• 获取第一手产品更新资讯</li>
                    <li>• 参与社群专属活动</li>
                  </ul>
                </div>
              </>
            )}

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 py-3 rounded-2xl glass-button font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
