export type NFTItemData = {
  id: number;
  name: string;
  priceMatic: string; // Price in MATIC
  imageUrl: string;
}

export type VerifyTxRequest = {
  txHash: string;
  itemId: number;
  walletAddress: string;
}
