import type { NFTItemData, VerifyTxRequest } from "../type/nft";
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const nftApi = {
  getNFTs: (): Promise<NFTItemData[]> =>
    axiosClient.get(API_ENDPOINTS.NFT.GET).then((res) => res.data),

  getMyNFTs: (): Promise<NFTItemData[]> =>
    axiosClient.get(API_ENDPOINTS.NFT.MY).then((res) => res.data),

  verifyTransaction: (data: VerifyTxRequest): Promise<void> =>
    axiosClient.post(API_ENDPOINTS.NFT.VERIFY_TRANSFER, data),
};
