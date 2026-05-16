import { create } from "zustand";
import { Howl } from "howler";
import { useSettingsStore } from "./settings.store";

const BASE_VOLUME = 0.5;
const BASE_BG_URL = [
  "/sounds/giao_huong_thank_do.mp3",
  "/sounds/cam_on_anh_do.mp3",
];

const clickSound = new Howl({ src: ["/sounds/click.mp3"], volume: BASE_VOLUME, preload: true });
const chattingSound = new Howl({ src: ["/sounds/chatting.mp3"], volume: BASE_VOLUME, preload: true });
const playCardSound = new Howl({ src: ["/sounds/play_card.mp3"], volume: BASE_VOLUME, preload: true });
const dealingCardSound = new Howl({ src: ["/sounds/dealing_card.mp3"], volume: BASE_VOLUME, preload: true });
const joinRoomSound = new Howl({ src: ["/sounds/join_room.mp3"], volume: BASE_VOLUME, preload: true });
const leftRoomSound = new Howl({ src: ["/sounds/left_room.mp3"], volume: BASE_VOLUME, preload: true });

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

/** Helpers that read from settingsStore directly to avoid circular deps */
const isMusicEnabled = () => useSettingsStore.getState().musicEnabled;
const isEffectEnabled = () => useSettingsStore.getState().effectEnabled;

type SoundStore = {
  volume: number;
  toggleMusicSound: () => void;
  toggleEffectSound: () => void;
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
  volume: BASE_VOLUME,

  toggleMusicSound: () => {
    const settings = useSettingsStore.getState();
    const newState = !settings.musicEnabled;
    settings.setMusicEnabled(newState);
    if (!newState) {
      currentBGM?.stop();
      isBGMPlaying = false;
    } else {
      get().playBGM();
    }
  },

  toggleEffectSound: () => {
    const settings = useSettingsStore.getState();
    settings.setEffectEnabled(!settings.effectEnabled);
  },

  setVolume: (v) => {
    Howler.volume(v);
    set({ volume: v });
  },

  playBGM: () => {
    if (!isMusicEnabled()) return;
    if (isBGMPlaying) return;
    isBGMPlaying = true;
    playSequentialBGM();
  },

  stopBGM: () => {
    currentBGM?.stop();
    isBGMPlaying = false;
  },

  playClick: () => {
    if (!isEffectEnabled()) return;
    clickSound.play();
  },

  chattingReceived: () => {
    if (!isEffectEnabled()) return;
    chattingSound.play();
  },

  playCard: () => {
    if (!isEffectEnabled()) return;
    playCardSound.play();
  },

  dealingCard: () => {
    if (!isEffectEnabled()) return;
    dealingCardSound.play();
  },

  joinRoom: () => {
    if (!isEffectEnabled()) return;
    joinRoomSound.play();
  },

  leftRoom: () => {
    if (!isEffectEnabled()) return;
    leftRoomSound.play();
  },
}));
