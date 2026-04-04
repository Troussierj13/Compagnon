# Phase de Communauté (Fellowship Phase) — The One Ring 2e

## Principe

La Phase de Communauté est la période de **repos et de récupération** entre les aventures. Elle représente les héros rentrant dans un lieu sûr, se reposant, progressant et se préparant pour leur prochaine aventure.

> Elle se déroule généralement dans un **Havre** (lieu sanctifié allié : Dale, la Comté, Fondcombe…) ou dans un établissement ordinaire.

---

## Structure de la Phase de Communauté

Chaque personnage effectue ses actions **individuellement**. Le groupe partage les Fellowship Points.

### 1. Récupération automatique

À l'entrée en Phase de Communauté, tous les personnages récupèrent automatiquement :
- **Endurance courante** → réinitialisée à l'Endurance maximale.
- **Fatigue de voyage** → réinitialisée à 0.
- **Espoir courant** → voir règle ci-dessous.

### 2. Récupération de l'Espoir

La récupération d'Espoir **n'est pas automatique** — elle dépend du lieu et des activités.

| Situation | Espoir récupéré |
|---|---|
| Repos dans un lieu ordinaire (auberge, village) | Jusqu'à **Cœur** points |
| Repos dans un Havre (lieu sanctifié) | Jusqu'à **Cœur + bonus du Havre** points |
| Yule (grande fête annuelle) | Réinitialisation totale à l'Espoir maximum |
| Rôdeur du Nord (Allégeance des Dúnedain) | Max ⌈Cœur ÷ 2⌉ (hors Yule) |
| Elfe de Lindon (La Longue Défaite) | Espoir récupéré normalement — mais Ombre max **1 point réduit** |

> L'Espoir ne peut jamais dépasser l'**Espoir maximum** du personnage.

---

## Actions disponibles

Chaque personnage choisit ses actions parmi la liste ci-dessous. Certaines nécessitent une ressource (Points de Progression, Points d'Aventure, Fellowship Points).

### Progression (Points de Progression)

| Action | Coût | Effet |
|---|---|---|
| Monter une compétence commune | PP (barème universel) | +1 rang (max 6) |
| Monter une compétence de combat | PP (barème universel) | +1 rang (max 6) |

### Croissance personnelle (Points d'Aventure)

| Action | Coût | Effet | Limite |
|---|---|---|---|
| Monter Sagesse | PA (barème universel) | +1 rang, +1 Vertu | 1 rang max par phase |
| Monter Vaillance | PA (barème universel) | +1 rang, +1 Récompense | 1 rang max par phase (pas les deux en même phase) |

> On ne peut pas monter **à la fois** Sagesse et Vaillance lors de la même Phase de Communauté.

### Guérison & Rétablissement

| Action | Ressource | Effet |
|---|---|---|
| Se soigner d'une Blessure | Repos + jet Guérison TN 14 | Lève l'état Blessé si succès |
| Traiter une Séquelle | Soins spéciaux (lieu adapté ou guérisseur) | Réduit le compteur `sequels` de 1 |

> En cas d'échec au jet de Guérison, la Blessure persiste et peut évoluer en Séquelle.

### Réduction de l'Ombre

| Action | Ressource | Effet |
|---|---|---|
| Repos et méditation | Activité dédiée (1 action) | Réduit l'Ombre jusqu'à la valeur de **Sagesse** du personnage |
| Soutien communautaire | Fellowship Points | Bonus supplémentaire à la réduction d'Ombre |
| Patronage / lieu sanctifié | (narratif) | Réduction bonifiée selon le Havre |

### Activités de groupe (Fellowship Points)

| Action | Coût FP | Effet |
|---|---|---|
| Renforcer un Havre | 1–3 FP | Améliore les bonus du Havre pour les futures phases |
| Regagner de l'Espoir (pendant l'aventure) | 1 FP | +1 Espoir à un personnage (utilisable hors Phase de Communauté aussi) |
| Action collective narrative | Variable | Soutien à une communauté alliée, recrutement, etc. |

---

## Yule (Fête Annuelle)

La **Yule** est la grande célébration annuelle (fin d'année, saison hivernale).

- Tous les personnages réinitialisent leur **Espoir** à la valeur maximum.
- Tous les personnages réinitialisent leur **Ombre** à 0 (sauf exceptions narratives majeures).
- La limite de montée en Sagesse/Vaillance reste la même (1 rang par phase).
- L'exception Rôdeur du Nord (**Allégeance des Dúnedain**) ne s'applique **pas** à Yule — ils récupèrent pleinement.

---

## Restrictions par culture

| Culture | Restriction |
|---|---|
| Rôdeur du Nord | Récupération Espoir max = ⌈Cœur ÷ 2⌉ (hors Yule) |
| Elfe de Lindon | Réduction Ombre max = **1 point** par phase (hors Yule) |
| Autres cultures | Aucune restriction particulière |

---

## Havre (Sanctuaire)

Un Havre est un lieu allié reconnu (Dale, la Comté, les Mines de la Moria reconquise, Fondcombe…).

- Les héros qui y passent leur Phase de Communauté bénéficient de **bonus de récupération**.
- Certains Havres peuvent être **améliorés** avec des Fellowship Points (actions collectives).
- Le MJ définit les bonus de chaque Havre dans sa campagne.

---

## Tableau récapitulatif

| Récupération | Automatique | Condition |
|---|---|---|
| Endurance max | ✅ | Toujours |
| Fatigue voyage = 0 | ✅ | Toujours |
| Espoir (partiel) | Via activité | Selon lieu + culture |
| Espoir (total — Yule) | Via Yule | 1 fois par an |
| Ombre réduite | Via activité | Selon Sagesse + lieu |
| Blessure levée | Via jet Guérison | Succès TN 14 requis |

> **Note app** : la Phase de Communauté n'est pas automatisée dans l'app. Le MJ gère les dépenses de PP/PA et les modifications de stats manuellement via l'interface de gestion du personnage. `community_points` est le compteur de Fellowship Points partagés.
