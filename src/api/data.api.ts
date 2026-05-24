import type { UserType } from "../type/user";
import type { MatchParticipant } from "../type/match-history";
import type { Transaction } from "../type/transaction";
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const dataApi = {
  profile: () =>
    axiosClient.get<UserType>(API_ENDPOINTS.USER.PROFILE)
    .then(res=>res.data),

  updateProfile: (data: { name: string }) =>
    axiosClient.put<UserType>(API_ENDPOINTS.USER.PROFILE, data)
    .then(res=>res.data),

  transactions: () =>
    axiosClient.get<Transaction[]>(API_ENDPOINTS.USER.TRANSACTIONS)
    .then(res=>res.data),

  matches: () =>
    axiosClient.get<MatchParticipant[]>(API_ENDPOINTS.USER.MATCHES)
    .then(res=>res.data),
};
