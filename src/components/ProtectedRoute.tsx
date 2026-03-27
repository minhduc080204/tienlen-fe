import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ROUTES } from "../routes/routes";

export const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);

    if (!token) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};
