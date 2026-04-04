# États & Conditions — The One Ring 2e

Les conditions sont des états mécaniques qui affectent le personnage.
Certains sont **automatiques** (calculés à partir des stats), d'autres sont **manuels** (posés par le MJ ou le joueur).

---

## États automatiques (calculés par l'app)

### Épuisé (Exhausted / Weary)

- **Déclencheur** : Endurance courante < Charge totale (strictement inférieur)
  ```
  Charge totale = poids équipement + Fatigue voyage
  Épuisé si : current_endurance < poids_total + fatigue
  ```
- **Effet mécanique** : les résultats **1, 2, 3** sur les Dés de Succès **ne comptent pas** (traités comme 0 pour la somme).
- Cela rend les succès beaucoup plus difficiles à obtenir.
- Se lève en réduisant la charge ou en récupérant de l'Endurance.

---

### Mélancolique (Miserable)

- **Déclencheur** : Espoir courant **strictement inférieur** à l'Ombre accumulée
  ```
  Mélancolique si : current_hope < shadows
  ```
- **Effet mécanique** : l'Œil de Sauron sur le Dé du Destin est un **échec automatique** (le jet entier échoue, quel que soit le total des Dés de Succès).
- Se lève en réduisant l'Ombre (phase de Communauté) ou en récupérant de l'Espoir.

#### Bout de Folie (Bout of Madness)

Quand un personnage **Mélancolique** obtient l'Œil de Sauron sur un **jet de résistance à l'Ombre** (jet d'Ombre, confrontation morale, tentation), cela peut déclencher un **Bout de Folie** :
- L'Espoir **maximum** est réduit de **1** (permanent jusqu'à guérison spéciale).
- Le personnage gagne un **Défaut** supplémentaire lié à son chemin de l'Ombre / Vocation (ex : Cupidité, Orgueil, Désespoir…).
- Le Bout de Folie ne se déclenche **pas** sur n'importe quel jet — uniquement lors de jets directement liés à l'Ombre ou à un choix moral difficile.

> **Note app** : le Bout de Folie est une décision narrative du MJ. L'app ne le déclenche pas automatiquement — `hope_max` se modifie manuellement via les modifiers, et le nouveau Défaut se note dans les champs texte de la fiche.

---

## États manuels (posés par le MJ ou le joueur)

### Blessé (Hurt / Wounded)

- **Déclencheur** : Coup Perforant réussi (voir `combat.md`).
- **Toggle manuel** `hurt: boolean` sur la fiche.
- **Durée** : stockée dans `injury.value + injury.unit` (heures ou jours).
- **Effet mécanique** : pénalités aux jets selon la gravité de la blessure.

> Un seul état `hurt` est modélisé dans la structure de données. Deux blessures simultanées peuvent être représentées en modifiant les notes de durée.

---

### Mort / Inconscient

- **Déclencheur** : Endurance courante = 0.
- **Inconscient** : le personnage tombe, reprend connaissance avec **1 Endurance** après ~1 heure.
- **Mort** : si le personnage est déjà Blessé ET tombe à 0 Endurance → en danger de mort (décision narrative du MJ).

---

## Tableau récapitulatif

| État | Type | Déclencheur | Effet mécanique principal |
|---|---|---|---|
| **Épuisé** | Automatique | `current_endurance < poids_total + fatigue` | Dés de Succès 1–3 ignorés |
| **Mélancolique** | Automatique | `current_hope < shadows` | Œil de Sauron = échec auto |
| **Blessé** | Manuel | Coup Perforant | Pénalités aux jets + durée |
| **Inconscient** | Automatique | Endurance = 0 | Hors combat, récup 1h |

---

## Récupération

| État | Récupération |
|---|---|
| Épuisé | Réduire la charge ou regagner de l'Endurance (repos, Guérison) |
| Mélancolique | Phase de Communauté (réduire l'Ombre), Fellowship Points |
| Blessé | Soins (jet Guérison), repos long, phase de Communauté |
| Inconscient | Automatique après ~1 heure |

---

## Séquelles (Sequels)

Les Séquelles (`sequels`) sont des traumatismes cumulatifs persistants, plus graves que les Blessures ordinaires.

### Quand une Séquelle se déclenche

- Quand une Blessure n'est **pas soignée correctement** (repos insuffisant, jet de Guérison raté).
- Quand un personnage tombe à **0 Endurance tout en étant déjà Blessé** : la blessure laisse une Séquelle.
- Décision narrative du MJ dans certains cas extrêmes.

### Effets mécaniques

- Les Séquelles s'accumulent (`sequels: number`).
- Chaque Séquelle représente un handicap permanent (cicatrice, traumatisme, membre affaibli).
- Elles **ne disparaissent pas** avec la Phase de Communauté ordinaire.
- Nécessitent des soins spéciaux ou des règles narratives de guérison longue durée.

### Différence Blessure vs Séquelle

| Critère | Blessure (`hurt`) | Séquelle (`sequels`) |
|---|---|---|
| Durée | Temporaire (heures/jours) | Permanente |
| Structure | Toggle + durée | Compteur cumulatif |
| Guérison | Repos + jet Guérison | Soins spéciaux / narratif MJ |
| Effet | Pénalités aux jets | Handicap permanent |

> **Note app** : `sequels` est un compteur entier sur la fiche. Son effet sur les jets n'est pas automatisé — le MJ applique les pénalités manuellement selon la sévérité.

---

## Ombre (Shadow) — accumulation

L'Ombre (`shadows`) augmente via :
- Actes mauvais ou moralement discutables.
- Exposition prolongée aux créatures de l'Ombre.
- Certains échecs critiques (Œil de Sauron dans des contextes corrompus).

L'Ombre diminue via :
- Phase de Communauté (activité spécifique dédiée à la guérison de l'Ombre).
- **Exception Elfe de Lindon** (La Longue Défaite) : ne peut récupérer qu'**1 point d'Ombre** maximum par phase de Communauté.

> **Note app** : `shadows` est un champ numérique sur le personnage. L'état Mélancolique est calculé automatiquement : `melancholic = current_hope < shadows`.

---

## Inspiré (Inspired)

Quand un personnage **invoque un de ses Traits Distinctifs** (Particularités) pour justifier une action :
- Il devient **Inspiré** pour ce jet.
- Dépenser **1 point d'Espoir** donne **2 Dés de Succès** supplémentaires (au lieu de 1 normalement).

> **Note app** : l'état Inspiré est déclaré par le joueur lors d'un jet. L'app n'automatise pas les jets, mais la règle de dépense d'Espoir (1 pt = 1 dé, ou 2 dés si Inspiré) est importante pour comprendre pourquoi `current_hope` diminue.
