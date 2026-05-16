import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export interface UserSettings {
  musicEnabled: boolean;
  effectEnabled: boolean;
  selectedCardSkinId: number | null;
  selectedCardSkinUrl: string | null;
}

export const settingsApi = {
  get: (): Promise<UserSettings> =>
    axiosClient.get<UserSettings>(API_ENDPOINTS.USER.SETTINGS).then((res) => res.data),

  save: (settings: Partial<UserSettings>): Promise<UserSettings> =>
    axiosClient.patch<UserSettings>(API_ENDPOINTS.USER.SETTINGS, settings).then((res) => res.data),
};
