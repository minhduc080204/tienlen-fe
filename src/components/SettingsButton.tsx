import { SettingIcon } from "../assets/icons/SettingIcon";
import { useModalStore } from "../stores/modal.store";
import { Button } from "./ui/Button";

export default function SettingsButton({ isFixed = false }: { isFixed?: boolean }) {
  const openModal = useModalStore((s) => s.open);
  return (
    <>
      {/* Floating settings Button */}
      <Button
        onClick={() => {
          openModal("SETTINGS")
        }}
        className={`
          ${isFixed ? 'fixed top-3 right-3 lg:top-5 lg:right-5' : ''}
          w-9 h-9 lg:w-12 lg:h-12 rounded-full
          backdrop-blur-md
          bg-amber-50/20
          shadow-lg shadow-red-900/40
          flex justify-center items-center
          z-1
        `}
      >

        <SettingIcon className="w-7 lg:w-10" />
      </Button>

    </>
  );
}
