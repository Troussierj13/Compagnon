class WeaponType {
    private name: string;
    private dmg: number;
    private injury: number;
    private weight: number;
    private note: string;

    constructor(name: string, dmg: number, injury: number, weight: number, note = "") {
        this.name = name;
        this.dmg = dmg;
        this.injury = injury;
        this.weight = weight;
        this.note = note;
    }
}

export {WeaponType};