import type { CardType } from "../../type/card"
import { Card } from "./Card"

type HandProps = {
    hands: CardType[],
    selectedIds: string[],
    onSelected: (card: CardType) => void,
}

export const Hand = ({
    hands,
    selectedIds,
    onSelected
}: HandProps) => {

    const renderCards = () => {
        return (
            <div className="inline-flex items-end">
                {hands.map((card) => <Card
                    key={card.rank + "" + card.suit}
                    card={card}
                    isSelected={selectedIds.includes(card.id)}
                    onSelected={() => onSelected(card)}
                />)}
            </div>
        )
    }

    return (
        <div>
            {hands && renderCards()}
        </div>
    )
}