import {ObjectImportable} from "@/utils/helpers"

export type InjuriesType = {
    oneHand: number
    twoHand: number
}

export class WeaponType extends ObjectImportable {
    name: string
    dmg: number
    injury: number | InjuriesType
    weight: number
    note: string

    constructor(name: string = "", dmg: number = 0, injury: number | InjuriesType = 0, weight: number = 0, note = "") {
        super()
        this.name = name
        this.dmg = dmg
        this.injury = injury
        this.weight = weight
        this.note = note
    }
}