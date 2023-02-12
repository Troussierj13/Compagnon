import {
    CultureType,
    DefaultCombatSkill,
    DerivedCharacteristics,
    SimpleAttributesValuesType,
} from "@/utils/Culture/CultureType";

class BardideType extends CultureType {
    constructor() {
        const derived: DerivedCharacteristics = {
            modEndurance: {identifier: "enduranceMax", mod: 20, op: "+"},
            modHope: {identifier: "hopeMax", mod: 8, op: "+"},
            modParade: {identifier: "parade", mod: 12, op: "+"},
        };
        const skills: Array<number> = [
            1, 1, 0, 2, 1, 1, 2, 1, 2, 0, 2, 2, 3, 0, 1, 1, 0, 1
        ];
        const favoredSkills: Array<number> = [1, 6]; //index of favored, start at index 0
        const combatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ["bows", "swords"],
            otherDefaultRank: 1,
        };
        const attributesSample: Array<SimpleAttributesValuesType> = [
            new SimpleAttributesValuesType({strength: 5, heart: 7, mind: 2}),
            new SimpleAttributesValuesType({strength: 4, heart: 7, mind: 3}),
            new SimpleAttributesValuesType({strength: 5, heart: 6, mind: 3}),
            new SimpleAttributesValuesType({strength: 4, heart: 6, mind: 4}),
            new SimpleAttributesValuesType({strength: 5, heart: 5, mind: 4}),
            new SimpleAttributesValuesType({strength: 6, heart: 6, mind: 2}),
        ];

        const possibleParticularities = [""];

        super(
            "bardide",
            ["intrepid"],
            "prosperous",
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

const Bardide = new BardideType();

export {Bardide};
