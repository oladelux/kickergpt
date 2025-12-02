import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Bot, User, Loader2, X, Sparkles } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { track } from "@vercel/analytics";

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
  usage,
  plan,
  onAnalysisComplete,
  onPromptLimitReached,
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [showSuggestionTip, setShowSuggestionTip] = useState(false);
  const [limitToastShown, setLimitToastShown] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationCache = useRef<Map<string, Message[]>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const kickoffLabel = match?.kickoffTime
    ? match.kickoffTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;
  const promptUsagePercent = useMemo(() => {
    if (!usage?.monthlyAllowance) return 0;
    return Math.min(100, Math.round((usage.monthlyUsed / usage.monthlyAllowance) * 100));
  }, [usage?.monthlyAllowance, usage?.monthlyUsed]);

  useEffect(() => {
    if (!match?.id) {
      setMessages([]);
      setInput("");
      setIsThinking(false);
      setLimitReached(false);
      setShowSuggestionTip(false);
      setLimitToastShown(false);
      setFollowUpSuggestions([]);
      setConversationId(null);
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
      setLimitToastShown(false);
    }
  }, [open]);

  useEffect(() => {
    if (suggestionsOpen) {
      setShowSuggestionTip(false);
    }
  }, [suggestionsOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, open]);

  const suggestedPrompts = useMemo(() => {
    if (!match) {
      return ["Give me a quick match preview.", "What is each team's recent form?"];
    }
    const matchup = `${match.homeTeam} vs ${match.awayTeam}`;
    return [
      `Give me a quick tactical preview for ${matchup}.`,
      `How does ${match.homeTeam} usually perform under this referee compared to ${match.awayTeam}`,
      `How do these teams perform under similar weather and pitch conditions?`,
      `What does the player ratings system say about these teams?`,
      "Which side has handled fixture congestion better in recent weeks?",
    ];
  }, [match]);

  const sendPrompt = async (promptText: string) => {
    if (!match || isThinking) return;
    const trimmed = promptText.trim();
    if (!trimmed) return;
    setLimitReached(false);
    const wasEmpty = messages.length === 0;
    if (wasEmpty) {
      setShowSuggestionTip(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const response = await api.fixtures.analyzeFixture(match.id, {
        message: trimmed,
        conversationId: conversationId ?? undefined,
        tone: "concise",
      });

      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const rawFollowUps =
        Array.isArray(response.followUpSuggestions) && response.followUpSuggestions.length > 0
          ? response.followUpSuggestions
              .map((s) => (typeof s?.question === "string" ? s.question.trim() : ""))
              .filter(Boolean)
          : [];
      if (rawFollowUps.length) {
        setFollowUpSuggestions(rawFollowUps);
      } else {
        setFollowUpSuggestions([]);
      }

      const assistantContent =
        response.summary ??
        response.analysis ??
        response.message ??
        `I'm having trouble generating an analysis for ${match.homeTeam} vs ${match.awayTeam}.`;
      const shouldAppendSuggestions = wasEmpty && rawFollowUps.length > 0;
      const appendedSuggestions = shouldAppendSuggestions
        ? `\n\n---\n**Want to dig deeper into this match? These are some follow-up questions you can ask:**\n${rawFollowUps
            .map((s) => `- ${s}`)
            .join("\n")}`
        : "";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `${assistantContent}${appendedSuggestions}`,
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
        if (!limitToastShown) {
          toast({
            title: "Prompt limit reached",
            description: "Upgrade to Pro or buy credits to continue chatting about this fixture.",
            variant: "destructive",
          });
          setLimitToastShown(true);
        }
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

  const handleSuggestionClick = (prompt: string) => {
    setSuggestionsOpen(false);
    void sendPrompt(prompt);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !match || isThinking) return;
    const currentInput = input;
    setInput("");
    await sendPrompt(currentInput);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="max-w-2xl h-[80vh] flex flex-col p-0 sm:rounded-3xl max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:w-full max-sm:max-w-full max-sm:h-[min(94vh,700px)] max-sm:rounded-t-3xl max-sm:border-t max-sm:translate-x-0 max-sm:translate-y-0 max-sm:shadow-2xl"
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
          {limitReached && (
            <p className="mt-2 text-xs font-semibold text-destructive">
              You’ve reached your prompt limit for this fixture. Upgrade or buy credits to continue.
            </p>
          )}
          {usage && (
            <div className="mt-3 w-full space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-3 text-left max-sm:mt-2 max-sm:p-2 max-sm:space-y-0">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground/80 max-sm:text-[11px]">
                <span className="uppercase tracking-[0.24em] text-muted-foreground max-sm:hidden">
                  {plan?.plan ?? "FREE"} plan
                </span>
                <span className="text-foreground max-sm:flex-1">
                  <span className="sm:hidden">
                    {usage.monthlyRemaining} {usage.monthlyRemaining === 1 ? 'prompt' : 'prompts'} left
                    {usage.addonCreditsRemaining ? ` + ${usage.addonCreditsRemaining}` : ""}
                  </span>
                  <span className="max-sm:hidden">
                    {usage.monthlyRemaining} left
                    {usage.addonCreditsRemaining ? ` + ${usage.addonCreditsRemaining}` : ""}
                  </span>
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="ml-auto text-[10px] h-6 px-2 sm:hidden"
                  onClick={() => track("upgrade_click_usage_card")}
                >
                  <Link to="/plans">Upgrade</Link>
                </Button>
              </div>
              <Progress value={promptUsagePercent} className="h-2 max-sm:hidden" />
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground max-sm:hidden">
                <span>
                  Used {usage.monthlyUsed} of {usage.monthlyAllowance} this month
                </span>
                {usage.addonCreditsRemaining > 0 && (
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    +{usage.addonCreditsRemaining} add-on credits
                  </Badge>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="ml-auto text-[11px]"
                  onClick={() => track("upgrade_click_usage_card")}
                >
                  <Link to="/plans">Upgrade</Link>
                </Button>
              </div>
            </div>
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
                    onClick={() => track("upgrade_click_limit_reached")}
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
              <>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-2xl p-4 bg-card border border-border">
                    <p className="text-sm text-muted-foreground">
                      Kickergpt is live on this fixture. Ask for scenario breakdowns, tactical
                      pivots, confidence swings, or anything else you need before the whistle.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl border border-border/70 bg-card/70 p-4 w-full">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Quick suggestions</p>
                    <p className="text-xs text-muted-foreground">
                      Tap a question to instantly ask Kickergpt.
                    </p>
                  </div>
                  <div className="grid gap-2 grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="rounded-2xl border border-border/70 bg-secondary/60 px-4 py-3 text-left text-sm font-medium text-foreground/90 transition hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-50"
                        disabled={isThinking}
                        onClick={() => handleSuggestionClick(prompt)}
                      >
                        <span className="block whitespace-normal break-words leading-snug">
                          {prompt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
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
            <div ref={messagesEndRef} />
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
            <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-border/70"
                  disabled={isThinking}
                >
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Show suggested questions</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[min(20rem,90vw)] p-0">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold">Suggested questions</p>
                  <p className="text-xs text-muted-foreground">
                    Click any option to send it immediately.
                  </p>
                </div>
                <ScrollArea className="max-h-64">
                  <div className="flex flex-col divide-y">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="w-full px-4 py-3 text-left text-sm whitespace-normal break-words hover:bg-muted/60 transition-colors"
                        disabled={isThinking}
                        onClick={() => handleSuggestionClick(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
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
          {showSuggestionTip && (
            <p className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-primary" />
              Need inspiration? Tap the sparkles icon to see suggested questions.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
