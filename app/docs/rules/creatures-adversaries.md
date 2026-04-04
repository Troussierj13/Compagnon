# Créatures & Adversaires — The One Ring 2e

## Structure d'une fiche ennemi

Chaque adversaire (PNJ ennemi, créature, monstre) est défini par les statistiques suivantes :

| Stat | Clé app | Description |
|---|---|---|
| **Niveau d'attribut** | `attribute_level` | Dangerosité globale (1–10+) |
| **Endurance** | `endurance` | Points de vie de la créature |
| **Puissance** (Power) | `power` | Nombre d'attaques par round |
| **Compétence de combat** | `combat_skill` | Pool de dés pour les jets d'attaque |
| **Valeur de Parade** | `parry` | TN des attaques des héros contre cette créature |
| **Seuil de blessure** | `injury_rating` | Seuil pour infliger une Blessure (Coup Perforant) |
| **Dégâts** | `damage` | Dégâts infligés en cas de touche |
| **Seuil de Peur** | `fear_rating` | TN du jet de Peur (0 = pas de jet requis) |
| **Haine / Détermination** | `special_resource_type` | `hatred` ou `determination` |
| **Valeur Haine/Déterm.** | `special_resource` | Points disponibles |
| **Capacités redoutables** | `special_abilities` | Liste de pouvoirs spéciaux (champ texte) |

---

## Haine vs Détermination

### Haine (Hatred)
Ressource des créatures **maléfiques** (Orques, Gobelins, Trolls, Wargs…).

- Les points de Haine sont **dépensés** par la créature pour des effets offensifs.
- Exemples d'utilisation : attaque supplémentaire, bonus de dégâts, capacité spéciale.
- La Haine se **régénère** entre les rounds (ou selon les règles du MJ).

### Détermination (Determination)
Ressource des créatures **nobles ou puissantes** (chefs humains, bêtes légendaires, gardiens…).

- Les points de Détermination permettent à la créature de **résister** ou d'amplifier sa puissance.
- Exemples : ignorer une Blessure, relancer un jet, invoquer un pouvoir spécial.

---

## Capacités redoutables (Dread Powers)

Certaines créatures ont des **capacités redoutables** qui sortent des règles standard de combat :

| Capacité | Effet typique |
|---|---|
| **Venimeux** | Inflige un état empoisonné (Ombre ou Endurance supplémentaire perdue) |
| **Blindage naturel** | Armure innée (+X dés de protection) |
| **Régénération** | Récupère X Endurance par round |
| **Terreur** | Déclenche un jet de Peur au début du combat |
| **Immense** | Ignore les postures Défensif et Arrière |
| **Nuée** | Traité comme un groupe — règles spéciales de dégâts |
| **Furtif** | Initiative toujours en premier, peut surprendre |

> Le MJ définit les capacités redoutables dans le champ texte `special_abilities` de la fiche ennemi. L'app ne les automatise pas.

---

## Créatures de référence

### Orque ordinaire (Goblin / Orc)

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 3 |
| Endurance | 12 |
| Puissance | 1 |
| Compétence de combat | 3 dés |
| Parade | 14 |
| Seuil de blessure | 12 |
| Dégâts | 5 |
| Seuil de Peur | — |
| Haine | 3 |

---

### Orque de guerre (Orc-warrior)

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 4 |
| Endurance | 18 |
| Puissance | 1 |
| Compétence de combat | 4 dés |
| Parade | 15 |
| Seuil de blessure | 14 |
| Dégâts | 6 |
| Seuil de Peur | — |
| Haine | 4 |

---

### Warg

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 4 |
| Endurance | 16 |
| Puissance | 1 |
| Compétence de combat | 4 dés |
| Parade | 14 |
| Seuil de blessure | 12 |
| Dégâts | 5 |
| Seuil de Peur | 8 |
| Haine | 3 |

---

### Troll des cavernes (Cave-troll)

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 6 |
| Endurance | 40 |
| Puissance | 2 |
| Compétence de combat | 5 dés |
| Parade | 16 |
| Seuil de blessure | 16 |
| Dégâts | 9 |
| Seuil de Peur | 12 |
| Haine | 6 |
| Capacités | Immense, Blindage naturel (+2 dés protection) |

---

### Araignée géante (Giant Spider)

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 4 |
| Endurance | 20 |
| Puissance | 2 |
| Compétence de combat | 4 dés |
| Parade | 13 |
| Seuil de blessure | 12 |
| Dégâts | 4 |
| Seuil de Peur | 10 |
| Haine | 4 |
| Capacités | Venimeux (Ombre +1 si touché), Furtif |

---

### Chef Orque (Orc-chieftain)

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 6 |
| Endurance | 28 |
| Puissance | 2 |
| Compétence de combat | 5 dés |
| Parade | 16 |
| Seuil de blessure | 15 |
| Dégâts | 7 |
| Seuil de Peur | — |
| Haine | 8 |
| Capacités | Cri de guerre (héros en Posture Défensif perdent −1 dé ce round) |

---

### Mort-vivant (Wight / Barrow-wight)

| Stat | Valeur |
|---|---|
| Niveau d'attribut | 5 |
| Endurance | 20 |
| Puissance | 1 |
| Compétence de combat | 5 dés |
| Parade | 15 |
| Seuil de blessure | 14 |
| Dégâts | 6 |
| Seuil de Peur | 12 |
| Détermination | 5 |
| Capacités | Terreur (jet de Peur au premier round), Régénération (4 End/round) |

---

## Groupes de créatures

Quand plusieurs créatures du même type attaquent ensemble, le MJ peut les **grouper** :

- Le groupe partage une seule **Endurance collective**.
- Les attaques du groupe comptent comme **Puissance × nombre de membres actifs** (cap selon la taille du groupe).
- Les héros peuvent cibler le groupe entier ou des individus selon la posture.

> Cette règle s'applique surtout aux Orques, Gobelins, Wargs en meute. Les créatures uniques (Troll, Dragon) ne se groupent jamais.

---

## Créer un adversaire personnalisé

Pour créer un nouvel ennemi dans le CRUD MJ (`/gm/enemies`), voici les fourchettes indicatives par Niveau d'attribut :

| Niveau | Endurance | Combat | Parade | Dégâts | Haine |
|---|---|---|---|---|---|
| 1–2 (faible) | 8–12 | 2 dés | 12–13 | 3–4 | 1–2 |
| 3–4 (moyen) | 12–20 | 3–4 dés | 13–15 | 5–6 | 3–4 |
| 5–6 (dangereux) | 20–30 | 4–5 dés | 15–17 | 6–8 | 5–7 |
| 7–8 (redoutable) | 30–50 | 5–6 dés | 17–19 | 8–10 | 7–10 |
| 9–10 (légendaire) | 50+ | 6+ dés | 19+ | 10+ | 10+ |

> **Note app** : ces valeurs alimentent la table `combatants` — voir `feature-enemies.md` pour le modèle de données complet.
