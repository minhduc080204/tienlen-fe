import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ROUTES } from "./routes";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;