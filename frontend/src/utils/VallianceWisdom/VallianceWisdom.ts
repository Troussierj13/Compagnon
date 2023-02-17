import {Virtue, VirtuesToInstance} from "@/utils/VallianceWisdom/Virtues";
import {Reward, RewardsToInstance} from "@/utils/VallianceWisdom/Rewards";

export class Wisdom {
    rank: number;
    virtues: Array<Virtue>;

    constructor(payload?: Partial<Wisdom>) {
        this.rank = payload?.rank || 0;
        this.virtues = [];
        if (payload?.virtues) {
            payload.virtues.map((virtues) => {
                let vir = VirtuesToInstance[virtues.identifier];
                if (!vir.info.isChosen() && virtues.chosen?.length) {
                    vir.info.setChosen(virtues.chosen);
                }
                this.virtues.push(vir);
            });
        }
    }
}

export class Valiance {
    rank: number;
    rewards: Array<Reward>;

    constructor(payload?: Partial<Valiance>) {
        this.rank = payload?.rank || 0;
        this.rewards = [];
        if (payload?.rewards) {
            payload.rewards.map((rewards) => {
                this.rewards.push(RewardsToInstance[rewards.identifier]);
            });
        }
    }
}

