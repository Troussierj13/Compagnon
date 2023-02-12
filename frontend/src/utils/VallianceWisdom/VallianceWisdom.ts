import {ModifierParam} from "@/utils/MapModifiers";

export type RewardVirtue = {
    identifier: string;
    name: string;
    description: string;
    modifiers: Array<ModifierParam>
};

export class Wisdom {
    rank: number;
    virtues: Array<RewardVirtue>;

    constructor(payload?: Partial<Wisdom>) {
        this.rank = payload?.rank || 0;
        this.virtues = payload?.virtues || [];
    }
}

export class Valiance {
    rank: number;
    rewards: Array<RewardVirtue>;

    constructor(payload?: Partial<Valiance>) {
        this.rank = payload?.rank || 0;
        this.rewards = payload?.rewards || [];
    }
}

