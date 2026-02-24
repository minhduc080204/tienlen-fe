import type { CardType } from "../../type/card";

export const Table = ({ cards }: { cards: CardType[] }) => {
  return (
    <div className="flex gap-3 justify-center min-h-[100px]">
      {cards.map((c,i) => (
        <div key={i} className="w-14 h-20 bg-white rounded-lg">
          {c.id}
        </div>
      ))}
    </div>
  );
};
