import {SkillIdentifier} from "../Types/IdentifiedType";
import {DescribableName, PossibleChoose} from "../helpers";

export type Vocation =
    | "captain"
    | "champion"
    | "treasureHunter"
    | "messenger"
    | "protector"
    | "savant";


export class VocationType {
    readonly name: DescribableName;
    readonly possibleFavoredSkill: PossibleChoose<SkillIdentifier>;
    readonly particularity: DescribableName;
    readonly shadowPath: DescribableName;

    constructor(name: DescribableName, possibleFavoredSkill: PossibleChoose<SkillIdentifier>, particularity: DescribableName, shadowPath: DescribableName) {
        this.name = name;
        this.possibleFavoredSkill = possibleFavoredSkill;
        this.particularity = particularity;
        this.shadowPath = shadowPath;
    }
}