// components/gameplay/Hand.tsx
import type { CardType } from "../../type/card";
import { Card } from "./Card";

export const Hand = ({ cards }: { cards: CardType[] }) => {
  return (
    <div className="flex gap-2 justify-center">
      {/* {cards.map((c) => (
        <Card key={c.id} card={c} selectable />
      ))} */}
    </div>
  );
};
