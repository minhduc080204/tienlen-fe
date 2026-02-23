import { motion } from "framer-motion";

interface Props {
  text: string;
  img: string;
  isPlaynow?: boolean;
  onClick: () => void;
}

export default function GameButton({ text, img, isPlaynow = false, onClick }: Props) {
  return (
    <motion.button
      className={`
        ${isPlaynow && 'row-span-2'}
        w-72 py-6 
        rounded-2xl
        flex flex-col items-center gap-2
        backdrop-blur-md
        bg-gradient-to-br
        from-red-900/40
        via-red-700/40
        to-rose-800/40

        border border-red-300/20
        shadow-[0_0_30px_rgba(185,28,28,0.6)]

        transition-all
        hover:shadow-[0_0_45px_rgba(220,38,38,0.9)]
        hover:border-red-200/40
      `}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <img className={`
          ${!isPlaynow&&'w-40'}
        `}
        src={`./images/${img}`}
      />

      <p
        className="
          text-xl font-extrabold tracking-wide
          text-white
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
        "
      >
        {text}
      </p>
    </motion.button>
  );
}
