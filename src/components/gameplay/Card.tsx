import type { CardType } from "../../type/card"
import { Button } from "../ui/Button"

type CardProps = {
    card: CardType,
    isSelected: boolean,
    onSelected: (card: CardType) => void
}

export const Card = ({ card, isSelected, onSelected }: CardProps) => {
    const isRed = card.suit >= 3

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
        if (rank == 11) return "J";
        if (rank == 12) return "Q";
        if (rank == 13) return "K";
        if (rank == 14) return "A";
        if (rank == 15) return "2";
        return rank;
    }

    return (
        <Button
            className={`
            w-[65px] h-[100px] -ml-[28px]
            md:w-[75px] md:h-[110px] md:-ml-[30px]
            xl:w-[120px] xl:h-[180px] xl:-ml-[35px]
            first:ml-0
            bg-white rounded-md lg:rounded-lg
            p-[2px] sm:p-1 lg:p-1.5 xl:p-2
            border border-black/70 lg:border-2
            flex flex-col overflow-hidden
            ${isRed ? 'text-[#EC2000]' : 'text-black'}
            ${isSelected && 'mb-2 sm:mb-3 lg:mb-4'}
        `}
            onClick={() => onSelected(card)}
        >
            <div className="text-xl lg:text-2xl xl:text-3xl flex flex-col items-start leading-none">
                <div>
                    <b className="font-card ">{rankMapping(card.rank)}</b>
                    <img className="w-4 lg:w-5 xl:w-6" src={`./cards/${SUITS[card.suit - 1]}_m_ic.svg`} />
                </div>
            </div>
            <div className="flex justify-center flex-1 items-center">
                <img
                    className="w-[40px] sm:w-[50px] lg:w-[60px] xl:w-auto object-contain max-h-full"
                    src={getCardImage(card.rank, card.suit - 1)}
                />
            </div>
        </Button>
    )
}
