import { cardIdToCard } from "../../utils/cardIdToCard";
import { Card } from "./Card";

export const Table = ({ cards }: { cards: string[] }) => {
  return (
    <div className="flex gap-3 justify-center">
      {cards.map((c, i) => <Card key={i} card={cardIdToCard(c)} isSelected={false} onSelected={() => { }} />)}
    </div>
  );
};
