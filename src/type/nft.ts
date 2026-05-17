export type NFTItemData = {
  id: number;
  name: string;
  priceMatic: string; // Price in MATIC
}

export type UserNft = {
  id: number;
  userId: number;
  nftItemId: number;
  walletAddress: string;
  txHash: string;
  createdAt: string;
}

export type VerifyTxRequest = {
  txHash: string;
  itemId: number;
  walletAddress: string;
}

export const R2_BASE_URL = import.meta.env.VITE_R2_URL;
