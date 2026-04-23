import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/stores/authStore";
import type { UserRole } from "@/types/traffic";

export function RequireAuth({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const user = useAuth((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
