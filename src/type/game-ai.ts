import type { CardType } from "./card";

export type CombinationType = "SINGLE" | "PAIR" | "TRIPLE" | "QUAD" | "SEQUENCE" | "DOUBLE_SEQUENCE";

export interface Combination {
  type: CombinationType;
  cards: CardType[];
  power: number; // (highestCard.rank * 10) + highestCard.suit
}

export interface HandAnalysis {
  singles: CardType[];
  pairs: Combination[];
  triples: Combination[];
  quads: Combination[];
  sequences: Combination[];
  doubleSequences: Combination[];
}
