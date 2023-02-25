export type InjuriesType = {
    oneHand: number;
    twoHand: number;
};

export class WeaponType {
    name: string;
    dmg: number;
    injury: InjuriesType;
    weight: number;
    note: string;
    rewardsMod: Array<string>; //Todo create Array<Modifier> and getModifiedWeapon() function to get weapon with modified value

    constructor(payload: Partial<WeaponType>) {
        this.name = payload?.name || "";
        this.dmg = payload?.dmg || 0;
        this.injury = {
            oneHand: payload?.injury?.oneHand ? payload?.injury?.oneHand : 0,
            twoHand: payload?.injury?.twoHand ? payload?.injury?.twoHand : 0,
        };
        this.weight = payload?.weight || 0;
        this.note = payload?.note || "";
        this.rewardsMod = payload?.rewardsMod || [];
    }
}
