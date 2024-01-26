export type ShowStateIdentifier =
    | "None"
    | "Entities"
    | "PlayerSheet";

export type ShowState = {
    identifier: ShowStateIdentifier;
    value: string;
}