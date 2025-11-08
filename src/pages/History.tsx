import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Loader2, RefreshCw, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { api, FixtureChatMessage } from "@/lib/api";
import { useMatches } from "@/hooks/useMatches";

type ChatHistoryEntry = Omit<FixtureChatMessage, "createdAt"> & {
  createdAt: Date;
};

type DecoratedChatHistoryEntry = ChatHistoryEntry & {
  fixtureLabel: string;
  isFallbackLabel: boolean;
};

type FixtureHistoryGroup = {
  fixtureId: number;
  fixtureLabel: string;
  isFallbackLabel: boolean;
  chats: DecoratedChatHistoryEntry[];
};

type FixtureNameMap = Record<number, string>;

const HISTORY_LIMIT = 50;

const formatRelativeDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MATCHUP_REGEX =
  /([A-Za-z0-9 .,'’&()/_-]{2,60})\s+(?:vs\.?|versus|v\.?)\s+([A-Za-z0-9 .,'’&()/_-]{2,60})/i;
const METADATA_LABEL_KEYS = [
  "fixtureName",
  "fixtureLabel",
  "fixtureTitle",
  "matchLabel",
  "matchTitle",
  "matchName",
  "matchup",
  "title",
  "label",
  "name",
];
const TEAM_NAME_CANDIDATE_KEYS = [
  "name",
  "teamName",
  "displayName",
  "shortName",
  "short_name",
  "fullName",
  "code",
];
const HOME_TEAM_KEYS = ["homeTeam", "home_team", "home", "homeName", "homeTeamName", "localTeam"];
const AWAY_TEAM_KEYS = ["awayTeam", "away_team", "away", "awayName", "awayTeamName", "visitorTeam"];

const extractString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length ? normalized : null;
};

const sanitizeTeamName = (value: string): string =>
  value.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

const extractTeamName = (value: unknown): string | null => {
  if (typeof value === "string") {
    const sanitized = sanitizeTeamName(value);
    return sanitized.length ? sanitized : null;
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of TEAM_NAME_CANDIDATE_KEYS) {
      const nested = extractString(obj[key]);
      if (nested) {
        return sanitizeTeamName(nested);
      }
    }
  }

  return null;
};

const findTeamNamesDeep = (
  value: unknown,
  depth = 0
): { home?: string | null; away?: string | null } => {
  if (!value || depth > 3) {
    return {};
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = findTeamNamesDeep(item, depth + 1);
      if (nested.home && nested.away) {
        return nested;
      }
    }
    return {};
  }

  if (typeof value !== "object") {
    return {};
  }

  const obj = value as Record<string, unknown>;
  const home = HOME_TEAM_KEYS.map((key) => extractTeamName(obj[key])).find(Boolean);
  const away = AWAY_TEAM_KEYS.map((key) => extractTeamName(obj[key])).find(Boolean);
  if (home && away) {
    return { home, away };
  }

  for (const nestedValue of Object.values(obj)) {
    const nested = findTeamNamesDeep(nestedValue, depth + 1);
    if (nested.home && nested.away) {
      return nested;
    }
  }

  return { home, away };
};

const getTeamsLabelFromMetadata = (metadata: Record<string, unknown>): string | null => {
  const { home, away } = findTeamNamesDeep(metadata);
  if (home && away) {
    return `${home} vs ${away}`;
  }
  return null;
};

const getLabelFromMetadata = (metadata?: FixtureChatMessage["metadata"]): string | null => {
  if (!metadata || typeof metadata !== "object") return null;
  const meta = metadata as Record<string, unknown>;

  for (const key of METADATA_LABEL_KEYS) {
    const value = extractString(meta[key]);
    if (value) {
      return value;
    }
  }

  const teamsLabel = getTeamsLabelFromMetadata(meta);
  if (teamsLabel) {
    return teamsLabel;
  }

  const fixture = meta["fixture"];
  if (fixture && typeof fixture === "object") {
    const fixtureRecord = fixture as Record<string, unknown>;
    for (const key of METADATA_LABEL_KEYS) {
      const nested = extractString(fixtureRecord[key]);
      if (nested) {
        return nested;
      }
    }
    const nestedTeamsLabel = getTeamsLabelFromMetadata(fixtureRecord);
    if (nestedTeamsLabel) {
      return nestedTeamsLabel;
    }
  }

  const context = meta["context"];
  if (context && typeof context === "object") {
    const contextLabel = getTeamsLabelFromMetadata(context as Record<string, unknown>);
    if (contextLabel) {
      return contextLabel;
    }
  }

  return null;
};

const extractMatchupFromText = (text?: string | null): string | null => {
  if (!text) return null;
  const match = text.match(MATCHUP_REGEX);
  if (!match) return null;

  const home = sanitizeTeamName(match[1] ?? "");
  const away = sanitizeTeamName(match[2] ?? "");
  if (!home || !away) return null;
  return `${home} vs ${away}`;
};

const deriveFixtureLabel = (
  entry: ChatHistoryEntry,
  fixtureNameMap: FixtureNameMap
): { label: string; isFallback: boolean } => {
  const knownLabel = fixtureNameMap[entry.fixtureId];
  if (knownLabel) {
    return { label: knownLabel, isFallback: false };
  }

  const metadataLabel = getLabelFromMetadata(entry.metadata);
  if (metadataLabel) {
    return { label: metadataLabel, isFallback: false };
  }

  const textLabel = extractMatchupFromText(entry.message) ?? extractMatchupFromText(entry.summary);
  if (textLabel) {
    return { label: textLabel, isFallback: false };
  }

  return { label: `Fixture ${entry.fixtureId}`, isFallback: true };
};

