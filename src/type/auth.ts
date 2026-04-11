import type { UserType } from "./user";

export type AuthStore = {
  token: string | null;
  user: UserType | null;
  isOfflineMode: boolean;
  login: (token: string, user: UserType) => void;
  logout: () => void;
  setOfflineMode: (offline: boolean) => void;
  setBalanceToken: (balanceToken?: number) => void;
};