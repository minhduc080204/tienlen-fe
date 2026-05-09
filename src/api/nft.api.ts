import axiosClient from "./axiosClient";
import { NFTItemData, VerifyTxRequest } from "../type/nft";
import { API_ENDPOINTS } from "./endpoints";

export const nftApi = {
  getNFTs: (): Promise<NFTItemData[]> =>
    axiosClient.get(API_ENDPOINTS.NFTS).then((res) => res.data),

  verifyTransaction: (data: VerifyTxRequest): Promise<void> =>
    axiosClient.post(API_ENDPOINTS.NFT_VERIFY, data),
};
