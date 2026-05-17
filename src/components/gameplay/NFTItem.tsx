import { useState } from "react";
import { R2_BASE_URL, type NFTItemData } from "../../type/nft";
import { Button } from "../ui/Button";

interface Props {
  item: NFTItemData;
  onBuy: (item: NFTItemData) => Promise<void>;
}

export default function NFTItem({ item, onBuy }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const imageUrl = `${R2_BASE_URL}/${item.id}/promote_ic.png`;

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      await onBuy(item);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="
      bg-stone-800/80 rounded-xl
      p-3 lg:p-4 flex flex-col items-center
      gap-2 lg:gap-3 border border-yellow-500/30
      hover:border-yellow-400 transition-colors
      w-40 lg:w-56
    ">
      <img src={imageUrl} alt={item.name} className="w-16 h-24 lg:w-24 lg:h-32 object-contain drop-shadow-md" />
      <div className="text-center w-full">
        <h3 className="text-white font-bold text-sm lg:text-lg truncate">{item.name}</h3>
        <p className="text-yellow-400 font-semibold text-xs lg:text-base">{item.priceMatic} MATIC</p>
      </div>
      <Button
        onClick={handleBuy}
        disabled={isLoading}
        className="w-full bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm"
      >
        {isLoading ? "..." : "Mua ngay"}
      </Button>
    </div>
  );
}
