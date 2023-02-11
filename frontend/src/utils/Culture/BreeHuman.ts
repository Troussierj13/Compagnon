import {
    CultureType,
    DefaultCombatSkill,
    DerivedCharacteristics,
    SimpleAttributesValuesType,
} from "@/utils/Culture/CultureType";

class BreeHumanType extends CultureType {
    constructor() {
        const derived: DerivedCharacteristics = {
            modEndurance: {identifier: "enduranceMax", mod: 20, op: "+"},
            modHope: {identifier: "hopeMax", mod: 10, op: "+"},
            modParade: {identifier: "parade", mod: 10, op: "+"},
        };
        const skills: Array<number> = [
            0, 1, 1, 1, 1, 2, 2, 1, 2, 0, 3, 0, 2, 1, 1, 1, 2, 0
        ];
        const favoredSkills: Array<number> = [8, 16]; //index of favored, start at index 0
        const combatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ['axes', 'spears'],
            otherDefaultRank: 1,
        };
        const attributesSample: Array<SimpleAttributesValuesType> = [
            new SimpleAttributesValuesType({strength: 2, heart: 5, mind: 7}),
            new SimpleAttributesValuesType({strength: 3, heart: 4, mind: 7}),
            new SimpleAttributesValuesType({strength: 3, heart: 5, mind: 6}),
            new SimpleAttributesValuesType({strength: 4, heart: 4, mind: 6}),
            new SimpleAttributesValuesType({strength: 4, heart: 5, mind: 5}),
            new SimpleAttributesValuesType({strength: 2, heart: 6, mind: 6}),
        ];

        super(
            "breeHuman",
            ["fromBree"],
            "common",
            14,
            attributesSample,
            derived,
            skills,
            favoredSkills,
            combatSkills
        );
    }
}

const BreeHuman = new BreeHumanType();

export {BreeHuman};
