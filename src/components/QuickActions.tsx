import { Button } from "@/components/ui/button";
import { Clock, CloudRain, Trash2 } from "lucide-react";

interface QuickActionsProps {
  onTimeClick: () => void;
  onWeatherClick: () => void;
  onClearClick: () => void;
  disabled?: boolean;
}

export const QuickActions = ({ 
  onTimeClick, 
  onWeatherClick, 
  onClearClick,
  disabled 
}: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onTimeClick}
        disabled={disabled}
        className="border-primary/50 hover:bg-primary/10 hover:border-primary jarvis-glow"
      >
        <Clock className="w-4 h-4 mr-2" />
        Tell Time
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onWeatherClick}
        disabled={disabled}
        className="border-primary/50 hover:bg-primary/10 hover:border-primary jarvis-glow"
      >
        <CloudRain className="w-4 h-4 mr-2" />
        Check Weather
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
