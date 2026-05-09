import axiosClient from "./axiosClient";
import { NFTItemData, VerifyTxRequest } from "../type/nft";

export const nftApi = {
  getNFTs: async (): Promise<NFTItemData[]> => {
    // Note: The guide uses /api/v1/nfts/ but we follow axiosClient configuration
    const res = await axiosClient.get("/nfts/");
    return res.data;
  },

  verifyTransaction: async (data: VerifyTxRequest): Promise<void> => {
    await axiosClient.post("/nfts/verify", data);
  },
};
