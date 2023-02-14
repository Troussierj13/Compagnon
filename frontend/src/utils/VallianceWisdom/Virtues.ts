//Virtues
import {DescribableName} from "@/utils/helpers";
import {ModifierParam} from "@/utils/MapModifiers";

export type VirtueIdentifier = 'assuranceVirtue'
    | 'empoweredVirtue'
    | 'steadyVirtue'
    | 'masteryVirtue'
    | 'resistanceVirtue'
    | 'livenessVirtue';

export type Virtue = {
    identifier: VirtueIdentifier;
    info: DescribableName;
    modifiers: Array<ModifierParam>
};

export const Assurance: Virtue = {
    identifier: "assuranceVirtue",
    info: new DescribableName(
        "Assurance",
        "Augmentez votre Espoir de 2"
    ),
    modifiers: []
};

export const Empowered: Virtue = {
    identifier: "empoweredVirtue",
    info: new DescribableName(
        "Habilité",
        "Réduisez le SR d'un Attribut de 1"
    ),
    modifiers: []
};
export const SteadyHand: Virtue = {
    identifier: "steadyVirtue",
    info: new DescribableName(
        "Main sûre",
        "Ajoutez 1 à votre valeur de CORPS pour un Coup puissant, et +1 au résultat du dé du Destin pour un Coup perforant"
    ),
    modifiers: []
};

export const Mastery: Virtue = {
    identifier: "masteryVirtue",
    info: new DescribableName(
        "Maîtrise",
        "Choisissez deux nouvelles Compétences communes favorites"
    ),
    modifiers: []
};

export const Resistance: Virtue = {
    identifier: "resistanceVirtue",
    info: new DescribableName(
        "Resistance",
        "Augmentez votre Endurance de 2"
    ),
    modifiers: []
};

export const Liveness: Virtue = {
    identifier: "livenessVirtue",
    info: new DescribableName(
        "Vivacité",
        "Augmentez votre valeur de Parade de 1"
    ),
    modifiers: []
};

export const VirtuesToInstance = {
    assuranceVirtue: Assurance,
    empoweredVirtue: Empowered,
    steadyVirtue: SteadyHand,
    masteryVirtue: Mastery,
    resistanceVirtue: Resistance,
    livenessVirtue: Liveness
};