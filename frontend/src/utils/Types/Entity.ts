type CompressedVisibility = {
    recto: number;
    charact: number;
    weapon: number;
    spe: number;
}

type VisibilityEntity = {
    name: boolean;
    surname: boolean;
    characteristicsName: boolean;
    lvlAttribute: boolean;
    description: boolean;
    endurance: boolean;
    power: boolean;
    valueHM: boolean;
    parade: boolean;
    armor: boolean;
    weapons: boolean[];
    specifications: boolean[];
}

const VISIBILITY_ALL:VisibilityEntity = {
    name: true,
    surname: true,
    characteristicsName: true,
    lvlAttribute: true,
    description: true,
    endurance: true,
    power: true,
    valueHM: true,
    parade: true,
    armor: true,
    weapons: [true, true, true],
    specifications: [true, true],
}

const COMPRESS_VISIBILITY_ALL = {
    recto: 31,
    charact: 31,
    weapon: 7,
    spe: 3
}

const VISIBILITY_DEFAULT: VisibilityEntity = {
    name: true,
    surname: true,
    characteristicsName: false,
    lvlAttribute: true,
    description: false,
    endurance: false,
    power: false,
    valueHM: false,
    parade: false,
    armor: false,
    weapons: [false, false, false],
    specifications: [false, false],
}

const COMPRESS_VISIBILITY_DEFAULT = {
    recto: 11,
    charact: 0,
    weapon: 0,
    spe: 0
}

const CompressVisibility = (v: VisibilityEntity): CompressedVisibility => {
    const checkB = (b: boolean) => {
        return b ? 1 : 0
    }

    return {
        recto: checkB(v.name)*1 + checkB(v.surname)*2 + checkB(v.characteristicsName)*4 + checkB(v.lvlAttribute)*8 + checkB(v.description)*16,
        charact: checkB(v.endurance)*1 + checkB(v.power)*2 + checkB(v.valueHM)*4 + checkB(v.parade)*8 + checkB(v.armor)*16,
        weapon: checkB(v.weapons[0])*1 + checkB(v.weapons[1])*2 + checkB(v.weapons[2])*4,
        spe: checkB(v.specifications[0])*1 + checkB(v.specifications[1])*2
    }
}

const VisibilityEntityBuilder = (v: CompressedVisibility, second: CompressedVisibility):VisibilityEntity => {
    const recto = v.recto != null ? v.recto : second.recto
    const charact = v.charact != null ? v.charact : second.charact
    const weapon = v.weapon != null ? v.weapon : second.weapon
    const spe = v.spe != null ? v.spe : second.spe

    const rectoV: string = recto.toString(2).padStart(5, '0').slice(-5);
    const charactV: string = charact.toString(2).padStart(5, '0').slice(-5);
    const weaponV: string = weapon.toString(2).padStart(3, '0').slice(-3);
    const speV: string = spe.toString(2).padStart(2, '0').slice(-2);

    const checkV = (n: string):boolean => {
        return n == '1';
    }

    return {
        name: checkV(rectoV.charAt(4)),
        surname: checkV(rectoV.charAt(3)),
        characteristicsName: checkV(rectoV.charAt(2)),
        lvlAttribute: checkV(rectoV.charAt(1)),
        description: checkV(rectoV.charAt(0)),
        endurance: checkV(charactV.charAt(4)),
        power: checkV(charactV.charAt(3)),
        valueHM: checkV(charactV.charAt(2)),
        parade: checkV(charactV.charAt(1)),
        armor: checkV(charactV.charAt(0)),
        weapons: [checkV(weaponV.charAt(2)), checkV(weaponV.charAt(1)), checkV(weaponV.charAt(0))],
        specifications: [checkV(speV.charAt(1)), checkV(speV.charAt(0))]
    } as VisibilityEntity
}

type Entity = {

}

const EntityBuilder = () => {

}

export type { VisibilityEntity, CompressedVisibility }
export { VisibilityEntityBuilder, CompressVisibility, VISIBILITY_ALL, VISIBILITY_DEFAULT, COMPRESS_VISIBILITY_ALL, COMPRESS_VISIBILITY_DEFAULT }