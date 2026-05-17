import { create } from "zustand";
import { persist } from "zustand/middleware";
import { settingsApi, type UserSettings } from "../api/settings.api";

interface SettingsState extends UserSettings {
  isSyncing: boolean;
  isSynced: boolean;

  // Actions
  setSelectedCardSkin: (id: number | null) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setEffectEnabled: (enabled: boolean) => void;

  // Sync helpers
  loadFromServer: () => Promise<void>;
  saveToServer: () => Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounce save: waits 800ms after last change before calling API */
const scheduleSave = (getState: () => SettingsState) => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    getState().saveToServer();
  }, 800);
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Default values (overridden by localStorage then by server)
      musicEnabled: true,
      effectEnabled: true,
      selectedCardSkinId: null,
      isSyncing: false,
      isSynced: false,

      setSelectedCardSkin: (id) => {
        set({ selectedCardSkinId: id });
        scheduleSave(get);
      },

      setMusicEnabled: (enabled) => {
        set({ musicEnabled: enabled });
        scheduleSave(get);
      },

      setEffectEnabled: (enabled) => {
        set({ effectEnabled: enabled });
        scheduleSave(get);
      },

      loadFromServer: async () => {
        try {
          
          set({ isSyncing: true });
          const data = await settingsApi.get();
          console.log(data);
          // Server data takes priority over localStorage
          set({
            musicEnabled: data.musicEnabled,
            effectEnabled: data.effectEnabled,
            selectedCardSkinId: data.selectedCardSkinId,
            isSynced: true,
          });
        } catch {
          // Silently fail – localStorage values remain
          set({ isSynced: false });
        } finally {
          set({ isSyncing: false });
        }
      },

      saveToServer: async () => {
        const { musicEnabled, effectEnabled, selectedCardSkinId } = get();
        try {
          await settingsApi.save({ musicEnabled, effectEnabled, selectedCardSkinId });
          set({ isSynced: true });
        } catch {
          set({ isSynced: false });
        }
      },
    }),
    {
      name: "game-settings",
      // Only persist the data fields, not the async helpers
      partialize: (s) => ({
        musicEnabled: s.musicEnabled,
        effectEnabled: s.effectEnabled,
        selectedCardSkinId: s.selectedCardSkinId,
      }),
    }
  )
);
