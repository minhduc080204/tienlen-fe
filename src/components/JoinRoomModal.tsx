import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../type/modal.store";
import { useSocketStore } from "../stores/socket.store";
import { gameApi } from "../api/game.api";

export default function JoinRoomModal() {
  const close = useModalStore((s) => s.close);
  const navigate = useNavigate();
  const connectSocket = useSocketStore((s) => s.connect);
  const setRoom = useSocketStore.setState;

  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error("Vui lòng nhập ID phòng");
      return;
    }

    if (isNaN(Number(roomId))) {
      toast.error("ID phòng không hợp lệ");
      return;
    }

    // try {
    //   setLoading(true);

    //   const res = await gameApi.joinRoom({ roomId: Number(roomId) });

    //   if (!res?.roomId || !res?.wsUrl) {
    //     toast.error("Không thể tham gia phòng");
    //     return;
    //   }

    //   setRoom({ roomId: res.roomId });
    //   connectSocket(res.roomId, res.wsUrl);

    //   close();
    //   navigate(ROUTES.ROOM);
    // } catch (err) {
    //   toast.error("Không thể tham gia phòng");
    // } finally {
    //   setLoading(false);
    // }
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
        w-[380px]
        bg-zinc-900 border border-red-700
        rounded-2xl p-6
        shadow-2xl shadow-red-900/30
      "
    >
      <h2 className="text-xl font-bold text-red-500 text-center mb-6">
        🔑 Tham Gia Phòng
      </h2>

      {/* Input Room ID */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          Nhập ID phòng
        </label>

        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Ví dụ: 12345"
          className="
            w-full px-4 py-2
            bg-zinc-800 border border-zinc-700
            rounded-lg
            text-white
            focus:outline-none
            focus:border-red-600
            focus:ring-1 focus:ring-red-600
            transition
          "
        />
      </div>

      {/* Join Button */}
      <button
        onClick={handleJoinRoom}
        disabled={!roomId || loading}
        className={`
          w-full py-2 rounded-lg
          font-semibold transition
          ${
            roomId
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-zinc-700 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {loading ? "Đang tham gia..." : "🚀 Tham Gia"}
      </button>

      {/* Close */}
      <button
        onClick={close}
        className="
          w-full mt-3 py-2 rounded-lg
          bg-zinc-800 hover:bg-zinc-700
          text-gray-300 transition
        "
      >
        Đóng
      </button>
    </motion.div>
  );
}