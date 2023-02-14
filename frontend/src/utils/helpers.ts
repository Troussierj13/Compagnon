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

    constructor(chooseInto: number, choice: Array<T>) {
        this.choice = choice;
        this.chooseInto = chooseInto;
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

export interface CallbackVoid {
    (): void
}

export class HoverSingleton {
    private static instance: HoverSingleton;
    public hover: boolean;
    public calbackHover: CallbackVoid;

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

    public tryChangeHover(val: boolean, callback: CallbackVoid) {
        if (this.hover) {
            this.calbackHover();
        }

        this.calbackHover = callback;
        this.hover = !val;
        return !val;
    }
}

