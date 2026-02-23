import type { UserType } from "./user";

export type AuthStore = {
  token: string | null;
  user: UserType | null;
  login: (token: string, user: UserType) => void;
  logout: () => void;
};