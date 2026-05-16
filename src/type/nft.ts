export type NFTItemData = {
  id: number;
  name: string;
  priceMatic: string; // Price in MATIC
  imageUrl: string;
  promoteImageUrl: string;
  sourceUrl: string;
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
