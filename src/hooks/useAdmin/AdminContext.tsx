import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser, AdminNFT, AdminMatch, AdminTransaction, DashboardStats, AdminTokenPackage } from '../../type/admin';
import { adminApi } from '../../api/admin.api';
import { gameToast } from '../../components/ui/toast';

interface AdminContextProps {
  users: AdminUser[];
  nfts: AdminNFT[];
  matches: AdminMatch[];
  transactions: AdminTransaction[];
  tokenPackages: AdminTokenPackage[];
  stats: DashboardStats;

  // Token Packages CRUD
  addTokenPackage: (pkg: Omit<AdminTokenPackage, 'id' | 'createdAt'>) => Promise<void>;
  updateTokenPackage: (id: number, updates: Partial<AdminTokenPackage>) => Promise<void>;
  deleteTokenPackage: (id: number) => Promise<void>;

  // Users CRUD
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: number, updates: Partial<AdminUser>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  // NFTs CRUD
  addNFT: (nft: Omit<AdminNFT, 'id' | 'createdAt'>) => Promise<void>;
  updateNFT: (id: number, updates: Partial<AdminNFT>) => Promise<void>;
  deleteNFT: (id: number) => Promise<void>;

  // Matches CRUD
  addMatch: (match: Omit<AdminMatch, 'id' | 'createdAt'>) => Promise<void>;
  updateMatch: (id: string, updates: Partial<AdminMatch>) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;

  // Transactions CRUD
  addTransaction: (tx: Omit<AdminTransaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<AdminTransaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [nfts, setNfts] = useState<AdminNFT[]>([]);
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [tokenPackages, setTokenPackages] = useState<AdminTokenPackage[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalNFTs: 0,
    totalVolumeMatic: 0,
    totalMatchesPlayed: 0,
    activeMatches: 0
  });

  // Fetch initial data
  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, nftsRes, matchesRes, txRes, pkgRes] = await Promise.all([
        adminApi.getStats().catch(() => ({ data: stats })), // Fallback if not ready
        adminApi.getUsers().catch(() => ({ data: [] })),
        adminApi.getNfts().catch(() => ({ data: [] })),
        adminApi.getMatches().catch(() => ({ data: [] })),
        adminApi.getTransactions().catch(() => ({ data: [] })),
        adminApi.getTokenPackages().catch(() => ({ data: [] })),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setNfts(nftsRes.data);
      setMatches(matchesRes.data);
      setTransactions(txRes.data);
      setTokenPackages(pkgRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Admin", error);
      gameToast.error("Không thể tải dữ liệu Admin. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Users CRUD ---
  const addUser = async (_newUser: Omit<AdminUser, 'id' | 'createdAt'>) => {
    gameToast.info("Chức năng tạo mới người dùng không được hỗ trợ trực tiếp qua API.");
  };

  const updateUser = async (id: number, updates: Partial<AdminUser>) => {
    const response = await adminApi.updateUser(id, updates);
    if (response.data) {
      setUsers(prev => prev.map(user => user.id === id ? { ...user, ...response.data } : user));
    } else {
      setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
    }
  };

  const deleteUser = async (id: number) => {
    await adminApi.deleteUser(id);
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // --- NFTs CRUD ---
  const addNFT = async (newNft: Omit<AdminNFT, 'id' | 'createdAt'>) => {
    const response = await adminApi.createNft(newNft);
    setNfts(prev => [...prev, response.data]);
  };

  const updateNFT = async (id: number, updates: Partial<AdminNFT>) => {
    const response = await adminApi.updateNft(id, updates);
    if (response.data) {
      setNfts(prev => prev.map(nft => nft.id === id ? { ...nft, ...response.data } : nft));
    } else {
      setNfts(prev => prev.map(nft => nft.id === id ? { ...nft, ...updates } : nft));
    }
  };

  const deleteNFT = async (id: number) => {
    await adminApi.deleteNft(id);
    setNfts(prev => prev.filter(nft => nft.id !== id));
  };

  // --- Matches CRUD ---
  const addMatch = async (_newMatch: Omit<AdminMatch, 'id' | 'createdAt'>) => {
    gameToast.info("Mở phòng chơi từ Admin API chưa được hỗ trợ.");
  };

  const updateMatch = async (_id: string, _updates: Partial<AdminMatch>) => {
    gameToast.info("Cập nhật phòng chơi từ Admin API chưa được hỗ trợ.");
  };

  const deleteMatch = async (id: string) => {
    await adminApi.deleteMatch(id);
    setMatches(prev => prev.filter(match => match.id !== id));
  };

  // --- Transactions CRUD ---
  const addTransaction = async (_newTx: Omit<AdminTransaction, 'id' | 'createdAt'>) => {
    gameToast.info("Ghi log giao dịch thủ công qua Admin API chưa được hỗ trợ.");
  };

  const updateTransaction = async (id: string, updates: Partial<AdminTransaction>) => {
    const response = await adminApi.updateTransaction(id, updates);
    if (response.data) {
      setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...response.data } : tx));
    } else {
      setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
    }
  };

  const deleteTransaction = async (id: string) => {
    await adminApi.deleteTransaction(id);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // --- Token Packages CRUD ---
  const addTokenPackage = async (newPkg: Omit<AdminTokenPackage, 'id' | 'createdAt'>) => {
    const response = await adminApi.createTokenPackage(newPkg);
    setTokenPackages(prev => [...prev, response.data]);
  };

  const updateTokenPackage = async (id: number, updates: Partial<AdminTokenPackage>) => {
    const response = await adminApi.updateTokenPackage(id, updates);
    if (response.data) {
      setTokenPackages(prev => prev.map(pkg => pkg.id === id ? { ...pkg, ...response.data } : pkg));
    } else {
      setTokenPackages(prev => prev.map(pkg => pkg.id === id ? { ...pkg, ...updates } : pkg));
    }
  };

  const deleteTokenPackage = async (id: number) => {
    await adminApi.deleteTokenPackage(id);
    setTokenPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      users,
      nfts,
      matches,
      transactions,
      stats,
      addUser,
      updateUser,
      deleteUser,
      addNFT,
      updateNFT,
      deleteNFT,
      addMatch,
      updateMatch,
      deleteMatch,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      tokenPackages,
      addTokenPackage,
      updateTokenPackage,
      deleteTokenPackage
    }}>
      {children}
    </AdminContext.Provider>
  );
};
