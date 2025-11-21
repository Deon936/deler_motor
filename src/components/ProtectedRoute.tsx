import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? "/login?admin=true" : "/login"} replace />;
  }

  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/login?admin=true" replace />;
  }

  return <>{children}</>;
}
