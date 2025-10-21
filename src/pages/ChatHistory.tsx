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
    // Load username from localStorage
    const storedUsername = localStorage.getItem("tej_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // TODO: Fetch chat history from MongoDB
    // Placeholder data for demonstration
    // In the future, this would call:
    // const history = await fetchChatHistory(storedUsername);
    // setChatHistory(history);
    
    // For now, show empty state with instructions
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

        {/* MongoDB Integration Notice */}
        <Card className="p-6 border-accent/30 bg-card/50 backdrop-blur-sm tej-glow animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-accent/10 border border-accent/30">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">MongoDB Integration Coming Soon</h2>
              <p className="text-muted-foreground">
                This page will display your complete chat history once MongoDB is integrated.
              </p>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Planned Features:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• View all past conversations organized by date</li>
                <li>• Search through chat history by keywords</li>
                <li>• Filter by date range or conversation topic</li>
                <li>• Export chat history as PDF or text</li>
                <li>• Delete individual conversations or bulk delete</li>
                <li>• Restore previous conversations to continue chatting</li>
              </ul>
            </div>
            <div className="text-sm text-muted-foreground pt-4 border-t border-border/50">
              <p className="font-semibold mb-2">Technical Implementation Notes:</p>
              <p className="text-xs">
                The backend edge function already includes MongoDB connection placeholders and schema definitions.
                After exporting your project, you can integrate MongoDB by:
              </p>
              <ol className="text-xs mt-2 space-y-1 text-left mx-auto max-w-xl">
                <li>1. Setting up a MongoDB Atlas cluster or local MongoDB instance</li>
                <li>2. Adding the MONGODB_URI environment variable</li>
                <li>3. Uncommenting the MongoDB connection code in the edge functions</li>
                <li>4. Implementing the saveChatToDB and fetchChatHistory functions</li>
              </ol>
            </div>
          </div>
        </Card>

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
