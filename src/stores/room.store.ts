import { create } from "zustand";
import type { GameMessageType } from "../type/game-message";
import type { PlayerType } from "../type/player";
import type { RoomType } from "../type/room";
import { gameToast } from "../components/ui/toast";

type RoomStore = {
  room: RoomType;
  // snapshot
  setRoomType: (payload: RoomType) => void;

  // events (delta)
  addPlayer: (player: PlayerType) => void;
  removePlayer: (userId: number) => void;
  setReady: (userId: number) => void;
  setUnReady: (userId: number) => void;
  setStartCountdown: () => void;  
  setNextTurn: (currentTurn: number) => void;
  resetRoom: () => void;
  setTable: (cardIds: string[]) => void;
  setGameMessage: (gameMessage: GameMessageType) => void;
};
/* =========================
   Store
========================= */

const initialState: RoomType = {
  status: "WAITING",
  table: [],
  players: [],
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: initialState,

  /* =========================
     SNAPSHOT (overwrite full)
  ========================= */
  setRoomType: (payload) =>
    set({
      room: payload,
    }),

  /* =========================
     EVENT HANDLERS
  ========================= */
  addPlayer: (player) =>
    set((state) => {
      const exists = state.room.players.some(
        (p) => p.user.id === player.user.id
      );

      if (exists) return state;
      
      return {
        room: {
          ...state.room,
          players: [...state.room.players, player],
        },
      };
    }),

  removePlayer: (userId) =>
    set((state) => ({
      room: {
        ...state.room,
        status: state.room.players.length==2?'WAITING':state.room.status,
        players: state.room.players.filter(
          (p) => p.user.id !== userId
        ),
      },
    })),

  setReady: (userId: number) => {
    set((state) => {
        if (!state.room) return state;

        return {
        room: {
            ...state.room,
            me:
            state.room.me && state.room.me.user.id === userId
                ? { ...state.room.me, ready: true }
                : state.room.me,
            players: state.room.players.map((p) =>
            p.user.id === userId
                ? { ...p, ready: true }
                : p
            ),
        },
        };
    });
  },

  setUnReady: (userId: number) => {
    set((state) => {
        if (!state.room) return state;

        return {
        room: {
            ...state.room,
            status: "WAITING",
            me:
            state.room.me && state.room.me.user.id === userId
                ? { ...state.room.me, ready: false }
                : state.room.me,
            players: state.room.players.map((p) =>
            p.user.id === userId
                ? { ...p, ready: false }
                : p
            ),
        },
        };
    });
  },

  setNextTurn: (currentTurn: number) => {
    set((state) => ({
      room: {
        ...state.room,
        currentTurn: currentTurn
      },
    }))
  },

  setTable: (cards: string[]) => {
    set((state) => ({
      room: {
        ...state.room,
        table: cards
      },
    }))
  },

  setStartCountdown: () => {
    set((state) => ({
      room: {
        ...state.room,
        status: "READY"
      },
    }))
  },

  setGameMessage: (gameMessage: GameMessageType) => {
    if(gameMessage.type === "ERROR") {
      gameToast.error(gameMessage.message)
    } else if(gameMessage.type === "SUCCESS") {
      gameToast.success(gameMessage.message)
    }
  },

  resetRoom: () =>
    set({
      room: initialState,
    }),
}));