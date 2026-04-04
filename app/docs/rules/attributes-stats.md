# Attributs & Stats dérivées — The One Ring 2e

## Les 3 attributs primaires

| Attribut | Clé app | Description mécanique |
|---|---|---|
| **Corps** (Strength) | `strength` | Force physique, endurance brute, vigueur au combat |
| **Cœur** (Heart) | `heart` | Courage, volonté, résistance morale |
| **Esprit** (Wits/Mind) | `mind` | Vigilance, intelligence, perception |

- Valeur typique : **1 à 9** selon la culture.
- Valeur max par défaut à la création : **14** (somme des 3 attributs ≤ 14 pour la plupart des cultures).

---

## Seuil de Réussite (SR)

Le SR (Success Rating / Seuil de Réussite) est la difficulté des jets basés sur cet attribut.

```
SR = 20 − valeur de l'attribut
```

| Corps | SR Corps | Cœur | SR Cœur | Esprit | SR Esprit |
|---|---|---|---|---|---|
| 2 | 18 | 2 | 18 | 2 | 18 |
| 4 | 16 | 4 | 16 | 4 | 16 |
| 5 | 15 | 5 | 15 | 5 | 15 |
| 6 | 14 | 6 | 14 | 6 | 14 |
| 7 | 13 | 7 | 13 | 7 | 13 |

> **Note app** : le SR est calculé automatiquement. Les vertus/modificateurs peuvent réduire le SR d'un attribut de 1 point (ex. Vertu "Habilité").

---

## Stats dérivées

### Endurance

- Représente les **points de vie** et la capacité à porter du poids.
- **Formule** : `Corps + bonus culture`
- Plafond = valeur max (Endurance max).
- L'Endurance courante diminue sous les coups et la Fatigue.

| Condition | Seuil |
|---|---|
| **Épuisé** | Endurance courante < Charge totale (Load + Fatigue) |
| **Inconscient** | Endurance courante = 0 |

### Espoir

- Représente la résistance morale, la volonté de continuer.
- **Formule** : `Cœur + bonus culture`
- Peut être **dépensé** pour ajouter un Dé de Succès supplémentaire à n'importe quel jet (1 point = 1 dé).
- L'Espoir diminue avec le Shadow (Ombre) et certains événements.

| Condition | Seuil |
|---|---|
| **Mélancolique** | Espoir courant **<** Ombre accumulée (strictement inférieur) |

> Quand Mélancolique : l'Œil de Sauron sur le Dé du Destin = échec automatique.

### Parade

- Difficulté que les ennemis doivent atteindre pour toucher le héros.
- **Formule** : `Esprit + bonus culture`
- Modifiable par : bouclier (bonus Parade), posture défensive, certaines vertus.

---

## Traits Distinctifs (Distinctive Features / Particularités)

Les Traits Distinctifs sont les **Particularités** du personnage, choisies à la création depuis la liste de sa culture (2 au choix).

Ce sont des adjectifs narratifs (ex. *Courageux*, *Secret*, *Loyal*) qui définissent la personnalité du héros.

### Mécanique — état Inspiré

Quand un personnage **invoque un de ses Traits Distinctifs** pour justifier une action, il devient **Inspiré** pour ce jet :

| Dépense | Sans Inspiré | Avec Inspiré |
|---|---|---|
| 1 point d'Espoir | +1 Dé de Succès | **+2 Dés de Succès** |

> Un personnage peut dépenser plusieurs points d'Espoir sur un même jet (chaque point = 1 dé, ou 2 dés si Inspiré).
> **Inspiré ne s'applique qu'une fois par jet** (dépenser plus de 1 Espoir sur un jet Inspiré donne 2 dés pour le 1er point, puis 1 dé par point supplémentaire).

> **Note app** : l'app ne gère pas les jets de dés — mais comprendre cette règle explique pourquoi `current_hope` peut diminuer de plusieurs points d'un coup pendant un combat.

---

## Ombre (Shadow)

- Points d'ombre accumulés au fil des aventures.
- Sources : actes contraires à l'éthique, exposition aux créatures de l'Ombre, échecs dramatiques.
- **Comparaison** : si Ombre > Espoir courant → personnage devient **Mélancolique** (voir `conditions.md`).
- Réduite pendant la phase de Communauté (Fellowship Phase).

---

## Blessures (Wounds)

- Un personnage peut recevoir **2 Blessures** au maximum.
- Une Blessure est infligée lors d'un **Coup Perforant** (voir `combat.md`).
- **Effets d'une Blessure** :
  - Pénalités aux jets (selon gravité déterminée par le Dé du Destin au moment de la blessure).
  - Si 2 blessures + Endurance à 0 → personnage en danger de mort.
- Guérison : repos, soins (compétence Guérison), phase de Communauté.

---

## Séquelles (Sequels)

- Trauma cumulatif persistant.
- Persistent après guérison d'une Blessure dans certains cas.
- Stockées sur la fiche, pas automatiquement calculées.

---

## Fatigue

- Accumulée lors des **voyages** (Journey rules).
- S'ajoute à la Charge (Load) pour calculer l'état Épuisé.
- Réinitialisée à la fin d'un voyage ou après repos.

---

## Charge (Load)

- Total du poids de l'équipement porté (armes + armure + casque + bouclier + objets de voyage).
- Chaque pièce d'équipement a une valeur de **poids** (Load).
- **Règle nain (Infatigable)** : les Nains du peuple de Durin divisent par 2 le poids de leur **armure et casque** (bouclier non concerné), arrondi **au supérieur**.

```
Charge totale = somme des poids équipés + Fatigue voyage
Épuisé si : Endurance courante < Charge totale
```
