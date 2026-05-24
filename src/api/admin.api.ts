import axiosClient from './axiosClient';
import type { AdminUser, AdminNFT, AdminMatch, AdminTransaction, DashboardStats, AdminAvatar } from '../type/admin';

export const adminApi = {
  // Stats
  getStats: () => axiosClient.get<DashboardStats>('/admin/stats'),

  // Users
  getUsers: () => axiosClient.get<AdminUser[]>('/admin/users'),
  updateUser: (id: number, data: Partial<AdminUser>) => axiosClient.put<AdminUser>(`/admin/users/${id}`, data),
  deleteUser: (id: number) => axiosClient.delete(`/admin/users/${id}`),

  // NFTs
  getNfts: () => axiosClient.get<AdminNFT[]>('/admin/nfts'),
  createNft: (data: Omit<AdminNFT, 'id' | 'createdAt'>) => axiosClient.post<AdminNFT>('/admin/nfts', data),
  updateNft: (id: number, data: Partial<AdminNFT>) => axiosClient.put<AdminNFT>(`/admin/nfts/${id}`, data),
  deleteNft: (id: number) => axiosClient.delete(`/admin/nfts/${id}`),

  // Matches
  getMatches: () => axiosClient.get<AdminMatch[]>('/admin/matches'),
  deleteMatch: (id: string) => axiosClient.delete(`/admin/matches/${id}`),

  // Transactions
  getTransactions: () => axiosClient.get<AdminTransaction[]>('/admin/transactions'),
  updateTransaction: (id: string, data: Partial<AdminTransaction>) => axiosClient.put<AdminTransaction>(`/admin/transactions/${id}`, data),
  deleteTransaction: (id: string) => axiosClient.delete(`/admin/transactions/${id}`),

  // Admin Avatars CRUD
  getAdminAvatars: () => axiosClient.get<AdminAvatar[]>('/admin/avatars'),
  createAdminAvatar: (data: { name: string; srcUrl: string; priceMatic: number; priceTokens: number; active: boolean }) =>
    axiosClient.post<AdminAvatar>('/admin/avatars', data),
  updateAdminAvatar: (id: number, data: Partial<AdminAvatar>) => axiosClient.put<AdminAvatar>(`/admin/avatars/${id}`, data),
  deleteAdminAvatar: (id: number) => axiosClient.delete(`/admin/avatars/${id}`),
};
