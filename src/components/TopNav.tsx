import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Clock, User, Heart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: MessageCircle, label: "Fixtures", path: "/fixtures" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: Clock, label: "History", path: "/history" },
  { icon: CreditCard, label: "Plan", path: "/plans" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-card/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            kicker<span className="bold text-primary">GPT</span>
          </Link>

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
          </div>
        </div>
      </div>
    </nav>
  );
}
