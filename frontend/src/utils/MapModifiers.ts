export type ModificatorOperation = '+' | '*'

export type ModifierParam = {
    path: string;
    mod: number;
    op: ModificatorOperation;
}

export class Modifiers {
    initialValue: number
    modifiedValue: number
    '+': Array<number>
    '*': Array<number>

    constructor(payload: Partial<Modifiers>) {
        this.initialValue = payload.initialValue || 0
        this.modifiedValue = payload.modifiedValue || payload.initialValue || 0
        this["+"] = payload["+"] || [0]
        this["*"] = payload["*"] || [1]
    }

    public addModifiers(mods: Array<Omit<ModifierParam, "path">>) {
        mods.map((item) => {
            this[item.op].push(item.mod)
        })

        this.calculate()
    }

    private calculate() {
        this.modifiedValue = (this.initialValue + this['+'].reduce((acc, curr) => acc + curr)) * this['*'].reduce((acc, curr) => acc * curr)
    }
}

export type MapModifier = {
    [key: string]: Modifiers
}