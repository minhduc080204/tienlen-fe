import type { CardType } from "../../type/card";

// components/gameplay/Card.tsx
type Props = {
  card: CardType;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export const CardX = ({ card, selectable, selected, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-14 h-20 rounded-lg bg-white
        flex flex-col justify-between p-1
        text-black font-bold
        cursor-pointer
        transition-all
        ${selected ? "-translate-y-4 ring-2 ring-red-500" : ""}
        ${selectable ? "hover:-translate-y-2" : ""}
      `}
    >
      <span>{card.rank}</span>
      <span className="self-end">{card.suit}</span>
    </div>
  );
};
