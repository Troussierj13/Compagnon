export class ArmorType {
    name: string
    protection: string
    parade: string
    weight: number

    constructor(payload?: Partial<ArmorType>) {
        this.name = payload?.name || ''
        this.protection = payload?.protection || ''
        this.parade = payload?.parade || ''
        this.weight = payload?.weight || 0
    }
}