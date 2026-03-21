import { useNavigate } from "react-router-dom";
import GameButton from "./GameButton";
import { gameApi } from "../api/game.api";
import toast from "react-hot-toast";
import { ROUTES } from "../routes/routes";
import { useSocketStore } from "../stores/socket.store";
import { useModalStore } from "../stores/modal.store";
import axios from "axios";

export default function MenuActions() {
  const navigate = useNavigate();
  const connectSocket = useSocketStore((s) => s.connect);
  const setRoom = useSocketStore.setState;
  const openModal = useModalStore((s) => s.open);
  const handlePlayNow = async () => {
    try {
      const res = await gameApi.quickJoin();
      console.log("CREATE", res);

      if (!res?.roomId || !res?.wsUrl) {
        toast.error("Có lỗi xảy ra khi vào phòng");
        return;
      }

      setRoom({ roomId: res.roomId });

      connectSocket(res.roomId, res.wsUrl);

      navigate(ROUTES.ROOM);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 400) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.messages ||
            "Yêu cầu không hợp lệ";

          toast.error(message);
          return;
        }

        if (!err.response) {
          toast.error("Không thể kết nối tới server");
          return;
        }
      }

      toast.error("Không thể kết nối phòng");
      console.error(err);
    }
  };
  return (
    <div className="w-full flex justify-end items-center grow">
      <div className="w-3/5 grid 
        grid-cols-[max-content_max-content]
        grid-rows-[max-content_max-content]
        items-center place-items-center gap-10
      ">
        <GameButton
          text="Chơi Ngay"
          img="play-now.png"
          isPlaynow={true}
          onClick={handlePlayNow}
        />
        <GameButton
          text="Tạo Phòng"
          img="create-room.png"
          onClick={() => {
            openModal("CREATE_ROOM")
          }}
        />
        <GameButton
          text="Tham Gia Phòng"
          img="join-room.png"
          onClick={() => {
            openModal("JOIN_ROOM")
          }}
        />
      </div>
    </div>
  );
}
