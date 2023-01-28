type ModificatorPriority = '1' | '10' | '100' | '1000';

type Modificator = {
    priority: ModificatorPriority;
    fMod: (attr: number) => number;
}

export class MapModificator {
    get modifiedValue(): number {
        return this._modifiedValue;
    }
    private id: string;
    private value: number;
    private _modifiedValue: number;
    private modificators: object;

    constructor(id: string, value: number) {
        this.id = id;
        this.value = value;
        this._modifiedValue = value;
        this.modificators = {
            '1': [],
            '10': [],
            '100': [],
            '1000': [],
        };
    }

    private calculate() {
        this._modifiedValue = 0;
    }

    public addModificator(mod: Modificator) {
        this.modificators[mod.priority].push(mod.fMod);

        console.log(this.modificators);
    }
}
