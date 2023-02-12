import {
    CultureType,
    DefaultCombatSkill,
    DerivedCharacteristics,
    SimpleAttributesValuesType,
} from "@/utils/Culture/CultureType";

class LindonElfType extends CultureType {
    constructor() {
        const derived: DerivedCharacteristics = {
            modEndurance: {identifier: "enduranceMax", mod: 20, op: "+"},
            modHope: {identifier: "hopeMax", mod: 8, op: "+"},
            modParade: {identifier: "parade", mod: 12, op: "+"},
        };
        const skills: Array<number> = [
            2, 2, 2, 0, 2, 2, 1, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 3
        ];
        const favoredSkills: Array<number> = [4, 17]; //index of favored, start at index 0
        const combatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ["bows", "spears"],
            otherDefaultRank: 1,
        };
        const attributesSample: Array<SimpleAttributesValuesType> = [
            new SimpleAttributesValuesType({strength: 5, heart: 2, mind: 7}),
            new SimpleAttributesValuesType({strength: 4, heart: 3, mind: 7}),
            new SimpleAttributesValuesType({strength: 5, heart: 3, mind: 6}),
            new SimpleAttributesValuesType({strength: 4, heart: 4, mind: 6}),
            new SimpleAttributesValuesType({strength: 5, heart: 4, mind: 5}),
            new SimpleAttributesValuesType({strength: 6, heart: 2, mind: 6}),
        ];

        const possibleParticularities = [""];

        super(
            "lindonElf",
            ["elvenPrecision", "longDefeat"],
            "modest",
            14,
            attributesSample,
            derived,
            skills,
            favoredSkills,
            combatSkills,
            possibleParticularities
        );
    }
}

const LindonElf = new LindonElfType();

export {LindonElf};
