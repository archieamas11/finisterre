import React from "react";
import { useLocation, Navigate } from "react-router-dom";

interface AuthState {
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  // Read auth state once per render
  const [auth, setAuth] = React.useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    return {
      isAdmin,
      isAuthenticated: !!token,
    };
  });

  React.useEffect(() => {
    // Listen for changes to localStorage (e.g., logout/login in other tabs)
    const handleStorage = () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "1";
      setAuth({
        isAdmin,
        isAuthenticated: !!token,
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return auth;
}

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate state={{ from: location }} to="/login" replace />;
  }
  return <>{children}</>;
};

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || !isAdmin) {
    return <Navigate state={{ from: location }} to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || isAdmin) {
    return <Navigate state={{ from: location }} to="/unauthorized" replace />;
  }
  return <>{children}</>;
};
