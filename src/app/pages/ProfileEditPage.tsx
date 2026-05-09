import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { loadUserProfile, saveUserProfile, UserProfile } from "@/app/utils/userProfile";

export function ProfileEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 从 localStorage 初始化
  const [userInfo, setUserInfo] = useState<UserProfile>(loadUserProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("图片不能超过5MB，请重新选择");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUserInfo((prev) => ({ ...prev, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!userInfo.name.trim()) {
      alert("姓名不能为空");
      return;
    }
    saveUserProfile(userInfo);
    setSaveSuccess(true);
    setTimeout(() => {
      navigate("/profile");
    }, 600);
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative">
      {/* Background blobs - pointer-events-none 确保不遮挡 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl" />
      </div>

      {/* Header — z-50 确保在所有内容之上 */}
      <div className="fixed top-0 left-0 right-0 glass-header z-50 safe-area-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 p-2 glass-button hover:bg-primary/25 rounded-full transition-all active:scale-95"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="text-base pr-1">返回</span>
          </button>

          <h1 className="text-xl font-medium">编辑个人信息</h1>

          <button
            onClick={handleSave}
            className="px-5 py-2 glass-primary rounded-xl font-medium active:scale-95 transition-all"
          >
            {saveSuccess ? "已保存 ✓" : "保存"}
          </button>
        </div>
      </div>

      {/* 内容区 — pt-20 留出 header 高度，z-10 低于 header */}
      <div className="pt-20 px-4 max-w-2xl mx-auto pb-10 relative z-10">
        {/* Avatar */}
        <div className="glass-card rounded-3xl p-6 mb-6 text-center">
          <div className="relative inline-block mb-3">
            <img
              src={userInfo.avatar}
              alt="头像"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/30 shadow-lg"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-2.5 glass-primary rounded-full shadow-lg active:scale-90 transition-all"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">点击相机图标更换头像</p>
          {/* 隐藏的文件输入框 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form */}
        <div className="glass-card rounded-3xl p-5 mb-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">姓名</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full p-4 glass-input rounded-2xl text-base outline-none"
              placeholder="请输入姓名"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">年龄</label>
            <input
              type="number"
              value={userInfo.age}
              onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
              className="w-full p-4 glass-input rounded-2xl text-base outline-none"
              placeholder="请输入年龄"
              min={1}
              max={130}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">性别</label>
            <div className="flex gap-3">
              <button
                onClick={() => setUserInfo({ ...userInfo, gender: "男" })}
                className={`flex-1 py-4 rounded-2xl font-medium transition-all active:scale-95 ${
                  userInfo.gender === "男" ? "glass-primary" : "glass-button hover:bg-primary/10"
                }`}
              >
                男
              </button>
              <button
                onClick={() => setUserInfo({ ...userInfo, gender: "女" })}
                className={`flex-1 py-4 rounded-2xl font-medium transition-all active:scale-95 ${
                  userInfo.gender === "女" ? "glass-primary" : "glass-button hover:bg-primary/10"
                }`}
              >
                女
              </button>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-muted-foreground">个人简介</label>
              <span className={`text-xs ${userInfo.bio.length >= 20 ? "text-red-400" : "text-muted-foreground/60"}`}>
                {userInfo.bio.length}/20
              </span>
            </div>
            <textarea
              value={userInfo.bio}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  setUserInfo({ ...userInfo, bio: e.target.value });
                }
              }}
              className="w-full p-4 glass-input rounded-2xl text-base outline-none resize-none leading-relaxed"
              placeholder="介绍一下自己吧，让更多朋友认识你～"
              rows={3}
              maxLength={20}
            />
          </div>
        </div>

        <div className="glass-button rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 个人信息将用于提供更精准的健康服务
          </p>
        </div>
      </div>
    </div>
  );
}