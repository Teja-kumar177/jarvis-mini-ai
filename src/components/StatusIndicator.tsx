interface StatusIndicatorProps {
  status: "idle" | "listening" | "processing" | "speaking";
}

export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusConfig = {
    idle: { text: "Ready", color: "text-muted-foreground", glow: false },
    listening: { text: "Listening...", color: "text-accent", glow: true },
    processing: { text: "Processing...", color: "text-primary", glow: true },
    speaking: { text: "Speaking...", color: "text-primary", glow: true },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          config.glow ? "jarvis-pulse animate-pulse-glow bg-primary" : "bg-muted"
        }`}
      />
      <span className={`text-sm font-medium ${config.color} ${config.glow ? "jarvis-text-glow" : ""}`}>
        {config.text}
      </span>
    </div>
  );
};
