// src/api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    GOOGLE: "/auth/google",
  },

  USER: {
    PROFILE: "/users/me",
    TRANSACTIONS: "/users/transactions",
    MATCHES: "/users/matches",
  },

  ROOM: {
    CREATE: "/room/create",
    JOIN: "/room/join",
    LEAVE: "/room/leave",
    QUICK_JOIN: "/room/quick-join",
    BOT: {
      CREATE: "/room/bot/create",
      START: "/room/bot/start",
      ATTACK: "/room/bot/attack",
    },
  },
};
