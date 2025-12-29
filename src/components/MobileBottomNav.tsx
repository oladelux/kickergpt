import { Home, Target, CreditCard, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { isNativeMobile } from "@/lib/platform";

export const MobileBottomNav = memo(function MobileBottomNav() {
  const location = useLocation();
  const isMobile = isNativeMobile();

  const navItems = [
    { path: "/fixtures", icon: Home, label: "Home" },
    { path: "/strategies", icon: Target, label: "Strategies" },
    { path: "/plans", icon: CreditCard, label: "Plans" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-primary/95 border-t border-primary/30",
      !isMobile && "backdrop-blur-lg"
    )}>
      <div
        className="grid grid-cols-4 h-16"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                "active:scale-95 transform duration-150",
                isActive ? "text-white" : "text-white/70 hover:text-white"
              )}
            >
              <Icon
                className={cn("h-6 w-6 transition-all duration-200", isActive && "scale-110")}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});
