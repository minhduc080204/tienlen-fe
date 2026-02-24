import { SettingIcon } from "../assets/icons/SettingIcon";
import { useSoundStore } from "../stores/sound.store";
import { useModalStore } from "../type/modal.store";

export default function SettingsButton({isFixed=false}: {isFixed?:boolean}) {
  const playClick = useSoundStore((s) => s.playClick);
  const openModal = useModalStore((s) => s.open);
  return (
    <>
      {/* Floating settings button */}
      <button
        onClick={() => {
          playClick();
          openModal("SETTINGS")
        }}
        className={`
          ${isFixed?'fixed top-5 right-5':''}
          w-12 h-12 rounded-full
          backdrop-blur-md
          bg-amber-50/20
          shadow-lg shadow-red-900/40
          flex justify-center items-center
          z-1
        `}
      >
        
        <SettingIcon className="w-10"/>
      </button>
      
    </>
  );
}
