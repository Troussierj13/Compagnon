export type InjuriesType = {
    oneHand: number
    twoHand: number
}

export class WeaponType {
    name: string
    dmg: number
    injury: InjuriesType
    weight: number
    note: string
    rewardsMod: Array<string>

    constructor(payload: Partial<WeaponType>) {
        this.name = payload?.name || ''
        this.dmg = payload?.dmg || 0
        this.injury = payload?.injury || {oneHand: 0, twoHand: 0}
        this.weight = payload?.weight || 0
        this.note = payload?.note || ''
        this.rewardsMod = payload?.rewardsMod || []
    }
}