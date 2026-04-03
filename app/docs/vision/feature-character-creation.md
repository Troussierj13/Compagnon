# Feature — Création de personnage (wizard)

> Référence principale : [`README.md`](./README.md)
> Fiche personnage : [`feature-characters.md`](./feature-characters.md)
> Système de jeu : [`feature-game-system.md`](./feature-game-system.md)

**Statut** : 🔵 Phase future — non bloquant pour la Phase 2 et 3

---

## Principe général

L'outil de création de personnage guide le MJ (ou le joueur, selon les droits accordés) à travers un **wizard en plusieurs étapes** pour créer un nouveau personnage TOR. Le wizard s'appuie sur les données du système de jeu (`feature-game-system.md`) : cultures, compétences et équipement de départ.

Cette feature est distincte de la fiche personnage (`feature-characters.md`) qui gère l'édition d'un personnage existant. Le wizard produit en sortie un personnage initialisé avec toutes les valeurs de départ correctes.

---

## 1. Déclenchement

Accessible depuis la liste des personnages d'une campagne : `/gm/campaigns/[id]/characters` → bouton "Nouveau personnage".

En phase future, le joueur pourrait également déclencher la création depuis son interface (en attente de validation par le MJ).

---

## 2. Étapes du wizard

### Étape 1 — Informations générales

| Champ | Type | Requis |
|---|---|---|
| Nom du personnage | text | Oui |
| Nom du joueur | text | Oui |
| Vocation | text libre | Oui |
| Âge | number | Oui |
| Qualité de vie | select : miserable / poor / modest / adequate / prosperous / rich | Oui |
| Garant | text libre | Non |
| Particularités | liste de textes libres | Non |
| Défauts | liste de textes libres | Non |
| Portrait | sélecteur Media Library | Non |

### Étape 2 — Choix de la culture

Sélection parmi toutes les cultures disponibles (table `cultures`). Pour chaque culture, afficher :
- Nom et description narrative
- Attributs de départ proposés (Corps / Cœur / Esprit)
- Compétences favorisées initiales
- Compétence de combat initiale
- Aperçu des vertus culturelles disponibles (noms uniquement)

> Les valeurs de départ de la culture sont des **valeurs proposées**, pas imposées. Le MJ peut les ajuster à l'étape suivante.

### Étape 3 — Répartition des attributs

Affichage des valeurs pré-remplies depuis la culture. Le MJ peut les modifier dans les limites des règles TOR.

| Attribut | Valeur initiale | Plage autorisée |
|---|---|---|
| CORPS | issu de la culture | 1–10 |
| CŒUR | issu de la culture | 1–10 |
| ESPRIT | issu de la culture | 1–10 |

Afficher en temps réel les stats dérivées calculées (Endurance max, Espoir max, Parade de base, SR).

### Étape 4 — Compétences initiales

Pré-remplissage depuis la culture :
- Compétences favorisées initiales cochées automatiquement
- Compétence de combat initiale au rang 1

Le MJ peut ajuster les rangs initiaux (points de départ selon les règles de la culture — à définir dans la culture elle-même).

### Étape 5 — Équipement de départ

Sélection depuis le catalogue de la campagne :
- Jusqu'à 4 armes (catalogue `campaign_weapons`)
- Armure, casque, bouclier (catalogue `campaign_armors`)

Affichage du poids total en temps réel (et indicateur d'épuisement si déjà trop lourd).

### Étape 6 — Trésor & inventaire de départ

- Valeur du trésor initial (suggestion basée sur la qualité de vie)
- Ajout optionnel d'objets d'inventaire de départ

### Étape 7 — Récapitulatif & confirmation

Vue d'ensemble de tous les choix effectués. Bouton "Créer le personnage" → génère l'entrée en base avec le JSONB `TORCharacterData` correctement initialisé.

---

## 3. Règles d'initialisation

À la création, les valeurs suivantes sont initialisées automatiquement :

| Champ | Valeur initiale |
|---|---|
| `current_endurance` | = Endurance max (= CORPS avec modifiers) |
| `current_hope` | = Espoir max (= CŒUR avec modifiers) |
| `fatigue` | 0 |
| `shadows` | 0 |
| `sequels` | 0 |
| `adventure_points` | 0 |
| `progression_points` | 0 |
| `community_points` | 0 |
| `sagesse.rank` | 0 |
| `vaillance.rank` | 0 |
| `states` | tout à false, injury null |
| `inventory` | `[]` |

---

## 4. Contraintes techniques

- Le wizard est **uniquement accessible au MJ** (route protégée par middleware `gm`)
- Les données intermédiaires du wizard sont stockées en état local (pas de sauvegarde partielle en base)
- La création est atomique : soit tout est sauvegardé, soit rien
- La culture sélectionnée est stockée comme `culture_id` (FK) — les données dérivées (attributs, compétences favorisées) sont copiées dans le JSONB `data` au moment de la création

---

## 5. Évolutions futures

- Permettre au joueur de démarrer la création de son personnage (soumis à validation MJ)
- Import d'un personnage depuis un fichier JSON (migration legacy)
- Génération aléatoire de personnage (tirage selon les tables de la culture)
