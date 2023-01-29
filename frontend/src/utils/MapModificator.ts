type ModificatorOperation = '+' | '*'
// eslint-disable-next-line no-unused-vars
export type ModificatorParam = {
    mod: number;
    op: ModificatorOperation;
}

type Modificators = {
    '+': Array<number>;
    '*': Array<number>;
}

export class MapModificator {
    private value: number
    private modificators: Modificators

    constructor(value: number) {
        this.value = value
        this._modifiedValue = value
        this.modificators = {
            '+': [0],
            '*': [1]
        }
    }

    private _modifiedValue: number

    get modifiedValue(): number {
        return this._modifiedValue
    }

    public addModificator(mod: ModificatorParam) {
        this.modificators[mod.op].push(mod.mod)

        this.calculate()
    }

    private calculate() {
        this._modifiedValue = (this.value + this.modificators['+'].reduce((acc, curr) => acc + curr)) * this.modificators['*'].reduce((acc, curr) => acc * curr)
    }
}
