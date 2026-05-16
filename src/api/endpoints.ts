// src/api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    GOOGLE: "/auth/google",
  },

  USER: {
    PROFILE: "/user/me",
    TRANSACTIONS: "/user/transactions",
    MATCHES: "/user/matches",
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

  NFT: {
    GET: "/nfts",
    MY: "/nfts/my",
    VERIFY_TRANSFER: "/nfts/verify-transfer",
  }
};
