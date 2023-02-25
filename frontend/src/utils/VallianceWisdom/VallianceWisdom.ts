import {dataVirtues, Virtue} from "@/utils/VallianceWisdom/Virtues";
import {Reward, dataRewards} from "@/utils/VallianceWisdom/Rewards";
import {ModifierParam} from "@/utils/MapModifiers";

export class Wisdom {
    rank: number;
    virtues: Array<Virtue>;

    constructor(payload?: Partial<Wisdom>) {
        this.rank = payload?.rank || 0;
        this.virtues = [];
        if (payload?.virtues) {
            payload.virtues.map((virtue) => {
                if (virtue.identifier != 'unknown') {
                    const copy = new Virtue(dataVirtues[virtue.identifier]);
                    copy.setChosen(virtue.chosen);

                    this.virtues.push(copy);
                }
            });
        }
    }

    public getModifiers(): Array<ModifierParam> {
        return this.virtues.filter((vir) => vir.isChosen()).map(vFiltered => vFiltered.getChosen()).map(el => el.modifiers).flatMap(el => el);
    }
}

export class Valiance {
    rank: number;
    rewards: Array<Reward>;

    constructor(payload?: Partial<Valiance>) {
        this.rank = payload?.rank || 0;
        this.rewards = [];
        if (payload?.rewards) {
            payload.rewards.map((reward) => {
                if (reward.identifier != 'unknown') {
                    const copy = new Reward(dataRewards[reward.identifier]);
                    

                    this.rewards.push(copy);
                }
            });
        }
    }
}

