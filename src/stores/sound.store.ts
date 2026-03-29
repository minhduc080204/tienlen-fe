import { create } from "zustand";
import { Howl } from "howler";

const BASE_VOLUME = 0.5
const BASE_BG_URL = [
  "/sounds/giao_huong_thank_do.mp3",
  "/sounds/cam_on_anh_do.mp3",
]

const clickSound = new Howl({ src: ["/sounds/click.mp3"], volume: BASE_VOLUME, preload: true });
const chattingSound = new Howl({ src: ["/sounds/chatting.mp3"], volume: BASE_VOLUME, preload: true });
const playCardSound = new Howl({ src: ["/sounds/play_card.mp3"], volume: BASE_VOLUME, preload: true });
const dealingCardSound = new Howl({ src: ["/sounds/dealing_card.mp3"], volume: BASE_VOLUME, preload: true });
const joinRoomSound = new Howl({ src: ["/sounds/join_room.mp3"], volume: BASE_VOLUME, preload: true });
const leftRoomSound = new Howl({ src: ["/sounds/left_room.mp3"], volume: BASE_VOLUME, preload: true });
// const bgSound = new Howl({ src: ["/sounds/bg_sound.mp3"], volume: 0.3, loop: true, preload: true });
const bgSounds = BASE_BG_URL.map(
  (url) =>
    new Howl({
      src: [import.meta.env.VITE_BASE_URL + url],
      volume: 0.1,
      loop: false,
      preload: true,
    })
);

let currentBGM: Howl | null = null;
let isBGMPlaying = false;
let currentBGMIndex = 0;

const playSequentialBGM = () => {
  if (bgSounds.length === 0) return;

  const sound = bgSounds[currentBGMIndex];
  currentBGM = sound;

  sound.once("end", () => {
    currentBGMIndex = (currentBGMIndex + 1) % bgSounds.length;
    playSequentialBGM();
  });

  sound.play();
};

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
    if (isBGMPlaying) return;

    isBGMPlaying = true;
    playSequentialBGM();
  },

  stopBGM: () => {
    currentBGM?.stop();
    isBGMPlaying = false;
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
