import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export const MobileHeader = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  className,
}: MobileHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-lg border-b border-border",
        className
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left side - Back button or spacer */}
        <div className="flex items-center w-12">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - Title */}
        <h1 className="flex-1 text-center text-lg font-semibold truncate px-2">
          {title}
        </h1>

        {/* Right side - Action or spacer */}
        <div className="flex items-center justify-end w-12">
          {rightAction}
        </div>
      </div>
    </header>
  );
};

