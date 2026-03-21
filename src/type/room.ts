import type { PlayerType } from "./player"

export type RoomStatus = "WAITING" | "PLAYING" | "READY";

export type RoomType = {
    roomId?: number
    me?: PlayerType
    table: string[]
    players: PlayerType[]
    status: RoomStatus
    currentTurn?: number
    betToken?: number
}