import {DescribableName, PossibleChoose} from "@/utils/helpers";
import {SkillIdentifier} from "@/utils/Types/IdentifiedType";
import {VocationType} from "@/utils/Vocations/Vocations";

export const Captain = new VocationType(
    new DescribableName(
        "Capitaine",
        "Quand le monde est sur le point de s'effondrer, il est du " +
        "devoir de tous les individus valeureux de prendre les rènes pour " +
        "diriger, quels que soient les dangers. Vous avez choisi de " +
        "mettre vos compétences au service de la communauté, " +
        "guider les vôtres dans ces heures sombres. Mais vous souhaitez " +
        "les voir suivre vos ordres non pas peur ou docilité, mais " +
        "parce qu'ils vous font confiance."
    ),
    new PossibleChoose<SkillIdentifier>(
        2,
        ['battle', 'enhearten', 'persuade']
    ),
    new DescribableName(
        "Commandement",
        "Vous avez développé la capacité de guider les autres dans leurs actions. " +
        "Lors de situations tendues, les gens viennent spontanément vous demander que faire."),
    new DescribableName(
        "Attrait du pouvoir",
        "Qu'elle l'ait obtenue de par son rang, son ascendance ou sa renommée, " +
        "une personne détentrice de l'autorité finit parfois par confondre l'intérêt général " +
        "de ceux qu'elle est supposée guider ou protéger avec son ambition personnelle. " +
        "Le pouvoir est l'essence même de la tentation : " +
        "c'est pour l'Ombre un chemin rapide pour conquéir le cœur de ceux qui rêvent d'en acquérir toujours plus."
    )
);

export const Champion = new VocationType(
    new DescribableName(
        "Champion",
        "À vos yeux, il n'existe qu'une solution pour s'opposer au " +
        "retour de l'Ombre : la conquérir par les armes. Ceux de " +
        "votre peuple vous considèrent comme un vaillant guerrier, " +
        "prompt au combat. Pour vous, le chemin de l'aventure doit " +
        "mener sans ambages là où rôdent vos ennemis, jusque dans " +
        "les lieux où ils se terrent."),
    new PossibleChoose<SkillIdentifier>(
        2,
        ['athletics', 'hunting', 'awe']
    ),
    new DescribableName(
        "Connaissance des ennemis",
        "Cette particularité fonctionne différemment des autres : " +
        "vous devez choisir un type spécifique d'ennemis auquel elle s'applique dans la liste suivante : " +
        "Araignées, Hommes Malfaisants, Morts-Visants, Orques, Trolls, Wargs. " +
        "Elle vous permet de connaitre les caractéristiques, les habitudes, " +
        "les forces et les faiblesses de votre ennemi de prédilection."
    ),
    new DescribableName(
        "Malédiction de la vengeance",
        "Ceux qui vivent par l'épée sont toujours tentés de dégainer" +
        "( que ce soit en paroles ou en actes ) à la moindre contrariété," +
        "ou estiment avoir subi un affront. Ils deviennent" +
        "irascibles, la corruption s'étend peu à peu toute leur volonté" +
        "et les condamne à réagir à chaque situation avec une violence" +
        "sans cesse croissante"
    )
);

export const TreasureHunter = new VocationType(
    new DescribableName(
        "Chasseur de trésors",
        "Les siècles passés ont été témoins de la gloire d'une myriade " +
        "de rois nains et de seigneurs elfes : leur héritage git désormais " +
        "dans des souterrains infestés d 'Orques. Ces trésors dérobés, " +
        "d'or et de joyaux flamboyants, attirent la convoitise des plus " +
        "audacieux, mais de terribles créatures les gardent... Vous êtes " +
        "de ceux qui osent chercher et réclamer ces butins perdus, " +
        "quand bien même il vous faudrait braver d'indicibles dangers."),
    new PossibleChoose<SkillIdentifier>(
        2,
        ['stealth', 'explore', 'scan']),
    new DescribableName(
        "Monte-en-l'air",
        "Ce talent intemporel regroupe l'art de faire les poches, de " +
        "crocheter les serrures, et d 'une manière générale tout moyen " +
        "frauduleux permettant de s'emparer des biens d'autrui ou " +
        "d'accéder à des lieux protégés."
    ),
    new DescribableName(
        "Mal du dragon",
        "Les aventuriers en quête de trésors perdus courent le risque " +
        "d'attraper cette vieille maladie qui transforrne un amas d'or " +
        "enchanté en un tas de cendres amères. Plus l'Ombre resserre " +
        "son étreinte autour du cœur de sa cible, plus le monde s'étrécit " +
        "autour d'elle et de son précieux butin, l'isolant dans la folie."
    )
);

