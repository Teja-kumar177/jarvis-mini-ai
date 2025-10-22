import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Calendar, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatHistoryItem {
  id: string;
  username: string;
  message: string;
  reply: string;
  timestamp: Date;
  sessionId: string;
}

const ChatHistory = () => {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchHistory = async () => {
      // Load username from localStorage
      const storedUsername = localStorage.getItem("tej_username");
      if (storedUsername) {
        setUsername(storedUsername);
        
        // Fetch chat history from database
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('username', storedUsername)
          .order('timestamp', { ascending: false })
          .limit(50);
        
        if (error) {
          console.error('Error fetching chat history:', error);
        } else if (data) {
          setChatHistory(data.map(item => ({
            id: item.id,
            username: item.username,
            message: item.message,
            reply: item.reply,
            timestamp: new Date(item.timestamp),
            sessionId: item.session_id
          })));
        }
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card p-4">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 hover:border-primary tej-glow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold tej-text-glow">Chat History</h1>
            {username && <p className="text-muted-foreground mt-1">For user: {username}</p>}
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Chat History Stats */}
        {chatHistory.length > 0 && (
          <Card className="p-6 border-accent/30 bg-card/50 backdrop-blur-sm tej-glow animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{chatHistory.length}</div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  {new Set(chatHistory.map(item => item.sessionId)).size}
                </div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
            </div>
          </Card>
        )}

        {/* Placeholder History List */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <ScrollArea className="h-[400px] w-full rounded-lg border border-primary/30 bg-card/50 backdrop-blur-sm p-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No chat history available yet</p>
                <p className="text-sm mt-2">Start chatting with Tej to build your conversation history!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((item) => (
                  <Card key={item.id} className="p-4 border-primary/20 bg-gradient-to-br from-card to-secondary tej-glow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs text-accent">{item.sessionId.substring(0, 8)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-primary/10 rounded p-2">
                        <p className="text-xs font-medium text-primary mb-1">You:</p>
                        <p className="text-sm">{item.message}</p>
                      </div>
                      <div className="bg-accent/10 rounded p-2">
                        <p className="text-xs font-medium text-accent mb-1">Tej:</p>
                        <p className="text-sm">{item.reply}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
