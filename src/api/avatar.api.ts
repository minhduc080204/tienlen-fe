import type { AvatarItemData, VerifyAvatarTxRequest } from "../type/avatar";
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const avatarApi = {
  getAvatars: (): Promise<AvatarItemData[]> =>
    axiosClient.get(API_ENDPOINTS.AVATAR.GET).then((res) => res.data),

  buyAvatar: (id: number): Promise<void> =>
    axiosClient.post(`${API_ENDPOINTS.AVATAR.BUY}/${id}`).then((res) => res.data),

  verifyTransfer: (data: VerifyAvatarTxRequest): Promise<void> =>
    axiosClient.post(API_ENDPOINTS.AVATAR.VERIFY_TRANSFER, data).then((res) => res.data),

  selectAvatar: (id: number): Promise<void> =>
    axiosClient.post(`${API_ENDPOINTS.AVATAR.SELECT}/${id}`).then((res) => res.data),

  selectCustom: (srcUrl: string): Promise<void> =>
    axiosClient.post(API_ENDPOINTS.AVATAR.SELECT_CUSTOM, { srcUrl }).then((res) => res.data),
};
