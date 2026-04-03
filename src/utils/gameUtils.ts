import type { CardType } from "../type/card";

export const createDeck = (): CardType[] => {
  const suits = [1, 2, 3, 4]; // Bích, Chuồn, Rô, Cơ
  const ranks = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // 3 to 2
  const deck: CardType[] = [];

  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push({
        id: (rank*10+suit).toString(),
        rank,
        suit,
      });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: CardType[]): CardType[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
