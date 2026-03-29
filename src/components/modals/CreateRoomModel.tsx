import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameApi } from "../../api/game.api";
import { TokenIcon } from "../../assets/icons/TokenIcon";
import { ROUTES } from "../../routes/routes";
import { useModalStore } from "../../stores/modal.store";
import { useSocketStore } from "../../stores/socket.store";
import { formatNumber } from "../../utils/formatNumber";
import { Button } from "../ui/Button";
import { gameToast } from "../ui/toast";

const BET_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];

export default function CreateRoomModal() {
  const close = useModalStore((s) => s.close);
  const navigate = useNavigate();
  const setRoom = useSocketStore.setState;
  const connectSocket = useSocketStore((s) => s.connect);

  const [selectedBet, setSelectedBet] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!selectedBet) {
      gameToast.error("Vui lòng chọn mức cược");
      return;
    }

    try {
      setLoading(true);

      const res = await gameApi.createRoom(selectedBet);

      if (!res?.roomId) {
        gameToast.error("Không thể tạo phòng");
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
          gameToast.error(message);
          return;
        }

        if (!err.response) {
          gameToast.error("Không thể kết nối tới server");
          return;
        }

        gameToast.error("Không thể kết nối phòng. Hãy đăng nhập lại");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/70 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />
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
          🎲 Chọn Mức Cược
        </h2>

        {/* Bet Options */}
        <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-4 lg:mb-6">
          {BET_OPTIONS.map((bet) => {
            const active = selectedBet === bet;

            return (
              <Button
                key={bet}
                onClick={() => setSelectedBet(bet)}
                className={`
                  py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold transition
                  flex justify-center items-center gap-1 border 
                  ${active
                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/40"
                    : "bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-red-700/20 hover:border-red-600"
                  }
                `}
              >
                {formatNumber(bet)} <TokenIcon className="w-5 lg:w-7" />
              </Button>
            );
          })}
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateRoom}
          disabled={!selectedBet || loading}
          className={`
            w-full py-2 text-sm lg:text-base rounded-lg
            font-semibold transition
            ${selectedBet
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-zinc-700 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {loading ? "Đang tạo..." : "🔥 Tạo Phòng"}
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
    </>
  );
}