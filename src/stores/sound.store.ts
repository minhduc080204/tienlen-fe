import { create } from "zustand";
import { Howl } from "howler";

const BASE_VOLUME = 0.5

const clickSound = new Howl({ src: ["/sounds/click.mp3"], volume: BASE_VOLUME, preload: true });
const chattingSound = new Howl({ src: ["/sounds/chatting.mp3"], volume: BASE_VOLUME, preload: true });
const playCardSound = new Howl({ src: ["/sounds/play_card.mp3"], volume: BASE_VOLUME, preload: true });
const dealingCardSound = new Howl({ src: ["/sounds/dealing_card.mp3"], volume: BASE_VOLUME, preload: true });
const joinRoomSound = new Howl({ src: ["/sounds/join_room.mp3"], volume: BASE_VOLUME, preload: true });
const leftRoomSound = new Howl({ src: ["/sounds/left_room.mp3"], volume: BASE_VOLUME, preload: true });
const bgSound = new Howl({ src: ["/sounds/bg_sound.mp3"], volume: 0.3, loop: true, preload: true });

type SoundStore = {
  enabled: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (v: number) => void;
  playBGM: () => void;
  stopBGM: () => void;
  playClick: () => void;
  chattingReceived: () => void;
  playCard: () => void;
  dealingCard: () => void;
  joinRoom: () => void;
  leftRoom: () => void;
};

export const useSoundStore = create<SoundStore>((set, get) => ({
  enabled: true,
  volume: BASE_VOLUME,

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

  playBGM: () => {
    if (!get().enabled) return;
    if (bgSound.playing()) return;
    bgSound.play();
  },

  stopBGM: () => {
    bgSound.stop();
  },

  playClick: () => {
    if (!get().enabled) return;
    clickSound.play();
  },

  chattingReceived: () => {
    if (!get().enabled) return;
    chattingSound.play();
  },

  playCard: () => {
    if (!get().enabled) return;
    playCardSound.play();
  },

  dealingCard: () => {
    if (!get().enabled) return;
    dealingCardSound.play();
  },

  joinRoom: () => {
    if (!get().enabled) return;
    joinRoomSound.play();
  },

  leftRoom: () => {
    if (!get().enabled) return;
    leftRoomSound.play();
  },
}));
