import {
    CultureType,
    DefaultCombatSkill,
    DerivedCharacteristics,
    SimpleAttributesValuesType,
} from "./CultureType";
import {PossibleChoose} from "../helpers";

class DurinDwarfType extends CultureType {
    constructor() {
        const derived: DerivedCharacteristics = {
            modEndurance: {identifier: "enduranceMax", mod: 22, op: "+"},
            modHope: {identifier: "hopeMax", mod: 8, op: "+"},
            modParade: {identifier: "parade", mod: 10, op: "+"},
        };
        const skills: Array<number> = [
            2, 1, 0, 0, 1, 2, 0, 3, 0, 0, 1, 1, 0, 0, 3, 2, 2, 1
        ];
        const favoredSkills: Array<number> = [5, 7]; //index of favored, start at index 0
        const combatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ["axes", "swords"],
            otherDefaultRank: 1,
        };
        const attributesSample: Array<SimpleAttributesValuesType> = [
            new SimpleAttributesValuesType({strength: 7, heart: 2, mind: 5}),
            new SimpleAttributesValuesType({strength: 7, heart: 3, mind: 4}),
            new SimpleAttributesValuesType({strength: 6, heart: 3, mind: 5}),
            new SimpleAttributesValuesType({strength: 6, heart: 4, mind: 4}),
            new SimpleAttributesValuesType({strength: 5, heart: 4, mind: 5}),
            new SimpleAttributesValuesType({strength: 6, heart: 2, mind: 6}),
        ];

        const possibleParticularities = new PossibleChoose<string>(2, ["Circonspect", "Entêté", "Fier", "Impétueux", "Majestueux", "Malin", "Secret", "Sévère"]);

        super(
            "durinDwarf",
            ["tireless", "naugrim"],
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

const DurinDwarf = new DurinDwarfType();

export {DurinDwarf};
