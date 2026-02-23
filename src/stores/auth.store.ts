import { create } from "zustand";
import type { AuthStore } from "../type/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
  },
}));
