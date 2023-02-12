import {
    CultureType,
    DefaultCombatSkill,
    DerivedCharacteristics,
    SimpleAttributesValuesType,
} from "@/utils/Culture/CultureType";
import {PossibleChoose} from "@/utils/helpers";

class NorthRangerType extends CultureType {
    constructor() {
        const derived: DerivedCharacteristics = {
            modEndurance: {identifier: "enduranceMax", mod: 20, op: "+"},
            modHope: {identifier: "hopeMax", mod: 6, op: "+"},
            modParade: {identifier: "parade", mod: 14, op: "+"},
        };
        const skills: Array<number> = [
            1, 2, 2, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2
        ];
        const favoredSkills: Array<number> = [3, 17]; //index of favored, start at index 0
        const combatSkills: DefaultCombatSkill = {
            defaultRank: 2,
            possibleSkills: ["spears", "swords"],
            otherDefaultRank: 1,
        };
        const attributesSample: Array<SimpleAttributesValuesType> = [
            new SimpleAttributesValuesType({strength: 7, heart: 5, mind: 2}),
            new SimpleAttributesValuesType({strength: 7, heart: 4, mind: 3}),
            new SimpleAttributesValuesType({strength: 6, heart: 5, mind: 3}),
            new SimpleAttributesValuesType({strength: 6, heart: 4, mind: 4}),
            new SimpleAttributesValuesType({strength: 5, heart: 5, mind: 4}),
            new SimpleAttributesValuesType({strength: 6, heart: 6, mind: 2}),
        ];

        const possibleParticularities = new PossibleChoose<string>(2, ["Courageux", "Grand", "Honorable", "Rapide", "Secret", "Sévère", "Sincère", "Subtil"]);

        super(
            "northRanger",
            ['kingOfMen', 'dunedainAllegiance'],
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

const NorthRanger = new NorthRangerType();

export {NorthRanger};
