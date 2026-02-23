import { useNavigate } from "react-router-dom";
import GameButton from "./GameButton";
import { gameApi } from "../api/game.api";
import toast from "react-hot-toast";
import { ROUTES } from "../routes/routes";
import { useSocketStore } from "../stores/socket.store";

export default function GameActions() {
  const navigate = useNavigate();
  const connectSocket = useSocketStore((s) => s.connect);
  const setRoom = useSocketStore.setState;

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

          }}
        />
        <GameButton
          text="Tham Gia Phòng"
          img="join-room.png"
          onClick={() => {

          }}
        />
      </div>
    </div>
  );
}
