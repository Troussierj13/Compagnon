//Virtues
import {DescribableNameWithModifier, IDictionary, PossibleChoose} from "../helpers";

export type VirtueIdentifier = 'unknown'
    | 'assuranceVirtue'
    | 'empoweredVirtue'
    | 'steadyVirtue'
    | 'masteryVirtue'
    | 'resistanceVirtue'
    | 'livenessVirtue';

export class Virtue {
    identifier: VirtueIdentifier;
    defaultInfo: DescribableNameWithModifier;
    choice: Array<DescribableNameWithModifier>;
    chosen: number;
    private _choice: PossibleChoose<DescribableNameWithModifier>;

    constructor(payload: Partial<Virtue>) {
        this.identifier = payload?.identifier || 'unknown';
        this.chosen = payload?.chosen !== undefined ? payload.chosen : -1;
        this.choice = payload?.choice || [];
        this.defaultInfo = payload?.defaultInfo || new DescribableNameWithModifier(
            "",
            "",
            []
        );

        if (payload?.choice !== undefined && payload.choice.length > 0) {
            this._choice = new PossibleChoose<DescribableNameWithModifier>(1, this.choice);
            if (this.chosen !== -1) {
                this.setChosen(this.chosen);
            }
        } else {
            this._choice = new PossibleChoose<DescribableNameWithModifier>(1, [this.defaultInfo]);
            this.setChosen(0);
        }
    }

    public setChosen(chosen?: number): void {
        if (chosen !== undefined && chosen >= 0) {
            this._choice.setChosen([chosen]);
            this.chosen = this._choice.getChosenId()[0];
        }
    }

    public getChosen(): DescribableNameWithModifier {
        return this._choice.getChosen()[0];
    }

    public isChosen(): boolean {
        return this.chosen !== -1;
    }

    public getInfos(): Array<DescribableNameWithModifier> {
        return this._choice.getPossibleChoice();
    }
}


export const dataVirtues: IDictionary<Partial<Omit<Virtue, '_choice'>>> = {
    empoweredVirtue: {
        identifier: 'empoweredVirtue',
        defaultInfo: {
            name: "Habilité",
            description: "Réduisez le SR d'un Attribut de 1",
            modifiers: []
        },
        choice: [
            {
                name: "Habilité (CORP)",
                description: "Réduisez le SR de CORPS de 1",
                modifiers: [{identifier: 'strengthSR', op: '+', mod: -1}]
            },
            {
                name: "Habilité (COEUR)",
                description: "Réduisez le SR de COEUR de 1",
                modifiers: [{identifier: 'heartSR', op: '+', mod: -1}]
            },
            {
                name: "Habilité (ESPRIT)",
                description: "Réduisez le SR de ESPRIT de 1",
                modifiers: [{identifier: 'mindSR', op: '+', mod: -1}]
            }
        ]
    },
    livenessVirtue: {
        identifier: 'livenessVirtue',
        defaultInfo: {
            name: "Vivacité",
            description: "Augmentez votre valeur de Parade de 1",
            modifiers: [{identifier: 'parade', op: '+', mod: 1}]
        }
    },
    resistanceVirtue: {
        identifier: "resistanceVirtue",
        defaultInfo: {
            name: "Resistance",
            description: "Augmentez votre Endurance de 2",
            modifiers: [{identifier: 'enduranceMax', op: '+', mod: 2}]
        }
    },
    masteryVirtue: {
        identifier: "masteryVirtue",
        defaultInfo: {
            name: "Maîtrise",
            description: "Choisissez deux nouvelles Compétences communes favorites",
            modifiers: []
        }
    },
    steadyVirtue: {
        identifier: "steadyVirtue",
        defaultInfo: {
            name: "Main sûre",
            description: "Ajoutez 1 à votre valeur de CORPS pour un Coup puissant, et +1 au résultat du dé du Destin pour un Coup perforant",
            modifiers: []
        }
    },
    assuranceVirtue: {
        identifier: "assuranceVirtue",
        defaultInfo: {
            name: "Assurance",
            description: "Augmentez votre Espoir de 2",
            modifiers: [{identifier: 'hopeMax', op: '+', mod: 2}]
        }
    },
};