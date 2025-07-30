import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Languages, Wand2, Trash2, Users } from "lucide-react";

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar?: string;
}

export const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Alice",
      content: "Hey everyone! How's it going?",
      timestamp: "2:30 PM",
      isOwn: false,
    },
    {
      id: "2",
      user: "You",
      content: "Pretty good! Just working on some new designs.",
      timestamp: "2:32 PM",
      isOwn: true,
    },
    {
      id: "3",
      user: "Bob",
      content: "That sounds interesting! What kind of designs?",
      timestamp: "2:33 PM",
      isOwn: false,
    },
    {
      id: "4",
      user: "You",
      content: "Glassmorphism UI components. The frosted glass effect is really beautiful!",
      timestamp: "2:35 PM",
      isOwn: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [roomName] = useState("General");
  const [participantCount] = useState(12);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleTranslate = () => {
    // Placeholder for AI translation
    setNewMessage("Translated: " + newMessage);
  };

  const handleImprove = () => {
    // Placeholder for AI improvement
    setNewMessage("Enhanced: " + newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass-panel border-b border-glass-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">#{roomName}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                {participantCount} participants
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-destructive">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-panel border-glass-border h-[calc(100vh-200px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[70%] ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <Avatar className="w-8 h-8 border border-glass-border">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {message.user[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`glass-panel p-3 rounded-2xl border border-glass-border ${message.isOwn ? "bg-primary/20" : ""}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {message.user}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-foreground">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-glass-border">
              <div className="glass-panel rounded-2xl border border-glass-border p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-base"
                    />
                    
                    {newMessage && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleTranslate}
                          className="rounded-full h-8 px-3 text-xs"
                        >
                          <Languages className="w-3 h-3 mr-1" />
                          Translate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleImprove}
                          className="rounded-full h-8 px-3 text-xs"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          Improve
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                    className="rounded-full glow-primary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};