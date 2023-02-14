import {Virtue, VirtuesToInstance} from "@/utils/VallianceWisdom/Virtues";
import {Reward, RewardsToInstance} from "@/utils/VallianceWisdom/Rewards";

export class Wisdom {
    rank: number;
    virtues: Array<Virtue>;

    constructor(payload?: Partial<Wisdom>) {
        console.log("payload wisdom : ", payload);
        this.rank = payload?.rank || 0;
        this.virtues = [];
        if (payload?.virtues) {
            payload.virtues.map((virtues) => {
                this.virtues.push(VirtuesToInstance[virtues.identifier]);
            });
        }
    }
}

export class Valiance {
    rank: number;
    rewards: Array<Reward>;

    constructor(payload?: Partial<Valiance>) {
        console.log("payload valiance : ", payload);
        this.rank = payload?.rank || 0;
        this.rewards = [];
        if (payload?.rewards) {
            payload.rewards.map((rewards) => {
                console.log(RewardsToInstance[rewards.identifier]);
                this.rewards.push(RewardsToInstance[rewards.identifier]);
            });
        }
    }
}

