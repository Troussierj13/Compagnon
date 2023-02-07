import {ModifierParam} from "@/utils/MapModifiers"
import {AttributesValuesType} from "@/utils/Types/CharacterTypes"

export type VocationType = 'captain' | 'champion' | 'treasureHunter' | 'messenger' | 'protector' | 'savant'
export const nameVocationType = {
    'captain': 'Capitaine',
    'champion': 'Champion',
    'treasureHunter': 'Chasseur de trésors',
    'messenger': 'Messager',
    'protector': 'Protecteur',
    'savant': 'Erudit'
}

export type CultureTypeEnum = 'hobbit';
export const nameCultureType = {
    'hobbit': 'Hobbit de la Compté'
}

export type CulturalAdvantage = 'intrepid' | 'goodSense';
export const nameCultureAdvantage = {
    'goodSense': 'Bon sens Hobbit',
    'intrepid': 'Intrepide'
}

export type QualityLife = 'poor' | 'modest' | 'common' | 'prosperous' | 'rich';
export const nameQualityLife = {
    'poor': 'Pauvre',
    'modest': 'Modeste',
    'common': 'Commun',
    'prosperous': 'Prospère',
    'rich': 'Riche'
}

export type CombatSkill = 'bows' | 'axes' | 'spears' | 'swords';

export type DefaultCombatSkill = {
    defaultRank: number;
    possibleSkills: Array<CombatSkill>;
    otherDefaultRank: number;
}

export type DerivedCharacteristics = {
    modEndurance: ModifierParam;
    modHope: ModifierParam;
    modParade: ModifierParam;
};

export class CultureType {
    readonly culture: CultureTypeEnum
    readonly derivedCharacteristics: DerivedCharacteristics
    readonly combatSkills: DefaultCombatSkill
    readonly culturalAdvantage: CulturalAdvantage
    readonly qualityLife: QualityLife
    readonly attributesMaxValue: number
    readonly attributesSample: Array<AttributesValuesType>
    readonly commonSkills: Array<number>
    readonly _favoredSkills: Array<number>

    constructor(culture: CultureTypeEnum, culturalAdvantage: CulturalAdvantage, qualityLife: QualityLife, attributesMaxValue: number, attributesSample: Array<AttributesValuesType>, derivedCharacteristics: DerivedCharacteristics, commonSkills: Array<number>, favoredSkills: Array<number>, combatSkills: DefaultCombatSkill) {
        this.culture = culture
        this.culturalAdvantage = culturalAdvantage
        this.qualityLife = qualityLife
        this.attributesMaxValue = attributesMaxValue
        this.attributesSample = attributesSample
        this.derivedCharacteristics = derivedCharacteristics
        this.commonSkills = commonSkills
        this._favoredSkills = favoredSkills
        this.combatSkills = combatSkills
    }
}