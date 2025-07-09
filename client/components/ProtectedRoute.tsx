import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "customer" | "worker" | "admin";
  adminOrWorker?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  adminOrWorker = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-yellow"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (adminOrWorker && !["admin", "worker"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
