import { motion } from "framer-motion";
import { useSoundStore } from "../stores/sound.store";
import { gameToast } from "./ui/toast";

interface Props {
  text: string;
  img: string;
  isOfflineMode?: boolean;
  onClick: () => void;
}

export default function GameButton({ text, img, isOfflineMode = false, onClick }: Props) {
  const playClick = useSoundStore((s) => s.playClick);
  const handleClick = () => {
    playClick();
    if (isOfflineMode) {
      return gameToast.error("Bạn đang Offline")
    }
    onClick();
  }
  return (
    <motion.button
      className={`
        w-24 py-3
        sm:w-38 sm:py-3
        lg:w-72 lg:py-6
        rounded-2xl
        flex flex-col items-center gap-1 lg:gap-2
        backdrop-blur-md
        bg-linear-to-br
        ${isOfflineMode ? 'bg-gray-800/60' : 'from-red-900/40 via-red-700/40 to-rose-800/40'}
        border border-red-300/20
        shadow-[0_0_20px_rgba(185,28,28,0.5)]
        lg:shadow-[0_0_30px_rgba(185,28,28,0.6)]
        transition-all
        hover:shadow-[0_0_45px_rgba(220,38,38,0.9)]
        hover:border-red-200/40
      `}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <img
        className="w-16 sm:w-20 lg:w-40"
        src={`./images/${img}`}
      />
      <p
        className="
          text-sm sm:text-base lg:text-xl font-extrabold tracking-wide
          text-white
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
        "
      >
        {text}
      </p>
    </motion.button>
  );
}
