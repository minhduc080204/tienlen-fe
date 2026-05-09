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
        setItems([
          { id: 1, name: "Classic Blue Back", price: "0.1", imageUrl: "/cards/back_card.svg" },
          { id: 2, name: "Golden Dragon Back", price: "0.5", imageUrl: "/cards/back_card.svg" },
          { id: 3, name: "Cyberpunk Frame", price: "0.2", imageUrl: "" }
        ]);
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
      const txHash = await purchaseNFT(item.id, item.price);

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
    <ModalContainer>
      <div className="p-4 border-b border-stone-700 flex justify-between items-center bg-stone-900/50">
        <h2 className="text-2xl font-bold text-yellow-500 uppercase drop-shadow-md">Cửa Hàng NFT</h2>
        <button onClick={close} className="text-stone-400 hover:text-white transition-colors">
          <X size={28} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1">
        {!account && (
          <div className="mb-6 bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-blue-200">Kết nối ví để mua NFT</span>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Kết nối MetaMask
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => (
              <NFTItem key={item.id} item={item} onBuy={handleBuy} />
            ))}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
