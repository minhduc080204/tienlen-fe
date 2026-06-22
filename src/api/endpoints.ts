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
    SETTINGS: "/user/settings",
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
  },

  AVATAR: {
    GET: "/avatars",
    BUY: "/avatars/buy",
    VERIFY_TRANSFER: "/avatars/verify-transfer",
    SELECT: "/avatars/select",
    SELECT_CUSTOM: "/avatars/select-custom",
    ADMIN: "/admin/avatars",
  },

  TOKEN: {
    DEPOSIT_PACKAGES: "/tokens/deposit/packages",
    DEPOSIT_VERIFY: "/tokens/deposit/verify",
  },

  ADMIN_TOKEN: {
    PACKAGES: "/admin/token-packages",
    PACKAGE_BY_ID: (id: number) => `/admin/token-packages/${id}`,
  },
};
