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