export const Messenger = new VocationType(
    new DescribableName(
        "Messager",
        "Le Sage soutient que les mauvais jours sont encore devant " +
        "nous et que pour garder espoir, tous ceux qui luttent " +
        "contre l'Ennemi doivent être soudés. Mais pour le moment, " +
        "les siècles vécus dans l'isolement par les Peuples Libres " +
        "empêchent leur union tout autant que les nombreuses lieues " +
        "qui les séparent ; or l'éloignement génère de la méfiance. " +
        "Vous avez décidé qu'il était de votre devoir de parcourir les " +
        "contrées éloignées pour colporter des nouvelles du monde " +
        "et prévenir ceux qui y habitent du danger à venir."
    ),
    new PossibleChoose<SkillIdentifier>(
        2,
        ['song', 'courtesy', 'travel']
    ),
    new DescribableName(
        "Folklore",
        "Au fil de vos errances, vous avez appris de nombreuses coutumes " +
        "et traditions, légendes et croyances des diverses communautés " +
        "qui composent les Peuples Libres ; quand vous avez " +
        "affaire à des étrangers, vous êtes à même de puiser dans cette " +
        "somme de folklores les informations utiles sur leur culture " +
        "(par exemple pour résoudre un conflit) ou de vagues notions " +
        "de leur langue (pour mieux communiquer)."
    ),
    new DescribableName(
        "Folie itinérante",
        "Un Messager peut tout à fait avoir ambition de voyager de " +
        "par le monde ; toutefois, il prend le risque de ne jamais trouver " +
        "d'endroit qui vaille la peine, à ses yeux, de s'y impliquer ou le " +
        "défendre. La route ne finit jamais, bien sûr ; mais alors, où aller ?"
    )
);

export const Protector = new VocationType(
    new DescribableName(
        "Protecteur",
        "Alors que d'année en année les ombres s'épaississent, vous " +
        "avez fait le serment de protéger tous ceux qui ne peuvent " +
        "pas se défendre par eux-mêmes. Cette promesse vous force " +
        "souvent à délaisser le monde civilisé et ses habitants, pour " +
        "repousser ce qui se tapit à l'extérieur de la ville. Mais peu " +
        "à peu, vous êtes devenu un étranger à leurs yeux : votre silhouette " +
        "leur paraît désormais aussi menaçante que les créatures " +
        "contre lesquelles vous luttez."
    ),
    new PossibleChoose<SkillIdentifier>(
        2,
        ['insight', 'healing', 'awareness']
    ),
    new DescribableName(
        "Conscience de l'ombre",
        "Vous avez pris conscience de l'existence d'une puissance " +
        "cachée qui rassemble sous sa bannière tous les êtres de la " +
        "Terre du Milieu malfaisants et effroyables, sombres et ténébreux " +
        "; et qu'au fil des années cette menace étend son " +
        "pouvoir. Les Sages partagent avec vous cette conscience, et tous " +
        "s'accordent pour dire que la situation devient chaque jour " +
        "plus évidente."
    ),
    new DescribableName(
        "Voie du désespoir",
        "L'un des stratagèmes les plus fréquents de l'Ombre pour corrompre " +
        "le cœur de ses adversaires consiste à les faire douter " +
        "d'eux-mêmes. Car au fond, ils savent bien combien l'Ennemi " +
        "est puissant et effroyable ; ils n'ignorent pas que le jour où ils " +
        "disparaitront, ceux qu'ils protègent seront trop naifs ou trop " +
        "faibles pour se défendre par eux-mêmes. Alors ils finissent " +
        "par se demander chaque jour : suis-je assez fort pour pouvoir " +
        "triompher un jour, ou vais-je emporter dans ma chute " +
        "les innocents que j'avais juré de protéger ?"
    )
);

export const Savant = new VocationType(
    new DescribableName(
        "Erudit",
        "Le savoir est ce qui vous permet de rendre la sauvagerie du monde moins effroyable : " +
        "les carte jaunies des grimoires oubliés remplacent la peur de l'inconnu par de la curiosité et " +
        "de l'émerveillement, les chansons composées dans les temps " +
        "jadis enhardissent les cœurs les plus éreintés. Le désir d'apprendre " +
        "guide chacun de vos pas et illumine votre voie, montrant " +
        "le chemin à ceux qui écoutent vos conseils."
    ),
    new PossibleChoose<SkillIdentifier>(
        2,
        ['craft', 'lore', 'riddle']
    ),
    new DescribableName(
        "Rimes de savoir",
        "Il s'agit de courts versets créés par la plupart des cultures " +
        "afin de mémoriser les événements importants de l'histoire " +
        "ancienne, qui sans ça auraient été oubliés. Les Érudits de la " +
        "Terre du Milieu doivent une grande partie de leur connaissance " +
        "du passé à l'existence de telles rimes."
    ),
    new DescribableName(
        "Attrait des secret",
        "Il est souhaitable d'avoir pour vertus une curiosité intellectuelle " +
        "et un grand appétit de connaissances ; mais manipulé " +
        "par l'Ombre, le savoir peut s'avérer pernicieux : une personne " +
        "lettrée se met alors à mépriser les autres, à les considérer " +
        "comme des idiots incultes. Les secrets restent l'appât le plus " +
        "dangereux, car le désir ardent de les percer peut corrompre " +
        "même les cœurs les plus nobles."
    )
);

export const VocationTypeToInstance = {
    captain: Captain,
    champion: Champion,
    treasureHunter: TreasureHunter,
    messenger: Messenger,
    protector: Protector,
    savant: Savant,
};
