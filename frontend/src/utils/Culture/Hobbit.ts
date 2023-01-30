import {CultureType, DefaultCombatSkill, DerivedCharacteristics} from '@/utils/Culture/CultureType'
import {AttributesValuesType} from "@/utils/Types/CharacterTypes"

class HobbitType extends CultureType {
    constructor() {
        const hobbitDerived: DerivedCharacteristics = {
            modEndurance: {mod: 18, op: '+'},
            modHope: {mod: 10, op: '+'},
            modParade: {mod: 12, op: '+'}
        }
        const hobbitSkills: Array<number> = [0, 2, 0, 0, 2, 1, 0, 0, 2, 1, 2, 0, 2, 3, 0, 0, 3, 0]
        const hobbitFavoredSkills: Array<number> = [11, 14]
        const hobbitCombatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ['bows', "swords"],
            otherDefaultRank: 1
        }
        const hobbitAttributesSample: Array<AttributesValuesType> = [
            new AttributesValuesType(3, 6, 5),
            new AttributesValuesType(3, 7, 4),
            new AttributesValuesType(2, 7, 5),
            new AttributesValuesType(4, 6, 4),
            new AttributesValuesType(4, 5, 5),
            new AttributesValuesType(2, 6, 6),
        ]

        super('intrepid', 'common', 14, hobbitAttributesSample, hobbitDerived, hobbitSkills, hobbitFavoredSkills, hobbitCombatSkills)
    }
}

const Hobbit = new HobbitType()

export {Hobbit}