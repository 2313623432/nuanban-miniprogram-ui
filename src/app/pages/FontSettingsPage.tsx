import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function FontSettingsPage() {
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(2); // 0: 小, 1: 中, 2: 大, 3: 特大
  
  const fontSizes = [
    { id: 0, label: "小", scale: 0.875 },
    { id: 1, label: "中", scale: 1 },
    { id: 2, label: "大", scale: 1.125 },
    { id: 3, label: "特大", scale: 1.25 }
  ];
  
  const currentSize = fontSizes[fontSize];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EA] via-[#FFE8CC] to-[#FFD9B3] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 safe-area-top" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: '1.5px solid rgba(255, 138, 0, 0.2)',
        boxShadow: '0 4px 20px 0 rgba(255, 138, 0, 0.1), 0 1px 4px 0 rgba(255, 138, 0, 0.06)'
      }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 100 }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 100
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-800" style={{ pointerEvents: 'none' }} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">字体大小</h1>
          </div>
        </div>
      </div>
      
      <div className="pt-20 px-4 max-w-2xl mx-auto pb-8 relative z-10">
        {/* Preview */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">预览效果</h3>
          <div
            className="p-4 glass-button rounded-2xl"
            style={{ fontSize: `${currentSize.scale}rem` }}
          >
            <p className="mb-2" style={{ fontSize: `${currentSize.scale * 1.25}rem` }}>
              标题示例文字
            </p>
            <p className="text-muted-foreground leading-relaxed">
              这是一段正文示例，您可以看到当前字体大小的显示效果。调整字体大小可以让您阅读更加舒适。
            </p>
          </div>
        </div>
        
        {/* Size Selector */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">选择字体大小</h3>
          
          {/* Slider */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max="3"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-3 bg-white/30 rounded-full outline-none appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(fontSize / 3) * 100}%, rgba(255,255,255,0.3) ${(fontSize / 3) * 100}%, rgba(255,255,255,0.3) 100%)`
              }}
            />
            
            <div className="flex justify-between mt-2">
              {fontSizes.map((size) => (
                <span
                  key={size.id}
                  className={`text-sm transition-all ${
                    fontSize === size.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {size.label}
                </span>
              ))}
            </div>
          </div>
          
          {/* Size Cards */}
          <div className="grid grid-cols-2 gap-3">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id)}
                className={`p-4 rounded-2xl transition-all ${
                  fontSize === size.id
                    ? "glass-primary shadow-lg"
                    : "glass-button hover:bg-primary/10"
                }`}
              >
                <div
                  className="font-medium mb-1"
                  style={{ fontSize: `${size.scale * 1.125}rem` }}
                >
                  Aa
                </div>
                <div className="text-sm">{size.label}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tips */}
        <div className="glass-button rounded-2xl p-4">
          <p className="text-base text-center text-muted-foreground">
            💡 设置会立即生效，您可以随时调整
          </p>
        </div>
      </div>
    </div>
  );
}