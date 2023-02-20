import {ModifierParam} from "@/utils/MapModifiers";

type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
>;

export type Vector2Rect<T> = {
    top: T;
    left: T;
};

export interface IDictionary<TValue> {
    [id: string]: TValue;
}

export class PossibleChoose<T> {
    readonly choice: Array<T>;
    readonly chooseInto: number;
    private _chosen: Array<number>;
    private _isChosen: boolean;

    constructor(chooseInto: number, choice: Array<T>, chosen?: Array<number>) {
        if (choice.length <= 0) {
            throw new RangeError("Need at least one choice in 'choice' array");
        }

        if (chooseInto <= 0 || chooseInto > choice.length) {
            throw new RangeError("'chooseInto' parameter must be greeter than zero and smaller than the size of the choice array");
        }

        this._chosen = [];
        this._isChosen = false;
        this.choice = choice;
        this.chooseInto = chooseInto;

        if (chosen) { // use setter to throw error if not valable parameter
            this.setChosen(chosen);
        } else if (choice.length === chooseInto) {
            this.setChosen(
                choice.map((el, id) => {
                    return id;
                })
            );
        }
    }

    public setChosen(chosen: Array<number>) {
        if (chosen.length !== this.chooseInto) {
            throw new RangeError("'chosen' array must be same size of 'choosenInto' number");
        }

        const filtered = chosen.filter((x) => x >= 0 && x < this.choice.length);
        if (filtered.length !== chosen.length) {
            throw new RangeError("Chosen array must be same includes only valid index of choice array");
        }
        this._chosen = filtered;
        this._isChosen = true;
    }

    public getChosen(): Array<T> {
        if (!this._isChosen) {
            throw new RangeError("Possible choice is not chosen, call setChosen(...) or call PossibleChoose<" + typeof <T>+"> constructor with chosen parameter");
        }

        return this.choice.filter((x, id) => this._chosen.includes(id));
    }

    public getChosenId(): Array<number> {
        return this._chosen;
    }

    public isChosen(): boolean {
        return this._isChosen;
    }
}

export class DescribableName {
    readonly name: string;
    readonly description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

export class DescribableNameWithModifier extends DescribableName {
    readonly modifiers: Array<ModifierParam>;

    constructor(name: string, description: string, modifiers: Array<ModifierParam>) {
        super(name, description);
        this.modifiers = modifiers || [];
    }
}

export interface Callback<T> {
    (): T
}

export interface CallbackParam<T> {
    // eslint-disable-next-line no-unused-vars
    (x: T): void
}

export interface FilterFunction<T> {
    // eslint-disable-next-line no-unused-vars
    (a: T): boolean
}

export class HoverSingleton {
    private static instance: HoverSingleton;
    public hover: boolean;
    public calbackHover: Callback<void>;

    private constructor() {
        this.hover = false;
        this.calbackHover = () => {
        };
    }

    public static GetInstance() {
        if (!HoverSingleton.instance) {
            HoverSingleton.instance = new HoverSingleton();
        }

        return HoverSingleton.instance;
    }

    public tryChangeHover(val: boolean, callback: Callback<void>) {
        if (this.hover) {
            this.calbackHover();
        }

        this.calbackHover = callback;
        this.hover = !val;
        return !val;
    }
}

