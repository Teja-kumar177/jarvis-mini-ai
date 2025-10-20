import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
}

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[400px] w-full rounded-lg border border-primary/30 bg-card/50 backdrop-blur-sm p-4">
      <div ref={scrollRef} className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg jarvis-text-glow">J.A.R.V.I.S. is ready, Sir.</p>
            <p className="text-sm mt-2">Start a conversation by voice or text.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary/20 border border-primary/30 ml-4"
                    : "bg-accent/10 border border-accent/30 mr-4 jarvis-glow"
                }`}
              >
                <p className="text-sm font-medium mb-1 text-primary">
                  {message.role === "user" ? "You" : "J.A.R.V.I.S."}
                </p>
                <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
