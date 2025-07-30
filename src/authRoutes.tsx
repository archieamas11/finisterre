import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  // Read auth state once per render
  const [auth, setAuth] = React.useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    return {
      isAuthenticated: !!token,
      isAdmin,
    };
  });

  React.useEffect(() => {
    // Listen for changes to localStorage (e.g., logout/login in other tabs)
    const handleStorage = () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "1";
      setAuth({
        isAuthenticated: !!token,
        isAdmin,
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return auth;
}

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
