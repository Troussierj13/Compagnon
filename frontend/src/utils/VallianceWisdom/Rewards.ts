//Rewards
import {DescribableName} from "@/utils/helpers";
import {ModifierParam} from "@/utils/MapModifiers";

export type RewardIdentifier = 'sharpReward'
    | 'adjustedReward'
    | 'cleverReward'
    | 'devastatingReward'
    | 'ferociousReward'
    | 'reinforcedReward';


export class Reward {
    identifier: RewardIdentifier;
    info: DescribableName;
    modifiers: Array<ModifierParam>;

    constructor(identifier: RewardIdentifier, info: DescribableName, modifiers: Array<ModifierParam>) {
        this.identifier = identifier;
        this.info = info;
        this.modifiers = modifiers;
    }
}

export const Sharp: Reward = {
    identifier: "sharpReward",
    info: new DescribableName(
        "Acéré (arme)",
        "Les jets d'attaque infligent un Coup perforant sur un 9 ou plus"
    ),
    modifiers: []
};

export const Adjusted: Reward = {
    identifier: "adjustedReward",
    info: new DescribableName(
        "Ajusté (armure ou casque)",
        "Ajoutez +2 au résultat de vos tests de PROTECTION"
    ),
    modifiers: []
};

export const Clever: Reward = {
    identifier: "cleverReward",
    info: new DescribableName(
        "Astucieux (armure, casque ou bouclier)",
        "Réduisez votre valeur de charge de 2"
    ),
    modifiers: []
};

export const Devastating: Reward = {
    identifier: "devastatingReward",
    info: new DescribableName(
        "Dévastateur (arme)",
        "Augmentez de 1 la valeur de dégats d'une arme"
    ),
    modifiers: []
};

export const Ferocious: Reward = {
    identifier: "ferociousReward",
    info: new DescribableName(
        "Féroce (arme)",
        "Augmentez de 2 la valeur de blessure d'une arme"
    ),
    modifiers: []
};

export const Reinforced: Reward = {
    identifier: "reinforcedReward",
    info: new DescribableName(
        "Renforcé (bouclier)",
        "Augmentez de +1 le modificateur de Parade d'un bouclier"
    ),
    modifiers: []
};

export const RewardsToInstance = {
    sharpReward: Sharp,
    adjustedReward: Adjusted,
    cleverReward: Clever,
    devastatingReward: Devastating,
    ferociousReward: Ferocious,
    reinforcedReward: Reinforced
};