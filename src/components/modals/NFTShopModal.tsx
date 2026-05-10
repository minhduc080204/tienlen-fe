import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { dataApi } from "../../api/data.api";
import { nftApi } from "../../api/nft.api";
import { useWeb3 } from "../../hooks/useWeb3";
import { useAuthStore } from "../../stores/auth.store";
import { useModalStore } from "../../stores/modal.store";
import type { NFTItemData } from "../../type/nft";
import NFTItem from "../gameplay/NFTItem";
import { gameToast } from "../ui/toast";
import { ModalContainer } from "./ModalContainer";

export default function NFTShopModal() {
  const close = useModalStore((s) => s.close);
  const { account, connectWallet, purchaseNFT } = useWeb3();

  const [items, setItems] = useState<NFTItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const data = await nftApi.getNFTs();
        setItems(data);
      } catch (error) {
        // Fallback seed data if API fails/not ready
      } finally {
        setLoading(false);
      }
    };
    fetchNFTs();
  }, []);

  const handleBuy = async (item: NFTItemData) => {
    try {
      let currentAccount = account;
      if (!currentAccount) {
        const { address } = await connectWallet();
        currentAccount = address;
      }

      gameToast.success("Vui lòng xác nhận trên MetaMask...");
      const txHash = await purchaseNFT(item.id, item.priceMatic.toString());

      gameToast.success("Đang xác thực giao dịch...");
      await nftApi.verifyTransaction({
        txHash,
        itemId: item.id,
        walletAddress: currentAccount!
      });

      // Refresh balance after purchase
      try {
        const updatedUser = await dataApi.profile();
        useAuthStore.getState().setBalanceToken(updatedUser.tokenBalance);
      } catch (e) {
        console.error("Failed to refresh balance", e);
      }

      gameToast.success("Mua NFT thành công!");
      close();
    } catch (error: any) {
      console.error("Purchase error:", error);
      if (error.message?.includes("rejected")) {
        gameToast.error("Giao dịch đã bị hủy");
      } else if (error.message?.includes("insufficient funds")) {
        gameToast.error("Số dư MATIC không đủ");
      } else {
        gameToast.error(error.message || "Có lỗi xảy ra khi mua NFT");
      }
    }
  };

  return (
    <ModalContainer className="w-[90vw] max-w-4xl max-h-[90vh] flex flex-col p-0! overflow-hidden border-yellow-600/50 shadow-yellow-900/20">
      <div className="p-2 px-4 lg:p-4 border-b border-stone-700 flex justify-between items-center bg-stone-900/80 shrink-0">
        <h2 className="text-lg lg:text-2xl font-bold text-yellow-500 uppercase drop-shadow-md">Cửa Hàng NFT</h2>
        <button onClick={close} className="text-stone-400 hover:text-white transition-colors p-1">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 lg:p-6 overflow-y-hidden flex-1 ">
        {!account && (
          <div className="mb-4 lg:mb-6 bg-blue-900/30 border border-blue-500/50 rounded-lg p-2 lg:p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-blue-200 text-sm lg:text-base">Kết nối ví để mua NFT</span>
            <button
              onClick={connectWallet}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 lg:py-2 rounded-md font-medium transition text-sm lg:text-base"
            >
              Kết nối MetaMask
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-y-auto custom-scrollbar pb-4 ">
            {items.map(item => (
              <NFTItem key={item.id} item={item} onBuy={handleBuy} />
            ))}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
