import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileWrapperProps {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export const MobileWrapper = ({
  children,
  className,
  withBottomNav = true,
}: MobileWrapperProps) => {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        withBottomNav && "pb-16", // Add padding for bottom nav
        className
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        // Bottom padding handled by withBottomNav prop + safe area
        paddingBottom: withBottomNav
          ? `calc(4rem + env(safe-area-inset-bottom))`
          : "env(safe-area-inset-bottom)",
      }}
    >
      {children}
    </div>
  );
};

