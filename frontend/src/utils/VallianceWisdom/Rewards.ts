//Rewards
import {DescribableNameWithModifier, PossibleChoose} from "@/utils/helpers";
import {ModifierParam} from "@/utils/MapModifiers";

export type RewardIdentifier = 'unknown'
    | 'sharpReward'
    | 'adjustedReward'
    | 'cleverReward'
    | 'devastatingReward'
    | 'ferociousReward'
    | 'reinforcedReward';

export type ApplyIdentifier = 'notApply'
    | 'armor'
    | 'helm'
    | 'shield'
    | 'weapon'

export class DescribableNameForRewards extends DescribableNameWithModifier {
    applyTo: ApplyIdentifier;

    constructor(name: string, description: string, modifiers?: Array<ModifierParam>, applyTo?: ApplyIdentifier) {
        super(name, description, modifiers);
        this.applyTo = applyTo || 'notApply';
    }
}

export class Reward {
    identifier: RewardIdentifier;
    defaultChoice: DescribableNameForRewards;
    choices: Array<DescribableNameForRewards>;
    applyTo: ApplyIdentifier;
    private _choice: PossibleChoose<DescribableNameForRewards>;

    constructor(payload: Partial<Reward>) {
        this.identifier = payload?.identifier || 'unknown';
        this.choices = payload?.choices || [];
        this.applyTo = payload?.applyTo || 'notApply';
        this.defaultChoice = payload?.defaultChoice || new DescribableNameForRewards(
            "",
            "",
            [],
            'notApply'
        );

        if (payload?.choices !== undefined && payload.choices.length > 0) {
            this._choice = new PossibleChoose<DescribableNameForRewards>(1, this.choices);
            this.setChosen(this.applyTo);
        } else {
            this._choice = new PossibleChoose<DescribableNameForRewards>(1, [this.defaultChoice]);
            this.setChosen(this.defaultChoice.applyTo);
        }
    }

    public resetChoices() {
        this.applyTo = 'notApply';
        this._choice.resetChoices();
    }

    public setChosen(apply?: ApplyIdentifier): void {
        if (apply !== undefined && apply !== 'notApply') {
            const index = this._choice.getPossibleChoice().findIndex((el) => el.applyTo === apply);
            this._choice.setChosen([index]);
            this.applyTo = this.getChosen().applyTo;
        }
    }

    public getChosen(): DescribableNameForRewards {
        return this._choice.getChosen()[0];
    }

    public isChosen(): boolean {
        return this.applyTo !== 'notApply';
    }

    public getInfos(): Array<DescribableNameForRewards> {
        return this._choice.getPossibleChoice();
    }
}

/*
export const dataRewards: IDictionary<Partial<Reward>> = {
    sharpReward: {
        identifier: "sharpReward",
        defaultChoice: {
            name: "Ac??r?? (arme)",
            description: "Les jets d'attaque infligent un Coup perforant sur un 9 ou plus",
            modifiers: [],
            applyTo: 'notApply'
        },
        choices: [
            {
                name: "Ac??r?? (arme)",
                description: "Les jets d'attaque infligent un Coup perforant sur un 9 ou plus",
                modifiers: [],
                applyTo: 'notApply'
            },
            {
                name: "Ac??r?? (arme)",
                description: "Les jets d'attaque infligent un Coup perforant sur un 9 ou plus",
                modifiers: [],
                applyTo: 'weapon'
            }
        ]
    },
    adjustedReward: {
        identifier: "adjustedReward",
        defaultChoice: {
            name: "Ajust?? (armure ou casque)",
            description: "Ajoutez +2 au r??sultat de vos tests de PROTECTION",
            modifiers: [],
            applyTo: 'notApply'
        },
        choices: [
            {
                name: "Ajust?? (armure)",
                description: "Ajoutez +2 au r??sultat de vos tests de PROTECTION",
                modifiers: [],
                applyTo: 'armor'
            },
            {
                name: "Ajust?? (casque)",
                description: "Ajoutez +2 au r??sultat de vos tests de PROTECTION",
                modifiers: [],
                applyTo: 'helm'
            }
        ]
    },
    cleverReward: {
        identifier: "cleverReward",
        defaultChoice: {
            name: "Astucieux (armure, casque ou bouclier)",
            description: "R??duisez votre valeur de charge de 2",
            modifiers: [],
            applyTo: 'notApply'
        },
        choices: [
            {
                name: "Astucieux (armure)",
                description: "R??duisez la valeur de charge de votre armure de 2",
                modifiers: [{identifier: 'armorWeight', mod: -2, op: '+'}],
                applyTo: 'armor'
            }, {
                name: "Astucieux (casque)",
                description: "R??duisez la valeur de charge de votre casque de 2",
                modifiers: [{identifier: 'helmWeight', mod: -2, op: '+'}],
                applyTo: 'helm'
            }, {
                name: "Astucieux (bouclier)",
                description: "R??duisez la valeur de charge de votre bouclier de 2",
                modifiers: [{identifier: 'shieldWeight', mod: -2, op: '+'}],
                applyTo: 'shield'
            },
        ]
    },
    devastatingReward: {
        identifier: "devastatingReward",
        defaultChoice: {
            name: "D??vastateur (arme)",
            description: "Augmentez de 1 la valeur de d??gats d'une arme",
            modifiers: [],
            applyTo: 'notApply'
        },
        choices: [
            {
                name: "D??vastateur (arme)",
                description: "Augmentez de 1 la valeur de d??gats d'une arme",
                modifiers: [],
                applyTo: 'notApply'
            },
            {
                name: "D??vastateur (arme)",
                description: "Augmentez de 1 la valeur de d??gats d'une arme",
                modifiers: [{identifier: 'weaponDamage', mod: 1, op: '+'}],
                applyTo: 'weapon'
            }
        ]
    },
    ferociousReward: {
        identifier: "ferociousReward",
        defaultChoice: {
            name: "F??roce (arme)",
            description: "Augmentez de 2 la valeur de blessure d'une arme",
            modifiers: [],
            applyTo: 'notApply'
        },
        choices: [
            {
                name: "F??roce (arme)",
                description: "Augmentez de 2 la valeur de blessure d'une arme",
                modifiers: [],
                applyTo: 'notApply'
            },
            {
                name: "F??roce (arme)",
                description: "Augmentez de 2 la valeur de blessure d'une arme",
                modifiers: [{identifier: 'weaponInjuryOneHand', mod: 2, op: '+'}, {
                    identifier: 'weaponInjuryTwoHand',
                    mod: 2,
                    op: '+'
                }],
                applyTo: 'weapon'
            }
        ]
    },
    reinforcedReward: {
        identifier: "reinforcedReward",
        defaultChoice: {
            name: "Renforc?? (bouclier)",
            description: "Augmentez de +1 le modificateur de Parade d'un bouclier",
            modifiers: [{identifier: 'shieldParade', mod: 1, op: '+'}],
            applyTo: 'shield'
        },
        choices: [
            {
                name: "Renforc?? (bouclier)",
                description: "Augmentez de +1 le modificateur de Parade d'un bouclier",
                modifiers: [{identifier: 'shieldParade', mod: 1, op: '+'}],
                applyTo: 'notApply'
            },
            {
                name: "Renforc?? (bouclier)",
                description: "Augmentez de +1 le modificateur de Parade d'un bouclier",
                modifiers: [{identifier: 'shieldParade', mod: 1, op: '+'}],
                applyTo: 'shield'
            }
        ]
    },
};
*/