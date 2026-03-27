import type { CardType } from "../../type/card"
import { Card } from "./Card"

type HandProps = {
    classes?: string,
    hands: CardType[],
    selectedIds: string[],
    onSelected: (card: CardType) => void,
}

export const Hand = ({
    classes,
    hands,
    selectedIds,
    onSelected
}: HandProps) => {

    const renderCards = () => {
        return (
            <div className="inline-flex items-end pb-0">
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
        <div className={classes}>
            {hands && renderCards()}
        </div>
    )
}