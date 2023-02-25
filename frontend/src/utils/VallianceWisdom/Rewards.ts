//Rewards
import {DescribableName, IDictionary} from "@/utils/helpers";
import {ModifierParam} from "@/utils/MapModifiers";

export type RewardIdentifier = 'unknown'
    | 'sharpReward'
    | 'adjustedReward'
    | 'cleverReward'
    | 'devastatingReward'
    | 'ferociousReward'
    | 'reinforcedReward';


export class Reward {
    identifier: RewardIdentifier;
    info: DescribableName;
    modifiers: Array<ModifierParam>;

    constructor(payload: Partial<Reward>) {
        this.identifier = payload?.identifier || 'unknown';
        this.info = payload?.info || new DescribableName('', '');
        this.modifiers = payload?.modifiers || [];
    }
}

export const dataRewards: IDictionary<Partial<Reward>> = {
    sharpReward: {
        identifier: "sharpReward",
        info: new DescribableName(
            "Acéré (arme)",
            "Les jets d'attaque infligent un Coup perforant sur un 9 ou plus"
        )
    },
    adjustedReward: {
        identifier: "adjustedReward",
        info: new DescribableName(
            "Ajusté (armure ou casque)",
            "Ajoutez +2 au résultat de vos tests de PROTECTION"
        )
    },
    cleverReward: {
        identifier: "cleverReward",
        info: new DescribableName(
            "Astucieux (armure, casque ou bouclier)",
            "Réduisez votre valeur de charge de 2"
        )
    },
    devastatingReward: {
        identifier: "devastatingReward",
        info: new DescribableName(
            "Dévastateur (arme)",
            "Augmentez de 1 la valeur de dégats d'une arme"
        )
    },
    ferociousReward: {
        identifier: "ferociousReward",
        info: new DescribableName(
            "Féroce (arme)",
            "Augmentez de 2 la valeur de blessure d'une arme"
        )
    },
    reinforcedReward: {
        identifier: "reinforcedReward",
        info: new DescribableName(
            "Renforcé (bouclier)",
            "Augmentez de +1 le modificateur de Parade d'un bouclier"
        )
    },
};