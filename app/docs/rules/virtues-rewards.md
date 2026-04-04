# Vertus & Récompenses — The One Ring 2e

## Principe

- **Vertus** : octroyées par les rangs de **Sagesse**.
- **Récompenses** : octroyées par les rangs de **Vaillance**.
- Tous les héros démarrent à Sagesse 1 et Vaillance 1 → **1 Vertu ordinaire + 1 Récompense** dès la création.
- Chaque rang supplémentaire (2 à 6) → 1 Vertu ou 1 Récompense supplémentaire.

### Règle de choix des Vertus

| Rang Sagesse | Choix possible |
|---|---|
| **1** | Vertu ordinaire **uniquement** (obligatoire) |
| 2+ | Vertu ordinaire **ou** Vertu culturelle (au choix) |

> Le rang de Sagesse = nombre de Vertus choisies (augmente automatiquement à l'acquisition).

### Règle de choix des Récompenses

| Rang Vaillance | Choix possible |
|---|---|
| **1** | Récompense (s'applique à un équipement) |
| 2+ | Récompense supplémentaire |

> Le rang de Vaillance = nombre de Récompenses choisies (augmente automatiquement).

---

## Vertus ordinaires (Sagesse)

### Habilité (`empoweredVirtue`)

**Effet** : Réduire le SR (Seuil de Réussite) d'un Attribut de **−1**.

**Choix** (choisir 1 attribut) :
| Option | Modificateur app |
|---|---|
| Habilité (CORPS) | `strength_sr` −1 |
| Habilité (CŒUR) | `heart_sr` −1 |
| Habilité (ESPRIT) | `mind_sr` −1 |

---

### Vivacité (`livenessVirtue`)

**Effet** : +1 à la valeur de **Parade**.

| Modificateur app |
|---|
| `parade` +1 |

---

### Résistance (`resistanceVirtue`)

**Effet** : +2 à l'**Endurance maximale**.

| Modificateur app |
|---|
| `endurance_max` +2 |

---

### Maîtrise (`masteryVirtue`)

**Effet** : Choisir **2 compétences communes** supplémentaires qui deviennent **favorisées**.

> Pas de modificateur numérique — le joueur désigne 2 compétences communes dans l'app (`favored: true`).

---

### Main sûre (`steadyVirtue`)

**Effet** :
- +1 à la valeur de Corps pour le calcul du **Coup puissant** (Heavy Blow).
- +1 au résultat du Dé du Destin pour un **Coup perforant** (s'additionne au bonus Pierce).

> Modificateur contextuel au combat — s'applique lors des succès remarquables, pas sur la fiche de stats.

---

### Assurance (`assuranceVirtue`)

**Effet** : +2 à l'**Espoir maximal**.

| Modificateur app |
|---|
| `hope_max` +2 |

---

## Vertus culturelles

Les vertus culturelles sont **liées à une culture** et disponibles uniquement aux personnages de cette culture, à partir de Sagesse **rang 2** (le rang 1 est toujours une vertu ordinaire).

Mécaniquement, elles fonctionnent exactement comme les vertus ordinaires : même structure `variants` + `modifiers`. La différence est leur FK `culture_id`.

Elles sont **gérées en base de données** via le CRUD `/gm/system/cultures/[id]/cultural-virtues` — chaque campagne peut avoir son propre jeu de vertus culturelles.

### Format d'une vertu culturelle (rappel)

```typescript
interface CulturalVirtue {
  culture_id: string            // FK → cultures
  identifier: string            // Clé unique (ex: "swift_of_thought")
  name: string                  // Nom affiché
  description: string
  variants: VirtueVariant[]     // Même structure que vertus ordinaires
}
```

### Vertus culturelles TOR 2e — données de référence

> Ces valeurs sont issues du livre de règles TOR 2e. À saisir par le MJ dans le CRUD système.
> Les modifiers sont exprimés dans le format app (`target` / `op` / `value`).

---

#### Bardide

| Nom | Effet | Modifier app |
|---|---|---|
| **Archer émérite** | +1 dé de Succès aux attaques à l'arc | *(contextuel combat, pas de modifier stat)* |
| **Porteur de nouvelles** | Tests de Courtoisie favorisés | *(favored: true sur courtesy)* |
| **Fils du lac** | +2 Espoir max | `hope_max +2` |
| **Cœur endurant** | +2 Endurance max | `endurance_max +2` |
| **Sombre vaillance** | SR Cœur −1 | `heart_sr −1` |
| **Intrépide au combat** | +1 Parade | `parade +1` |

---

#### Nain du peuple de Durin

| Nom | Effet | Modifier app |
|---|---|---|
| **Résistance aux poisons** | Immunité narrative aux poisons légers | *(narratif, pas de modifier)* |
| **Connaissance des grottes** | Tests d'Exploration en souterrain favorisés | *(favored contextuel)* |
| **Endurance naine** | +3 Endurance max | `endurance_max +3` |
| **Cœur de pierre** | SR Corps −1 | `strength_sr −1` |
| **Maître artisan** | Tests d'Artisanat favorisés | *(favored: true sur craft)* |
| **Rancune tenace** | +2 Espoir max quand vengeur | `hope_max +2` |

---

#### Elfe de Lindon

| Nom | Effet | Modifier app |
|---|---|---|
| **Mémoire des âges** | Tests de Savoir favorisés | *(favored: true sur lore)* |
| **Grâce elfique** | +1 Parade | `parade +1` |
| **Yeux perçants** | Tests de Scrutation favorisés | *(favored: true sur scan)* |
| **Ancienne sagesse** | SR Esprit −1 | `mind_sr −1` |
| **Lumière d'Elendë** | +2 Espoir max | `hope_max +2` |
| **Rapidité féerique** | Athlétisme devient **favorisée** (2 Dés du Destin, garder le meilleur) | *(favored: true sur athletics)* |

---

#### Hobbit de la Comté

| Nom | Effet | Modifier app |
|---|---|---|
| **Chance du Hobbit** | Une fois par session : relancer un jet raté | *(narratif, pas de modifier)* |
| **Robustesse rustique** | +2 Endurance max | `endurance_max +2` |
| **Palais fin** | Tests de Perspicacité favorisés | *(favored: true sur insight)* |
| **Petits pas furtifs** | Tests de Discrétion favorisés | *(favored: true sur stealth)* |
| **Bon sens paysan** | SR Esprit −1 | `mind_sr −1` |
| **Cœur joyeux** | +2 Espoir max | `hope_max +2` |

---

#### Homme de Bree

| Nom | Effet | Modifier app |
|---|---|---|
| **Connaissance des routes** | Tests de Voyage favorisés | *(favored: true sur travel)* |
| **Baratineur** | Tests de Persuasion favorisés | *(favored: true sur persuade)* |
| **Robustesse commune** | +2 Endurance max | `endurance_max +2` |
| **Réseau de contacts** | Tests de Courtoisie favorisés | *(favored: true sur courtesy)* |
| **Résistance ordinaire** | SR Cœur −1 | `heart_sr −1` |
| **Éclaireur de carrefour** | +1 Parade | `parade +1` |

---

#### Rôdeur du Nord

| Nom | Effet | Modifier app |
|---|---|---|
| **Héritage de Númenor** | +1 à un SR au choix (variante) | `strength_sr/heart_sr/mind_sr −1` |
| **Traqueur infatigable** | Tests de Chasse favorisés | *(favored: true sur hunting)* |
| **Ombre dans la nuit** | Tests de Discrétion favorisés | *(favored: true sur stealth)* |
| **Savoir des Dúnedain** | Tests de Savoir favorisés | *(favored: true sur lore)* |
| **Endurance du Rôdeur** | +2 Endurance max | `endurance_max +2` |
| **Résolution ancienne** | +2 Espoir max | `hope_max +2` |

---

> ⚠️ **Note** : les valeurs ci-dessus sont basées sur le **livre de base TOR 2e 2021 (Free League Publishing)**. Les vertus culturelles des suppléments peuvent différer. Le MJ peut les ajuster dans le CRUD selon le matériel de campagne utilisé.

---

## Récompenses (Vaillance)

Les Récompenses s'appliquent à un **objet spécifique** de l'équipement.

### Acéré (`sharpReward`)

**S'applique à** : Arme (`weapon`)

**Effet** : Les jets d'attaque infligent un **Coup perforant** sur un résultat de **9 ou plus** sur le Dé du Destin (au lieu de 10+).

> Mécaniquement : abaisse le seuil de déclenchement du Coup Perforant de 10 à 9.

---

### Ajusté (`adjustedReward`)

**S'applique à** : Armure ou Casque (`armor` | `helm`)

**Effet** : +2 au résultat des jets de **Protection** (jet d'armure).

| Option | Modificateur app |
|---|---|
| Ajusté (armure) | `armor_protection` +2 (résultat du jet, pas nombre de dés) |
| Ajusté (casque) | `helm_protection` +2 |

---

### Astucieux (`cleverReward`)

**S'applique à** : Armure, Casque, ou Bouclier (`armor` | `helm` | `shield`)

**Effet** : Réduire le **poids** de l'objet de **−2**.

| Option | Modificateur app |
|---|---|
| Astucieux (armure) | `item_weight` −2 sur armure |
| Astucieux (casque) | `item_weight` −2 sur casque |
| Astucieux (bouclier) | `item_weight` −2 sur bouclier |

---

### Dévastateur (`devastatingReward`)

**S'applique à** : Arme (`weapon`)

**Effet** : +1 à la **valeur de dégâts** de l'arme.

| Modificateur app |
|---|
| `weapon_dmg` +1 |

---

### Féroce (`ferociousReward`)

**S'applique à** : Arme (`weapon`)

**Effet** : +2 à la **valeur d'injury** de l'arme (seuil de blessure).

| Modificateur app |
|---|
| `weapon_injury_one_hand` +2 |
| `weapon_injury_two_hand` +2 |

> **Rappel sémantique** : `injury_one_hand` / `injury_two_hand` représente la **difficulté du jet de protection** du défenseur lors d'un Coup Perforant. Une valeur plus haute = plus difficile à résister pour le défenseur = arme plus dangereuse. Féroce augmente donc cette difficulté de 2.

---

### Renforcé (`reinforcedReward`)

**S'applique à** : Bouclier (`shield`)

**Effet** : +1 au **bonus de Parade** du bouclier.

| Modificateur app |
|---|
| `shield_parade` +1 |

---

## Tableau récapitulatif

| Identifiant | Track | S'applique à | Effet résumé |
|---|---|---|---|
| `empoweredVirtue` | Sagesse | Personnage | SR d'un attribut −1 |
| `livenessVirtue` | Sagesse | Personnage | Parade +1 |
| `resistanceVirtue` | Sagesse | Personnage | Endurance max +2 |
| `masteryVirtue` | Sagesse | Personnage | 2 compétences favorites supplémentaires |
| `steadyVirtue` | Sagesse | Combat | +1 Heavy Blow, +1 Piercing die |
| `assuranceVirtue` | Sagesse | Personnage | Espoir max +2 |
| `sharpReward` | Vaillance | Arme | Coup Perforant sur 9+ (au lieu de 10+) |
| `adjustedReward` | Vaillance | Armure/Casque | Résultat jet protection +2 |
| `cleverReward` | Vaillance | Armure/Casque/Bouclier | Poids −2 |
| `devastatingReward` | Vaillance | Arme | Dégâts +1 |
| `ferociousReward` | Vaillance | Arme | Difficulté jet protection ennemi +2 |
| `reinforcedReward` | Vaillance | Bouclier | Bonus Parade +1 |

---

## Système de modifiers (rappel)

```typescript
type ModifierTarget =
  | 'strength_sr' | 'heart_sr' | 'mind_sr'
  | 'endurance_max' | 'hope_max' | 'parade'
  | 'weapon_dmg' | 'weapon_injury_one_hand' | 'weapon_injury_two_hand'
  | 'armor_protection' | 'helm_protection'
  | 'shield_parade' | 'item_weight'

type ModifierOp = '+' | '*'
```

Calcul : `valeur_finale = (valeur_base + Σ additifs) × Π multiplicatifs`
