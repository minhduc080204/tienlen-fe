import type { ActionType } from "./action";

export const DURATION_TURN_TIME = 20;
export const DURATION_READY_TIME = 5;

export type SocketResponseType<T> = {
  action: ActionType;
  data: T;
  timestamp: number;
};