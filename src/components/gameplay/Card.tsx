import type { CardType } from "../../type/card"

type CardProps = {
    card: CardType,
    isSelected: boolean,
    onSelected: (card: CardType)=>void
}

export const Card = ({card, isSelected, onSelected}:CardProps) => {
    const isRed = card.suit>=2

    const SUITS = ["spade", "club", "diamond", "heart"] as const;
    const RANKS = {
        11: "jack",
        12: "queen",
        13: "king",
    } as const;

    const getCardImage = (rank: number, suit: number) => {
        const suitName = SUITS[suit];
        

        if (RANKS[rank as keyof typeof RANKS]) {
            return `./cards/${RANKS[rank as keyof typeof RANKS]}_${suitName}_ic.svg`;
        }

        return `./cards/${suitName}_ic.svg`;
    };
    
    const rankMapping = (rank: number) => {
        if(rank==11) return "J";
        if(rank==12) return "Q";
        if(rank==13) return "K";
        if(rank==14) return "A";
        if(rank==15) return "2";
        return rank;
    }
    
  return (
    <button 
        className={`
            w-30 h-45 bg-white -ml-10 
            rounded-lg p-2 border-2 border-black/70 
            flex flex-col overflow-hidden
            ${isRed?'text-[#EC2000]':'text-black'}
            ${isSelected&&'mb-4'}
        `}
        onClick={()=>onSelected(card)}
    >
        <div className="text-3xl flex flex-col items-start">
            <div>
                <b className="font-card">{rankMapping(card.rank)}</b>
                <img className="w-6" src={`./cards/${SUITS[card.suit-1]}_m_ic.svg`}/>
            </div>
        </div>
        <div className="flex justify-center mt-2 mb-2">
            <img className="" src={getCardImage(card.rank, card.suit-1)}/>
        </div>
    </button>
  )
}
