import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useSettingsStore } from "../stores/settings.store";
import { useSoundStore } from "../stores/sound.store";

/**
 * Syncs user settings (sound, skin) from the backend after login.
 * Should be mounted once at the top of the app.
 */
export function useSyncSettings() {
  const token = useAuthStore((s) => s.token);
  const loadFromServer = useSettingsStore((s) => s.loadFromServer);
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);
  const playBGM = useSoundStore((s) => s.playBGM);
  const stopBGM = useSoundStore((s) => s.stopBGM);
  const hasSynced = useRef(false);

  // Load settings from server when user logs in
  useEffect(() => {
    if (!token) {
      hasSynced.current = false;
      return;
    }
    if (hasSynced.current) return;
    hasSynced.current = true;
    loadFromServer();
  }, [token]);

  // React to musicEnabled changes (including after server load)
  useEffect(() => {
    if (!token) return;
    if (musicEnabled) {
      playBGM();
    } else {
      stopBGM();
    }
  }, [musicEnabled, token]);
}
