import {
    CultureType,
    nameCultureType,
    nameQualityLife,
    QualityLife,
    qualityLifeByTreasure,
    QualityLifeType,
} from '@/utils/Culture/CultureType';
import {Vocation, VocationType} from '@/utils/Vocations/Vocations';
import {VocationTypeToInstance} from '@/utils/Vocations/VocationsInstances';
import {DescribableName, IDictionary, IntRange} from '@/utils/helpers';
import {Modifiers} from '@/utils/MapModifiers';
import {SetModifiers} from '@/utils/Rules/Rules';
import {ArmorType} from '@/utils/Types/ArmorType';
import {Attributes} from '@/utils/Types/CharacterTypes';
import {
    HeartSkillIdentifier,
    IdentifiedValue,
    Identifier,
    IdentifierModifiableAttr,
    MindSkillIdentifier,
    SkillIdentifier,
    StrengthSkillIdentifier,
} from '@/utils/Types/IdentifiedType';
import {WeaponType} from '@/utils/Types/WeaponType';
import {Bardide} from "@/utils/Culture/Bardide";
import {Hobbit} from '@/utils/Culture/Hobbit';
import {LindonElf} from "@/utils/Culture/LindonElf";
import {BreeHuman} from "@/utils/Culture/BreeHuman";
import {DurinDwarf} from "@/utils/Culture/DurinDwarf";
import {NorthRanger} from "@/utils/Culture/NorthRanger";
import {Valiance, Wisdom} from "@/utils/VallianceWisdom/VallianceWisdom";

const CultureTypeToInstance = {
    bardide: Bardide,
    lindonElf: LindonElf,
    hobbit: Hobbit,
    breeHuman: BreeHuman,
    durinDwarf: DurinDwarf,
    northRanger: NorthRanger
};

export class SkillType {
    name: string;
    favored: boolean;
    rank: IntRange<0, 6>;

    constructor(name: string = '', favored?: boolean, rank?: IntRange<0, 6>) {
        this.name = name;
        this.favored = favored || false;
        this.rank = rank || 0;
    }
}

class CombatSkillType {
    name: string;
    rank: IntRange<0, 6>;

    constructor(name: string = '', rank?: IntRange<0, 6>) {
        this.name = name;
        this.rank = rank || 0;
    }
}

export class CombatSkillsType {
    axes: CombatSkillType;
    bows: CombatSkillType;
    spears: CombatSkillType;
    swords: CombatSkillType;

    constructor(payload?: Partial<CombatSkillsType>) {
        this.axes = new CombatSkillType('Haches', payload?.axes?.rank);
        this.bows = new CombatSkillType('Arcs', payload?.bows?.rank);
        this.spears = new CombatSkillType('Lances', payload?.spears?.rank);
        this.swords = new CombatSkillType('Epées', payload?.swords?.rank);
    }
}

export class StrengthSkillsType {
    awe: SkillType;
    athletics: SkillType;
    awareness: SkillType;
    hunting: SkillType;
    song: SkillType;
    craft: SkillType;

    constructor(payload?: Partial<StrengthSkillsType>) {
        this.awe = new SkillType(
            'Présence',
            payload?.awe?.favored,
            payload?.awe?.rank
        );
        this.athletics = new SkillType(
            'Athélisme',
            payload?.athletics?.favored,
            payload?.athletics?.rank
        );
        this.awareness = new SkillType(
            'Vigilance',
            payload?.awareness?.favored,
            payload?.awareness?.rank
        );
        this.hunting = new SkillType(
            'Chasse',
            payload?.hunting?.favored,
            payload?.hunting?.rank
        );
        this.song = new SkillType(
            'Chant',
            payload?.song?.favored,
            payload?.song?.rank
        );
        this.craft = new SkillType(
            'Artisanat',
            payload?.craft?.favored,
            payload?.craft?.rank
        );
    }
}

export class HeartSkillsType {
    enhearten: SkillType;
    travel: SkillType;
    insight: SkillType;
    healing: SkillType;
    courtesy: SkillType;
    battle: SkillType;

