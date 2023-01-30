type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export class ObjectImportable implements Object {
    assign(obj: object): any {
        if (this.compareKeys(obj)) {
            return
        }

        return Object.assign(this, obj)
    }

    private compareKeys(to: object): boolean {
        let toKeys = Object.keys(to).sort()
        let thisKeys = Object.keys(this).sort()
        if (thisKeys.length >= toKeys.length) {
            thisKeys = thisKeys.filter((v) => {
                toKeys.includes(v)
            })
        }
        return JSON.stringify(thisKeys) === JSON.stringify(toKeys)
    }
}