import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "./stores/modal.store";
import { lazy, Suspense } from "react";

// Lazy load modals
const CreateRoomModal = lazy(() => import("./components/modals/CreateRoomModel"));
const SettingsModal = lazy(() => import("./components/modals/SettingsModal"));
const JoinRoomModal = lazy(() => import("./components/modals/JoinRoomModal"));
const ChatTab = lazy(() => import("./components/ChatTab"));
const BotPlayModal = lazy(() => import("./components/modals/BotPlayModal"));
const BotPlayOfflineModal = lazy(() => import("./components/modals/BotPlayOfflineModal"));
const ProfileModal = lazy(() => import("./components/modals/ProfileModal"));

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
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pointer-events-auto">
              <Suspense fallback={null}>
                {modal === "PROFILE" && <ProfileModal />}
                {modal === "SETTINGS" && <SettingsModal />}
                {modal === "CREATE_ROOM" && <CreateRoomModal />}
                {modal === "JOIN_ROOM" && <JoinRoomModal />}
                {modal === "CHAT_ROOM" && <ChatTab />}
                {modal === "BOT_PLAY" && <BotPlayModal />}
                {modal === "BOT_OFFLINE_PLAY" && <BotPlayOfflineModal />}
              </Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
