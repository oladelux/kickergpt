import { Link, useLocation } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  User,
  Heart,
  CreditCard,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { track } from "@vercel/analytics";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionData } from "@/hooks/useSubscription";
import { useGeoCountry } from "@/hooks/useGeoCountry";
import { useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import { isNativeMobile } from "@/lib/platform";

const navItems = [
  { icon: MessageCircle, label: "Fixtures", path: "/fixtures" },
  { icon: Target, label: "Strategies", path: "/strategies" },
  { icon: Clock, label: "History", path: "/history" },
];

interface TopNavProps {
  onFilterClick?: () => void;
  selectedLeagueKey?: string | null;
  leagueName?: string;
}

const TopNav = memo(function TopNav({ onFilterClick, selectedLeagueKey, leagueName }: TopNavProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { plan: subscriptionPlan, usage, loading: subscriptionLoading } = useSubscriptionData();
  const { resolvedCountryCode } = useGeoCountry();

  // Get plan display name
  const getPlanDisplayName = () => {
    if (!subscriptionPlan) return "FREE";
    const plan = subscriptionPlan.plan;
    if (plan === "PRO") return "PRO";
    if (plan === "MONTHLY_UNLIMITED") return "Monthly Unlimited";
    if (plan === "THREE_DAY_PASS") return "3-Day Pass";
    if (plan === "SEVEN_DAY_PASS") return "7-Day Pass";
    return "FREE";
  };

  // Get usage display text
  const getUsageDisplay = () => {
    if (!usage) return { remaining: 0, used: 0, allowance: 0, isUnlimited: false };

    const isNigerian = resolvedCountryCode === "NG";
    const planName = subscriptionPlan?.plan;

    // For Nigerian users on Monthly Unlimited or PRO, show unlimited
    if (isNigerian && (planName === "MONTHLY_UNLIMITED" || planName === "PRO")) {
      return {
        remaining: Infinity,
        used: usage.monthlyUsed,
        allowance: Infinity,
        isUnlimited: true,
      };
    }

    // For 3-day or 7-day passes, show unlimited
    if (isNigerian && (planName === "THREE_DAY_PASS" || planName === "SEVEN_DAY_PASS")) {
      return {
        remaining: Infinity,
        used: usage.monthlyUsed,
        allowance: Infinity,
        isUnlimited: true,
      };
    }

    // For FREE and other plans, show actual numbers
    return {
      remaining: usage.monthlyRemaining > 0 ? usage.monthlyRemaining : usage.totalCreditsRemaining,
      used: usage.monthlyUsed,
      allowance: usage.monthlyAllowance,
      isUnlimited: false,
    };
  };

  const usageDisplay = getUsageDisplay();
  const planDisplayName = getPlanDisplayName();

  const usagePercent = useMemo(() => {
    if (usageDisplay.isUnlimited || !usageDisplay.allowance) return 0;
    return Math.min(100, Math.round((usageDisplay.used / usageDisplay.allowance) * 100));
  }, [usageDisplay.allowance, usageDisplay.used, usageDisplay.isUnlimited]);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.trim()?.[0]?.toUpperCase() || "";
    const last = lastName?.trim()?.[0]?.toUpperCase() || "";
    return first + last;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const isMobile = isNativeMobile();

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-card/95",
        !isMobile && "backdrop-blur"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            kicker<span className="bold text-primary">GPT</span>
          </Link>

          {/* Mobile: Filter button and badge - only on /fixtures route */}
          {location.pathname === "/fixtures" && onFilterClick && (
            <div className="flex items-center gap-2 lg:hidden">
              {selectedLeagueKey && leagueName && (
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs flex-shrink-0 truncate max-w-[150px]"
                >
                  {leagueName}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 gap-1.5 sm:gap-2 flex-shrink-0"
                onClick={onFilterClick}
              >
                <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs">Filters</span>
              </Button>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2">
            <div className=" items-center gap-2 md:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    asChild
                    size="sm"
                    variant={isActive ? "default" : "ghost"}
                    className="rounded-md"
                  >
                    <Link
                      to={item.path}
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => {
                        if (item.path === "/strategies") track("strategies_nav_click");
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}

              {isAuthenticated && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-9 px-3 rounded-md hover:bg-accent/50 hover:text-foreground"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={undefined} alt={user.name || "User"} />
                        <AvatarFallback className="bg-muted text-foreground text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden lg:inline">{user.name}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0">
                    {/* Account Header */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={undefined} alt={user.name || "User"} />
                          <AvatarFallback className="bg-muted text-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subscription/Usage Card */}
                    {usage && !subscriptionLoading && (
                      <>
                        <div className="p-4 border-b border-border">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-foreground">Credits</span>
                            <span className="text-sm font-semibold text-foreground">
                              {usageDisplay.isUnlimited
                                ? "Unlimited"
                                : `${usageDisplay.remaining} left`}
                            </span>
                          </div>
                          {!usageDisplay.isUnlimited && (
                            <Progress value={usagePercent} className="h-2 mb-2" />
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{planDisplayName} plan</span>
                            <span>
                              {usageDisplay.isUnlimited
                                ? `Used ${usageDisplay.used}`
                                : `Used ${usageDisplay.used} of ${usageDisplay.allowance}`}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {usage.adCreditsRemaining && usage.adCreditsRemaining > 0 ? (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                +{usage.adCreditsRemaining} ad 🎁
                              </p>
                            ) : (
                              ""
                            )}
                            {usage.purchasedCreditsRemaining &&
                            usage.purchasedCreditsRemaining > 0 ? (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                +{usage.purchasedCreditsRemaining} purchased
                              </p>
                            ) : (
                              ""
                            )}
                            {usage.addonCreditsRemaining && usage.addonCreditsRemaining > 0 ? (
                              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                +{usage.addonCreditsRemaining} addon
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Menu Items */}
                    <div className="p-1">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/favorites" className="flex items-center gap-2 cursor-pointer">
                          <Heart className="h-4 w-4" />
                          <span>Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/plans"
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => track("plan_button_dropdown_click")}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Manage plan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {!isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild variant="default" size="sm">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

export default TopNav;
