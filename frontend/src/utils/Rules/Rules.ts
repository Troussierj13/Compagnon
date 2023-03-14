import {ModifierParam, Modifiers} from "@/utils/MapModifiers";
import {PlayerType} from "@/utils/Types/PlayerType";
// @ts-ignore
import {get} from "lodash";

const getOperatorFunc = {
    "===": (l: any, r: any): boolean => {
        return l === r;
    },
    "!==": (l: any, r: any): boolean => {
        return l !== r;
    },
    "<": (l: any, r: any): boolean => {
        return l < r;
    },
    ">": (l: any, r: any): boolean => {
        return l > r;
    },
    "<=": (l: any, r: any): boolean => {
        return l <= r;
    },
    ">=": (l: any, r: any): boolean => {
        return l >= r;
    }
};

const getConditionResult = (c?: Condition, player?: PlayerType) => {
    return c && player
        ? getOperatorFunc[c.operator](get(player, c.lCondition), c.rCondition)
        : true;
};

type Condition = {
    lCondition: string;
    rCondition: string | number;
    operator: "===" | "!==" | "<" | ">" | "<=" | ">=";
};

type Rule = {
    condition?: Condition;
    modTrue: Array<ModifierParam>;
    modFalse: Array<ModifierParam>;
};

const dwarfRule: Rule = {
    condition: {
        lCondition: "culture.culture",
        rCondition: "durinDwarf",
        operator: "===",
    },
    modFalse: [],
    modTrue: [
        {identifier: "armorWeight", mod: 1 / 2, op: "*"},
        {identifier: "shieldWeight", mod: 1 / 2, op: "*"},
    ],
};

//Ajouter ici tte les règles à appliquer sous forme de constante de type Rule, puis ajouter ces règles au tableau 'rules'

const rules: Array<Rule> = [dwarfRule];

const SetModifiers = (player: PlayerType) => {
    const deriveRace = player.culture.derivedCharacteristics;
    const modAttr: Rule = {
        modFalse: [],
        modTrue: [
            deriveRace.modEndurance,
            deriveRace.modHope,
            deriveRace.modParade,
        ],
    };
    const tmpRule: Array<Rule> = [...rules];
    tmpRule.push(modAttr);

    tmpRule.map((ru) => {
        if (getConditionResult(ru.condition, player)) {
            ru.modTrue.map((mod) => {
                if (!player.modifiers[mod.identifier]) {
                    player.modifiers[mod.identifier] = new Modifiers();
                }
                player.modifiers[mod.identifier].addModifiers([mod]);
            });
        } else {
            ru.modFalse.map((mod) => {
                if (!player.modifiers[mod.identifier]) {
                    player.modifiers[mod.identifier] = new Modifiers();
                }
                player.modifiers[mod.identifier].addModifiers([mod]);
            });
        }
    });
};

export {SetModifiers};