    constructor(payload?: Partial<HeartSkillsType>) {
        this.enhearten = new SkillType(
            'Inspiration',
            payload?.enhearten?.favored,
            payload?.enhearten?.rank
        );
        this.travel = new SkillType(
            'Voyage',
            payload?.travel?.favored,
            payload?.travel?.rank
        );
        this.insight = new SkillType(
            'Intuition',
            payload?.insight?.favored,
            payload?.insight?.rank
        );
        this.healing = new SkillType(
            'Soins',
            payload?.healing?.favored,
            payload?.healing?.rank
        );
        this.courtesy = new SkillType(
            'Courtoisie',
            payload?.courtesy?.favored,
            payload?.courtesy?.rank
        );
        this.battle = new SkillType(
            'Art de la guerre',
            payload?.battle?.favored,
            payload?.battle?.rank
        );
    }
}

export class MindSkillsType {
    persuade: SkillType;
    stealth: SkillType;
    scan: SkillType;
    explore: SkillType;
    riddle: SkillType;
    lore: SkillType;

    constructor(payload?: Partial<MindSkillsType>) {
        this.persuade = new SkillType(
            'Persuasion',
            payload?.persuade?.favored,
            payload?.persuade?.rank
        );
        this.stealth = new SkillType(
            'Discrétion',
            payload?.stealth?.favored,
            payload?.stealth?.rank
        );
        this.scan = new SkillType(
            'Inspection',
            payload?.scan?.favored,
            payload?.scan?.rank
        );
        this.explore = new SkillType(
            'Exploration',
            payload?.explore?.favored,
            payload?.explore?.rank
        );
        this.riddle = new SkillType(
            'Enigmes',
            payload?.riddle?.favored,
            payload?.riddle?.rank
        );
        this.lore = new SkillType(
            'Connaissances',
            payload?.lore?.favored,
            payload?.lore?.rank
        );
    }
}

type UnitInjuries = 'hours' | 'days';

type Injuries = {
    value: number;
    unit: UnitInjuries;
};

type States = {
    exhaust: boolean;
    melancholic: boolean;
    hurt: boolean;
    injuries: Injuries;
};

type TravelEquipment = {
    name: string;
    skillRef?: SkillIdentifier;
};

export type HeaderValues = {
    heroicCulture: string;
    culturalAdvantage: Array<DescribableName>;
    vocation: VocationType;
    name: string;
    age: number;
    qualityLife: QualityLifeType;
    garant: string;
    treasure: number;
    particularities: Array<string>;
    faults: Array<string>;
}

export class PlayerType {
    name: string;
    vocation: Vocation;
    age: number;
    qualityLife: QualityLife;
    garant: string;
    particularities: Array<string>;
    faults: Array<string>;
    culture: CultureType;
    treasure: number;
    attributes: Attributes;
    strengthSkills: StrengthSkillsType;
    heartSkills: HeartSkillsType;
    mindSkills: MindSkillsType;
    combatSkills: CombatSkillsType;
    weapons: Array<WeaponType>;
    armor: ArmorType;
    helm: ArmorType;
    shield: ArmorType;
    wisdom: Wisdom;
    valiance: Valiance;
    adventurePoints: number;
    progressPoints: number;
    communityPoints: number;
    fatigue: IdentifiedValue;
    shadows: IdentifiedValue;
    sequels: number;
    currentEndurance: IdentifiedValue;
    currentHope: IdentifiedValue;
    states: States;
    travelEquipment: Array<TravelEquipment>;

    modifiers: IDictionary<Modifiers>;

