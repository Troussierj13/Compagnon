import {IntRange} from "@/utils/helpers"
import {
    CultureType,
    nameCultureAdvantage,
    nameCultureType,
    nameQualityLife,
    nameVocationType,
    QualityLife,
    VocationType
} from "@/utils/Culture/CultureType"
import {Attributes} from "@/utils/Types/CharacterTypes"
import {WeaponType} from "@/utils/Types/WeaponType"
import {ArmorType} from "@/utils/Types/ArmorType"
import {Hobbit} from "@/utils/Culture/Hobbit"
import {MapModifier} from "@/utils/MapModifiers"
import {SetModifiers} from "@/utils/Rules/Rules"

const CultureEnumToInstance = {
    "hobbit": Hobbit
}

export type CombatSkillIdentifier = 'axes' | 'bows' | 'spears' | 'swords'
export type StrengthSkillIdentifier = 'awe' | 'athletics' | 'awareness' | 'hunting' | 'song' | 'craft'
export type HeartSkillIdentifier = 'enhearten' | 'travel' | 'insight' | 'healing' | 'courtesy' | 'battle'
export type MindSkillIdentifier = 'persuade' | 'stealth' | 'scan' | 'explore' | 'riddle' | 'lore'

export type SkillIdentifier =
    CombatSkillIdentifier
    | StrengthSkillIdentifier
    | HeartSkillIdentifier
    | MindSkillIdentifier

type IdentifiedValue = {
    identifier: string
    value: number
}

export class SkillType {
    identifier: SkillIdentifier
    name: string
    favored: boolean
    rank: IntRange<0, 6>

    constructor(identifier: SkillIdentifier, name: string = "", favored?: boolean, rank?: IntRange<0, 6>) {
        this.identifier = identifier
        this.name = name
        this.favored = favored || false
        this.rank = rank || 0
    }
}

class CombatSkillType {
    identifier: SkillIdentifier
    name: string
    rank: IntRange<0, 6>

    constructor(identifier: SkillIdentifier, name: string = "", rank?: IntRange<0, 6>) {
        this.identifier = identifier
        this.name = name
        this.rank = rank || 0
    }
}

export class CombatSkillsType {
    axes: CombatSkillType
    bows: CombatSkillType
    spears: CombatSkillType
    swords: CombatSkillType

    constructor(payload?: Partial<CombatSkillsType>) {
        this.axes = new CombatSkillType("axes", "Haches", payload?.axes?.rank)
        this.bows = new CombatSkillType("bows", "Arcs", payload?.bows?.rank)
        this.spears = new CombatSkillType("spears", "Lances", payload?.spears?.rank)
        this.swords = new CombatSkillType("swords", "Epées", payload?.swords?.rank)
    }
}

export class StrengthSkillsType {
    awe: SkillType
    athletics: SkillType
    awareness: SkillType
    hunting: SkillType
    song: SkillType
    craft: SkillType

    constructor(payload?: Partial<StrengthSkillsType>) {
        this.awe = new SkillType("awe", "Présence", payload?.awe?.favored, payload?.awe?.rank)
        this.athletics = new SkillType("athletics", "Athélisme", payload?.athletics?.favored, payload?.athletics?.rank)
        this.awareness = new SkillType("awareness", "Vigilance", payload?.awareness?.favored, payload?.awareness?.rank)
        this.hunting = new SkillType("hunting", "Chasse", payload?.hunting?.favored, payload?.hunting?.rank)
        this.song = new SkillType("song", "Chant", payload?.song?.favored, payload?.song?.rank)
        this.craft = new SkillType("craft", "Artisanat", payload?.craft?.favored, payload?.craft?.rank)
    }
}

export class HeartSkillsType {
    enhearten: SkillType
    travel: SkillType
    insight: SkillType
    healing: SkillType
    courtesy: SkillType
    battle: SkillType

    constructor(payload?: Partial<HeartSkillsType>) {
        this.enhearten = new SkillType("enhearten", "Inspiration", payload?.enhearten?.favored, payload?.enhearten?.rank)
        this.travel = new SkillType("travel", "Voyage", payload?.travel?.favored, payload?.travel?.rank)
        this.insight = new SkillType("insight", "Intuition", payload?.insight?.favored, payload?.insight?.rank)
        this.healing = new SkillType("healing", "Soins", payload?.healing?.favored, payload?.healing?.rank)
        this.courtesy = new SkillType("courtesy", "Courtoisie", payload?.courtesy?.favored, payload?.courtesy?.rank)
        this.battle = new SkillType("battle", "Art de la guerre", payload?.battle?.favored, payload?.battle?.rank)
    }
}

export class MindSkillsType {
    persuade: SkillType
    stealth: SkillType
    scan: SkillType
    explore: SkillType
    riddle: SkillType
    lore: SkillType

    constructor(payload?: Partial<MindSkillsType>) {
        this.persuade = new SkillType("persuade", "Persuasion", payload?.persuade?.favored, payload?.persuade?.rank)
        this.stealth = new SkillType("stealth", "Discrétion", payload?.stealth?.favored, payload?.stealth?.rank)
        this.scan = new SkillType("scan", "Inspection", payload?.scan?.favored, payload?.scan?.rank)
        this.explore = new SkillType("explore", "Exploration", payload?.explore?.favored, payload?.explore?.rank)
        this.riddle = new SkillType("riddle", "Enigmes", payload?.riddle?.favored, payload?.riddle?.rank)
        this.lore = new SkillType("lore", "Connaissances", payload?.lore?.favored, payload?.lore?.rank)
    }
}

