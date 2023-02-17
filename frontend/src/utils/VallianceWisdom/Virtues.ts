//Virtues
import {DescribableName, DescribableNameWithModifier, PossibleChoose} from "@/utils/helpers";

export type VirtueIdentifier = 'assuranceVirtue'
    | 'empoweredVirtue'
    | 'steadyVirtue'
    | 'masteryVirtue'
    | 'resistanceVirtue'
    | 'livenessVirtue';

export type Virtue = {
    identifier: VirtueIdentifier;
    info: PossibleChoose<DescribableNameWithModifier>;
    defaultInfo?: DescribableName;
    chosen?: Array<number>;
};

export const Assurance: Virtue = {
    identifier: "assuranceVirtue",
    info: new PossibleChoose<DescribableNameWithModifier>(
        1,
        [
            new DescribableNameWithModifier(
                "Assurance",
                "Augmentez votre Espoir de 2",
                [{identifier: 'hopeMax', op: '+', mod: 2}]
            )
        ]
    )
};

export const Empowered: Virtue = {
    identifier: "empoweredVirtue",
    info: new PossibleChoose<DescribableNameWithModifier>(
        1,
        [
            new DescribableNameWithModifier(
                "Habilité",
                "Réduisez le SR de CORPS de 1",
                [{identifier: 'strengthSR', op: '+', mod: -1}]
            ),
            new DescribableNameWithModifier(
                "Habilité",
                "Réduisez le SR de COEUR de 1",
                [{identifier: 'heartSR', op: '+', mod: -1}]
            ),
            new DescribableNameWithModifier(
                "Habilité",
                "Réduisez le SR de ESPRIT de 1",
                [{identifier: 'mindSR', op: '+', mod: -1}]
            )
        ]
    ),
    defaultInfo: new DescribableName(
        "Habilité",
        "Réduisez le SR d'un Attribut de 1"
    ),
};
export const SteadyHand: Virtue = {
    identifier: "steadyVirtue",
    info: new PossibleChoose<DescribableNameWithModifier>(
        1,
        [
            new DescribableNameWithModifier(
                "Main sûre",
                "Ajoutez 1 à votre valeur de CORPS pour un Coup puissant, et +1 au résultat du dé du Destin pour un Coup perforant",
                []
            )
        ]
    )
};

export const Mastery: Virtue = {
    identifier: "masteryVirtue",
    info: new PossibleChoose<DescribableNameWithModifier>(
        1,
        [
            new DescribableNameWithModifier(
                "Maîtrise",
                "Choisissez deux nouvelles Compétences communes favorites",
                []
            )
        ]
    )
};

export const Resistance: Virtue = {
    identifier: "resistanceVirtue",
    info: new PossibleChoose<DescribableNameWithModifier>(
        1,
        [
            new DescribableNameWithModifier(
                "Resistance",
                "Augmentez votre Endurance de 2",
                [{identifier: 'enduranceMax', op: '+', mod: 2}]
            )
        ]
    )
};

export const Liveness: Virtue = {
    identifier: "livenessVirtue",
    info: new PossibleChoose<DescribableNameWithModifier>(
        1,
        [
            new DescribableNameWithModifier(
                "Vivacité",
                "Augmentez votre valeur de Parade de 1",
                [{identifier: 'parade', op: '+', mod: 1}]
            )
        ]
    )
};

export const VirtuesToInstance = {
    assuranceVirtue: Assurance,
    empoweredVirtue: Empowered,
    steadyVirtue: SteadyHand,
    masteryVirtue: Mastery,
    resistanceVirtue: Resistance,
    livenessVirtue: Liveness
};