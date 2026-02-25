import type { CardType } from "./card";
import type { UserType } from "./user";

export type PlayerType = {
  user: UserType
  ready: boolean
  handSize: number
  handCards?: CardType[]
  playerIndex: number
};