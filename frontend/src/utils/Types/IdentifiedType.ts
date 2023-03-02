export type CombatSkillIdentifier = "axes" | "bows" | "spears" | "swords";
export type StrengthSkillIdentifier =
    | "awe"
    | "athletics"
    | "awareness"
    | "hunting"
    | "song"
    | "craft";
export type HeartSkillIdentifier =
    | "enhearten"
    | "travel"
    | "insight"
    | "healing"
    | "courtesy"
    | "battle";
export type MindSkillIdentifier =
    | "persuade"
    | "stealth"
    | "scan"
    | "explore"
    | "riddle"
    | "lore";

export type SkillIdentifier = "unknown"
    | CombatSkillIdentifier
    | StrengthSkillIdentifier
    | HeartSkillIdentifier
    | MindSkillIdentifier;

export type ArmorIdentifier = "unknown"
    | "armor"
    | "helm"
    | "shield"

export type Identifier =
    | "unknown"
    | "strength"
    | "heart"
    | "mind"
    | "strengthSR"
    | "heartSR"
    | "mindSR"
    | "enduranceMax"
    | "hopeMax"
    | "parade"
    | "fatigue"
    | "shadows"
    | "currentEndurance"
    | "currentHope"
    | "weight"
    | "armorWeight"
    | "armorProtection"
    | "helmWeight"
    | "helmProtection"
    | "shieldWeight"
    | "shieldParade"
    | "weaponDamage"
    | "weaponInjuryOneHand"
    | "weaponInjuryTwoHand";

export type IdentifierModifiableAttr =
    | "adventurePoints"
    | "progressPoints"
    | "communityPoints"
    | "sequels";

export class IdentifiedValue {
    identifier: Identifier;
    value: number;

    constructor(payload?: Partial<IdentifiedValue>) {
        this.identifier = payload?.identifier || "unknown";
        this.value = payload?.value || 0;
    }
}
