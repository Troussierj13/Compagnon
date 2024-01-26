import {ModifierParam} from "../MapModifiers";
import {DescribableName, PossibleChoose} from "../helpers";
import {CulturalAdvantage, CulturalAdvantageToInstance} from "./CulturalAdvantage";

export type CultureTypeEnum =
    "bardide"
    | "lindonElf"
    | "hobbit"
    | "breeHuman"
    | "durinDwarf"
    | "northRanger"
export const nameCultureType = {
    bardide: "Bardide",
    lindonElf: "Elfe de Lindon",
    hobbit: "Hobbit de la Compté",
    breeHuman: "Homme de Bree",
    durinDwarf: "Nain du peuple de Durin",
    northRanger: "Rodeur du nord",
};

export type QualityLifeType = {
    name: string
    treasure: number
};
export type QualityLife = "poor" | "modest" | "common" | "prosperous" | "rich" | "veryRich";
export const nameQualityLife = {
    poor: {
        name: "Pauvre",
        treasure: 0
    },
    modest: {
        name: "Modeste",
        treasure: 0
    },
    common: {
        name: "Courant",
        treasure: 30
    },
    prosperous: {
        name: "Prospère",
        treasure: 90
    },
    rich: {
        name: "Riche",
        treasure: 180
    },
    veryRich: {
        name: "Très riche",
        treasure: 300
    }
};

export const qualityLifeByTreasure = (treasure: number) => {
    let res: QualityLife = 'modest';
    for (const [key, value] of Object.entries(nameQualityLife)) {
        if (treasure >= value.treasure) {
            res = key as QualityLife;
        }
    }
    return res;
};

export type CombatSkill = "bows" | "axes" | "spears" | "swords";

export type DefaultCombatSkill = {
    defaultRank: number;
    possibleSkills: Array<CombatSkill>;
    otherDefaultRank: number;
};

export type DerivedCharacteristics = {
    modEndurance: ModifierParam;
    modHope: ModifierParam;
    modParade: ModifierParam;
};

export class SimpleAttributesValuesType {
    strength: number;
    heart: number;
    mind: number;

    constructor(payload?: Partial<SimpleAttributesValuesType>) {
        this.strength = payload?.strength || 0;
        this.heart = payload?.heart || 0;
        this.mind = payload?.mind || 0;
    }
}

export class CultureType {
    readonly culture: CultureTypeEnum;
    readonly derivedCharacteristics: DerivedCharacteristics;
    readonly combatSkills: DefaultCombatSkill;
    readonly culturalAdvantages: Array<DescribableName>;
    readonly qualityLife: QualityLifeType;
    readonly attributesMaxValue: number;
    readonly attributesSample: Array<SimpleAttributesValuesType>;
    readonly commonSkills: Array<number>;
    readonly favoredSkills: Array<number>;
    readonly possibleParticularities: PossibleChoose<string>;

    constructor(
        culture: CultureTypeEnum,
        culturalAdvantages: Array<CulturalAdvantage>,
        qualityLife: QualityLife,
        attributesMaxValue: number,
        attributesSample: Array<SimpleAttributesValuesType>,
        derivedCharacteristics: DerivedCharacteristics,
        commonSkills: Array<number>,
        favoredSkills: Array<number>,
        combatSkills: DefaultCombatSkill,
        possibleParticularities: PossibleChoose<string>
    ) {
        this.culture = culture;
        this.culturalAdvantages = culturalAdvantages.map(x => CulturalAdvantageToInstance[x]);
        this.qualityLife = nameQualityLife[qualityLife];
        this.attributesMaxValue = attributesMaxValue;
        this.attributesSample = attributesSample;
        this.derivedCharacteristics = derivedCharacteristics;
        this.commonSkills = commonSkills;
        this.favoredSkills = favoredSkills;
        this.combatSkills = combatSkills;
        this.possibleParticularities = possibleParticularities;
    }
}
