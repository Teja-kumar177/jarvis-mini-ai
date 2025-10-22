import { Button } from "@/components/ui/button";
import { Clock, CloudRain, Trash2, History } from "lucide-react";

interface QuickActionsProps {
  onTimeClick: () => void;
  onWeatherClick: () => void;
  onClearClick: () => void;
  onHistoryClick: () => void;
  disabled?: boolean;
}

export const QuickActions = ({ 
  onTimeClick, 
  onWeatherClick, 
  onClearClick,
  onHistoryClick,
  disabled 
}: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onTimeClick}
        disabled={disabled}
        className="border-primary/50 hover:bg-primary/10 hover:border-primary tej-glow"
      >
        <Clock className="w-4 h-4 mr-2" />
        Tell Time
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onWeatherClick}
        disabled={disabled}
        className="border-primary/50 hover:bg-primary/10 hover:border-primary tej-glow"
      >
        <CloudRain className="w-4 h-4 mr-2" />
        Check Weather
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onHistoryClick}
        disabled={disabled}
        className="border-accent/50 hover:bg-accent/10 hover:border-accent tej-glow"
      >
        <History className="w-4 h-4 mr-2" />
        View History
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClearClick}
        disabled={disabled}
        className="border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear Chat
      </Button>
    </div>
  );
};
