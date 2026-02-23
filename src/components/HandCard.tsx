import type { CardType } from "../type/card"
import { Card } from "./gameplay/Card"

export const HandCard = () => {
    const selectedCards: CardType[] = []
    const hands: CardType[] = [
        {rank: 3, suit: 0},
        {rank: 4, suit: 1},
        {rank: 5, suit: 2},
        {rank: 6, suit: 3},
        {rank: 7, suit: 0},
        {rank: 8, suit: 1},
        {rank: 9, suit: 2},
        {rank: 10, suit: 3},
        {rank: 11, suit: 0},
        {rank: 12, suit: 1},
        {rank: 13, suit: 2},
        {rank: 14, suit: 3},
        {rank: 15, suit: 0},
    ]

    const renderCards = () => {
        return(
            <div className="inline-flex items-end">
                {hands.map((card, index)=><Card 
                    key={index} 
                    card={card} 
                    isSelected={index%3==0} 
                    onSelected={(card)=>{selectedCards.push(card)}}
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