import type { CardType } from "../type/card"
import { Card } from "./gameplay/Card"

type HandCardProps = {
    hands: CardType[],
    selectedIds: string[],
    onSelected: (card: CardType)=>void,
}

export const HandCard = ({
    hands,
    selectedIds,
    onSelected
}:HandCardProps) => {
    

    const renderCards = () => {
        return(
            <div className="inline-flex items-end">
                {hands.map((card)=><Card 
                    key={card.id} 
                    card={card} 
                    isSelected={selectedIds.includes(card.id)}
                    onSelected={()=>onSelected(card)}
                />)}
            </div>
        )
    }

    return(
        <div>
            {hands&&renderCards()}
        </div>
    )
}