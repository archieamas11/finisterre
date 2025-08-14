import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "@/hooks/useAuthMutations";

export function useLogout(redirectTo: string = "/") {
  const navigate = useNavigate();
  const mutation = useLogoutMutation();

  const performLogout = async (clearClientState?: () => void) => {
    try {
      await toast.promise(mutation.mutateAsync(), {
        loading: "Logging out...",
        success: "You have been logged out successfully",
        error: "Failed to log out. Please try again.",
        duration: 500,
      });

      if (clearClientState) {
        try {
          clearClientState();
        } catch (err) {
          // Ignore client state cleanup errors
          console.error("Error clearing client state:", err);
        }
      }

      navigate(redirectTo);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  return { performLogout, isPending: mutation.isPending };
}
