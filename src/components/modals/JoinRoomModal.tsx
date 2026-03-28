import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { gameApi } from "../../api/game.api";
import { ROUTES } from "../../routes/routes";
import { useModalStore } from "../../stores/modal.store";
import { useSocketStore } from "../../stores/socket.store";
import { Button } from "../ui/Button";
import axios from "axios";

export default function JoinRoomModal() {
  const close = useModalStore((s) => s.close);
  const navigate = useNavigate();
  const setRoom = useSocketStore.setState;
  const connectSocket = useSocketStore((s) => s.connect);

  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomId) {
      toast.error("Vui lòng nhập ID phòng");
      return;
    }

    try {
      setLoading(true);

      const res = await gameApi.joinRoom(Number(roomId));

      if (!res?.roomId) {
        toast.error("Không thể tham gia phòng");
        return;
      }

      setRoom({ roomId: res.roomId });
      connectSocket(res.roomId, res.wsUrl);
      close();
      navigate(ROUTES.ROOM, { state: { fromButton: true } });
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

        toast.error("Không thể kết nối phòng. Hãy đăng nhập lại");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25 }}
      className="
        fixed z-50
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[92vw] max-w-[380px]
        bg-zinc-900 border border-red-700
        rounded-2xl p-4 lg:p-6
        shadow-2xl shadow-red-900/30
      "
    >
      <h2 className="text-lg lg:text-xl font-bold text-red-500 text-center mb-4 lg:mb-6">
        🔑 Tham Gia Phòng
      </h2>

      {/* Input Room ID */}
      <div className="mb-4 lg:mb-6">
        <label className="block text-xs lg:text-sm text-gray-400 mb-1.5 lg:mb-2">
          Nhập ID phòng
        </label>

        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Ví dụ: 12345"
          className="
            w-full px-3 py-2 lg:px-4
            bg-zinc-800 border border-zinc-700
            rounded-lg text-sm lg:text-base
            text-white
            focus:outline-none focus:border-red-600
            focus:ring-1 focus:ring-red-600
            transition
          "
        />
      </div>

      {/* Join Button */}
      <Button
        onClick={handleJoinRoom}
        disabled={!roomId || loading}
        className={`
          w-full py-2 text-sm lg:text-base rounded-lg
          font-semibold transition
          ${roomId
            ? "bg-red-600 hover:bg-red-500 text-white"
            : "bg-zinc-700 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {loading ? "Đang tham gia..." : "🚀 Tham Gia"}
      </Button>

      {/* Close */}
      <Button
        onClick={close}
        className="
          w-full mt-2 lg:mt-3 py-2 rounded-lg text-sm lg:text-base
          bg-zinc-800 hover:bg-zinc-700
          text-gray-300 transition
        "
      >
        Đóng
      </Button>
    </motion.div>
  );
}