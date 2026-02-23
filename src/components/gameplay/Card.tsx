import type { CardType } from "../../type/card"

type CardProps = {
    card: CardType,
    isSelected: boolean,
    onSelected: (card: CardType)=>void
}

export const Card = ({card, isSelected, onSelected}:CardProps) => {
    const isRed = card.suit>=2

    const suitIconMapping = [
        "spade_ic.svg",
        "club_ic.svg",
        "diamond_ic.svg",
        "heart_ic.svg",
    ]
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
            rounded-lg p-2 border-1 border-black 
            ${isRed?'text-red-700':'text-black'}
            ${isSelected&&'mb-4'}
        `}
        onClick={()=>onSelected(card)}
    >
        <div className="text-3xl flex items-center">
            <b className="font-card">{rankMapping(card.rank)}</b>
            <img className="w-6" src={`./cards/${suitIconMapping[card.suit]}`}/>
        </div>
        <div className="flex justify-center mt-5">
            <img className="w-20" src={`./cards/${suitIconMapping[card.suit]}`}/>
        </div>
    </button>
  )
}
