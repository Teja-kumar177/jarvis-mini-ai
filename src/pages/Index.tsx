import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Send, MicOff } from "lucide-react";
import { AICore } from "@/components/AICore";
import { VoiceVisualizer } from "@/components/VoiceVisualizer";
import { ChatWindow } from "@/components/ChatWindow";
import { QuickActions } from "@/components/QuickActions";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SpeechRecognitionService, TextToSpeechService } from "@/utils/speechRecognition";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Status = "idle" | "listening" | "processing" | "speaking";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { toast } = useToast();
  
  const speechRecognition = useRef(new SpeechRecognitionService());
  const textToSpeech = useRef(new TextToSpeechService());

  useEffect(() => {
    // Check if speech services are supported
    if (!speechRecognition.current.isSupported()) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition. You can still use text input.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendToAI = async (userMessage: string, task?: string) => {
    setStatus("processing");
    
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);

    try {
      const { data, error } = await supabase.functions.invoke("jarvis-chat", {
        body: { 
          messages: [...messages, userMsg],
          task 
        },
      });

      if (error) throw error;

      const assistantMsg: Message = { role: "assistant", content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);

      // Speak the response
      if (textToSpeech.current.isSupported()) {
        setStatus("speaking");
        textToSpeech.current.speak(
          data.reply,
          () => setStatus("idle"),
          (error) => {
            console.error("TTS error:", error);
            setStatus("idle");
          }
        );
      } else {
        setStatus("idle");
      }

    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to communicate with J.A.R.V.I.S.",
        variant: "destructive",
      });
      setStatus("idle");
    }
  };

  const handleVoiceInput = () => {
    if (status === "listening") {
      speechRecognition.current.stop();
      setStatus("idle");
      setIsVoiceMode(false);
      return;
    }

    setStatus("listening");
    setIsVoiceMode(true);

    speechRecognition.current.start(
      (transcript) => {
        setStatus("idle");
        setIsVoiceMode(false);
        if (transcript.trim()) {
          sendToAI(transcript);
        }
      },
      (error) => {
        console.error("Speech recognition error:", error);
        toast({
          title: "Voice Input Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
        setStatus("idle");
        setIsVoiceMode(false);
      }
    );
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "idle") return;
    
    sendToAI(input);
    setInput("");
  };

  const handleTimeClick = () => {
    if (status !== "idle") return;
    sendToAI("What time is it?", "time");
  };

  const handleWeatherClick = async () => {
    if (status !== "idle") return;
    
    setStatus("processing");
    try {
      const { data, error } = await supabase.functions.invoke("get-weather", {
        body: { location: "New York" }, // Default location
      });

      if (error) throw error;

      const weather = data.weather;
      const weatherText = `The weather in ${weather.location} is currently ${weather.description} with a temperature of ${weather.temperature}°F, feels like ${weather.feelsLike}°F. Humidity is at ${weather.humidity}%, with wind speeds of ${weather.windSpeed} mph.`;
      
      sendToAI(weatherText);
    } catch (error: any) {
      console.error("Weather error:", error);
      toast({
        title: "Weather Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
      setStatus("idle");
    }
  };

  const handleClearChat = () => {
    if (status !== "idle") return;
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card p-4 overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-5xl font-bold jarvis-text-glow">J.A.R.V.I.S.</h1>
          <p className="text-muted-foreground">Your Personal Smart AI Assistant</p>
        </div>

        {/* AI Core */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <AICore 
            isActive={status !== "idle"} 
            isSpeaking={status === "speaking"} 
          />
        </div>

        {/* Status */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <StatusIndicator status={status} />
        </div>

        {/* Voice Visualizer */}
        {isVoiceMode && (
          <div className="animate-fade-in">
            <VoiceVisualizer isActive={status === "listening"} />
          </div>
        )}

        {/* Chat Window */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <ChatWindow messages={messages} />
        </div>

        {/* Input Controls */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={status !== "idle"}
              className="flex-1 border-primary/30 bg-card/50 backdrop-blur-sm focus:border-primary jarvis-glow"
            />
            <Button
              type="submit"
              disabled={status !== "idle" || !input.trim()}
              className="bg-primary hover:bg-primary/90 jarvis-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Voice Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleVoiceInput}
              disabled={!speechRecognition.current.isSupported() || status === "processing" || status === "speaking"}
              size="lg"
              className={`rounded-full w-16 h-16 ${
                status === "listening" 
                  ? "bg-destructive hover:bg-destructive/90 jarvis-glow-strong" 
                  : "bg-accent hover:bg-accent/90 jarvis-glow"
              }`}
            >
              {status === "listening" ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <QuickActions
            onTimeClick={handleTimeClick}
            onWeatherClick={handleWeatherClick}
            onClearClick={handleClearChat}
            disabled={status !== "idle"}
          />
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p>Click the microphone to use voice commands, or type your message above.</p>
          <p className="mt-1">Try: "What time is it?" or "How's the weather?"</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
