type ModificatorPriority = '1' | '10' | '100' | '1000';

// eslint-disable-next-line no-unused-vars
type FMod = (attr: number) => number;

type ModificatorParam = {
    priority: ModificatorPriority;
    fMod: FMod;
}
type Modificators = {
    1: Array<FMod>;
    10: Array<FMod>;
    100: Array<FMod>;
    1000: Array<FMod>;
}

export class MapModificator {
    private id: string
    private value: number
    private modificators: Modificators

    constructor(id: string, value: number) {
        this.id = id
        this.value = value
        this._modifiedValue = value
        this.modificators = {
            1: [],
            10: [],
            100: [],
            1000: [],
        }
    }

    private _modifiedValue: number

    get modifiedValue(): number {
        return this._modifiedValue
    }

    public addModificator(mod: ModificatorParam) {
        this.modificators[mod.priority as ModificatorPriority].push(mod.fMod)

        this.calculate()

        console.log(this.modificators)
    }

    private calculate() {
        this._modifiedValue = 0
    }
}
