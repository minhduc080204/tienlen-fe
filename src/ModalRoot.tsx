import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "./stores/modal.store";
import CreateRoomModal from "./components/modals/CreateRoomModel";
import SettingsModal from "./components/modals/SettingsModal";
import JoinRoomModal from "./components/modals/JoinRoomModal";
import BotPlayModal from "./components/modals/BotPlayModal";
import ChatTab from "./components/ChatTab";

export default function ModalRoot() {
  const { modal, close } = useModalStore();

  return (
    <AnimatePresence>
      {modal && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            {modal === "SETTINGS" && <SettingsModal />}
            {modal === "CREATE_ROOM" && <CreateRoomModal />}
            {modal === "JOIN_ROOM" && <JoinRoomModal />}
            {modal === "CHAT_ROOM" && <ChatTab />}
            {modal === "BOT_PLAY" && <BotPlayModal />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}