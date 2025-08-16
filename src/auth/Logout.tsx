import { toast } from "sonner";
import React, { useEffect } from "react";
import Spinner from "@/components/ui/spinner";
import { useLogout } from "@/hooks/useLogout";

// Create a reusable logout function that can be called from anywhere
export const executeLogout = async (navigateFn?: (path: string) => void, redirectTo = "/", clearClientState?: () => void) => {
  try {
    // Keep backward compatibility: delegate to hook's logic
    const nav = navigateFn ?? (() => {});
    const cleanup = async () => {
      try {
        if (clearClientState) clearClientState();
      } catch {
        // ignore
      }
    };

    // We can't use hook here; mimic the toast UX and then navigate
    await toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 50)), {
      loading: "Logging out...",
      success: "You have been logged out successfully",
      error: "Failed to log out. Please try again.",
      duration: 500,
    });

    // Fallback local cleanup in case callers still rely on it
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    } catch {
      // ignore
    }

    await cleanup();

    if (navigateFn) {
      nav(redirectTo);
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// Hook version for use within components
export const useLegacyLogout = (redirectTo = "/") => {
  // Legacy hook kept for compatibility; use hooks/useLogout instead
  const performLogout = async (clearClientState?: () => void) => {
    return await executeLogout(undefined, redirectTo, clearClientState);
  };

  return { performLogout };
};

// The component version that automatically logs out when mounted
const Logout: React.FC<{
  redirectTo?: string;
  showLoader?: boolean;
  clearClientState?: () => void;
}> = ({ redirectTo = "/", showLoader = true, clearClientState }) => {
  const [loading, setLoading] = React.useState(true);
  const { performLogout } = useLogout(redirectTo);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await performLogout(clearClientState);
      } finally {
        setLoading(false);
      }
    };

    handleLogout();
  }, [performLogout, clearClientState]);

  if (!loading || !showLoader) return null;

  return (
    <div className="flex h-screen w-full items-center justify-center" aria-live="polite" role="status">
      <Spinner />
    </div>
  );
};

export default Logout;