type RewardVirtue = {
    identifier: string
    name: string
    description: string
}

class Wisdom {
    rank: number
    virtues: Array<RewardVirtue>

    constructor(payload?: Partial<Wisdom>) {
        this.rank = payload?.rank || 0
        this.virtues = payload?.virtues || []
    }
}

class Valiance {
    rank: number
    rewards: Array<RewardVirtue>

    constructor(payload?: Partial<Valiance>) {
        this.rank = payload?.rank || 0
        this.rewards = payload?.rewards || []
    }
}

type UnitInjuries = 'hours' | 'days'

type Injuries = {
    value: number
    unit: UnitInjuries
}

type States = {
    exhaust: boolean
    melancholic: boolean
    hurt: boolean
    injuries: Injuries
}

type TravelEquipment = {
    name: string
    skillRef?: SkillIdentifier
}

type HeaderValues = {
    heroicCulture: string
    culturalAdvantage: string
    vocation: string
    age: number
    qualityLife: string
    garant: string
    shadowPath: string
    treasure: number
    particularities: Array<string>
    faults: Array<string>
}

export class PlayerType {
    name: string
    vocation: VocationType
    age: number
    qualityLife: QualityLife
    garant: string
    shadowPath: string
    particularities: Array<string>
    faults: Array<string>
    race: CultureType
    treasure: number
    attributes: Attributes
    strengthSkills: StrengthSkillsType
    heartSkills: HeartSkillsType
    mindSkills: MindSkillsType
    combatSkills: CombatSkillsType
    weapons: Array<WeaponType>
    armor: ArmorType
    helm: ArmorType
    shield: ArmorType
    wisdom: Wisdom
    valiance: Valiance
    adventurePoints: number
    progressPoints: number
    communityPoints: number
    weight: IdentifiedValue
    fatigue: IdentifiedValue
    shadows: IdentifiedValue
    sequels: IdentifiedValue
    currentEndurance: IdentifiedValue
    currentHope: IdentifiedValue
    states: States
    travelEquipment: Array<TravelEquipment>

    modifiers: MapModifier

    constructor(payload?: Partial<PlayerType>) {
        this.name = payload?.name || ''
        this.vocation = payload?.vocation || 'captain'
        this.age = payload?.age || 0
        this.qualityLife = payload?.qualityLife || 'poor'
        this.garant = payload?.garant || ''
        this.shadowPath = payload?.shadowPath || ''
        this.particularities = payload?.particularities || []
        this.faults = payload?.faults || []
        this.race = CultureEnumToInstance['hobbit']
        this.treasure = payload?.treasure || 0
        this.attributes = new Attributes(payload?.attributes?.values)
        this.strengthSkills = new StrengthSkillsType(payload?.strengthSkills)
        this.heartSkills = new HeartSkillsType(payload?.heartSkills)
        this.mindSkills = new MindSkillsType(payload?.mindSkills)
        this.combatSkills = new CombatSkillsType(payload?.combatSkills)
        this.weapons = []
        payload?.weapons?.map((w) => {
            this.weapons.push(new WeaponType(w))
        })
        this.weapons = []
        this.armor = new ArmorType(payload?.armor)
        this.helm = new ArmorType(payload?.helm)
        this.shield = new ArmorType(payload?.shield)
        this.wisdom = new Wisdom(payload?.wisdom)
        this.valiance = new Valiance(payload?.valiance)
        this.adventurePoints = payload?.adventurePoints || 0
        this.progressPoints = payload?.progressPoints || 0
        this.communityPoints = payload?.communityPoints || 0
        this.weight = {identifier: payload?.weight?.identifier || "weigth", value: payload?.weight?.value || 0}
        this.fatigue = {identifier: payload?.fatigue?.identifier || "fatigue", value: payload?.fatigue?.value || 0}
        this.shadows = {identifier: payload?.shadows?.identifier || "shadows", value: payload?.shadows?.value || 0}
        this.sequels = {identifier: payload?.sequels?.identifier || "sequels", value: payload?.sequels?.value || 0}
        this.currentEndurance = {
            identifier: payload?.currentEndurance?.identifier || "currentEndurance",
            value: payload?.currentEndurance?.value || this.attributes.secondary.endurance
        }
        this.currentHope = {
            identifier: payload?.currentHope?.identifier || "currentHope",
            value: payload?.currentHope?.value || this.attributes.secondary.hope
        }
        this.states = {
            exhaust: payload?.states?.exhaust || false,
            melancholic: payload?.states?.melancholic || false,
            hurt: payload?.states?.hurt || false,
            injuries: {value: payload?.states?.injuries?.value || 0, unit: payload?.states?.injuries?.unit || 'hours'}
        }
        this.travelEquipment = []
        payload?.travelEquipment?.map((e) => {
            this.travelEquipment.push({name: e?.name || "Equipement", skillRef: e?.skillRef})
        })

        console.log(this)

        this.modifiers = SetModifiers(this)
    }

    getHeaderValues(): HeaderValues {
        return {
            heroicCulture: nameCultureType[this.race.culture],
            culturalAdvantage: nameCultureAdvantage[this.race.culturalAdvantage],
            vocation: nameVocationType[this.vocation],
            qualityLife: nameQualityLife[this.qualityLife],
            age: this.age,
            garant: this.garant,
            shadowPath: this.shadowPath,
            treasure: this.treasure,
            particularities: this.particularities,
            faults: this.faults,
        }
    }
}