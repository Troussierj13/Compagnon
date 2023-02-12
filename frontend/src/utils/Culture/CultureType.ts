import {ModifierParam} from "@/utils/MapModifiers";

export type VocationType = {
    name: string,
    shadowPath: string,
}
export type Vocation =
    | "captain"
    | "champion"
    | "treasureHunter"
    | "messenger"
    | "protector"
    | "savant";

export const nameVocationType = {
    captain: {
        name: "Capitaine",
        shadowPath: "Attrait du pouvoir",
    },
    champion: {
        name: "Champion",
        shadowPath: "Malédiction de la vengeance",
    },
    treasureHunter: {
        name: "Chasseur de trésors",
        shadowPath: "Mal du dragon",
    },
    messenger: {
        name: "Messager",
        shadowPath: "Folie itinérante",
    },
    protector: {
        name: "Protecteur",
        shadowPath: "Voie du désespoir",
    },
    savant: {
        name: "Erudit",
        shadowPath: "Attrait des secret",
    },
};

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

export type CulturalAdvantageType = {
    name: string
    bonus: string
}
export type CulturalAdvantage =
    "intrepid"
    | "elvenPrecision"
    | "longDefeat"
    | "goodSense"
    | "semiMan"
    | "fromBree"
    | "tireless"
    | "naugrim"
    | "kingOfMen"
    | "dunedainAllegiance"
export const nameCultureAdvantage = {
    intrepid: {
        name: "Intrepide",
        bonus: "Vos tests de VAILIANCE sont favorisés"
    },
    elvenPrecision: {
        name: "Précision elfique",
        bonus: "Tant que votre Héros n'est pas Mélancolique, vous pouvez dépenser 1 point d'Espoir pour obtenir une Réussite magique lors d'un jet de Compétence"
    },
    longDefeat: {
        name: "",
        bonus: "Durant la Phase de Communauté, lors de l'étape destinée à réduire les points d'Ombre cumulés par les Héros, vous ne pouvez perdre que 1 point d'Ombre"
    },
    goodSense: {
        name: "Bon sens Hobbit",
        bonus: "Vos tests de SAGESSE sont favorisés, et vous gagnez (1d) à vos tests d'Ombre lorsque vous tentez de résister à la Cupidité"
    },
    semiMan: {
        name: "Semi-Hommes",
        bonus: "Ne peut utiliser que : Arc, dague, épée courte, gourdin, hache, lance, lance courte, massue. De plus, les Semi-Hommes ne peuvent pas utiliser de grand bouclier."
    },
    fromBree: {
        name: "Originaire de Bree",
        bonus: "Chaque Homme de Bree de la Compagnie augmente la valeur de Communauté de 1 point"
    },
    tireless: {
        name: "Infatigable",
        bonus: "Divisez par deux la valeur de Charge de l'armure du Héros quelle qu'elle soit, casque inclus, mais sans prendre en compte son bouclier (arrondir au supérieur)"
    },
    naugrim: {
        name: "Naugrim",
        bonus: "Un aventurier nain ne peut pas utiliser l'Attirail de guerre suivant : grand arc, grande lance, grand bouclier"
    },
    kingOfMen: {
        name: "Rois des Hommes",
        bonus: "Ajouter 1 points à un Attribut de votre choix"
    },
    dunedainAllegiance: {
        name: "Allégeance des Dünedain",
        bonus: "Durant la Phase de Communauté (hormis Yule), le nombre maximal de points d'Espoir que vous pouvez récupérer est égal à la moitié de votre valeur de CŒUR (arrondir au supérieur)"
    }
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
    readonly culturalAdvantages: Array<CulturalAdvantageType>;
    readonly qualityLife: QualityLifeType;
    readonly attributesMaxValue: number;
    readonly attributesSample: Array<SimpleAttributesValuesType>;
    readonly commonSkills: Array<number>;
    readonly favoredSkills: Array<number>;
    readonly possibleParticularities: Array<string>;

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
        possibleParticularities: Array<string>
    ) {
        this.culture = culture;
        this.culturalAdvantages = culturalAdvantages.map(x => nameCultureAdvantage[x]);
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
