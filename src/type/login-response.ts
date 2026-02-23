import type { UserType } from "./user";

export type LoginResponse = {
    token: string;
    user: UserType;
}