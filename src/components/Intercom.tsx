import { useEffect } from "react";
import Intercom from "@intercom/messenger-js-sdk";
import { useAuth } from "@/hooks/useAuth";

// Type declarations for Intercom SDK
interface IntercomConfig {
  app_id: string;
  user_id: string;
  name: string;
  email: string;
  created_at?: number;
}

export default function IntercomComponent() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only initialize Intercom for logged-in users
    if (isAuthenticated && user) {
      // Initialize Intercom with user data
      const config: IntercomConfig = {
        app_id: "jua3c1go",
        user_id: user.id,
        name: user.name,
        email: user.email,
        // createdAt is optional since it's not in the User interface
        // Can be added later if the User interface is updated
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Intercom as any)(config);

      // Configure Intercom to show help articles
      // Note: Help space is primarily configured in Intercom dashboard:
      // Settings > Channels > Messenger > Web > Layout and Spaces
      // Enable the Help space to allow customers to access Help Center from Messenger
      if (typeof window !== "undefined") {
        const win = window as unknown as {
          Intercom?: (command: string, ...args: unknown[]) => void;
        };
        if (win.Intercom) {
          // The help space will be available if configured in the Intercom dashboard
          // Users can access help articles through the messenger interface
        }
      }
    } else {
      // Shutdown Intercom when user logs out
      if (typeof window !== "undefined") {
        const win = window as unknown as { Intercom?: (command: string) => void };
        if (win.Intercom) {
          win.Intercom("shutdown");
        }
      }
    }

    // Cleanup function
    return () => {
      if (!isAuthenticated || !user) {
        if (typeof window !== "undefined") {
          const win = window as unknown as { Intercom?: (command: string) => void };
          if (win.Intercom) {
            win.Intercom("shutdown");
          }
        }
      }
    };
  }, [user, isAuthenticated]);

  // This component doesn't render anything
  return null;
}
