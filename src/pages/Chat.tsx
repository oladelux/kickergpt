import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI football analyst. Ask me about match predictions, team stats, player performance, or tactical insights!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response (replace with actual OpenAI integration)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a placeholder response. Connect your OpenAI backend to get real football insights!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Football AI Insights
          </h1>
          <p className="text-sm text-muted-foreground">Get expert match analysis and predictions</p>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`rounded-2xl p-4 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any team, match, or player..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
