import { useNavigate } from "react-router-dom";
import GameButton from "./GameButton";
import { gameApi } from "../api/game.api";
import { ROUTES } from "../routes/routes";
import { useSocketStore } from "../stores/socket.store";
import { useModalStore } from "../stores/modal.store";
import axios from "axios";
import { gameToast } from "./ui/toast";
import { useAuthStore } from "../stores/auth.store";

export default function MenuActions() {
  const navigate = useNavigate();
  const connectSocket = useSocketStore((s) => s.connect);
  const setRoom = useSocketStore.setState;
  const openModal = useModalStore((s) => s.open);
  const isOfflineMode = useAuthStore((s) => s.isOfflineMode);

  const handlePlayNow = async () => {
    try {
      const res = await gameApi.quickJoin();

      if (!res?.roomId || !res?.wsUrl) {
        gameToast.error("Có lỗi xảy ra khi vào phòng");
        return;
      }

      setRoom({ roomId: res.roomId });
      connectSocket(res.roomId, res.wsUrl);
      navigate(ROUTES.ROOM, { state: { fromButton: true } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 400) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.messages ||
            "Yêu cầu không hợp lệ";
          gameToast.error(message);
          return;
        }

        if (!err.response) {
          gameToast.error("Không thể kết nối tới server");
          return;
        }
      }

      gameToast.error("Không thể kết nối phòng. Hãy đăng nhập lại");
      console.error(err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center grow px-4">
      <div className="
        grid
        grid-cols-2 grid-rows-2
        items-center place-items-center
        sm:gap-4
        lg:grid-cols-[max-content_max-content]
        lg:grid-rows-[max-content_max-content]
        lg:gap-8
        w-full max-w-xs
        lg:max-w-none lg:w-3/5
        ml-auto
        mr-20
        lg:mr-0
      ">
        <GameButton
          text="Chơi Ngay"
          img="play-now.png"
          isOfflineMode={isOfflineMode}
          onClick={handlePlayNow}
        />
        <GameButton
          text="Chơi Với Bot"
          img="play-now.png"
          onClick={() => openModal("BOT_PLAY")}
        />
        <GameButton
          text="Tạo Phòng"
          img="create-room.png"
          isOfflineMode={isOfflineMode}
          onClick={() => openModal("CREATE_ROOM")}
        />
        <GameButton
          text="Tham Gia Phòng"
          img="join-room.png"
          isOfflineMode={isOfflineMode}
          onClick={() => openModal("JOIN_ROOM")}
        />
      </div>
    </div>
  );
}
