import { Button } from "@/components/ui/button";
import { Clock, CloudRain, Trash2, Save } from "lucide-react";

interface QuickActionsProps {
  onTimeClick: () => void;
  onWeatherClick: () => void;
  onClearClick: () => void;
  onSaveClick: () => void;
  disabled?: boolean;
}

export const QuickActions = ({ 
  onTimeClick, 
  onWeatherClick, 
  onClearClick,
  onSaveClick,
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
        onClick={onSaveClick}
        disabled={disabled}
        className="border-accent/50 hover:bg-accent/10 hover:border-accent tej-glow"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Chat
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
