export class AttributesValuesType {
    strength: number
    heart: number
    mind: number

    constructor(payload?: Partial<AttributesValuesType>) {
        this.strength = payload?.strength || 0
        this.heart = payload?.heart || 0
        this.mind = payload?.mind || 0
    }
}

export class AttributesSecondaryType {
    endurance: number
    hope: number
    parade: number

    constructor(payload?: AttributesSecondaryType) {
        this.endurance = payload?.endurance || 0
        this.hope = payload?.hope || 0
        this.parade = payload?.parade || 0
    }
}

export class Attributes {
    values: AttributesValuesType
    sr: AttributesValuesType
    secondary: AttributesSecondaryType

    constructor(payload?: Partial<AttributesValuesType>) {
        this.values = new AttributesValuesType(payload)
        this.sr = new AttributesValuesType({
            strength: (payload?.strength ? 20 - payload?.strength : 0),
            heart: (payload?.heart ? 20 - payload?.heart : 0),
            mind: (payload?.mind ? 20 - payload?.mind : 0),
        })
        this.secondary = new AttributesSecondaryType({
            endurance: payload?.strength || 0,
            hope: payload?.heart || 0,
            parade: payload?.mind || 0
        })
    }
}