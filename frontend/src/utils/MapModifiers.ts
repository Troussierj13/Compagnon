import {Identifier} from "@/utils/Types/IdentifiedType";

export type ModificatorOperation = "+" | "*";

export type ModifierParam = {
    identifier: Identifier;
    mod: number;
    op: ModificatorOperation;
};

export class Modifiers {
    "+": Array<number>;
    "*": Array<number>;

    constructor() {
        this["+"] = [0];
        this["*"] = [1];
    }

    public static tryModify(initial: number, mods: Array<ModifierParam>) {
        const modAdd: Array<number> = mods.filter(m => m.op === '+').map(m => m.mod);
        modAdd.push(0);
        const modMult: Array<number> = mods.filter(m => m.op === '*').map(m => m.mod);
        modMult.push(1);

        const result = (
            (initial + modAdd.reduce((acc, curr) => acc + curr)) *
            modMult.reduce((acc, curr) => acc * curr)
        );
        return (result >= 0 ? result : 0);
    }

    public addModifiers(mods: Array<ModifierParam>) {
        mods.map((item) => {
            this[item.op].push(item.mod);
        });
    }

    public removeModifiers(mod: ModifierParam) {
        const index = this[mod.op].findIndex(el => el === mod.mod);
        this[mod.op].splice(index, 1);
    }

    getModified(initial: number): number {
        const result = (
            (initial + this["+"].reduce((acc, curr) => acc + curr)) *
            this["*"].reduce((acc, curr) => acc * curr)
        );
        return (result >= 0 ? result : 0);
    }
}
