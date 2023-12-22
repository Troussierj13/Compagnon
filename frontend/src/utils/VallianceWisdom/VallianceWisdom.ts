import {Virtue} from "../VallianceWisdom/Virtues";
import {Reward} from "../VallianceWisdom/Rewards";
import {ModifierParam} from "../MapModifiers";
import {IDictionary} from "../helpers";

export class Wisdom {
    rank: number;
    virtues: Array<Virtue>;

    constructor(payload?: Partial<Wisdom>, dataVirtues?: IDictionary<Partial<Virtue>>) {
        this.rank = payload?.rank || 0;
        this.virtues = [];
        if (dataVirtues && payload?.virtues) {
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

    constructor(payload?: Partial<Valiance>, dataRewards?: IDictionary<Partial<Reward>>) {
        this.rank = payload?.rank || 0;
        this.rewards = [];
        if (dataRewards && payload?.rewards) {
            payload.rewards.map((reward) => {
                if (reward.identifier != 'unknown') {
                    const copy = new Reward(dataRewards[reward.identifier]);
                    copy.setChosen(reward.applyTo);

                    this.rewards.push(copy);
                }
            });
        }
    }

    public getModifiers(): Array<ModifierParam> {
        return this.rewards.filter((rew) => rew.isChosen()).map(vFiltered => vFiltered.getChosen()).map(el => el.modifiers).flatMap(el => el);
    }
}

