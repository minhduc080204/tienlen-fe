// src/api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GOOGLE: "/auth/google",
  },

  USER: {
    PROFILE: "/users/me",
  },

  ROOM: {
    CREATE: "/rooms/create",
    JOIN: "/rooms/join",
    LEAVE: "/rooms/leave",
    QUICK_JOIN: "/rooms/quick-join",
  },
};
