import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../stores/auth.store";
import { useModalStore } from "../../stores/modal.store";
import { useSoundStore } from "../../stores/sound.store";
import { Button } from "../ui/Button";
import { ModalContainer } from "./ModalContainer";

export default function SettingsModal() {
  const { musicEnabled, effectEnabled, volume, toggleMusicSound, toggleEffectSound, setVolume, playBGM } =
    useSoundStore();

  const close = useModalStore((s) => s.close);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    logout();
    close();
    await authApi.logout();
  }

  return (
    <ModalContainer className="w-[320px]">
      <h2 className="text-xl font-bold text-red-500 text-center mb-4">
        ⚙️ Cài đặt
      </h2>

      {/* Toggle Music sound */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Âm thanh</span>
        <Button
          onClick={() => {
            toggleMusicSound();
          }}
          className={`
              w-11 h-6 rounded-full transition
              ${musicEnabled ? "bg-red-600" : "bg-zinc-600"}
            `}
        >
          <div
            className={`
                w-5 h-5 bg-white rounded-full m-0.5 transition
                ${musicEnabled ? "translate-x-5" : ""}
              `}
          />
        </Button>
      </div>

      {/* Toggle Effect sound */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Hiệu ứng</span>
        <Button
          onClick={() => {
            toggleEffectSound();
          }}
          className={`
              w-11 h-6 rounded-full transition
              ${effectEnabled ? "bg-red-600" : "bg-zinc-600"}
            `}
        >
          <div
            className={`
                w-5 h-5 bg-white rounded-full m-0.5 transition
                ${effectEnabled ? "translate-x-5" : ""}
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

      {/* Logout */}
      <Button
        onClick={handleLogout}
        className="
            w-full py-2 rounded-lg mb-3
            bg-zinc-700 hover:bg-zinc-600
            transition
            text-white font-semibold
          "
      >
        Đăng xuất
      </Button>

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
    </ModalContainer>
  );
}
