import { create } from "zustand";
import { Howl } from "howler";

const clickSound = new Howl({
  src: ["/sounds/click.mp3"],
  volume: 0.4,
  preload: true,
});

type SoundStore = {
  enabled: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (v: number) => void;
  playClick: () => void;
};

export const useSoundStore = create<SoundStore>((set, get) => ({
  enabled: true,
  volume: 0.4,

  toggleSound: () =>
    set((s) => {
      const newState = !s.enabled;
      Howler.mute(!newState);
      return { enabled: newState };
    }),

  setVolume: (v) => {
    Howler.volume(v);
    set({ volume: v });
  },

  playClick: () => {
    if (!get().enabled) return;
    clickSound.stop();
    clickSound.play();
  },
}));
