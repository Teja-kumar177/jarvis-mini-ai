import { useEffect, useRef } from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
}

export const VoiceVisualizer = ({ isActive }: VoiceVisualizerProps) => {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !barsRef.current) return;

    const bars = barsRef.current.children;
    const updateBars = () => {
      Array.from(bars).forEach((bar) => {
        const height = Math.random() * 100 + 20;
        (bar as HTMLElement).style.height = `${height}%`;
      });
    };

    const interval = setInterval(updateBars, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center h-24 gap-2" ref={barsRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-100
            ${isActive ? '' : 'h-4'}`}
          style={{
            height: isActive ? '20%' : '16px',
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};
