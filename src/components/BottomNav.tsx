import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Clock, User, Heart, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";

const navItems = [
  { icon: MessageCircle, label: "Fixtures", path: "/fixtures" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: Clock, label: "History", path: "/history" },
  { icon: CreditCard, label: "Plan", path: "/plans" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                if (item.path === "/plans") track("plan_button_bottomnav_click");
              }}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-12 bg-gradient-to-r from-primary to-accent rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
