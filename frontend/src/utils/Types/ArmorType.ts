import {ObjectImportable} from "@/utils/helpers"

export class ArmorType extends ObjectImportable {
    name: string
    protection: string
    parade: string
    weight: number

    constructor(name: string = "", protection: string = "", parade: string = "", weight: number = 0) {
        super()
        this.name = name
        this.protection = protection
        this.parade = parade
        this.weight = weight
    }
}