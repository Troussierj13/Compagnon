import {IntRange, ObjectImportable} from "@/utils/helpers"
import {CultureType, CultureTypeEnum} from "@/utils/Culture/CultureType"
import {Attributes} from "@/utils/Types/CharacterTypes"
import {WeaponType} from "@/utils/Types/WeaponType"
import {ArmorType} from "@/utils/Types/ArmorType"
import {Hobbit} from "@/utils/Culture/Hobbit"

const CultureEnumToInstance = {
    "hobbit": Hobbit
}

export type CombatSkillIdentifier = 'axes' | 'bows' | 'spears' | 'swords'
export type StrengthSkillIdentifier = 'awe' | 'athletics' | 'awareness' | 'hunting' | 'song' | 'craft'
export type HeartSkillIdentifier = 'enhearten' | 'travel' | 'insight' | 'healing' | 'courtesy' | 'battle'
export type MindSkillIdentifier = 'persuade' | 'stealth' | 'scan' | 'explore' | 'riddle' | 'lore'

export type IdentifierType =
    CombatSkillIdentifier
    | StrengthSkillIdentifier
    | HeartSkillIdentifier
    | MindSkillIdentifier

export class SkillType extends ObjectImportable {
    identifier: IdentifierType
    name: string
    favored: boolean
    rank: IntRange<0, 6>

    constructor(identifier: IdentifierType, name: string = "", favored: boolean = false, rank: IntRange<0, 6> = 0) {
        super()
        this.identifier = identifier
        this.name = name
        this.favored = favored
        this.rank = rank
    }
}

class CombatSkillType extends ObjectImportable {
    identifier: IdentifierType
    name: string
    rank: IntRange<0, 6>

    constructor(identifier: IdentifierType, name: string = "", rank: IntRange<0, 6> = 0) {
        super()
        this.identifier = identifier
        this.name = name
        this.rank = rank
    }
}

export class CombatSkillsType extends ObjectImportable {
    axes: CombatSkillType
    bows: CombatSkillType
    spears: CombatSkillType
    swords: CombatSkillType

    constructor() {
        super()
        this.axes = new CombatSkillType("axes", "Haches")
        this.bows = new CombatSkillType("bows", "Arcs")
        this.spears = new CombatSkillType("spears", "Lances")
        this.swords = new CombatSkillType("swords", "Epées")
    }
}

export class StrengthSkillsType extends ObjectImportable {
    awe: SkillType
    athletics: SkillType
    awareness: SkillType
    hunting: SkillType
    song: SkillType
    craft: SkillType

    constructor() {
        super()
        this.awe = new SkillType("awe", "Présence")
        this.athletics = new SkillType("athletics", "Athélisme")
        this.awareness = new SkillType("awareness", "Vigilance")
        this.hunting = new SkillType("hunting", "Chasse")
        this.song = new SkillType("song", "Chant")
        this.craft = new SkillType("craft", "Artisanat")
    }
}

export class HeartSkillsType extends ObjectImportable {
    enhearten: SkillType
    travel: SkillType
    insight: SkillType
    healing: SkillType
    courtesy: SkillType
    battle: SkillType

    constructor() {
        super()
        this.enhearten = new SkillType("enhearten", "Inspiration")
        this.travel = new SkillType("travel", "Voyage")
        this.insight = new SkillType("insight", "Intuition")
        this.healing = new SkillType("healing", "Soins")
        this.courtesy = new SkillType("courtesy", "Courtoisie")
        this.battle = new SkillType("battle", "Art de la guerre")
    }
}

export class MindSkillsType extends ObjectImportable {
    persuade: SkillType
    stealth: SkillType
    scan: SkillType
    explore: SkillType
    riddle: SkillType
    lore: SkillType

    constructor() {
        super()
        this.persuade = new SkillType("persuade", "Persuasion")
        this.stealth = new SkillType("stealth", "Discrétion")
        this.scan = new SkillType("scan", "Inspection")
        this.explore = new SkillType("explore", "Exploration")
        this.riddle = new SkillType("riddle", "Enigmes")
        this.lore = new SkillType("lore", "Connaissances")
    }
}

export class PlayerType extends ObjectImportable {
    name: string
    race: CultureType
    attributes: Attributes
    strengthSkills: StrengthSkillsType
    heartSkills: HeartSkillsType
    mindSkills: MindSkillsType
    combatSkills: CombatSkillsType
    weapons: Array<WeaponType>
    armor: ArmorType
    helm: ArmorType
    shield: ArmorType

    constructor(name: string, culture: CultureTypeEnum) {
        super()
        this.name = name
        this.race = CultureEnumToInstance[culture]
        this.attributes = new Attributes()
        this.strengthSkills = new StrengthSkillsType()
        this.heartSkills = new HeartSkillsType()
        this.mindSkills = new MindSkillsType()
        this.combatSkills = new CombatSkillsType()
        this.weapons = [new WeaponType("Epée longue", 5, {
            oneHand: 16,
            twoHand: 18
        }, 3, "Peut se manier à une ou deux mains")]
        this.armor = new ArmorType()
        this.helm = new ArmorType()
        this.shield = new ArmorType()
    }
}