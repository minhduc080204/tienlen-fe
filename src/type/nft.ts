export interface NFTItemData {
  id: number;
  name: string;
  price: string; // Price in MATIC
  imageUrl: string;
}

export interface VerifyTxRequest {
  txHash: string;
  itemId: number;
  walletAddress: string;
}