    constructor(payload?: Partial<PlayerType>) {
        this.name = payload?.name || '';
        this.vocation = payload?.vocation || 'captain';
        this.age = payload?.age || 0;
        this.qualityLife = payload?.qualityLife || 'poor';
        this.garant = payload?.garant || '';
        this.particularities = payload?.particularities || [];
        this.faults = payload?.faults || [];
        this.culture = payload?.culture ? CultureTypeToInstance[payload.culture.culture] : CultureTypeToInstance['hobbit'];
        this.treasure = payload?.treasure || 0;
        this.attributes = new Attributes(payload?.attributes?.values);
        this.strengthSkills = new StrengthSkillsType(payload?.strengthSkills);
        this.heartSkills = new HeartSkillsType(payload?.heartSkills);
        this.mindSkills = new MindSkillsType(payload?.mindSkills);
        this.combatSkills = new CombatSkillsType(payload?.combatSkills);
        this.weapons = [];
        payload?.weapons?.map((w) => {
            this.weapons.push(new WeaponType(w));
        });
        this.armor = new ArmorType(
            payload?.armor,
            payload?.armor?.weight?.identifier
                ? payload?.armor?.weight?.identifier
                : 'armorWeight'
        );
        this.helm = new ArmorType(
            payload?.helm,
            payload?.helm?.weight?.identifier
                ? payload?.helm?.weight?.identifier
                : 'helmWeight'
        );
        this.shield = new ArmorType(
            payload?.shield,
            payload?.shield?.weight?.identifier
                ? payload?.shield?.weight?.identifier
                : 'shieldWeight'
        );
        this.wisdom = new Wisdom(payload?.wisdom);
        this.valiance = new Valiance(payload?.valiance);
        this.adventurePoints = payload?.adventurePoints || 0;
        this.progressPoints = payload?.progressPoints || 0;
        this.communityPoints = payload?.communityPoints || 0;
        this.fatigue = {
            identifier: payload?.fatigue?.identifier || 'fatigue',
            value: payload?.fatigue?.value || 0,
        };
        this.shadows = {
            identifier: payload?.shadows?.identifier || 'shadows',
            value: payload?.shadows?.value || 0,
        };
        this.sequels = payload?.sequels || 0;
        this.currentEndurance = {
            identifier:
                payload?.currentEndurance?.identifier || 'currentEndurance',
            value:
                payload?.currentEndurance?.value ||
                this.attributes.secondary.endurance.value,
        };
        this.currentHope = {
            identifier: payload?.currentHope?.identifier || 'currentHope',
            value:
                payload?.currentHope?.value ||
                this.attributes.secondary.hope.value,
        };
        this.states = {
            exhaust: payload?.states?.exhaust || false,
            melancholic: payload?.states?.melancholic || false,
            hurt: payload?.states?.hurt || false,
            injuries: {
                value: payload?.states?.injuries?.value || 0,
                unit: payload?.states?.injuries?.unit || 'hours',
            },
        };
        this.travelEquipment = [];
        payload?.travelEquipment?.map((e) => {
            this.travelEquipment.push({
                name: e?.name || 'Equipement',
                skillRef: e?.skillRef,
            });
        });

        this.modifiers = {};
        SetModifiers(this);

        console.log(this.wisdom);
        console.log(this.valiance);
    }

    getValue(identifier: Identifier | IdentifierModifiableAttr): number {
        switch (identifier) {
            case 'unknown':
                return 0;
            case 'sequels':
                return this.sequels;
            case 'adventurePoints':
                return this.adventurePoints;
            case 'progressPoints':
                return this.progressPoints;
            case 'communityPoints':
                return this.communityPoints;
            case 'strength':
                return this.attributes.values.strength.value;
            case 'heart':
                return this.attributes.values.heart.value;
            case 'mind':
                return this.attributes.values.mind.value;
            case 'strengthSR':
                return this.attributes.sr.strength.value;
            case 'heartSR':
                return this.attributes.sr.heart.value;
            case 'mindSR':
                return this.attributes.sr.mind.value;
            case 'enduranceMax':
                return this.attributes.secondary.endurance.value;
            case 'hopeMax':
                return this.attributes.secondary.hope.value;
            case 'parade':
                return this.attributes.secondary.parade.value;
            case 'fatigue':
                return this.fatigue.value;
            case 'shadows':
                return this.shadows.value;
            case 'currentEndurance':
                return this.currentEndurance.value;
            case 'currentHope':
                return this.currentHope.value;
            case 'armorWeight':
                return this.armor.weight.value;
            case 'helmWeight':
                return this.helm.weight.value;
            case 'shieldWeight':
                return this.shield.weight.value;
            default:
                return 0;
        }
    }

    getModifiedValue(
        identifier: Identifier | IdentifierModifiableAttr
    ): number {
        if (identifier === 'unknown') {
            return 0;
        } else if (identifier === 'weight') {
            return (
                this.weapons.reduce((prev, curr) => prev + curr.weight, 0) +
                this.getModifiedValue('armorWeight') +
                this.getModifiedValue('helmWeight') +
                this.getModifiedValue('shieldWeight')
            );
        } else if (this.modifiers[identifier]) {
            return this.modifiers[identifier].getModified(
                this.getValue(identifier)
            );
        } else {
            return this.getValue(identifier);
        }
    }

