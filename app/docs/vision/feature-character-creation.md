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

Afficher en temps réel les stats dérivées calculées en appliquant les bonus de la culture sélectionnée :
- **Endurance max** = `CORPS + culture.endurance_bonus`
- **Espoir max** = `CŒUR + culture.hope_bonus`
- **Parade de base** = `ESPRIT + culture.parade_bonus`
- **SR** = `20 − attribut`

### Étape 4 — Compétences initiales

Pré-remplissage depuis la culture sélectionnée :

**Compétences communes** : les 18 compétences affichées avec leurs rangs de départ issus de `culture.starting_attributes`. Les 2 compétences favorisées de la culture (`starting_favored_skills`) sont cochées automatiquement.

**Compétences de combat** : chaque culture donne rang 2 à une compétence de combat au choix, et rang 1 aux autres. La config est lue depuis `culture.starting_combat_skills`.

Exemple pour les Bardides (`{ "bows": 2, "axes": 1, "spears": 1, "swords": 1 }`) :
- Afficher un sélecteur : "Compétence de combat au rang 2 : [Arcs ▼] ou [Épées ▼]"
- Les autres compétences sont pré-remplies au rang défini dans `starting_combat_skills` (lecture seule)

> Le MJ peut ajuster les rangs initiaux si les règles de la culture l'autorisent.

### Étape 5 — Équipement de départ

Sélection depuis le catalogue de la campagne :
- Jusqu'à 4 armes (catalogue `campaign_weapons`)
- Armure, casque, bouclier (catalogue `campaign_armors`)

Affichage du poids total en temps réel (et indicateur d'épuisement si déjà trop lourd).

### Étape 6 — Trésor & inventaire de départ

- Valeur du trésor initial (suggestion basée sur la qualité de vie)
- Ajout optionnel d'objets d'inventaire de départ

### Étape 7 — Vertus, Récompenses & confirmation

Tous les personnages démarrent à **Sagesse rang 1** et **Vaillance rang 1**. Cette étape permet de choisir les éléments de départ obligatoires avant la création.

**Vertu initiale (Sagesse rang 1)** — obligatoire, vertu ordinaire uniquement :
- Sélecteur parmi les vertus ordinaires disponibles
- Si la vertu choisie a plusieurs variantes, proposer le choix de variante
- Résultat : `sagesse.rank = 1`, `sagesse.virtues = [{ virtue_id, chosen_variant, is_cultural: false, rank_acquired: 1 }]`

**Récompense initiale (Vaillance rang 1)** — obligatoire :
- Sélecteur parmi les récompenses disponibles
- Choix de la cible (arme / armure / casque / bouclier selon `valid_targets` de la récompense)
- Résultat : `vaillance.rank = 1`, `vaillance.rewards = [{ reward_id, apply_to }]`

**Récapitulatif** : vue d'ensemble de tous les choix effectués (attributs, compétences, équipement, vertu, récompense). Bouton "Créer le personnage" → génère l'entrée en base avec le JSONB `TORCharacterData` correctement initialisé.

---

## 3. Règles d'initialisation

À la création, les valeurs suivantes sont initialisées automatiquement :

| Champ | Valeur initiale |
|---|---|
| `current_endurance` | = Endurance max (= `CORPS + culture.endurance_bonus`) |
| `current_hope` | = Espoir max (= `CŒUR + culture.hope_bonus`) |
| `fatigue` | 0 |
| `shadows` | 0 |
| `sequels` | 0 |
| `adventure_points` | 0 |
| `progression_points` | 0 |
| `community_points` | 0 |
| `sagesse.rank` | **1** (vertu ordinaire choisie à l'étape 7) |
| `vaillance.rank` | **1** (récompense choisie à l'étape 7) |
| `states` | tout à false, injury null |
| `inventory` | `[]` |

> Selon les règles TOR 2e, tout personnage commence avec Sagesse 1 + 1 Vertu ordinaire, et Vaillance 1 + 1 Récompense. `sagesse.rank = 0` et `vaillance.rank = 0` sont des états invalides.

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
