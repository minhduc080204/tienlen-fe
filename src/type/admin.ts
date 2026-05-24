export interface AdminUser {
  id: number;
  name: string;
  avatarUrl?: string;
  tokenBalance: number;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED';
  email: string;
  createdAt: string;
}

export interface AdminNFT {
  id: number;
  name: string;
  priceMatic: string;
  sourceKey: string;
  type: 'STANDARD' | 'PREMIUM' | 'LEGENDARY';
  description: string;
  isDefault: boolean;
  createdAt: string;
}

export interface AdminMatch {
  id: string;
  roomName: string;
  mode: 'BOT' | 'OFFLINE' | 'MULTIPLAYER';
  betAmount: number;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  playersCount: number;
  maxPlayers: number;
  winnerName: string | null;
  createdAt: string;
}

export interface AdminTransaction {
  id: string;
  txHash: string;
  walletAddress: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PURCHASE_NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  userName: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalNFTs: number;
  totalVolumeMatic: number;
  totalMatchesPlayed: number;
  activeMatches: number;
}
