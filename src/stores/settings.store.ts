import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  selectedCardSkinId: number | null;
  selectedCardSkinUrl: string | null;
  setSelectedCardSkin: (id: number | null, url: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedCardSkinId: null,
      selectedCardSkinUrl: null,
      setSelectedCardSkin: (id, url) => set({ selectedCardSkinId: id, selectedCardSkinUrl: url }),
    }),
    {
      name: "game-settings",
    }
  )
);
