import type { CardType } from "../type/card";

export const cardIdToCard = (cardId: string):CardType => {
    return {
        id: cardId,
        rank : parseInt(cardId.slice(0, cardId.length-1)),
        suit: parseInt(cardId.slice(cardId.length-1, cardId.length))
    }
}