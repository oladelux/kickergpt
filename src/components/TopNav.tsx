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
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { track } from "@vercel/analytics";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionData } from "@/hooks/useSubscription";
import { useMemo, useEffect, useState } from "react";

const navItems = [
  { icon: MessageCircle, label: "Fixtures", path: "/fixtures" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: Clock, label: "History", path: "/history" },
];

export default function TopNav() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { plan: subscriptionPlan, usage, loading: subscriptionLoading } = useSubscriptionData();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const usagePercent = useMemo(() => {
    if (!usage?.monthlyAllowance) return 0;
    return Math.min(100, Math.round((usage.monthlyUsed / usage.monthlyAllowance) * 100));
  }, [usage?.monthlyAllowance, usage?.monthlyUsed]);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.trim()?.[0]?.toUpperCase() || "";
    const last = lastName?.trim()?.[0]?.toUpperCase() || "";
    return first + last;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-card/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            kicker<span className="bold text-primary">GPT</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Mobile theme toggle */}
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 rounded-full md:hidden border-border hover:bg-accent/50"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            <div className="hidden items-center gap-2 md:flex">
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
                    <Link to={item.path} className="flex items-center gap-2 text-sm font-medium">
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
                              {usage.monthlyRemaining} left
                            </span>
                          </div>
                          <Progress value={usagePercent} className="h-2 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{subscriptionPlan?.plan ?? "FREE"} plan</span>
                            <span>
                              Used {usage.monthlyUsed} of {usage.monthlyAllowance}
                            </span>
                          </div>
                          {usage.addonCreditsRemaining > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Add-on credits: {usage.addonCreditsRemaining}
                            </p>
                          )}
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
                      {mounted && (
                        <DropdownMenuItem
                          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                          className="cursor-pointer"
                        >
                          {theme === "dark" ? (
                            <>
                              <Sun className="h-4 w-4 mr-2" />
                              <span>Light mode</span>
                            </>
                          ) : (
                            <>
                              <Moon className="h-4 w-4 mr-2" />
                              <span>Dark mode</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
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
                  {mounted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 rounded-md"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  )}
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
}
