import { useEffect, useRef, useState } from "react";

interface VoiceWaveProps {
  amplitude: number; // 0-1 之间的振幅值
  barCount?: number; // 声波条的数量
}

export function VoiceWave({ amplitude, barCount = 20 }: VoiceWaveProps) {
  const [bars, setBars] = useState<number[]>(new Array(barCount).fill(0));
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.08;
      
      const newBars = Array.from({ length: barCount }, (_, i) => {
        // 使用多个正弦波叠加，创造更自然的波形
        const wave1 = Math.sin(timeRef.current * 2 + i * 0.5);
        const wave2 = Math.sin(timeRef.current * 3 + i * 0.3) * 0.5;
        const wave3 = Math.sin(timeRef.current * 1.5 + i * 0.7) * 0.3;
        
        const combined = (wave1 + wave2 + wave3) / 1.8;
        
        // 根据振幅调整高度
        const baseHeight = 4;
        const maxHeight = 48;
        
        // 即使amplitude为0，也保持基础高度
        const normalizedValue = (Math.abs(combined) * amplitude);
        const height = amplitude > 0 
          ? baseHeight + (maxHeight - baseHeight) * normalizedValue
          : baseHeight;
        
        return height;
      });
      
      setBars(newBars);
      animationRef.current = requestAnimationFrame(animate);
    };

    // 始终运行动画
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [amplitude, barCount]);

  return (
    <div className="flex items-center gap-1 h-12 mb-3">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full transition-all duration-100 ease-out"
          style={{
            height: `${height}px`,
            opacity: 0.5 + amplitude * 0.5,
          }}
        />
      ))}
    </div>
  );
}