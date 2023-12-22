import {Identifier} from "../Types/IdentifiedType";
import {Modifiers} from "../MapModifiers";
import {Reward} from "../VallianceWisdom/Rewards";
import {IDictionary} from "../helpers";

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
    rewardsMod: Array<Reward>;

    constructor(payload: Partial<WeaponType>, dataRewards?: IDictionary<Partial<Reward>>) {
        this.name = payload?.name || "";
        this.dmg = payload?.dmg || 0;
        this.injury = {
            oneHand: payload?.injury?.oneHand ? payload?.injury?.oneHand : 0,
            twoHand: payload?.injury?.twoHand ? payload?.injury?.twoHand : 0,
        };
        this.weight = payload?.weight || 0;
        this.note = payload?.note || "";
        this.rewardsMod = [];
        if (payload?.rewardsMod && dataRewards) {
            payload.rewardsMod.map((rewardsMod) => {
                if (rewardsMod.identifier != 'unknown') {
                    const copy = new Reward(dataRewards[rewardsMod.identifier]);
                    copy.setChosen('weapon');

                    this.rewardsMod.push(copy);
                }
            });
        }
    }

    public getValue(identifier: Identifier): number {
        if (identifier === 'weaponDamage') {
            return this.dmg;
        } else if (identifier === 'weaponInjuryOneHand') {
            return this.injury.oneHand;
        } else if (identifier === 'weaponInjuryTwoHand') {
            return this.injury.twoHand;
        } else {
            return 0;
        }
    }

    public getModifiedValue(identifier: Identifier): number {
        const id = identifier as 'weaponDamage' | 'weaponInjuryOneHand' | 'weaponInjuryTwoHand';
        const modifiers = this.rewardsMod.map(rew => rew.getChosen().modifiers).flatMap(m => m.filter(mo => mo.identifier === id));
        return Modifiers.tryModify(this.getValue(id), modifiers);
    }
}
