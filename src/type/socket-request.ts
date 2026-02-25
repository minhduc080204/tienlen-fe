import type { ActionType } from "./action";

export type SocketRequestType<T> = {
  action: ActionType;
  data: T;
};