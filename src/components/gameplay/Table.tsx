import type { CardType } from "../../type/card";
import { Card } from "./Card";

export const Table = ({ cards }: { cards: CardType[] }) => {
  return (
    <div className="flex gap-3 justify-center">
      {cards.map((c,i) =><Card key={i} card={c} isSelected={false} onSelected={()=>{}}/> )}
    </div>
  );
};
