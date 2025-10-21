import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Send, MicOff, User, StopCircle } from "lucide-react";
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
  const [username, setUsername] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const speechRecognition = useRef(new SpeechRecognitionService());
  const textToSpeech = useRef(new TextToSpeechService());

  useEffect(() => {
    // Load username from localStorage
    const storedUsername = localStorage.getItem("tej_username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Prompt for username on first visit
      const name = prompt("Welcome to Tej! What's your name?");
      if (name) {
        setUsername(name);
        localStorage.setItem("tej_username", name);
      }
    }

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

    // Request microphone permission first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setStatus("listening");
        setIsVoiceMode(true);

        toast({
          title: "Listening...",
          description: "Speak now. I'm listening, Sir.",
        });

        speechRecognition.current.start(
          (transcript) => {
            console.log("Transcript received:", transcript);
            setStatus("idle");
            setIsVoiceMode(false);
            if (transcript.trim()) {
              sendToAI(transcript);
            } else {
              toast({
                title: "No Speech",
                description: "I didn't catch that. Please try again.",
              });
            }
          },
          (error) => {
            console.error("Speech recognition error:", error);
            toast({
              title: "Voice Input Error",
              description: error || "Failed to recognize speech. Please try again.",
              variant: "destructive",
            });
            setStatus("idle");
            setIsVoiceMode(false);
          }
        );
      })
      .catch((error) => {
        console.error("Microphone permission error:", error);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive",
        });
      });
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

  const handleSaveChat = () => {
    if (status !== "idle") return;
    // TODO: Implement save to MongoDB
    toast({
      title: "Save Chat (Coming Soon)",
      description: "Chat history saving will be implemented with MongoDB integration.",
    });
  };

  const handleStopSpeaking = () => {
    textToSpeech.current.stop();
    setStatus("idle");
    toast({
      title: "Speech Stopped",
      description: "Text-to-speech has been stopped.",
    });
  };

  const handleViewHistory = () => {
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card p-4 overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Username Display */}
        {username && (
          <div className="absolute top-0 right-0 flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg px-4 py-2 tej-glow">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{username}</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in pt-12">
          <h1 className="text-5xl font-bold tej-text-glow">Tej</h1>
          <p className="text-muted-foreground">Your Smart AI Assistant</p>
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
              className="flex-1 border-primary/30 bg-card/50 backdrop-blur-sm focus:border-primary tej-glow"
            />
            <Button
              type="submit"
              disabled={status !== "idle" || !input.trim()}
              className="bg-primary hover:bg-primary/90 tej-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Voice Button */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleVoiceInput}
              disabled={!speechRecognition.current.isSupported() || status === "processing" || status === "speaking"}
              size="lg"
              className={`rounded-full w-16 h-16 ${
                status === "listening" 
                  ? "bg-destructive hover:bg-destructive/90 tej-glow-strong" 
                  : "bg-accent hover:bg-accent/90 tej-glow"
              }`}
            >
              {status === "listening" ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            {status === "speaking" && (
              <Button
                onClick={handleStopSpeaking}
                size="lg"
                className="rounded-full w-16 h-16 bg-destructive hover:bg-destructive/90 tej-glow animate-pulse"
              >
                <StopCircle className="w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <QuickActions
            onTimeClick={handleTimeClick}
            onWeatherClick={handleWeatherClick}
            onSaveClick={handleSaveChat}
            onHistoryClick={handleViewHistory}
            onClearClick={handleClearChat}
            disabled={status !== "idle"}
          />
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p>Click the microphone to use voice commands, or type your message above.</p>
          <p className="mt-1 text-primary/70">💡 Tip: Click mic, wait for "Listening...", then speak clearly</p>
          <p className="mt-1">Try: "What time is it?" or "How's the weather?"</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
