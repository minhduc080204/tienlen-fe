import type { ActionType } from "./action";
import type { UserType } from "./user";

export type ChatMessageType = {
    action: ActionType;
    user: UserType;
    content: string;
    timestamp: number;
}