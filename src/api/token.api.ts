import type { AdminTokenPackageCreateRequest, AdminTokenPackageUpdateRequest, DepositVerifyRequest, TokenPackage } from "../type/token";
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const tokenApi = {
  // User endpoints
  getDepositPackages: (): Promise<TokenPackage[]> =>
    axiosClient.get(API_ENDPOINTS.TOKEN.DEPOSIT_PACKAGES).then((res) => res.data),

  verifyDeposit: (data: DepositVerifyRequest): Promise<{ tokensAwarded: number }> =>
    axiosClient.post(API_ENDPOINTS.TOKEN.DEPOSIT_VERIFY, data).then((res) => res.data),

  // Admin endpoints
  adminGetPackages: (): Promise<TokenPackage[]> =>
    axiosClient.get(API_ENDPOINTS.ADMIN_TOKEN.PACKAGES).then((res) => res.data),

  adminCreatePackage: (data: AdminTokenPackageCreateRequest): Promise<TokenPackage> =>
    axiosClient.post(API_ENDPOINTS.ADMIN_TOKEN.PACKAGES, data).then((res) => res.data),

  adminUpdatePackage: (id: number, data: AdminTokenPackageUpdateRequest): Promise<TokenPackage> =>
    axiosClient.put(API_ENDPOINTS.ADMIN_TOKEN.PACKAGE_BY_ID(id), data).then((res) => res.data),

  adminDeletePackage: (id: number): Promise<void> =>
    axiosClient.delete(API_ENDPOINTS.ADMIN_TOKEN.PACKAGE_BY_ID(id)).then((res) => res.data),
};
