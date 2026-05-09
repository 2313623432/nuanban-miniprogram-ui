import { useState } from "react";
import { X, Gift, Award, Truck, AlertCircle, MapPin, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AddressSettingsModal } from "./AddressSettingsModal";

interface GiftItem {
  id: string;
  name: string;
  category: "virtual" | "physical";
  points: number;
  description: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface RedeemModalProps {
  gift: GiftItem;
  currentPoints: number;
  onConfirm: (address?: { name: string; phone: string; address: string }) => void;
  onClose: () => void;
}

export function RedeemModal({ gift, currentPoints, onConfirm, onClose }: RedeemModalProps) {
  // 模拟已保存的地址列表
  const [savedAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "张三",
      phone: "13800138000",
      address: "北京市朝阳区XX路XX号XX小区XX栋XX室",
      isDefault: true
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses.find(a => a.isDefault)?.id || null
  );
  const [showAddressSettings, setShowAddressSettings] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const needsAddress = gift.category !== "virtual";
  const canRedeem = currentPoints >= gift.points;
  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);

  const handleConfirm = () => {
    if (needsAddress) {
      // 如果选择了已保存的地址
      if (selectedAddressId && selectedAddress) {
        onConfirm({
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address
        });
        return;
      }

      // 如果填写了新地址
      if (showNewAddressForm) {
        if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.address.trim()) {
          toast.error("请填写完整的收货信息");
          return;
        }

        if (!/^1[3-9]\d{9}$/.test(newAddress.phone)) {
          toast.error("请输入正确的手机号");
          return;
        }

        onConfirm(newAddress);
        return;
      }

      // 既没选择地址也没填写新地址
      toast.error("请选择收货地址或填写新地址");
      return;
    }

    onConfirm(undefined);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative glass-card rounded-3xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">确认兑换</h3>
                <p className="text-sm text-muted-foreground">{gift.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 礼品信息 */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">礼品名称</span>
              <span className="font-medium">{gift.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">所需积分</span>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{gift.points}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">当前积分</span>
              <span className={canRedeem ? "text-green-500" : "text-red-500"}>
                {currentPoints}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">兑换后余额</span>
              <span className="font-medium">{currentPoints - gift.points}</span>
            </div>
          </div>

          {/* 收货地址选择 */}
          {needsAddress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="font-medium">收货信息</span>
                </div>
                <button
                  onClick={() => setShowAddressSettings(true)}
                  className="text-xs text-primary hover:underline"
                >
                  管理地址
                </button>
              </div>

              {/* 已保存的地址列表 */}
              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-2">
                  {savedAddresses.map(address => (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`w-full glass-card rounded-2xl p-4 text-left transition-all ${
                        selectedAddressId === address.id
                          ? "border-2 border-primary/50 bg-primary/5"
                          : "border border-white/10 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          <span className="text-muted-foreground text-sm">{address.phone}</span>
                          {address.isDefault && (
                            <span className="text-xs px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                              默认
                            </span>
                          )}
                        </div>
                        {selectedAddressId === address.id && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{address.address}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* 新建地址按钮 */}
              {!showNewAddressForm && (
                <button
                  onClick={() => {
                    setShowNewAddressForm(true);
                    setSelectedAddressId(null);
                  }}
                  className="w-full py-3 rounded-2xl glass-button flex items-center justify-center gap-2 text-sm font-medium border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  使用新地址
                </button>
              )}

              {/* 新地址表单 */}
              {showNewAddressForm && (
                <div className="space-y-3 glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">填写新地址</span>
                    <button
                      onClick={() => {
                        setShowNewAddressForm(false);
                        if (savedAddresses.length > 0) {
                          setSelectedAddressId(savedAddresses.find(a => a.isDefault)?.id || savedAddresses[0].id);
                        }
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      取消
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="收货人姓名"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="手机号"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                  />
                  <textarea
                    placeholder="详细地址"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl glass-card border border-white/10 focus:border-primary/50 focus:outline-none transition-all resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* 提示信息 */}
          <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">温馨提示</p>
              <ul className="space-y-1">
                {gift.category === "virtual" ? (
                  <li>• 虚拟权益兑换后即时生效，不可退款</li>
                ) : (
                  <>
                    <li>• 实物礼品7个工作日内发货</li>
                    <li>• 运费由平台承担，仅支持大陆地区配送</li>
                  </>
                )}
                <li>• 兑换成功后积分不可退回</li>
              </ul>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl glass-button font-medium"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canRedeem}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canRedeem ? `确认兑换（-${gift.points}积分）` : "积分不足"}
            </button>
          </div>
        </div>
      </div>

      {/* 地址管理弹窗 */}
      {showAddressSettings && (
        <AddressSettingsModal onClose={() => setShowAddressSettings(false)} />
      )}
    </>
  );
}