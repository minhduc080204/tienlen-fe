// stores/chat.store.ts
import { create } from "zustand";
import type { ChatType } from "../type/chat";

type ChatStore = {
  messages: ChatType[];
  addMessage: (msg: ChatType) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  clearMessages: () => set({ messages: [] }),
}));