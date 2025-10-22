export const ArmorBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card animate-gradient-shift" />
      
      {/* Hexagonal armor pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="100" height="87" patternUnits="userSpaceOnUse">
              <polygon 
                points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                className="text-primary animate-pulse-slow"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>
      
      {/* Glowing orbs with dynamic colors */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow-gold" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow-red" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-pulse-glow-gold" style={{ animationDelay: "0.5s" }} />
      
      {/* Arc reactor inspired circles */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="relative">
          <div className="absolute w-96 h-96 border-2 border-primary rounded-full animate-ping-slow" />
          <div className="absolute w-80 h-80 border-2 border-accent rounded-full animate-ping-slow" style={{ animationDelay: "0.3s" }} />
          <div className="absolute w-64 h-64 border-2 border-primary rounded-full animate-ping-slow" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>
      
      {/* Tech lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-horizontal" />
        <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-scan-horizontal" style={{ animationDelay: "1s" }} />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-horizontal" style={{ animationDelay: "2s" }} />
        
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent animate-scan-vertical" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent animate-scan-vertical" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent animate-scan-vertical" style={{ animationDelay: "0.5s" }} />
      </div>
    </div>
  );
};
