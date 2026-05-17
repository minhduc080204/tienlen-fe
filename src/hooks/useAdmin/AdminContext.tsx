import { createContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser, AdminNFT, AdminMatch, AdminTransaction, DashboardStats } from '../../type/admin';

interface AdminContextProps {
  users: AdminUser[];
  nfts: AdminNFT[];
  matches: AdminMatch[];
  transactions: AdminTransaction[];
  stats: DashboardStats;

  // Users CRUD
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: number, updates: Partial<AdminUser>) => void;
  deleteUser: (id: number) => void;

  // NFTs CRUD
  addNFT: (nft: Omit<AdminNFT, 'id' | 'createdAt'>) => void;
  updateNFT: (id: number, updates: Partial<AdminNFT>) => void;
  deleteNFT: (id: number) => void;

  // Matches CRUD
  addMatch: (match: Omit<AdminMatch, 'id' | 'createdAt'>) => void;
  updateMatch: (id: string, updates: Partial<AdminMatch>) => void;
  deleteMatch: (id: string) => void;

  // Transactions CRUD
  addTransaction: (tx: Omit<AdminTransaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<AdminTransaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const AdminContext = createContext<AdminContextProps | undefined>(undefined);

// Initial Mock Seed Data
const defaultUsers: AdminUser[] = [
  {
    id: 1,
    name: "Minh Đức",
    email: "duc.admin@tienlen.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=duc",
    tokenBalance: 1500000,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: "2026-04-01T08:00:00Z"
  },
  {
    id: 2,
    name: "Gia Bảo",
    email: "bao.gia@gmail.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=bao",
    tokenBalance: 450000,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: "2026-04-10T12:30:00Z"
  },
  {
    id: 3,
    name: "Anh Tuấn",
    email: "tuankiet@gmail.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=tuan",
    tokenBalance: 25000,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: "2026-04-15T15:20:00Z"
  },
  {
    id: 4,
    name: "Quốc Hùng",
    email: "hungq@gmail.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=hung",
    tokenBalance: 5000,
    role: 'USER',
    status: 'SUSPENDED',
    createdAt: "2026-04-20T10:00:00Z"
  },
  {
    id: 5,
    name: "Bích Phương",
    email: "phuongb@gmail.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=phuong",
    tokenBalance: 820000,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: "2026-04-25T09:45:00Z"
  }
];

const defaultNFTs: AdminNFT[] = [
  {
    id: 1,
    name: "Dragon Card Skin",
    priceMatic: "0.5",
    sourceKey: "nft-dragon",
    type: 'LEGENDARY',
    description: "Vàng óng ánh, uy phong lẫm liệt cùng hiệu ứng rồng lửa khi ra bài",
    isDefault: false,
    createdAt: "2026-05-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Cyberpunk Glow",
    priceMatic: "0.25",
    sourceKey: "nft-cyberpunk",
    type: 'PREMIUM',
    description: "Phong cách tương lai neon nổi bật đầy hiện đại sắc sảo",
    isDefault: false,
    createdAt: "2026-05-05T00:00:00Z"
  },
  {
    id: 3,
    name: "Classic Red",
    priceMatic: "0.0",
    sourceKey: "nft-classic-red",
    type: 'STANDARD',
    description: "Lá bài truyền thống đỏ quý phái",
    isDefault: true,
    createdAt: "2026-04-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Classic Blue",
    priceMatic: "0.0",
    sourceKey: "nft-classic-blue",
    type: 'STANDARD',
    description: "Lá bài truyền thống xanh dịu mát",
    isDefault: true,
    createdAt: "2026-04-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Phoenix Reborn",
    priceMatic: "0.8",
    sourceKey: "nft-phoenix",
    type: 'LEGENDARY',
    description: "Hỏa phượng hoàng bay lượn tái sinh tuyệt đẹp hiếm có",
    isDefault: false,
    createdAt: "2026-05-10T00:00:00Z"
  }
];

const defaultMatches: AdminMatch[] = [
  {
    id: "room-101",
    roomName: "Phòng Đại Cao Thủ ⚔️",
    mode: 'MULTIPLAYER',
    betAmount: 10000,
    status: 'PLAYING',
    playersCount: 3,
    maxPlayers: 4,
    winnerName: null,
    createdAt: "2026-05-17T14:30:00Z"
  },
  {
    id: "room-102",
    roomName: "Tập Luyện Với AI Sơ Cấp 🤖",
    mode: 'BOT',
    betAmount: 1000,
    status: 'FINISHED',
    playersCount: 1,
    maxPlayers: 4,
    winnerName: "Minh Đức",
    createdAt: "2026-05-17T12:15:00Z"
  },
  {
    id: "room-103",
    roomName: "Ván Bài Offline Giải Trí ☕",
    mode: 'OFFLINE',
    betAmount: 0,
    status: 'FINISHED',
    playersCount: 1,
    maxPlayers: 4,
    winnerName: "Bot 1",
    createdAt: "2026-05-17T11:00:00Z"
  },
  {
    id: "room-104",
    roomName: "Phòng Bàn Tròn Tân Thủ 🌱",
    mode: 'MULTIPLAYER',
    betAmount: 500,
    status: 'WAITING',
    playersCount: 2,
    maxPlayers: 4,
    winnerName: null,
    createdAt: "2026-05-17T15:05:00Z"
  }
];

const defaultTransactions: AdminTransaction[] = [
  {
    id: "tx-201",
    txHash: "0x748e2fa5b4c588e1b6dfd802cf89bab37c35a5e76251fc8fdcd5995116fea34d",
    walletAddress: "0x859e6De4a2bF39258afE00f7F740D713022eF8e1",
    amount: 0.5,
    type: 'PURCHASE_NFT',
    status: 'SUCCESS',
    userName: "Minh Đức",
    createdAt: "2026-05-17T14:35:00Z"
  },
  {
    id: "tx-202",
    txHash: "0x4b78912efc4d51b3294ba7e4c9f1234900aef76825dfa2e6fb1234a9efbcd912",
    walletAddress: "0x859e6De4a2bF39258afE00f7F740D713022eF8e1",
    amount: 2.5,
    type: 'DEPOSIT',
    status: 'SUCCESS',
    userName: "Minh Đức",
    createdAt: "2026-05-17T13:00:00Z"
  },
  {
    id: "tx-203",
    txHash: "0x98ef5612acde3e4b7894ff12de4b89ab4c125df12aefbc68123efd9a78bcfeab",
    walletAddress: "0x32a4eDeF32aF12345AfE00f7F740D713022eF8e1",
    amount: 1.2,
    type: 'WITHDRAW',
    status: 'PENDING',
    userName: "Gia Bảo",
    createdAt: "2026-05-17T14:50:00Z"
  },
  {
    id: "tx-204",
    txHash: "0xab8912cd78ef65ea4e2bf789da9c08ba09de876e5dfbc324faec987eef9bd21",
    walletAddress: "0x789e6De4a2bF39258afE00f7F740D713022eF678",
    amount: 0.25,
    type: 'PURCHASE_NFT',
    status: 'SUCCESS',
    userName: "Anh Tuấn",
    createdAt: "2026-05-17T10:12:00Z"
  }
];

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('admin_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [nfts, setNfts] = useState<AdminNFT[]>(() => {
    const saved = localStorage.getItem('admin_nfts');
    return saved ? JSON.parse(saved) : defaultNFTs;
  });

  const [matches, setMatches] = useState<AdminMatch[]>(() => {
    const saved = localStorage.getItem('admin_matches');
    return saved ? JSON.parse(saved) : defaultMatches;
  });

  const [transactions, setTransactions] = useState<AdminTransaction[]>(() => {
    const saved = localStorage.getItem('admin_transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_nfts', JSON.stringify(nfts));
  }, [nfts]);

  useEffect(() => {
    localStorage.setItem('admin_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('admin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Compute Dashboard Statistics dynamically
  const stats = useMemo<DashboardStats>(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
    const totalNFTs = nfts.length;
    
    // Sum amount of successful transactions that involve MATIC flow (Deposits and NFT purchases)
    const totalVolumeMatic = transactions
      .filter(tx => tx.status === 'SUCCESS')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalMatchesPlayed = matches.length;
    const activeMatches = matches.filter(m => m.status === 'PLAYING' || m.status === 'WAITING').length;

    return {
      totalUsers,
      activeUsers,
      totalNFTs,
      totalVolumeMatic: parseFloat(totalVolumeMatic.toFixed(2)),
      totalMatchesPlayed,
      activeMatches
    };
  }, [users, nfts, matches, transactions]);

  // --- Users CRUD ---
  const addUser = (newUser: Omit<AdminUser, 'id' | 'createdAt'>) => {
    setUsers(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1;
      return [
        ...prev,
        {
          ...newUser,
          id: nextId,
          createdAt: new Date().toISOString()
        }
      ];
    });
  };

  const updateUser = (id: number, updates: Partial<AdminUser>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // --- NFTs CRUD ---
  const addNFT = (newNft: Omit<AdminNFT, 'id' | 'createdAt'>) => {
    setNfts(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(n => n.id)) + 1 : 1;
      return [
        ...prev,
        {
          ...newNft,
          id: nextId,
          createdAt: new Date().toISOString()
        }
      ];
    });
  };

  const updateNFT = (id: number, updates: Partial<AdminNFT>) => {
    setNfts(prev => prev.map(nft => nft.id === id ? { ...nft, ...updates } : nft));
  };

  const deleteNFT = (id: number) => {
    setNfts(prev => prev.filter(nft => nft.id !== id));
  };

  // --- Matches CRUD ---
  const addMatch = (newMatch: Omit<AdminMatch, 'id' | 'createdAt'>) => {
    setMatches(prev => {
      const nextId = `room-${prev.length > 0 ? prev.length + 101 : 101}`;
      return [
        ...prev,
        {
          ...newMatch,
          id: nextId,
          createdAt: new Date().toISOString()
        }
      ];
    });
  };

  const updateMatch = (id: string, updates: Partial<AdminMatch>) => {
    setMatches(prev => prev.map(match => match.id === id ? { ...match, ...updates } : match));
  };

  const deleteMatch = (id: string) => {
    setMatches(prev => prev.filter(match => match.id !== id));
  };

  // --- Transactions CRUD ---
  const addTransaction = (newTx: Omit<AdminTransaction, 'id' | 'createdAt'>) => {
    setTransactions(prev => {
      const nextId = `tx-${prev.length > 0 ? prev.length + 201 : 201}`;
      return [
        ...prev,
        {
          ...newTx,
          id: nextId,
          createdAt: new Date().toISOString()
        }
      ];
    });
  };

  const updateTransaction = (id: string, updates: Partial<AdminTransaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
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
      deleteTransaction
    }}>
      {children}
    </AdminContext.Provider>
  );
};
