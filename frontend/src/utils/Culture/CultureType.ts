import { ModifierParam } from "@/utils/MapModifiers";

export type VocationType =
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

export type CultureTypeEnum = "hobbit";
export const nameCultureType = {
  hobbit: "Hobbit de la Compté",
};

export type CulturalAdvantage = "intrepid" | "goodSense";
export const nameCultureAdvantage = {
  goodSense: "Bon sens Hobbit",
  intrepid: "Intrepide",
};

export type QualityLife = "poor" | "modest" | "common" | "prosperous" | "rich";
export const nameQualityLife = {
  poor: "Pauvre",
  modest: "Modeste",
  common: "Commun",
  prosperous: "Prospère",
  rich: "Riche",
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
  readonly culturalAdvantage: CulturalAdvantage;
  readonly qualityLife: QualityLife;
  readonly attributesMaxValue: number;
  readonly attributesSample: Array<SimpleAttributesValuesType>;
  readonly commonSkills: Array<number>;
  readonly _favoredSkills: Array<number>;

  constructor(
    culture: CultureTypeEnum,
    culturalAdvantage: CulturalAdvantage,
    qualityLife: QualityLife,
    attributesMaxValue: number,
    attributesSample: Array<SimpleAttributesValuesType>,
    derivedCharacteristics: DerivedCharacteristics,
    commonSkills: Array<number>,
    favoredSkills: Array<number>,
    combatSkills: DefaultCombatSkill
  ) {
    this.culture = culture;
    this.culturalAdvantage = culturalAdvantage;
    this.qualityLife = qualityLife;
    this.attributesMaxValue = attributesMaxValue;
    this.attributesSample = attributesSample;
    this.derivedCharacteristics = derivedCharacteristics;
    this.commonSkills = commonSkills;
    this._favoredSkills = favoredSkills;
    this.combatSkills = combatSkills;
  }
}
