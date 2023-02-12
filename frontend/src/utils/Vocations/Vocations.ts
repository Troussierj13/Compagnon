import {SkillIdentifier} from "@/utils/Types/IdentifiedType";
import {PossibleChoose} from "@/utils/helpers";

export type Vocation =
    | "captain"
    | "champion"
    | "treasureHunter"
    | "messenger"
    | "protector"
    | "savant";


export class VocationType {
    readonly name: string;
    readonly possibleFavoredSkill: PossibleChoose<SkillIdentifier>;
    readonly particularity: string;
    readonly shadowPath: string;

    constructor(name: string, possibleFavoredSkill: PossibleChoose<SkillIdentifier>, particularity: string, shadowPath: string) {
        this.name = name;
        this.possibleFavoredSkill = possibleFavoredSkill;
        this.particularity = particularity;
        this.shadowPath = shadowPath;
    }
}

export const Captain = new VocationType(
    "Capitaine",
    new PossibleChoose<SkillIdentifier>(2, ['battle', 'enhearten', 'persuade']),
    "Commandement",
    "Attrait du pouvoir");

export const Champion = new VocationType(
    "Champion",
    new PossibleChoose<SkillIdentifier>(2, ['athletics', 'hunting', 'awe']),
    "Connaissance des ennemis",
    "Malédiction de la vengeance");

export const TreasureHunter = new VocationType(
    "Chasseur de trésors",
    new PossibleChoose<SkillIdentifier>(2, ['stealth', 'explore', 'scan']),
    "Monte-en-l'air",
    "Mal du dragon");

export const Messenger = new VocationType(
    "Messager",
    new PossibleChoose<SkillIdentifier>(2, ['song', 'courtesy', 'travel']),
    "Folklore",
    "Folie itinérante");

export const Protector = new VocationType(
    "Protecteur",
    new PossibleChoose<SkillIdentifier>(2, ['insight', 'healing', 'awareness']),
    "Conscience de l'ombre",
    "Voie du désespoir");

export const Savant = new VocationType(
    "Erudit",
    new PossibleChoose<SkillIdentifier>(2, ['craft', 'lore', 'riddle']),
    "Rimes de savoir",
    "Attrait des secret");

export const VocationTypeToInstance = {
    captain: Captain,
    champion: Champion,
    treasureHunter: TreasureHunter,
    messenger: Messenger,
    protector: Protector,
    savant: Savant,
};
