import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  spu: string; // 商品SPU，用于去重
  name: string;
  description: string;
  imageUrl: string;
  points: number;
  stock?: number;
}

interface DialogAdCardProps {
  product: Product;
  onDismiss: () => void;
  onNotInterested: (productSpu: string) => void;
}

export function DialogAdCard({ product, onDismiss, onNotInterested }: DialogAdCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // 上报广告曝光埋点
    reportAdEvent('dialog_ad_show', product.id);
  }, [product.id]);

  const reportAdEvent = (eventName: string, productId: string, extra?: any) => {
    try {
      // 模拟埋点上报
      const eventData = {
        event: eventName,
        productId,
        timestamp: Date.now(),
        ...extra
      };

      // 实际项目中这里应该调用埋点SDK
      console.log('Ad Event:', eventData);

      // 保存到本地，失败时可以补报
      const pendingEvents = JSON.parse(localStorage.getItem('pendingAdEvents') || '[]');
      pendingEvents.push(eventData);
      localStorage.setItem('pendingAdEvents', JSON.stringify(pendingEvents));
    } catch (error) {
      console.error('Failed to report ad event:', error);
    }
  };

  const handleClick = () => {
    // 上报点击埋点
    reportAdEvent('dialog_ad_click', product.id);

    // 模拟跳转商品详情页
    toast.success("正在跳转商品详情...", {
      description: `${product.name} - ${product.points}积分`
    });

    // 实际项目中跳转到商品详情页
    // navigate(`/product/${product.id}?source=dialog_ad`);
  };

  const handleNotInterested = () => {
    // 上报负反馈埋点
    reportAdEvent('dialog_ad_feedback', product.id, { feedback: 'not_interested' });

    // 记录30天不展示
    onNotInterested(product.spu);

    // 关闭菜单
    setShowMenu(false);

    // 卡片消失
    onDismiss();

    toast.info("已标记为不感兴趣", {
      description: "30天内不再推荐此商品"
    });
  };

  return (
    <div className="w-full my-3">
      {/* 广告标识栏 */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          {/* 品牌图标 */}
          <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-xs font-bold">暖</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">暖伴积分商城</div>
            <div className="text-xs text-muted-foreground">Sponsored</div>
          </div>
        </div>

        {/* 菜单按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>

          {/* 下拉菜单 */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[140px]">
                <button
                  onClick={handleNotInterested}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  不感兴趣
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    toast.info("已隐藏此广告");
                    onDismiss();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  隐藏广告
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 商品卡片 */}
      <div
        onClick={handleClick}
        className="glass-card rounded-2xl p-4 bg-white/80 border border-gray-200 cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-3">
          {/* 商品图片 */}
          <div className="flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3E商品%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* 商品信息 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-1 mb-1">
              {product.name}
            </h3>
            <div className="text-sm text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </div>
            <div className="flex items-center gap-3 text-sm">
              {product.stock && product.stock > 0 && (
                <span className="text-green-600 font-medium">有货</span>
              )}
              <span className="text-primary font-bold">{product.points} 积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
