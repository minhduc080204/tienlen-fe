import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ROUTES } from "../routes/routes";

export const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);
    const isOfflineMode = useAuthStore((s) => s.isOfflineMode);

    if (!token && !isOfflineMode) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};
