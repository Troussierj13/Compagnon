import {
    CultureType,
    DefaultCombatSkill,
    DerivedCharacteristics,
    SimpleAttributesValuesType,
} from "@/utils/Culture/CultureType";

class HobbitType extends CultureType {
    constructor() {
        const hobbitDerived: DerivedCharacteristics = {
            modEndurance: {identifier: "enduranceMax", mod: 18, op: "+"},
            modHope: {identifier: "hopeMax", mod: 10, op: "+"},
            modParade: {identifier: "parade", mod: 12, op: "+"},
        };
        const hobbitSkills: Array<number> = [
            0, 0, 2, 0, 2, 1, 0, 0, 2, 1, 2, 0, 2, 3, 0, 0, 3, 0
        ];
        const hobbitFavoredSkills: Array<number> = [10, 13]; //index of favored, start at index 0
        const hobbitCombatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ["bows", "swords"],
            otherDefaultRank: 1,
        };
        const hobbitAttributesSample: Array<SimpleAttributesValuesType> = [
            new SimpleAttributesValuesType({strength: 3, heart: 6, mind: 5}),
            new SimpleAttributesValuesType({strength: 3, heart: 7, mind: 4}),
            new SimpleAttributesValuesType({strength: 2, heart: 7, mind: 5}),
            new SimpleAttributesValuesType({strength: 4, heart: 6, mind: 4}),
            new SimpleAttributesValuesType({strength: 4, heart: 5, mind: 5}),
            new SimpleAttributesValuesType({strength: 2, heart: 6, mind: 6}),
        ];

        super(
            "hobbit",
            ["goodSense", "semiMan"],
            "common",
            14,
            hobbitAttributesSample,
            hobbitDerived,
            hobbitSkills,
            hobbitFavoredSkills,
            hobbitCombatSkills
        );
    }
}

const Hobbit = new HobbitType();

export {Hobbit};
