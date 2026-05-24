export interface AvatarItemData {
  id: number;
  name: string;
  srcUrl: string;
  priceMatic: number;
  priceTokens: number;
  style: string;
  owned: boolean;
  active: boolean;
}

export interface VerifyAvatarTxRequest {
  txHash: string;
  itemId: number;
  walletAddress: string;
}
