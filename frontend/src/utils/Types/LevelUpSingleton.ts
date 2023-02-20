import {CallbackParam, IDictionary} from "@/utils/helpers";

export class LevelUpSingleton {
    private static instance: IDictionary<LevelUpSingleton> = {};
    private onModification: boolean;
    private callbacks: Array<CallbackParam<boolean>>;

    private constructor() {
        this.onModification = false;
        this.callbacks = [];
    }

    public static GetInstance(playerId: string) {
        if (!LevelUpSingleton.instance[playerId]) {
            LevelUpSingleton.instance[playerId] = new LevelUpSingleton();
        }

        return LevelUpSingleton.instance[playerId];
    }

    public registerCallback(fn: CallbackParam<boolean>) {
        this.callbacks.push(fn);
    }

    public setOnModification(val: boolean) {
        this.onModification = val;

        this.callbacks.map(fn => fn(val));
    }
}