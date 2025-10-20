import { useEffect, useState } from "react";

interface AICoreProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const AICore = ({ isActive, isSpeaking }: AICoreProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div 
        className={`absolute w-64 h-64 rounded-full border-2 border-primary/30 
          ${isActive ? 'jarvis-pulse' : ''}`}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear'
        }}
      />
      <div 
        className={`absolute w-48 h-48 rounded-full border-2 border-accent/40
          ${isSpeaking ? 'jarvis-glow-strong' : isActive ? 'jarvis-glow' : ''}`}
        style={{ 
          transform: `rotate(${-rotation * 1.5}deg)`,
          transition: 'transform 0.05s linear'
        }}
      />
      
      {/* Core circle */}
      <div 
        className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent
          flex items-center justify-center
          ${isSpeaking ? 'jarvis-glow-strong animate-pulse-glow' : isActive ? 'jarvis-glow' : ''}`}
      >
        {/* Inner circles */}
        <div className="absolute w-24 h-24 rounded-full bg-background/50 border border-primary/50" />
        <div className="absolute w-16 h-16 rounded-full bg-background/70 border border-accent/50" />
        <div className="absolute w-8 h-8 rounded-full bg-primary/80 animate-pulse-glow" />
        
        {/* Center dot */}
        <div className="absolute w-3 h-3 rounded-full bg-foreground" />
      </div>

      {/* Scanning effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-full jarvis-scan opacity-50" />
      )}
    </div>
  );
};
