import type { CardType } from "./card";

export type CombinationType = "SINGLE" | "PAIR" | "TRIPLE" | "QUAD" | "SEQUENCE" | "DOUBLE_SEQUENCE";

export const BOT_DIFFICULTY_MAP: Record<number, "EASY" | "MEDIUM" | "HARD"> = {
  1: "EASY",
  2: "MEDIUM",
  3: "HARD",
};

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
