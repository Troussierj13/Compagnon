//TODO change it to type with modificator on statistique or other
export type CulturalAdvantage = 'intrepid';

export type QualityLife = 'poor' | 'modest' | 'common' | 'prosperous' | 'rich';

export type CombatSkill = 'bows' | 'axes' | 'spears' | 'swords';

export type DefaultCombatSkill = {
    defaultRank: number;
    possibleSkills: Array<CombatSkill>;
    otherDefaultRank: number;
}

export type DerivedCharacteristics = {
    fEndurance: (attr: number) => number;
    fHope: (attr: number) => number;
    fParade: (attr: number) => number;
};

export type Attributes = {
    strength: number;
    heart: number;
    mind: number;
};

export class CultureType {
    private name: string;
    private culturalAdvantage: CulturalAdvantage;
    private qualityLife: QualityLife;
    private attributesMaxValue: number;
    private attributesSample: Array<Attributes>;
    private derivedCharacteristics: DerivedCharacteristics;
    private commonSkills: Array<number>;
    private favoredSkills: Array<number>;
    private combatSkills: DefaultCombatSkill;

    constructor(name: string, culturalAdvantage: CulturalAdvantage, qualityLife: QualityLife, attributesMaxValue: number, attributesSample: Array<Attributes>, derivedCharacteristics: DerivedCharacteristics, commonSkills: Array<number>, favoredSkills: Array<number>, combatSkills: DefaultCombatSkill) {
        this.name = name;
        this.culturalAdvantage = culturalAdvantage;
        this.qualityLife = qualityLife;
        this.attributesMaxValue = attributesMaxValue;
        this.attributesSample = attributesSample;
        this.derivedCharacteristics = derivedCharacteristics;
        this.commonSkills = commonSkills;
        this.favoredSkills = favoredSkills;
        this.combatSkills = combatSkills;
    }
}