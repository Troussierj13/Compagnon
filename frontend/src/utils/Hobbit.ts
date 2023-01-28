import {Attributes, CultureType, DefaultCombatSkill, DerivedCharacteristics} from './CultureType';

const hobbitDerived: DerivedCharacteristics = {
    fEndurance: (attr: number) => {
        return attr + 18
    },
    fHope: (attr: number) => {
        return attr + 10
    },
    fParade: (attr: number) => {
        return attr + 12
    }
};
const hobbitSkills: Array<number> = [0, 0, 2, 0, 2, 1, 0, 0, 2, 1, 2, 0, 2, 3, 0, 0, 3, 0];
const hobbitFavoredSkills: Array<number> = [11, 14];
const hobbitCombatSkills: DefaultCombatSkill = {
    defaultRank: 2,
    possibleSkills: ['bows', "swords"],
    otherDefaultRank: 1
};
const hobbitAttributesSample: Array<Attributes> = [
    {strength: 3, heart: 6, mind: 5},
    {strength: 3, heart: 7, mind: 4},
    {strength: 2, heart: 7, mind: 5},
    {strength: 4, heart: 6, mind: 4},
    {strength: 4, heart: 5, mind: 5},
    {strength: 2, heart: 6, mind: 6},
];
export const Hobbit = new CultureType("Hobbit", 'intrepid', 'common', 14, hobbitAttributesSample, hobbitDerived, hobbitSkills, hobbitFavoredSkills, hobbitCombatSkills);