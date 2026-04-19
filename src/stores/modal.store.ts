import { create } from "zustand";

export type ModalType = 
  "PROFILE" | 
  "SETTINGS" | 
  "CREATE_ROOM" | 
  "CHAT_ROOM" |
  "JOIN_ROOM" | 
  "BOT_PLAY" |
  "BOT_OFFLINE_PLAY" |
  null;

type ModalStore = {
  modal: ModalType;
  open: (type: ModalType) => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  open: (type) => set({ modal: type }),
  close: () => set({ modal: null }),
}));