    getHeaderValues(): HeaderValues {
        return {
            heroicCulture: nameCultureType[this.culture.culture],
            culturalAdvantage: this.culture.culturalAdvantages,
            vocation: VocationTypeToInstance[this.vocation],
            qualityLife: nameQualityLife[qualityLifeByTreasure(this.treasure)],
            name: this.name,
            age: this.age,
            garant: this.garant,
            treasure: this.treasure,
            particularities: this.particularities,
            faults: this.faults,
        };
    }

    setValue(
        identifier: Identifier | IdentifierModifiableAttr,
        value: number
    ): void {
        switch (identifier) {
            case 'unknown':
                return;
            case 'currentEndurance':
                this.setCurrentEndurance(value);
                break;
            case 'currentHope':
                this.setCurrentHope(value);
                break;
            case 'fatigue':
                this.setFatigue(value);
                break;
            case 'shadows':
                this.setShadows(value);
                break;
            case 'sequels':
                this.setSequels(value);
                break;
            case 'adventurePoints':
                this.setAdventurePoints(value);
                break;
            case 'progressPoints':
                this.setProgressPoints(value);
                break;
            case 'communityPoints':
                this.setCommunityPoints(value);
                break;
        }
    }

    setCurrentEndurance(value: number) {
        if (value < 0) {
            value = 0;
        } else {
            let max = this.getModifiedValue('enduranceMax');
            if (value > max) value = max;
        }

        this.currentEndurance.value = value;
        let modified = this.getModifiedValue('currentEndurance');

        this.states.exhaust = modified < this.getModifiedValue('weight') + this.getModifiedValue('fatigue');
    }

    getSkill(identifier: StrengthSkillIdentifier | HeartSkillIdentifier | MindSkillIdentifier): SkillType {
        switch (identifier) {
            case "awe":
                return this.strengthSkills.awe;
            case "athletics":
                return this.strengthSkills.athletics;
            case "awareness":
                return this.strengthSkills.awareness;
            case "hunting":
                return this.strengthSkills.hunting;
            case "song":
                return this.strengthSkills.song;
            case "craft":
                return this.strengthSkills.craft;
            case "enhearten":
                return this.heartSkills.enhearten;
            case "travel":
                return this.heartSkills.travel;
            case "insight":
                return this.heartSkills.insight;
            case "healing":
                return this.heartSkills.healing;
            case "courtesy":
                return this.heartSkills.courtesy;
            case "battle":
                return this.heartSkills.battle;
            case "persuade":
                return this.mindSkills.persuade;
            case "stealth":
                return this.mindSkills.stealth;
            case "scan":
                return this.mindSkills.scan;
            case "explore":
                return this.mindSkills.explore;
            case "riddle":
                return this.mindSkills.riddle;
            case "lore":
                return this.mindSkills.lore;
        }
    }

    private setCurrentHope(value: number) {
        if (value < 0) {
            value = 0;
        } else {
            let max = this.getModifiedValue('hopeMax');
            if (value > max) value = max;
        }

        this.currentHope.value = value;
        let modified = this.getModifiedValue('currentHope');

        this.states.melancholic = modified < this.getModifiedValue('shadows');
    }

    private setFatigue(value: number) {
        if (value < 0) {
            value = 0;
        }
        this.fatigue.value = value;

        this.states.exhaust = this.getModifiedValue('currentEndurance') < this.getModifiedValue('weight') + this.getModifiedValue('fatigue');
    }

    private setShadows(value: number) {
        if (value < 0) {
            value = 0;
        } else {
            let max = this.getModifiedValue('hopeMax');
            if (value > max) value = max;
        }

        this.shadows.value = value;
        let modified = this.getModifiedValue('shadows');

        this.states.melancholic = modified > this.getModifiedValue('currentHope');
    }

    private setSequels(value: number) {
        if (value < 0) {
            value = 0;
        }
        this.sequels = value;
    }

    private setAdventurePoints(value: number) {
        if (value < 0) {
            value = 0;
        }
        this.adventurePoints = value;
    }

    private setProgressPoints(value: number) {
        if (value < 0) {
            value = 0;
        }
        this.progressPoints = value;
    }

    private setCommunityPoints(value: number) {
        if (value < 0) {
            value = 0;
        }
        this.communityPoints = value;
    }
}
