import { useState } from "react";
import type { NFTItemData } from "../../type/nft";
import { Button } from "../ui/Button";

interface Props {
  item: NFTItemData;
  onBuy: (item: NFTItemData) => Promise<void>;
}

export default function NFTItem({ item, onBuy }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      await onBuy(item);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-stone-800/80 rounded-xl p-4 flex flex-col items-center gap-3 border border-yellow-500/30 hover:border-yellow-400 transition-colors">
      <img src={item.imageUrl || "/cards/back_card.svg"} alt={item.name} className="w-24 h-32 object-contain drop-shadow-md" />
      <div className="text-center w-full">
        <h3 className="text-white font-bold text-lg truncate">{item.name}</h3>
        <p className="text-yellow-400 font-semibold">{item.price} MATIC</p>
      </div>
      <Button 
        onClick={handleBuy} 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-2 rounded-lg"
      >
        {isLoading ? "Đang xử lý..." : "Mua ngay"}
      </Button>
    </div>
  );
}
