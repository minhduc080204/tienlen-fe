import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore } from "../type/auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isOfflineMode: false,

      login: (token, user) => {
        set({ token, user, isOfflineMode: false });
      },

      logout: () => {
        set({ token: null, user: null, isOfflineMode: false });
      },

      setOfflineMode: (offline) => {
        set({ isOfflineMode: offline, token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// import { create } from "zustand";
// import type { AuthStore } from "../type/auth";

// export const useAuthStore = create<AuthStore>((set) => ({
//   token: localStorage.getItem("token"),
//   user: localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user")!)
//     : null,

//   login: (token, user) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     set({ token, user });
//   },

//   logout: () => {
//     localStorage.clear();
//     set({ token: null, user: null });
//   },
// }));
