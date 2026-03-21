import { motion } from "framer-motion";
import { useSoundStore } from "../../stores/sound.store";
import { useModalStore } from "../../stores/modal.store";
import { Button } from "../ui/Button";

export default function SettingsModal() {
  const { enabled, volume, toggleSound, setVolume } =
    useSoundStore();

  const close = useModalStore((s) => s.close);
  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/70 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />

      {/* Modal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        className="
          fixed z-50
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[320px]
          bg-zinc-900 border border-red-700
          rounded-2xl p-6
          shadow-2xl shadow-red-900/30
        "
      >
        <h2 className="text-xl font-bold text-red-500 text-center mb-4">
          ⚙️ Cài đặt
        </h2>

        {/* Toggle sound */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300">Âm thanh</span>
          <Button
            onClick={() => {
              toggleSound();
            }}
            className={`
              w-11 h-6 rounded-full transition
              ${enabled ? "bg-red-600" : "bg-zinc-600"}
            `}
          >
            <div
              className={`
                w-5 h-5 bg-white rounded-full m-0.5 transition
                ${enabled ? "translate-x-5" : ""}
              `}
            />
          </Button>
        </div>

        {/* Volume */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Âm lượng</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-red-600"
          />
        </div>

        {/* Close */}
        <Button
          onClick={() => {
            close();
          }}
          className="
            w-full py-2 rounded-lg
            bg-red-600 hover:bg-red-500
            transition
            text-white font-semibold
          "
        >
          Đóng
        </Button>
      </motion.div>
    </>
  );
}
