import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRoomStore } from "../stores/room.store";
import { ROUTES } from "../routes/routes";

export const RoomGuard = () => {
    const room = useRoomStore((s) => s.room);
    const location = useLocation();

    const isFromButton = location.state?.fromButton;
    const hasRoom = !!room.roomId;

    // Allow if navigated via button OR already in a room
    if (!isFromButton && !hasRoom) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <Outlet />;
};
