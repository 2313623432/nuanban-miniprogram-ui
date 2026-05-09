import { useState } from "react";
import { X, MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface AddressSettingsModalProps {
  onClose: () => void;
  onSave?: (address: Address) => void;
}

export function AddressSettingsModal({ onClose, onSave }: AddressSettingsModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "张三",
      phone: "13800138000",
      address: "北京市朝阳区XX路XX号XX小区XX栋XX室",
      isDefault: true
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: "", phone: "", address: "" });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address
    });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error("请填写完整的收货信息");
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error("请输入正确的手机号");
      return;
    }

    let savedAddress: Address;

    if (editingId) {
      savedAddress = { id: editingId, ...formData, isDefault: addresses.find(a => a.id === editingId)?.isDefault || false };
      setAddresses(addresses.map(a =>
        a.id === editingId ? savedAddress : a
      ));
      toast.success("地址修改成功");
    } else {
      savedAddress = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, savedAddress]);
      toast.success("地址添加成功");
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "" });
  };

  const handleConfirm = () => {
    const defaultAddress = addresses.find(a => a.isDefault);
    if (!defaultAddress) {
      toast.error("请先添加收货地址");
      return;
    }

    if (onSave) {
      onSave(defaultAddress);
    }
    onClose();
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("地址删除成功");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    toast.success("已设为默认地址");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between sticky top-0 glass-card z-10 -m-6 p-6 mb-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">收货地址管理</h3>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 添加/编辑表单 */}
        {(isAdding || editingId) && (
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <h4 className="font-medium">{editingId ? "编辑地址" : "新增地址"}</h4>
            <input
              type="text"
              placeholder="收货人姓名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
            />
            <input
              type="tel"
              placeholder="手机号"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
            />
            <textarea
              placeholder="详细地址"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 rounded-xl bg-white/5 text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm"
              >
                保存
              </button>
            </div>
          </div>
        )}

        {/* 地址列表 */}
        <div className="space-y-3">
          {addresses.map(address => (
            <div key={address.id} className="glass-card rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{address.name}</span>
                    <span className="text-muted-foreground">{address.phone}</span>
                    {address.isDefault && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 py-2 rounded-xl bg-white/5 text-sm"
                  >
                    设为默认
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 py-2 rounded-xl bg-white/5 text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 添加地址按钮 */}
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="w-full py-3 rounded-2xl glass-button flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            添加新地址
          </button>
        )}

        {/* 确认按钮 - 当有onSave回调时显示 */}
        {onSave && !isAdding && !editingId && addresses.length > 0 && (
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            确认收货地址
          </button>
        )}
      </div>
    </div>
  );
}
