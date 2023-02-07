import {CultureType, DefaultCombatSkill, DerivedCharacteristics} from '@/utils/Culture/CultureType'
import {AttributesValuesType} from "@/utils/Types/CharacterTypes"

class HobbitType extends CultureType {
    constructor() {
        const hobbitDerived: DerivedCharacteristics = {
            modEndurance: {path: 'attributes.secondary.endurance', mod: 18, op: '+'},
            modHope: {path: 'attributes.secondary.hope', mod: 10, op: '+'},
            modParade: {path: 'attributes.secondary.parade', mod: 12, op: '+'}
        }
        const hobbitSkills: Array<number> = [0, 2, 0, 0, 2, 1, 0, 0, 2, 1, 2, 0, 2, 3, 0, 0, 3, 0]
        const hobbitFavoredSkills: Array<number> = [11, 14]
        const hobbitCombatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ['bows', "swords"],
            otherDefaultRank: 1
        }
        const hobbitAttributesSample: Array<AttributesValuesType> = [
            new AttributesValuesType({strength: 3, heart: 6, mind: 5}),
            new AttributesValuesType({strength: 3, heart: 7, mind: 4}),
            new AttributesValuesType({strength: 2, heart: 7, mind: 5}),
            new AttributesValuesType({strength: 4, heart: 6, mind: 4}),
            new AttributesValuesType({strength: 4, heart: 5, mind: 5}),
            new AttributesValuesType({strength: 2, heart: 6, mind: 6}),
        ]

        super('intrepid', 'common', 14, hobbitAttributesSample, hobbitDerived, hobbitSkills, hobbitFavoredSkills, hobbitCombatSkills)
    }
}

const Hobbit = new HobbitType()

export {Hobbit}