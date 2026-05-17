import { R2_BASE_URL, type NFTItemData } from "../../type/nft";
import { Button } from "../ui/Button";

interface NftsTabProps {
  myNfts: NFTItemData[];
  selectedCardSkinId: number | null;
  setSelectedCardSkin: (id: number | null) => void;
}

export const NftsTab = ({ myNfts, selectedCardSkinId, setSelectedCardSkin }: NftsTabProps) => (
  <div className="grid grid-cols-3 gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1 pb-2 w-full h-full min-h-0 content-start">
    {myNfts.length === 0 ? (
      <div className="col-span-3 w-full text-center text-zinc-500 py-10 flex flex-col items-center gap-3 self-center">
        <div className="text-4xl opacity-20">🃏</div>
        <div>Bạn chưa sở hữu item NFT nào</div>
      </div>
    ) : (
      <>
        {myNfts.map((item) => {
          const isSelected = selectedCardSkinId === item.id;
          const imageUrl = `${R2_BASE_URL}/${item.id}/promote_ic.png`;
          return (
            <div
              key={item.id}
              className={`bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all h-[220px] lg:h-[280px] flex flex-col ${isSelected ? "border-red-500 shadow-lg shadow-red-900/20" : "border-zinc-800 hover:border-zinc-700"
                }`}
            >
              <div className="flex-1 bg-zinc-800 relative group overflow-hidden min-h-0">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    ĐANG DÙNG
                  </div>
                )}
              </div>
              <div className="p-3 shrink-0">
                <div className="font-bold text-sm mb-2 text-zinc-100 truncate">{item.name}</div>
                <Button
                  disabled={isSelected}
                  onClick={() => setSelectedCardSkin(item.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected
                    ? "bg-zinc-800 text-zinc-500 cursor-default"
                    : "bg-red-600 hover:bg-red-500 text-white active:scale-95"
                    }`}
                >
                  {isSelected ? "Đã chọn" : "Sử dụng"}
                </Button>
              </div>
            </div>
          );
        })}
        {myNfts.map((item) => {
          const isSelected = selectedCardSkinId === item.id;
          const imageUrl = `${R2_BASE_URL}/${item.id}/promote_ic.png`;
          return (
            <div
              key={item.id}
              className={`bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all h-[220px] lg:h-[280px] flex flex-col ${isSelected ? "border-red-500 shadow-lg shadow-red-900/20" : "border-zinc-800 hover:border-zinc-700"
                }`}
            >
              <div className="flex-1 bg-zinc-800 relative group overflow-hidden min-h-0">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    ĐANG DÙNG
                  </div>
                )}
              </div>
              <div className="p-3 shrink-0">
                <div className="font-bold text-sm mb-2 text-zinc-100 truncate">{item.name}</div>
                <Button
                  disabled={isSelected}
                  onClick={() => setSelectedCardSkin(item.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected
                    ? "bg-zinc-800 text-zinc-500 cursor-default"
                    : "bg-red-600 hover:bg-red-500 text-white active:scale-95"
                    }`}
                >
                  {isSelected ? "Đã chọn" : "Sử dụng"}
                </Button>
              </div>
            </div>
          );
        })}
        {myNfts.map((item) => {
          const isSelected = selectedCardSkinId === item.id;
          const imageUrl = `${R2_BASE_URL}/${item.id}/promote_ic.png`;
          return (
            <div
              key={item.id}
              className={`bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all h-[220px] lg:h-[280px] flex flex-col ${isSelected ? "border-red-500 shadow-lg shadow-red-900/20" : "border-zinc-800 hover:border-zinc-700"
                }`}
            >
              <div className="flex-1 bg-zinc-800 relative group overflow-hidden min-h-0">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    ĐANG DÙNG
                  </div>
                )}
              </div>
              <div className="p-3 shrink-0">
                <div className="font-bold text-sm mb-2 text-zinc-100 truncate">{item.name}</div>
                <Button
                  disabled={isSelected}
                  onClick={() => setSelectedCardSkin(item.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected
                    ? "bg-zinc-800 text-zinc-500 cursor-default"
                    : "bg-red-600 hover:bg-red-500 text-white active:scale-95"
                    }`}
                >
                  {isSelected ? "Đã chọn" : "Sử dụng"}
                </Button>
              </div>
            </div>
          );
        })}
      </>
    )}
  </div>
);
