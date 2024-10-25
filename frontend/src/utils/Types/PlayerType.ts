import {
    CultureType,
    nameCultureType,
    nameQualityLife,
    QualityLife,
    qualityLifeByTreasure,
    QualityLifeType,
} from '../Culture/CultureType';
import {Vocation, VocationType} from '../Vocations/Vocations';
import {VocationTypeToInstance} from '../Vocations/VocationsInstances';
import {DescribableName, IDictionary, IntRange} from '../helpers';
import {ModifierParam, Modifiers} from '../MapModifiers';
import {SetModifiers} from '../Rules/Rules';
import {ArmorType} from './ArmorType';
import {Attributes} from './CharacterTypes';
import {
    ArmorIdentifier,
    HeartSkillIdentifier,
    IdentifiedValue,
    Identifier,
    IdentifierModifiableAttr,
    MindSkillIdentifier,
    SkillIdentifier,
    StrengthSkillIdentifier,
} from "./IdentifiedType";
import {WeaponType} from './WeaponType';
import {Bardide} from "../Culture/Bardide";
import {Hobbit} from "../Culture/Hobbit";
import {LindonElf} from "../Culture/LindonElf";
import {BreeHuman} from "../Culture/BreeHuman";
import {DurinDwarf} from "../Culture/DurinDwarf";
import {NorthRanger} from "../Culture/NorthRanger";
import {Valiance, Wisdom} from "../VallianceWisdom/VallianceWisdom";
import {Virtue} from "../VallianceWisdom/Virtues";
import {ApplyIdentifier, Reward} from "../VallianceWisdom/Rewards";
import {APIRequests} from "../apiurls";

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

    constructor(payload?: Partial<SkillType>) {
        this.name = payload?.name || '';
        this.favored = payload?.favored || false;
        this.rank = payload?.rank || 0;
    }
}

class CombatSkillType {
    name: string;
    rank: IntRange<0, 6>;

    constructor(payload?: Partial<CombatSkillType>) {
        this.name = payload?.name || '';
        this.rank = payload?.rank || 0;
    }
}

export class CombatSkillsType {
    axes: CombatSkillType;
    bows: CombatSkillType;
    spears: CombatSkillType;
    swords: CombatSkillType;

    constructor(payload?: Partial<CombatSkillsType>) {
        this.axes = new CombatSkillType({name: 'Haches', rank: payload?.axes?.rank});
        this.bows = new CombatSkillType({name: 'Arcs', rank: payload?.bows?.rank});
        this.spears = new CombatSkillType({name: 'Lances', rank: payload?.spears?.rank});
        this.swords = new CombatSkillType({name: 'Epées', rank: payload?.swords?.rank});
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
            {
                name: 'Présence',
                favored: payload?.awe?.favored,
                rank: payload?.awe?.rank
            }
        );
        this.athletics = new SkillType(
            {
                name: 'Athlétisme',
                favored: payload?.athletics?.favored,
                rank: payload?.athletics?.rank
            }
        );
        this.awareness = new SkillType(
            {
                name: 'Vigilance',
                favored: payload?.awareness?.favored,
                rank: payload?.awareness?.rank
            }
        );
        this.hunting = new SkillType(
            {
                name: 'Chasse',
                favored: payload?.hunting?.favored,
                rank: payload?.hunting?.rank
            }
        );
        this.song = new SkillType(
            {
                name: 'Chant',
                favored: payload?.song?.favored,
                rank: payload?.song?.rank
            }
        );
        this.craft = new SkillType(
            {
                name: 'Artisanat',
                favored: payload?.craft?.favored,
                rank: payload?.craft?.rank
            }
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
            {
                name: 'Inspiration',
                favored: payload?.enhearten?.favored,
                rank: payload?.enhearten?.rank
            }
        );
        this.travel = new SkillType(
            {
                name: 'Voyage',
                favored: payload?.travel?.favored,
                rank: payload?.travel?.rank
            }
        );
        this.insight = new SkillType(
            {
                name: 'Intuition',
                favored: payload?.insight?.favored,
                rank: payload?.insight?.rank
            }
        );
        this.healing = new SkillType(
            {
                name: 'Soins',
                favored: payload?.healing?.favored,
                rank: payload?.healing?.rank
            }
        );
        this.courtesy = new SkillType(
            {
                name: 'Courtoisie',
                favored: payload?.courtesy?.favored,
                rank: payload?.courtesy?.rank
            }
        );
        this.battle = new SkillType(
            {
                name: 'Art de la guerre',
                favored: payload?.battle?.favored,
                rank: payload?.battle?.rank
            }
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
            {
                name: 'Persuasion',
                favored: payload?.persuade?.favored,
                rank: payload?.persuade?.rank
            }
        );
        this.stealth = new SkillType(
            {
                name: 'Discrétion',
                favored: payload?.stealth?.favored,
                rank: payload?.stealth?.rank
            }
        );
        this.scan = new SkillType(
            {
                name: 'Inspection',
                favored: payload?.scan?.favored,
                rank: payload?.scan?.rank
            }
        );
        this.explore = new SkillType(
            {
                name: 'Exploration',
                favored: payload?.explore?.favored,
                rank: payload?.explore?.rank
            }
        );
        this.riddle = new SkillType(
            {
                name: 'Enigmes',
                favored: payload?.riddle?.favored,
                rank: payload?.riddle?.rank
            }
        );
        this.lore = new SkillType(
            {
                name: 'Connaissances',
                favored: payload?.lore?.favored,
                rank: payload?.lore?.rank
            }
        );
    }
}

