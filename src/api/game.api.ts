import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export type BotLevel = "easy" | "medium" | "hard";

export type CreateBotRoomResponse = {
  betToken: number;
  botLevel: BotLevel;
};

export type StartBotGameResponse = {
  userTokenBalance: number;
  userCards: number[];
  botRemainingCards: number;
  currentTurn: "USER" | "BOT";
  table: number[];
};

export type AttackBotGameResponse = {
  botPlayedCards: number[];
  botRemainingCards: number;
  userRemainingCards: number;
  currentTurn: "USER" | "BOT";
  table: number[];
  finished: boolean;
  winners: Array<"USER" | "BOT">;
};

export const gameApi = {
  createRoom: (betToken: number) =>
    axiosClient
      .post<{ roomId: number; wsUrl: string }>(API_ENDPOINTS.ROOM.CREATE, { betToken })
      .then((res) => res.data),
  joinRoom: (roomId: number) =>
    axiosClient
      .post<{ roomId: number; wsUrl: string }>(API_ENDPOINTS.ROOM.JOIN, { roomId })
      .then((res) => res.data),
  quickJoin: () =>
    axiosClient
      .post<{ roomId: number; wsUrl: string }>(API_ENDPOINTS.ROOM.QUICK_JOIN)
      .then((res) => res.data),
  createBotRoom: (betToken: number, botLevel: BotLevel) =>
    axiosClient
      .post<CreateBotRoomResponse>(API_ENDPOINTS.ROOM.BOT.CREATE, { betToken, botLevel })
      .then((res) => res.data),
  startBotGame: () =>
    axiosClient
      .post<StartBotGameResponse>(API_ENDPOINTS.ROOM.BOT.START, {})
      .then((res) => res.data),
  attackBotGame: (cards: number[]) =>
    axiosClient
      .post<AttackBotGameResponse>(API_ENDPOINTS.ROOM.BOT.ATTACK, { cards })
      .then((res) => res.data),
};
