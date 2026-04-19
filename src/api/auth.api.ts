// src/api/auth.api.ts
import type { LoginResponse } from "../type/login-response";
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export interface LoginPayload {
  account: string;
  password: string;
}

export interface RegisterPayload {
  account: string;
  name: string;
  password: string;
  rePassword: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    axiosClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
    .then(res=>res.data),

  logout: () =>
    axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  register: (data: RegisterPayload) =>
    axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data),

  loginWithGoogle: (token: string) =>
    axiosClient.post(API_ENDPOINTS.AUTH.GOOGLE, { token })
    .then(res=>res.data),
};