type UnitInjuries = 'hours' | 'days';

export type Injuries = {
    value: number;
    unit: UnitInjuries;
};

export type States = {
    exhaust: boolean;
    melancholic: boolean;
    hurt: boolean;
    injuries: Injuries;
};

export type TravelEquipment = {
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
    readonly _id: string;
    name: string;
    vocation: Vocation;
    age: number;
    qualityLife: QualityLife;
    garant: string;
    particularities: Array<string>;
    particularitiesId: Array<number>;
    faults: Array<string>;
    culture: CultureType;
    treasure: number;
    attributes: Attributes;
    strengthSkills: StrengthSkillsType;
    heartSkills: HeartSkillsType;
    mindSkills: MindSkillsType;
    combatSkills: CombatSkillsType;
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
    weapons: Array<WeaponType>;

    constructor(payload?: Partial<PlayerType>, dataV?: IDictionary<Partial<Virtue>>, dataR?: IDictionary<Partial<Reward>>) {
        this._id = payload?._id || '';
        this.name = payload?.name || '';
        this.vocation = payload?.vocation || 'captain';
        this.age = payload?.age || 0;
        this.qualityLife = payload?.qualityLife || 'poor';
        this.garant = payload?.garant || '';
        this.particularities = payload?.particularities || [];
        this.particularitiesId = payload?.particularitiesId || [];
        this.faults = payload?.faults || [];
        this.culture = payload?.culture ? CultureTypeToInstance[payload.culture.culture] : CultureTypeToInstance['hobbit'];
        this.treasure = payload?.treasure || 0;
        this.attributes = new Attributes(payload?.attributes?.values);
        this.strengthSkills = new StrengthSkillsType(payload?.strengthSkills);
        this.heartSkills = new HeartSkillsType(payload?.heartSkills);
        this.mindSkills = new MindSkillsType(payload?.mindSkills);
        this.combatSkills = new CombatSkillsType(payload?.combatSkills);
        this.weapons = [];
        try {
            this.culture.possibleParticularities.setChosen(this.particularitiesId);
            this.particularities = this.culture.possibleParticularities.getChosen();
        } catch (e) {
            console.log('particularitiesId on PlayerType constructor: ', e);
        }
        payload?.weapons?.map((w) => {
            this.weapons.push(new WeaponType(w, dataR));
        });
        this.armor = new ArmorType(payload?.armor);
        this.helm = new ArmorType(payload?.helm);
        this.shield = new ArmorType(payload?.shield);
        this.wisdom = new Wisdom(payload?.wisdom, dataV);
        this.valiance = new Valiance(payload?.valiance, dataR);
        this.adventurePoints = payload?.adventurePoints || 0;
        this.progressPoints = payload?.progressPoints || 0;
        this.communityPoints = payload?.communityPoints || 0;
        this.fatigue = new IdentifiedValue({
            identifier: payload?.fatigue?.identifier || 'fatigue',
            value: payload?.fatigue?.value || 0,
        });
        this.shadows = new IdentifiedValue({
            identifier: payload?.shadows?.identifier || 'shadows',
            value: payload?.shadows?.value || 0,
        });
        this.sequels = payload?.sequels || 0;
        this.currentEndurance = new IdentifiedValue({
            identifier:
                payload?.currentEndurance?.identifier || 'currentEndurance',
            value:
                payload?.currentEndurance?.value ||
                this.attributes.secondary.endurance.value,
        });
        this.currentHope = new IdentifiedValue({
            identifier: payload?.currentHope?.identifier || 'currentHope',
            value:
                payload?.currentHope?.value ||
                this.attributes.secondary.hope.value,
        });
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

        this.addModifiers(this.valiance.getModifiers());
        this.addModifiers(this.wisdom.getModifiers());
    }

    removeTravelEquipment(equip: TravelEquipment) {
        this.travelEquipment = this.travelEquipment.filter(e => e !== equip);
    }

    addTravelEquipment(equip: TravelEquipment) {
        this.travelEquipment.push(equip);
    }

    addWeapon(weapon: WeaponType) {
        this.weapons.push(weapon);
    }

    addVirtue(virtue: Virtue) {
        this.wisdom.virtues.push(virtue);
        if (virtue.isChosen()) {
            this.addModifiers(virtue.getChosen().modifiers);
        }
    }

    addReward(reward: Reward) {
        this.valiance.rewards.push(reward);
    }

    removeWeapon(weapon: WeaponType) {
        const re = this.valiance.rewards.filter(rew => weapon.rewardsMod.includes(rew));
        re.map(rew => rew.resetChoices());
        this.weapons = this.weapons.filter(w => w !== weapon);
    }

    changeArmor(armor: ArmorType, identifier: ArmorIdentifier) {
        //reset choice of associate rewards
        if (armor.identifier === 'unknown' || this.armor != new ArmorType(armor)) {
            this.resetRewardsChoiceArmor(identifier);
        }

        switch (identifier) {
            case "armor":
                this.armor = new ArmorType(armor);
                break;
            case "helm":
                this.helm = new ArmorType(armor);
                break;
            case "shield":
                this.shield = new ArmorType(armor);
                break;
        }
    }

    getModifiedValue(identifier: Identifier | IdentifierModifiableAttr): number {
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

    getSkill(identifier: SkillIdentifier): SkillType {
        identifier = identifier as StrengthSkillIdentifier | HeartSkillIdentifier | MindSkillIdentifier; //Remove CombatSkillIdentifier
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

    public addInjury(injury: Injuries) {
        if (injury.value > 0) {
            this.states.injuries = injury;
            this.states.hurt = true;
        }
    }

    public removeInjury() {
        this.states.injuries = {value: 0, unit: 'hours'};
        this.states.hurt = false;
    }

    public setVirtueChoice(virtueId: number, index: number) {
        if (this.wisdom.virtues[virtueId] === undefined) {
            throw new Error("Not find virtue with index: " + virtueId);
        }

        this.wisdom.virtues[virtueId].setChosen(index);

        const modChosen = this.wisdom.virtues[virtueId].getChosen();
        this.addModifiers(modChosen.modifiers);
    }

    public setRewardChoiceArmor(rewardId: number, applyTo: ApplyIdentifier) {
        if (this.valiance.rewards[rewardId] === undefined) {
            throw new Error("Not find virtue with index: " + rewardId);
        }

        this.valiance.rewards[rewardId].setChosen(applyTo);

        const modChosen = this.valiance.rewards[rewardId].getChosen();
        this.addModifiers(modChosen.modifiers);
    }

    public setRewardChoiceWeapon(rewardId: number, indexWeapon: number) {
        if (this.valiance.rewards[rewardId] === undefined) {
            throw new Error("Not find virtue with index: " + rewardId);
        }

        this.valiance.rewards[rewardId].setChosen('weapon');
        this.weapons[indexWeapon].rewardsMod.push(this.valiance.rewards[rewardId]);
    }

    public addModifiers(mods: Array<ModifierParam>) {
        mods.map((mod) => {
            if (!this.modifiers[mod.identifier]) {
                this.modifiers[mod.identifier] = new Modifiers();
            }
            this.modifiers[mod.identifier].addModifiers([mod]);
        });
    }

    public removeModifiers(mods: Array<ModifierParam>) {
        mods.map((mod) => {
            if (this.modifiers[mod.identifier]) {
                console.log("remove", mod.identifier, mod);
                this.modifiers[mod.identifier].removeModifiers(mod);
            }
        });
    }

    public async saveOnDb() {
        await APIRequests.Character.update(this._id, this);
    }

    public getValue(identifier: Identifier | IdentifierModifiableAttr): number {
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
            case 'armorProtection':
                return this.armor.protection.value;
            case 'helmWeight':
                return this.helm.weight.value;
            case 'helmProtection':
                return this.helm.protection.value;
            case 'shieldWeight':
                return this.shield.weight.value;
            case 'shieldParade':
                return this.shield.parade.value;
            default:
                return 0;
        }
    }

    private resetRewardsChoiceArmor(identifier: ArmorIdentifier) {
        this.valiance.rewards.map((rew) => {
            if (rew.isChosen() && rew.getChosen().applyTo === identifier) {
                this.removeModifiers(rew.getChosen().modifiers);
                rew.resetChoices();
            }
        });
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
