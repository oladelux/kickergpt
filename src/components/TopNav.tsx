import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Clock, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Clock, label: "History", path: "/history" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
            <span className="text-xl font-bold">Football AI</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                >
                  <Link to={item.path} className="flex items-center gap-2">
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
