import type { ActionType } from "./action";

export type SocketResponseType<T> = {
  action: ActionType;
  data: T;
  timestamp: number;
};