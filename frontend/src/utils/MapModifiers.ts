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

    public addModifiers(mods: Array<ModifierParam>) {
        mods.map((item) => {
            this[item.op].push(item.mod);
        });
    }

    getModified(initial: number): number {
        const result = (
            (initial + this["+"].reduce((acc, curr) => acc + curr)) *
            this["*"].reduce((acc, curr) => acc * curr)
        );
        return (result >= 0 ? result : 0);
    }
}
