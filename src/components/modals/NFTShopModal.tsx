import { Coins, X } from "lucide-react";
import { useEffect, useState } from "react";
import { avatarApi } from "../../api/avatar.api";
import { dataApi } from "../../api/data.api";
import { nftApi } from "../../api/nft.api";
import { useWeb3 } from "../../hooks/useWeb3";
import { useAuthStore } from "../../stores/auth.store";
import { useModalStore } from "../../stores/modal.store";
import type { AvatarItemData } from "../../type/avatar";
import type { NFTItemData } from "../../type/nft";
import { formatNumber } from "../../utils/formatNumber";
import NFTItem from "../gameplay/NFTItem";
import { gameToast } from "../ui/toast";
import { ModalContainer } from "./ModalContainer";

export default function NFTShopModal() {
  const close = useModalStore((s) => s.close);
  const { account, connectWallet, transferMatic } = useWeb3();

  // Tab State
  const [activeTab, setActiveTab] = useState<"nfts" | "avatars">("nfts");

  // NFT State
  const [items, setItems] = useState<NFTItemData[]>([]);
  const [loading, setLoading] = useState(true);

  // Avatar State
  const [avatars, setAvatars] = useState<AvatarItemData[]>([]);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const updateUserStore = useAuthStore((s) => s.updateUser);

  const fetchAvatars = async () => {
    setAvatarLoading(true);
    try {
      const data = await avatarApi.getAvatars();
      setAvatars(data);
    } catch (error) {
      console.error("Failed to fetch avatars", error);
    } finally {
      setAvatarLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "nfts" && items.length === 0) {
      const fetchNFTs = async () => {
        setLoading(true);
        try {
          const data = await nftApi.getNFTs();
          setItems(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchNFTs();
    } else if (activeTab === "avatars" && avatars.length === 0) {
      fetchAvatars();
    }
  }, [activeTab]);

  const handleBuy = async (item: NFTItemData) => {
    try {
      let currentAccount = account;
      if (!currentAccount) {
        const { address } = await connectWallet();
        currentAccount = address;
      }

      gameToast.success("Vui lòng xác nhận trên MetaMask...");
      const txHash = await transferMatic(item.priceMatic.toString());

      gameToast.success("Đang xác thực giao dịch...");
      await nftApi.verifyTransaction({
        txHash,
        itemId: item.id,
        walletAddress: currentAccount!
      });

      // Refresh balance after purchase
      try {
        const updatedUser = await dataApi.profile();
        updateUserStore(updatedUser);
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
        gameToast.error(error?.response?.data?.message || error.message || "Có lỗi xảy ra khi mua NFT");
      }
    }
  };

  const handleBuyAvatarToken = async (styleName: string, sampleItem: AvatarItemData) => {
    try {
      gameToast.success(`Đang xử lý mua bộ ${styleDisplayNames[styleName] || styleName}...`);
      await avatarApi.buyAvatar(sampleItem.id);

      // Refresh balance after purchase
      try {
        const updatedUser = await dataApi.profile();
        updateUserStore(updatedUser);
      } catch (e) {
        console.error("Failed to refresh balance", e);
      }

      await fetchAvatars();
      gameToast.success(`Mua bộ avatar ${styleDisplayNames[styleName] || styleName} thành công!`);
    } catch (error: any) {
      console.error("Purchase avatar token error:", error);
      gameToast.error(error?.response?.data?.message || error.message || "Có lỗi xảy ra khi mua bộ avatar");
    }
  };

  const handleBuyAvatarMatic = async (styleName: string, sampleItem: AvatarItemData) => {
    try {
      let currentAccount = account;
      if (!currentAccount) {
        const { address } = await connectWallet();
        currentAccount = address;
      }

      gameToast.success("Vui lòng xác nhận trên MetaMask...");
      const txHash = await transferMatic(sampleItem.priceMatic.toString());

      gameToast.success("Đang xác thực giao dịch...");
      await avatarApi.verifyTransfer({
        txHash,
        itemId: sampleItem.id,
        walletAddress: currentAccount!
      });

      // Refresh balance after purchase
      try {
        const updatedUser = await dataApi.profile();
        updateUserStore(updatedUser);
      } catch (e) {
        console.error("Failed to refresh balance", e);
      }

      await fetchAvatars();
      gameToast.success(`Mua bộ avatar ${styleDisplayNames[styleName] || styleName} bằng Web3 thành công!`);
    } catch (error: any) {
      console.error("Purchase avatar Web3 error:", error);
      if (error.message?.includes("rejected")) {
        gameToast.error("Giao dịch đã bị hủy");
      } else if (error.message?.includes("insufficient funds")) {
        gameToast.error("Số dư MATIC không đủ");
      } else {
        gameToast.error(error?.response?.data?.message || error.message || "Có lỗi xảy ra khi mua bộ avatar");
      }
    }
  };

  // Avatar styles helpers
  const freeStyles = ["adventurer", "adventurer-neutral", "big-ears"];

  const styleDisplayNames: Record<string, string> = {
    adventurer: "Thám Hiểm (Mẫu Free)",
    "adventurer-neutral": "Trung Lập (Mẫu Free)",
    "big-ears": "Tai To (Mẫu Free)",
    avataaars: "Nhân Vật Cao Cấp",
    bottts: "Người Máy Cyberpunk",
    thumbs: "Ngón Tay Tinh Nghịch",
  };

  const styleDescriptions: Record<string, string> = {
    adventurer: "Mẫu thám hiểm phiêu lưu cổ điển, hoàn toàn miễn phí cho tất cả người chơi.",
    "adventurer-neutral": "Thiết kế tối giản, tinh tế và thanh lịch, hoàn toàn miễn phí.",
    "big-ears": "Tạo hình ngộ nghĩnh và đầy cá tính với đôi tai đặc biệt, hoàn toàn miễn phí.",
    avataaars: "Mở khóa toàn bộ style nhân vật cực đẹp với đa dạng tùy biến trang phục và sắc thái biểu cảm.",
    bottts: "Bộ sưu tập những chú người máy tương lai đậm chất công nghệ và khoa học viễn tưởng.",
    thumbs: "Phong cách thiết kế các ngón tay tinh nghịch, dễ thương và vô cùng phá cách.",
  };

  // Group avatars by style
  const uniqueStyles = Array.from(new Set(avatars.map((a) => a.style)));
  const avatarPacks = uniqueStyles.map((styleName) => {
    const packItems = avatars.filter((a) => a.style === styleName);
    const sample = packItems[0];
    const isFree = freeStyles.includes(styleName);
    const isOwned = isFree || packItems.some((a) => a.owned);

    return {
      style: styleName,
      name: styleDisplayNames[styleName] || styleName,
      description: styleDescriptions[styleName] || "Bộ ảnh đại diện Dicebear chất lượng cao.",
      items: packItems,
      sample,
      isFree,
      isOwned,
      priceTokens: sample?.priceTokens || 0,
      priceMatic: sample?.priceMatic || 0,
    };
  });

  return (
    <ModalContainer className="w-[90vw] max-w-4xl max-h-[90vh] flex flex-col p-0! overflow-hidden border-yellow-600/50 shadow-yellow-900/20">
      {/* Header */}
      <div className="p-2 px-4 lg:p-4 border-b border-stone-700 flex justify-between items-center bg-stone-900/80 shrink-0">
        <h2 className="text-lg lg:text-2xl font-bold text-yellow-500 uppercase drop-shadow-md">Cửa Hàng NFT</h2>
        <button onClick={close} className="text-stone-400 hover:text-white transition-colors p-1 cursor-pointer">
          <X size={24} />
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-stone-850 px-4 lg:px-6 bg-stone-900/50 shrink-0 gap-6">
        <button
          onClick={() => setActiveTab("nfts")}
          className={`py-3 text-sm font-bold uppercase transition-colors relative flex items-center gap-2 cursor-pointer ${activeTab === "nfts" ? "text-yellow-500" : "text-stone-400 hover:text-stone-200"
            }`}
        >
          Skins Bài (NFT)
          {activeTab === "nfts" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("avatars")}
          className={`py-3 text-sm font-bold uppercase transition-colors relative flex items-center gap-2 cursor-pointer ${activeTab === "avatars" ? "text-yellow-500" : "text-stone-400 hover:text-stone-200"
            }`}
        >
          Bộ Ảnh Đại Diện
          {activeTab === "avatars" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 overflow-y-hidden flex-1 flex flex-col min-h-0">
        {/* Wallet connection banner if tab requires and wallet is not connected */}
        {activeTab === "nfts" && !account && (
          <div className="mb-4 lg:mb-6 bg-blue-900/30 border border-blue-500/50 rounded-lg p-2 lg:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
            <span className="text-blue-200 text-sm lg:text-base">Kết nối ví để mua NFT Skins</span>
            <button
              onClick={connectWallet}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 lg:py-2 rounded-md font-medium transition text-sm lg:text-base cursor-pointer"
            >
              Kết nối MetaMask
            </button>
          </div>
        )}

        {/* Loading indicators */}
        {((activeTab === "nfts" && loading) || (activeTab === "avatars" && avatarLoading)) ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : activeTab === "nfts" ? (
          /* NFT Tab Content */
          <div className="flex gap-4 overflow-y-auto custom-scrollbar pb-4 flex-1">
            {items.map((item) => (
              <NFTItem key={item.id} item={item} onBuy={handleBuy} />
            ))}
          </div>
        ) : (
          /* Avatar Tab Content */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-4 flex-1 pr-1 min-h-0">
            {avatarPacks.map((pack) => (
              <div
                key={pack.style}
                className="bg-stone-900/60 border border-stone-800 hover:border-yellow-600/30 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-md"
              >
                {/* Pack Info */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-yellow-500 font-extrabold text-base uppercase drop-shadow-sm">
                      {pack.name}
                    </span>
                    {pack.isOwned && (
                      <span className="text-[10px] bg-green-500/10 border border-green-500/25 text-green-400 font-bold px-2 py-0.5 rounded-full shrink-0">
                        Đã sở hữu
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-xs mt-1.5 leading-relaxed min-h-[36px]">
                    {pack.description}
                  </p>

                  {/* Horizontal Previews of templates in this style */}
                  <div className="flex gap-2 items-center justify-start my-4 overflow-x-auto pb-1.5 custom-scrollbar shrink-0">
                    {pack.items.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="w-11 h-11 rounded-full bg-stone-950 p-0.5 border border-stone-850 flex items-center justify-center shrink-0 shadow-inner"
                      >
                        <img src={item.srcUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {pack.items.length > 5 && (
                      <div className="w-11 h-11 rounded-full bg-stone-950 border border-stone-850 flex items-center justify-center text-[10px] text-stone-400 font-extrabold shrink-0">
                        +{pack.items.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchase Button options */}
                <div className="mt-2 shrink-0">
                  {pack.isOwned ? (
                    <div className="w-full text-center text-xs text-stone-500 bg-stone-950/40 border border-stone-850 rounded-lg py-2.5 font-bold uppercase tracking-wider">
                      Đã sở hữu trọn bộ
                    </div>
                  ) : (
                    <div className="flex flex-col xs:flex-row gap-2">
                      {/* Token purchase */}
                      <button
                        onClick={() => handleBuyAvatarToken(pack.style, pack.sample)}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-stone-950 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-yellow-950/15"
                      >
                        <Coins size={14} />
                        Mua với {formatNumber(pack.priceTokens)} Xu
                      </button>

                      {/* MATIC Web3 purchase */}
                      <button
                        onClick={() => handleBuyAvatarMatic(pack.style, pack.sample)}
                        className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-950/20"
                      >
                        💎 {pack.priceMatic} MATIC
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
