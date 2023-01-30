import {ObjectImportable} from "@/utils/helpers"

export class AttributesValuesType extends ObjectImportable {
    strength: number
    heart: number
    mind: number

    constructor(strength: number = 0, heart: number = 0, mind: number = 0) {
        super()
        this.strength = strength
        this.heart = heart
        this.mind = mind
    }
}

export class AttributesSecondaryType extends ObjectImportable {
    endurance: number
    hope: number
    parade: number

    constructor(endurance: number = 0, hope: number = 0, parade: number = 0) {
        super()
        this.endurance = endurance
        this.hope = hope
        this.parade = parade
    }
}

export class Attributes extends ObjectImportable {
    values: AttributesValuesType
    sr: AttributesValuesType
    secondary: AttributesSecondaryType

    constructor(values?: AttributesValuesType, sr?: AttributesValuesType, secondary?: AttributesSecondaryType) {
        super()
        this.values = values ? values : new AttributesValuesType()
        this.sr = sr ? sr : new AttributesValuesType()
        this.secondary = secondary ? secondary : new AttributesSecondaryType()
    }
}