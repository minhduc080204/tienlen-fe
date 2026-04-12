import { motion } from "framer-motion";
import { useState } from "react";
import { TokenIcon } from "../../assets/icons/TokenIcon";
import { useModalStore } from "../../stores/modal.store";
import { formatNumber } from "../../utils/formatNumber";
import { Button } from "../ui/Button";
import { gameToast } from "../ui/toast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";

const BET_OPTIONS = [10, 50, 100, 200, 500, 1000];
const DIFFICULTY_LEVELS = [
  { id: 1, name: "Dễ", icon: "🟢" },
  { id: 2, name: "Trung bình", icon: "🟡" },
  { id: 3, name: "Khó", icon: "🔴" },
];

export default function BotPlayOfflineModal() {
  const close = useModalStore((s) => s.close);
  const navigate = useNavigate();
  const [selectedBet, setSelectedBet] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);

  const handleStart = () => {
    if (!selectedBet) {
      gameToast.error("Vui lòng chọn mức cược");
      return;
    }
    if (!difficulty) {
      gameToast.error("Vui lòng chọn mức độ khó");
      return;
    }

    // Gửi thông báo tính năng chuẩn bị sẵn sàng hoặc route tới GamePlayOffline
    gameToast.info(`Bắt đầu chơi Bot mức độ: ${difficulty}, cược: ${selectedBet}`);
    close();
    navigate(ROUTES.GAME_PLAY_OFFLINE_BOT, { state: { botMode: true, bet: selectedBet, difficulty } });
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
          bg-zinc-900 border border-blue-700
          rounded-2xl p-4 lg:p-6
          shadow-2xl shadow-blue-900/30
        "
      >
        <h2 className="text-lg lg:text-xl font-bold text-blue-500 text-center mb-2 lg:mb-6">
          🤖 Chơi Với Bot Offline
        </h2>

        {/* Difficulty Options */}
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">1. Chọn độ khó:</h3>
        <div className="flex gap-2 mb-4 lg:mb-6">
          {DIFFICULTY_LEVELS.map((level) => {
            const active = difficulty === level.id;
            return (
              <Button
                key={level.id}
                onClick={() => setDifficulty(level.id)}
                className={`
                  flex-1 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold transition
                  border
                  ${active
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/40"
                    : "bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-blue-700/20 hover:border-blue-600"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base lg:text-lg">{level.icon}</span>
                  <span>{level.name}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Bet Options */}
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">2. Chọn mức cược:</h3>
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
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/40"
                    : "bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-blue-700/20 hover:border-blue-600"
                  }
                `}
              >
                {formatNumber(bet)} <TokenIcon className="w-5 lg:w-7" />
              </Button>
            );
          })}
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          disabled={!selectedBet || !difficulty}
          className={`
            w-full py-2 text-sm lg:text-base rounded-lg
            font-semibold transition text-white
            ${selectedBet && difficulty
              ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              : "bg-zinc-700 text-gray-400 cursor-not-allowed opacity-70"
            }
          `}
        >
          🚀 Bắt Đầu
        </Button>

        {/* Close */}
        <Button
          onClick={close}
          className="
            w-full mt-2 lg:mt-3 py-2 rounded-lg text-sm lg:text-base
            bg-zinc-800 hover:bg-zinc-700
            text-gray-300 transition border border-zinc-700/50
          "
        >
          Đóng
        </Button>
      </motion.div>
    </>
  );
}