const getMetadataBadges = (metadata?: FixtureChatMessage["metadata"]) => {
  if (!metadata || typeof metadata !== "object") return [];
  const meta = metadata as Record<string, unknown>;
  const badgeKeys = ["league", "competition", "stage", "market", "focus", "scope"];

  const badges = badgeKeys
    .map((key) => meta[key])
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  const tags = meta["tags"];
  if (Array.isArray(tags)) {
    tags.forEach((tag) => {
      if (typeof tag === "string" && tag.trim()) {
        badges.push(tag.trim());
      }
    });
  }

  return Array.from(new Set(badges)).slice(0, 4);
};

const normalizeChats = (chats: FixtureChatMessage[]): ChatHistoryEntry[] =>
  chats
    .map((chat) => {
      const createdAt = new Date(chat.createdAt ?? "");
      const safeDate = Number.isNaN(createdAt.getTime()) ? new Date() : createdAt;
      return { ...chat, createdAt: safeDate };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export default function History() {
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const { matches } = useMatches();

  const fixtureNameMap = useMemo<FixtureNameMap>(() => {
    return matches.reduce((acc, match) => {
      const matchId = Number(match.id);
      if (!Number.isNaN(matchId)) {
        acc[matchId] = `${match.homeTeam} vs ${match.awayTeam}`;
      }
      return acc;
    }, {} as FixtureNameMap);
  }, [matches]);

  const decoratedHistory = useMemo<DecoratedChatHistoryEntry[]>(() => {
    return history.map((entry) => {
      const { label, isFallback } = deriveFixtureLabel(entry, fixtureNameMap);
      return { ...entry, fixtureLabel: label, isFallbackLabel: isFallback };
    });
  }, [history, fixtureNameMap]);

  const groupedHistory = useMemo<FixtureHistoryGroup[]>(() => {
    const groups = new Map<number, FixtureHistoryGroup>();

    decoratedHistory.forEach((entry) => {
      const existing = groups.get(entry.fixtureId);
      if (existing) {
        existing.chats.push(entry);
        if (existing.isFallbackLabel && !entry.isFallbackLabel) {
          existing.fixtureLabel = entry.fixtureLabel;
          existing.isFallbackLabel = false;
        }
      } else {
        groups.set(entry.fixtureId, {
          fixtureId: entry.fixtureId,
          fixtureLabel: entry.fixtureLabel,
          isFallbackLabel: entry.isFallbackLabel,
          chats: [entry],
        });
      }
    });

    return Array.from(groups.values()).sort((a, b) => {
      const latestA = a.chats[0]?.createdAt.getTime() ?? 0;
      const latestB = b.chats[0]?.createdAt.getTime() ?? 0;
      return latestB - latestA;
    });
  }, [decoratedHistory]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const chats = await api.fixtures.getUserChats({ limit: HISTORY_LIMIT });
      if (isMountedRef.current) {
        setHistory(normalizeChats(chats));
      }
    } catch (err) {
      if (isMountedRef.current) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your chat history. Please try again.";
        setError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadHistory();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-20 md:pb-4 md:pt-20">
      <TopNav />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Chat History
            </h1>
            <p className="text-muted-foreground">
              Revisit every fixture analysis you&apos;ve requested from the Boot Room Bot.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
            className="gap-2 self-start md:self-center"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {loading && groupedHistory.length === 0 ? (
          <HistorySkeleton />
        ) : error ? (
          <Card className="bg-card/50 backdrop-blur-sm border-destructive/40">
            <CardContent className="py-10 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Clock className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Unable to load chat history</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="default" onClick={loadHistory}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : groupedHistory.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="py-12 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">No conversations yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start a chat from the matches tab to see your AI summaries here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {groupedHistory.map((group) => {
              const latestChat = group.chats[0];
              const lastUpdatedLabel = latestChat
                ? formatRelativeDate(latestChat.createdAt)
                : "Recently";

              return (
                <AccordionItem
                  key={group.fixtureId}
                  value={`fixture-${group.fixtureId}`}
                  className="rounded-2xl border border-border bg-card/50 px-4 backdrop-blur-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between w-full">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{group.fixtureLabel}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lastUpdatedLabel}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-background/80 text-xs uppercase">
                          Fixture ID {group.fixtureId}
                        </Badge>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {group.chats.length} {group.chats.length === 1 ? "message" : "messages"}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pb-4">
                      {group.chats.map((entry) => {
                        const metadataBadges = getMetadataBadges(entry.metadata);
                        return (
                          <div
                            key={entry.id}
                            className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {formatRelativeDate(entry.createdAt)}
                              </div>
                              {entry.tone && (
                                <Badge
                                  variant="secondary"
                                  className="capitalize bg-primary/10 text-primary"
                                >
                                  {entry.tone}
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                  Your question
                                </p>
                                <CardDescription className="text-base text-foreground">
                                  {entry.message}
                                </CardDescription>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                  AI summary
                                </p>
                                <p className="text-sm leading-relaxed text-foreground">
                                  {entry.summary}
                                </p>
                              </div>
                            </div>

                            {metadataBadges.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {metadataBadges.map((badge) => (
                                  <Badge
                                    key={`${entry.id}-${badge}`}
                                    variant="secondary"
                                    className="bg-primary/10 text-primary hover:bg-primary/20"
                                  >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="bg-card/40 border-border/60">
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 2 }).map((_, innerIndex) => (
              <div
                key={innerIndex}
                className="space-y-3 rounded-2xl border border-border/60 bg-background/50 p-4"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
