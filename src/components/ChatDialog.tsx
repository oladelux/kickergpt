import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Bot, User, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Match } from "@/services/matches.service";
import { api, ClientError } from "@/lib/api";
import { SubscriptionRecord, SubscriptionUsage } from "@/hooks/useSubscription";
import { MarkdownContent } from "@/components/MarkdownContent";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatDialogProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usage?: SubscriptionUsage | null;
  plan?: SubscriptionRecord | null;
  onAnalysisComplete?: () => void | Promise<void>;
  onPromptLimitReached?: () => void | Promise<void>;
}

export default function ChatDialog({
  match,
  open,
  onOpenChange,
  usage: _usage,
  plan: _plan,
  onAnalysisComplete,
  onPromptLimitReached,
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const conversationCache = useRef<Map<string, Message[]>>(new Map());
  const kickoffLabel = match?.kickoffTime
    ? match.kickoffTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  useEffect(() => {
    if (!match?.id) {
      setMessages([]);
      setInput("");
      setIsThinking(false);
      setLimitReached(false);
      return;
    }
    const cached = conversationCache.current.get(match.id);
    setMessages(cached ?? []);
    setInput("");
    setIsThinking(false);
  }, [match?.id]);

  useEffect(() => {
    if (match?.id) {
      conversationCache.current.set(match.id, messages);
    }
  }, [messages, match?.id]);

  useEffect(() => {
    if (!open) {
      setLimitReached(false);
    }
  }, [open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !match || isThinking) return;
    setLimitReached(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await api.fixtures.analyzeFixture(match.id, {
        message: userMessage.content,
        tone: "concise",
      });

      const assistantContent =
        response.summary ??
        response.analysis ??
        response.message ??
        `I'm having trouble generating an analysis for ${match.homeTeam} vs ${match.awayTeam}.`;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      await onAnalysisComplete?.();
    } catch (error) {
      if (
        error instanceof ClientError &&
        error.status === 403 &&
        error.responseBody?.message === "promptLimitReached"
      ) {
        setLimitReached(true);
        await onPromptLimitReached?.();
      } else {
        console.error("Failed to fetch analysis", error);
        const fallbackMessage: Message = {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: "Sorry, I couldn't fetch the analysis right now. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="max-w-2xl h-[80vh] flex flex-col p-0 sm:rounded-3xl max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:w-full max-sm:max-w-full max-sm:h-[min(88vh,600px)] max-sm:rounded-t-3xl max-sm:border-t max-sm:translate-x-0 max-sm:translate-y-0 max-sm:shadow-2xl"
      >
        <div className="sm:hidden flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
        </div>
        <DialogHeader className="relative px-6 py-4 border-b max-sm:px-4 text-center sm:text-center">
          <DialogTitle className="text-base font-semibold leading-tight sm:text-lg">
            {match ? `${match.homeTeam} vs ${match.awayTeam}` : "Match Chat"}
          </DialogTitle>
          {match && kickoffLabel && (
            <p className="text-xs text-muted-foreground">{`${match.league} • ${kickoffLabel}`}</p>
          )}
          <DialogClose className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/70 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat dialog</span>
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 max-sm:px-4">
          <div className="space-y-4">
            {limitReached && (
              <div className="space-y-3 rounded-2xl border border-destructive/60 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive">Prompt limit reached</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro or buy add-on credits to keep asking Kickergpt about this fixture.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  >
                    <Link to="/plans">Upgrade / Buy credits</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setLimitReached(false)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl p-4 bg-card border border-border">
                  <p className="text-sm text-muted-foreground">
                    Kickergpt is live on this fixture. Ask for scenario breakdowns, tactical pivots,
                    confidence swings, or anything else you need before the whistle.
                  </p>
                </div>
              </div>
            )}
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
                  <MarkdownContent content={message.content} />
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-3 animate-fade-in justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl p-4 bg-card border border-border flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the match..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={isThinking || !input.trim()}
            >
              {isThinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
