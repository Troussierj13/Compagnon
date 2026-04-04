# Progression — The One Ring 2e

## Deux types de points d'expérience

| Type | Clé app | Utilisé pour | Gain typique |
|---|---|---|---|
| **Points de Progression** (`progression_points`) | Monter les compétences communes **et de combat** | 3/session + bonus Yule |
| **Points d'Aventure** (`adventure_points`) | Monter les rangs de Sagesse et Vaillance **uniquement** | 3/session + bonus événements |

> Les deux types sont gagnés séparément et dépensés séparément.

---

## Barème universel (compétences + Sagesse/Vaillance)

Un seul barème s'applique à tout : compétences communes, compétences de combat, Sagesse, Vaillance.

| Passage de rang | Coût en points |
|---|---|
| 0 → 1 | **4 pts** |
| 1 → 2 | **8 pts** |
| 2 → 3 | **12 pts** |
| 3 → 4 | **20 pts** |
| 4 → 5 | **26 pts** |
| 5 → 6 | **30 pts** |

> Exemple : passer une compétence de rang 2 à rang 4 coûte 12 + 20 = **32 points de Progression**.
> Exemple : monter Sagesse de rang 1 à rang 3 coûte 8 + 12 = **20 points d'Aventure**.

---

## Points de Progression — dépenses

- Monter une **compétence commune** (rang 0–6)
- Monter une **compétence de combat** (rang 0–6)

Coût = barème universel ci-dessus.

---

## Points d'Aventure — dépenses

- Monter le rang de **Sagesse** (→ octroie une Vertu)
- Monter le rang de **Vaillance** (→ octroie une Récompense)

Coût = barème universel ci-dessus.

> **Limite** : on ne peut monter qu'**un rang** en Sagesse **ou** Vaillance par phase de Communauté (pas les deux).

### Autres dépenses PA

- **Élever un héritier** : coût variable (règle optionnelle narrative).

---

## Sagesse (Wisdom)

- Rang de **1 à 6**.
- Le rang = nombre de Vertus choisies (il augmente automatiquement à chaque acquisition d'une Vertu).
- **Rang 1 = 1 Vertu ordinaire** dès la création du personnage.
- À partir du **rang 2** : Vertu ordinaire **ou** Vertu culturelle au choix.
- Résistance à la corruption, jets d'Ombre liés à la Sagesse.

---

## Vaillance (Valour)

- Rang de **1 à 6**.
- Le rang = nombre de Récompenses choisies (il augmente automatiquement à chaque acquisition d'une Récompense).
- **Rang 1 = 1 Récompense** dès la création du personnage.
- À partir du **rang 2** : Récompense supplémentaire à chaque rang.
- Jets de résistance à la peur liés à la Vaillance.

---

## Phase de Communauté (Fellowship Phase)

La phase entre les aventures où les personnages se reposent et progressent.

### Actions disponibles

| Action | Ressource dépensée | Effet |
|---|---|---|
| Monter des compétences communes | Points de Progression | +rang(s) au barème universel |
| Monter des compétences de combat | Points de Progression | +rang(s) au barème universel |
| Monter Sagesse | Points d'Aventure | +1 rang, +1 Vertu |
| Monter Vaillance | Points d'Aventure | +1 rang, +1 Récompense |
| Réduire l'Ombre | Fellowship Points | Diminue la Shadow accumulée |
| Se soigner | Repos + jet Guérison | Lève les Blessures |
| Récupérer l'Espoir | Activité de repos | Regagne des points d'Espoir |

> **Limite Sagesse/Vaillance** : maximum 1 rang en Sagesse OU 1 rang en Vaillance par phase (pas les deux dans la même phase).

---

## Fellowship Points (Points de Communauté)

- Gagnés collectivement par le groupe pendant l'aventure.
- **Dépensables pendant l'aventure** (pas seulement en phase de Communauté) pour regagner de l'Espoir.
- Aussi dépensés en phase de Communauté pour des actions d'équipe (renforcer une communauté alliée, etc.).
- Clé app : `community_points`.
- Pas de mécanique de calcul automatique — compteur simple géré par le MJ.

> **Règle Homme de Bree** : chaque Homme de Bree dans la Compagnie augmente la réserve de Fellowship Points de 1 (avantage culturel "Originaire de Bree").
