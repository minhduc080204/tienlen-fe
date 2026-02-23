import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SettingIcon } from "../assets/icons/SettingIcon";
import { useSoundStore } from "../stores/sound.store";
import SettingsModal from "./SettingsModal";

export default function SettingsButton({isFixed=false}: {isFixed?:boolean}) {
  const [open, setOpen] = useState(false);
  const playClick = useSoundStore((s) => s.playClick);

  return (
    <>
      {/* Floating settings button */}
      <button
        onClick={() => {
          playClick();
          setOpen(true);
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

      <AnimatePresence>
        {open && <SettingsModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
