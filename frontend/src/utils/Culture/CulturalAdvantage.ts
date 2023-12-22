import {DescribableName} from "../helpers";

export type CulturalAdvantage =
    "intrepid"
    | "elvenPrecision"
    | "longDefeat"
    | "goodSense"
    | "semiMan"
    | "fromBree"
    | "tireless"
    | "naugrim"
    | "kingOfMen"
    | "dunedainAllegiance";


export const Intrepid = new DescribableName(
    "Intrepide",
    "Vos tests de VAILIANCE sont favorisés"
);
export const ElvenPrecision = new DescribableName(
    "Précision elfique",
    "Tant que votre Héros n'est pas Mélancolique, vous pouvez dépenser 1 point d'Espoir pour obtenir une Réussite magique lors d'un jet de Compétence"
);
export const LongDefeat = new DescribableName(
    "La longue défaite",
    "Durant la Phase de Communauté, lors de l'étape destinée à réduire les points d'Ombre cumulés par les Héros, vous ne pouvez perdre que 1 point d'Ombre"
);
export const GoodSense = new DescribableName(
    "Bon sens Hobbit",
    "Vos tests de SAGESSE sont favorisés, et vous gagnez (1d) à vos tests d'Ombre lorsque vous tentez de résister à la Cupidité"
);
export const SemiMan = new DescribableName(
    "Semi-Hommes",
    "Ne peut utiliser que : Arc, dague, épée courte, gourdin, hache, lance, lance courte, massue. De plus, les Semi-Hommes ne peuvent pas utiliser de grand bouclier."
);
export const FromBree = new DescribableName(
    "Originaire de Bree",
    "Chaque Homme de Bree de la Compagnie augmente la valeur de Communauté de 1 point"
);
export const Tireless = new DescribableName(
    "Infatigable",
    "Divisez par deux la valeur de Charge de l'armure du Héros quelle qu'elle soit, casque inclus, mais sans prendre en compte son bouclier (arrondir au supérieur)"
);
export const Naugrim = new DescribableName(
    "Naugrim",
    "Un aventurier nain ne peut pas utiliser l'Attirail de guerre suivant : grand arc, grande lance, grand bouclier"
);
export const KingOfMen = new DescribableName(
    "Rois des Hommes",
    "Ajouter 1 points à un Attribut de votre choix"
);
export const DunedainAllegiance = new DescribableName(
    "Allégeance des Dünedain",
    "Durant la Phase de Communauté (hormis Yule), le nombre maximal de points d'Espoir que vous pouvez récupérer est égal à la moitié de votre valeur de CŒUR (arrondir au supérieur)"
);


export const CulturalAdvantageToInstance = {
    intrepid: Intrepid,
    elvenPrecision: ElvenPrecision,
    longDefeat: LongDefeat,
    goodSense: GoodSense,
    semiMan: SemiMan,
    fromBree: FromBree,
    tireless: Tireless,
    naugrim: Naugrim,
    kingOfMen: KingOfMen,
    dunedainAllegiance: DunedainAllegiance,
};

