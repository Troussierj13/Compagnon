import {ModificatorParam} from "@/utils/MapModificator"
import {AttributesValuesType} from "@/utils/Types/CharacterTypes"

export type CultureTypeEnum = 'hobbit';

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
    modEndurance: ModificatorParam;
    modHope: ModificatorParam;
    modParade: ModificatorParam;
};

export class CultureType {
    constructor(culturalAdvantage: CulturalAdvantage, qualityLife: QualityLife, attributesMaxValue: number, attributesSample: Array<AttributesValuesType>, derivedCharacteristics: DerivedCharacteristics, commonSkills: Array<number>, favoredSkills: Array<number>, combatSkills: DefaultCombatSkill) {
        this._culturalAdvantage = culturalAdvantage
        this._qualityLife = qualityLife
        this._attributesMaxValue = attributesMaxValue
        this._attributesSample = attributesSample
        this._derivedCharacteristics = derivedCharacteristics
        this._commonSkills = commonSkills
        this._favoredSkills = favoredSkills
        this._combatSkills = combatSkills
    }

    private _culturalAdvantage: CulturalAdvantage

    get culturalAdvantage(): CulturalAdvantage {
        return this._culturalAdvantage
    }

    private _qualityLife: QualityLife

    get qualityLife(): QualityLife {
        return this._qualityLife
    }

    private _attributesMaxValue: number

    get attributesMaxValue(): number {
        return this._attributesMaxValue
    }

    private _attributesSample: Array<AttributesValuesType>

    get attributesSample(): Array<AttributesValuesType> {
        return this._attributesSample
    }

    private _derivedCharacteristics: DerivedCharacteristics

    get derivedCharacteristics(): DerivedCharacteristics {
        return this._derivedCharacteristics
    }

    private _commonSkills: Array<number>

    get commonSkills(): Array<number> {
        return this._commonSkills
    }

    private _favoredSkills: Array<number>

    get favoredSkills(): Array<number> {
        return this._favoredSkills
    }

    private _combatSkills: DefaultCombatSkill

    get combatSkills(): DefaultCombatSkill {
        return this._combatSkills
    }
}