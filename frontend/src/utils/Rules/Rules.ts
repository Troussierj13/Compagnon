import {PlayerType} from "@/utils/Types/PlayerType"
import {MapModifier, ModifierParam, Modifiers} from "@/utils/MapModifiers"
// @ts-ignore
import {get, set} from "lodash"

const getOperatorFunc = {
    '===': (l: any, r: any): boolean => {
        return l === r
    },
    '!==': (l: any, r: any): boolean => {
        return l !== r
    },
    '<': (l: any, r: any): boolean => {
        return l < r
    },
    '>': (l: any, r: any): boolean => {
        return l > r
    },
    '<=': (l: any, r: any): boolean => {
        return l <= r
    },
    '>=': (l: any, r: any): boolean => {
        return l >= r
    },
}

const getConditionResult = (c?: Condition) => {
    return (c ? getOperatorFunc[c.operator](c.lCondition, c.rCondition) : true)
}

type Condition = {
    lCondition: string
    rCondition: string | number
    operator: '===' | '!==' | '<' | '>' | '<=' | '>='
}

type Rule = {
    condition?: Condition
    modTrue: Array<ModifierParam>
    modFalse: Array<ModifierParam>
}

const dwarfRule: Rule = {
    condition: {lCondition: 'race.name', rCondition: 'dwarf', operator: '==='},
    modFalse: [],
    modTrue: [{path: "weightTotal", mod: 1 / 2, op: '*'}]
}

//Ajouter ici tte les règles à appliquer sous forme de constante de type Rule, puis ajouter ces règles au tableau 'rules'

const rules = [
    dwarfRule
]

const SetModifiers = (player: PlayerType): MapModifier => {
    let res: MapModifier = {}

    const deriveRace = player.race.derivedCharacteristics
    const modAttr: Rule = {
        modFalse: [],
        modTrue: [deriveRace.modEndurance, deriveRace.modHope, deriveRace.modParade]
    }
    rules.push(modAttr)

    rules.map((ru) => {
        if (getConditionResult(ru.condition)) {
            ru.modTrue.map((mod) => {
                let modifs = new Modifiers({initialValue: get(player, mod.path)})
                modifs.addModifiers([mod])
                set(res, mod.path, modifs)
            })

        } else {
            ru.modFalse.map((mod) => {
                set(res, mod.path, new Modifiers({initialValue: get(player, mod.path)}))
            })
        }
    })

    return res
}

export {SetModifiers}