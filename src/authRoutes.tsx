import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthQuery } from "@/hooks/useAuthQuery";

interface AuthState {
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const { data, isSuccess, isPending } = useAuthQuery();
  const tokenExists = typeof window !== "undefined" && !!localStorage.getItem("token");
  const isAuthenticated = !!(tokenExists && isSuccess && data?.success);
  const isAdmin = !!data?.user?.isAdmin;
  return { isAdmin, isAuthenticated, isLoading: tokenExists && isPending };
}

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!isAuthenticated) {
    return <Navigate state={{ from: location }} to="/login" replace />;
  }
  return <>{children}</>;
};

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!isAuthenticated || !isAdmin) {
    return <Navigate state={{ from: location }} to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!isAuthenticated || isAdmin) {
    return <Navigate state={{ from: location }} to="/unauthorized" replace />;
  }
  return <>{children}</>;
};
