import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export function AddressSettingsPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "张三",
      phone: "138****5678",
      address: "北京市朝阳区某某街道某某小区1号楼101室",
      isDefault: true,
    },
    {
      id: "2",
      name: "李四",
      phone: "139****1234",
      address: "上海市浦东新区某某路123号",
      isDefault: false,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Address>>({});

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("已设为默认地址");
  };

  const handleDelete = (id: string) => {
    if (addresses.length === 1) {
      toast.error("至少保留一个地址");
      return;
    }

    const addr = addresses.find(a => a.id === id);
    if (addr?.isDefault) {
      toast.error("默认地址不能删除，请先设置其他默认地址");
      return;
    }

    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("地址已删除");
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setEditForm(addr);
  };

  const handleSaveEdit = () => {
    if (!editForm.name || !editForm.phone || !editForm.address) {
      toast.error("请填写完整信息");
      return;
    }

    setAddresses(addresses.map(addr =>
      addr.id === editingId ? { ...addr, ...editForm } : addr
    ));
    setEditingId(null);
    setEditForm({});
    toast.success("地址已更新");
  };

  const handleAddNew = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setEditForm({
      id: newId,
      name: "",
      phone: "",
      address: "",
      isDefault: false,
    });
  };

  const handleSaveNew = () => {
    if (!editForm.name || !editForm.phone || !editForm.address) {
      toast.error("请填写完整信息");
      return;
    }

    setAddresses([...addresses, editForm as Address]);
    setEditingId(null);
    setEditForm({});
    toast.success("地址已添加");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] pb-24">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 glass-header border-b border-white/10 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-xl glass-button flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold flex-1">地址设置</h1>
          <button
            onClick={handleAddNew}
            className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            新增
          </button>
        </div>
      </div>

      {/* 地址列表 */}
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="glass-card rounded-2xl p-5 space-y-3">
            {editingId === addr.id ? (
              <>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="收货人姓名"
                  className="w-full px-4 py-2 rounded-xl glass-button"
                />
                <input
                  type="tel"
                  value={editForm.phone || ""}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="联系电话"
                  className="w-full px-4 py-2 rounded-xl glass-button"
                />
                <textarea
                  value={editForm.address || ""}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="详细地址"
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl glass-button resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="flex-1 py-2 rounded-xl glass-button"
                  >
                    取消
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{addr.name}</span>
                        <span className="text-muted-foreground">{addr.phone}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            默认
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {addr.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 py-2 rounded-xl glass-button text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      设为默认
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(addr)}
                    className="flex-1 py-2 rounded-xl glass-button text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex-1 py-2 rounded-xl glass-button text-sm font-medium flex items-center justify-center gap-1 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* 新增地址表单 */}
        {editingId && !addresses.find(a => a.id === editingId) && (
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold mb-2">新增地址</h3>
            <input
              type="text"
              value={editForm.name || ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="收货人姓名"
              className="w-full px-4 py-2 rounded-xl glass-button"
            />
            <input
              type="tel"
              value={editForm.phone || ""}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="联系电话"
              className="w-full px-4 py-2 rounded-xl glass-button"
            />
            <textarea
              value={editForm.address || ""}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              placeholder="详细地址"
              rows={3}
              className="w-full px-4 py-2 rounded-xl glass-button resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveNew}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditForm({});
                }}
                className="flex-1 py-2 rounded-xl glass-button"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
