# Feature — Voyage (`feature-journey.md`)

> Référence règles : [`app/docs/rules/journey.md`](../rules/journey.md)
> Affichage TV mode Voyage : [`feature-display-tv.md`](./feature-display-tv.md) — section "3. Voyage"
> Vision globale : [`README.md`](./README.md)

---

## Principe général

La feature Voyage couvre l'expérience de déplacement entre les lieux dans une campagne TOR. Elle touche quatre surfaces :

1. **Système de jeu (back-office global)** — configuration des cartes hex et des types de terrain, réutilisables entre campagnes
2. **Préparation de scène** — sélection de la carte, placement du marqueur de départ
3. **Panneau session MJ** — gestion du voyage en live (chemin, rôles, étapes, résolution des événements)
4. **TV** — grille hex avec marqueur de groupe, trail du chemin, titre de scène avec dates
5. **Téléphone joueur** — onglet "Voyage" : rôle, fatigue accumulée, événements résolus

Les joueurs lancent leurs dés physiquement. L'app enregistre les résultats, calcule les étapes et applique les conséquences mécaniques directement sur les fiches.

---

## Flux de jeu

```
1. [Back-office] MJ configure une carte hex dans le système de jeu global
   → Définit les hexagones et leurs types de terrain

2. [Préparation de scène] MJ crée une scène de type "Voyage"
   → Sélectionne la carte à utiliser
   → La position de départ est héritée de la dernière scène voyage (ou placée manuellement si 1re fois)

3. [En session] MJ démarre la scène voyage
   → Assigne les rôles aux personnages (Guide, Éclaireur, Gardien, Pourvoyeur)
   → Les PJ (ou le MJ avec eux) cliquent la destination sur la grille
   → L'app calcule le chemin le plus court (minimum de jours)
   → Le MJ / les PJ peuvent modifier le chemin hex par hex
   → L'app affiche : total de jours · nombre d'étapes · date d'arrivée estimée

4. [Étape 1 — jours 1 à 7] L'app avance le marqueur sur la carte jusqu'au hex atteint à j7
   → Les joueurs lancent leurs dés physiquement
   → Le MJ saisit les résultats dans le panneau (total + résultat dé-destin)
   → Si Œil de Sauron → sélection de l'événement dans la table → conséquences appliquées en 1 clic
   → L'événement s'ajoute au journal du voyage

5. [Étapes suivantes] Répétition jusqu'à la dernière étape
   → Si un événement "Perdus" ajoute des jours et fait dépasser un multiple de 7 :
     une étape supplémentaire est créée automatiquement

6. [Arrivée] La scène se termine
   → Position courante mémorisée pour le prochain voyage
   → Date dans l'univers mise à jour
```

---

## Calcul des étapes

- **1 étape = 7 jours de voyage**
- Le nombre d'étapes est calculé au départ : `ceil(total_days / 7)` (minimum 1)
- L'événement **"Perdus"** peut ajouter des jours en cours de route :
  - Les jours ajoutés sont intégrés au `total_days`
  - Si le nouveau `total_days` dépasse le prochain multiple de 7, une nouvelle étape est créée
  - La date d'arrivée estimée est recalculée immédiatement

**Exemple :**
```
Trajet initial : 17 jours → 3 étapes (j1–j7, j8–j14, j15–j17)
Étape 2 : événement "Perdus" +5 jours → nouveau total : 22 jours
→ ceil(22/7) = 4 étapes → étape 4 créée (j18–j22)
→ Date d'arrivée estimée décalée de 5 jours
```

---

## Terrain et coûts

Les types de terrain et leurs valeurs par défaut (modifiables par le MJ hex par hex) :

| Terrain | Jours/hex | Niveau de risque |
|---|---|---|
| Route | 1 | Standard |
| Plaine | 1 | Standard |
| Collines | 2 | Standard |
| Forêt légère | 2 | Standard |
| Forêt dense | 3 | Risqué |
| Marécage | 3 | Risqué |
| Montagne | 4 | Insensé |
| Montagnes hostiles | 5 | Insensé |

Le **chemin le plus court** est celui qui minimise le total de jours (pas le nombre de hexes).

---

## Table des événements de voyage (TOR 2e)

Déclenchés par un résultat **Œil de Sauron** sur le dé-destin lors d'un jet de rôle.
Le MJ choisit ou tire au sort parmi les événements applicables au niveau de risque de l'étape.

| # | Événement | Conséquence mécanique | Scope |
|---|---|---|---|
| 1 | **Maladie** (Ill Health) | +X Fatigue | Individuel (personnage qui a roulé l'Œil) |
| 2 | **Mésaventure** (Mishap) | Équipement endommagé — note RP, pas de stat modifiée | Individuel |
| 3 | **Mauvais Temps** (Foul Weather) | +1 Fatigue | Toute la compagnie |
| 4 | **L'Ombre s'étend** (Shadow Fell) | +1 Ombre | Individuel |
| 5 | **Rencontre hostile** (Encounter) | Scène RP / combat MJ — aucune stat modifiée par l'app | Compagnie |
| 6 | **Perdus** (Loss of the Way) | +X jours au trajet (recalcul étapes + date) | Compagnie |

> La valeur X pour Fatigue et jours ajoutés est saisie librement par le MJ au moment de la résolution.
> Pour "Rencontre hostile", l'app crée une note dans le journal voyage mais ne modifie aucune stat — le MJ gère la scène séparément.

---

## Rôles de voyage

Assignés par le MJ avant le départ, mémorisés pour toute la durée du voyage.

| Rôle | Compétence | Jet requis |
|---|---|---|
| **Guide** | Voyage (`travel`) | Obligatoire — définit la réussite globale |
| **Éclaireur** | Chasse (`hunting`) ou Scrutation (`scan`) | Optionnel — détecte les dangers |
| **Gardien** | Vigilance (`awareness`) | Optionnel — réduit rencontres nocturnes |
| **Pourvoyeur** | Chasse (`hunting`) | Optionnel — peut réduire Fatigue groupe |

> Il peut y avoir plusieurs Éclaireurs. Un seul Guide et un seul Gardien actifs.
> Un personnage sans rôle ne fait pas de jet à chaque étape.

---

## Calendrier dans l'univers

Format : **"3e Âge, an 2946, 14 octobre"** — calendrier humain standard (mois 1–12, jours 1–30/31).

- La date de début du voyage est héritée de la `current_date` de la session
- Chaque étape avance la `current_date` de 7 jours (ou moins si c'est la dernière étape)
- La date est affichée dans le titre de scène TV et dans le panneau session
- La `current_date` de la campagne est mise à jour à la fin du voyage

---

## Modèle de données

### `journey_maps` — cartes hex (système de jeu global)

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `game_system_id` | uuid | FK → game_systems |
| `name` | text | Ex : "Les Terres Sauvages" |
| `background_image_id` | uuid | FK → media_library — image de fond (catégorie `map`) |
| `grid_width` | int | Nombre de colonnes de la grille |
| `grid_height` | int | Nombre de lignes de la grille |
| `hex_size` | int | Taille d'un hex en pixels (pour calibrage) |
| `grid_offset_x` | float | Décalage horizontal de la grille sur l'image (px) |
| `grid_offset_y` | float | Décalage vertical de la grille sur l'image (px) |
| `default_start_hex` | jsonb | `{q, r}` — position de départ par défaut pour une nouvelle campagne |
| `created_at` | timestamptz | — |

### `hex_tiles` — cases de la grille

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `map_id` | uuid | FK → journey_maps |
| `q` | int | Coordonnée axiale q |
| `r` | int | Coordonnée axiale r |
| `terrain_type` | text | Enum : road / plain / hills / light_forest / dense_forest / marsh / mountain / hostile_mountain |
| `days_cost` | int | Jours pour traverser (default depuis terrain_type, overridable) |
| `danger_level` | text | Enum : standard / risky / dire (default depuis terrain_type, overridable) |
| `passable` | bool | `false` = hex infranchissable (ignoré par le pathfinding) |
| `label` | text | Optionnel — nom affiché sur la TV et dans le panneau session |
| `poi_type` | text | Optionnel — enum : city / ruin / fort / lair / cave / other |
| `poi_hidden` | bool | `true` = point d'intérêt non visible sur la TV tant que le MJ ne le révèle pas |

### `journeys` — une instance de voyage (= une scène voyage)

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `session_id` | uuid | FK → sessions |
| `campaign_id` | uuid | FK → campaigns |
| `map_id` | uuid | FK → journey_maps |
| `start_hex` | jsonb | `{q, r}` |
| `destination_hex` | jsonb | `{q, r}` |
| `planned_path` | jsonb | `[{q, r}, ...]` chemin choisi par les PJ |
| `actual_path` | jsonb | `[{q, r}, ...]` chemin réellement parcouru |
| `current_hex` | jsonb | `{q, r}` position courante |
| `roles` | jsonb | `{guide: char_id, scout: [char_id], lookout: char_id, hunter: char_id}` |
| `total_days` | int | Total jours calculé (mis à jour si "Perdus") |
| `days_elapsed` | int | Jours écoulés depuis le départ |
| `start_date` | jsonb | `{year: 2946, month: 10, day: 14}` |
| `current_date` | jsonb | Date courante dans l'univers |
| `estimated_end_date` | jsonb | Date d'arrivée estimée (recalculée si "Perdus") |
| `status` | text | Enum : active / completed / abandoned |
| `created_at` | timestamptz | — |

### `journey_stages` — une étape (1 round de jets, tous les 7 jours)

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `journey_id` | uuid | FK → journeys |
| `stage_number` | int | 1, 2, 3… |
| `day_start` | int | Jour de début de l'étape (ex: 8) |
| `day_end` | int | Jour de fin de l'étape (ex: 14) |
| `hex_at_stage` | jsonb | `{q, r}` position à la fin de cette étape |
| `in_universe_date` | jsonb | Date dans l'univers à cette étape |
| `danger_level` | text | Niveau de risque dominant de cette étape |
| `rolls` | jsonb | `[{character_id, role, skill_key, total, feat_die, eye_of_sauron: bool}]` |
| `status` | text | Enum : pending / resolved |

### `journey_events` — événements déclenchés dans une étape

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `stage_id` | uuid | FK → journey_stages |
| `journey_id` | uuid | FK → journeys |
| `event_type` | text | Enum : ill_health / mishap / foul_weather / shadow_fell / encounter / loss_of_way |
| `triggered_by` | uuid | FK → characters (qui a roulé l'Œil) |
| `affected_scope` | text | Enum : individual / full_party |
| `affected_character_id` | uuid | FK → characters — null si full_party |
| `consequence_type` | text | Enum : fatigue / shadow / endurance / days_added / rp_only |
| `consequence_value` | int | Valeur numérique (ex: 2 pour +2 Fatigue) |
| `applied` | bool | Conséquence appliquée sur la fiche ? |
| `notes` | text | Texte libre MJ (surtout pour "Rencontre") |
| `created_at` | timestamptz | — |

---

## Interfaces

### Back-office — Système de jeu : Cartes

#### Liste des cartes
- Liste des cartes hex du système de jeu
- Bouton "Nouvelle carte"

#### Création / édition d'une carte — flux en 3 étapes

**Étape 1 — Image de fond**
- Sélection d'une image depuis la médiathèque (catégorie `map`)
- L'image est affichée dans un conteneur fixe

**Étape 2 — Calibrage de la grille**
- L'app superpose une grille hexagonale sur l'image
- Contrôles de calibrage :
  - **Taille des hexes** (slider) — agrandit ou réduit la grille pour correspondre à l'échelle de la carte
  - **Décalage X / Y** (sliders ou drag) — repositionne la grille pour aligner les hexes avec les zones géographiques
- La grille s'affiche en overlay semi-transparent pour voir l'image dessous
- Bouton "Réinitialiser" pour revenir aux valeurs par défaut
- Dimensions de la grille (colonnes × lignes) calculées automatiquement depuis la taille de l'image et la taille des hexes

**Étape 3 — Configuration des hexes**
- Mode "Terrain" : clic sur un hex → dropdown terrain (route / plaine / collines / forêt légère / forêt dense / marécage / montagne / montagnes hostiles)
- Chaque terrain a une couleur distincte (palette fixe, visible en légende)
- Outil "Pinceau zone" : maintenir clic et glisser pour colorier plusieurs hexes d'un coup avec le terrain sélectionné
- Mode "Infranchissable" : marquer un hex comme bloqué (rendu hachuré sur la grille) — le pathfinding le contourne
- Mode "Point d'intérêt" : clic sur un hex → saisir un nom + choisir un type (ville, ruine, forteresse, repaire, grotte, autre) + cocher "Caché" si le lieu n'est pas encore révélé aux joueurs
- Mode "Départ" : clic sur un hex → définir comme position de départ par défaut de la campagne (un seul hex à la fois)
- Bascule rapide entre les modes via une toolbar latérale
- Aperçu temps réel du rendu TV (bouton "Voir rendu TV")

### Préparation de scène — Scène de type Voyage

- Le MJ choisit la carte parmi celles du système de jeu
- Affichage de la position courante héritée (ou placement manuel si 1re fois)
- Confirmation avant de démarrer

### Panneau session MJ — Mode Voyage

Layout en deux colonnes :

**Colonne gauche — Carte**
- Grille hex interactive (plein écran relatif)
- Marqueur de groupe sur la position courante
- Trail du chemin parcouru (ligne colorée)
- Chemin planifié (ligne pointillée)
- Hexes colorés par terrain
- Clic sur un hex = sélectionner comme destination ou modifier le chemin
- Étiquettes des lieux nommés visibles au survol

**Colonne droite — Contrôles**

*Section Voyage*
- Date courante + date d'arrivée estimée
- Barre de progression : "Jour X / Y — Étape Z/N"
- Bouton "Avancer à l'étape suivante"

*Section Rôles*
- Assignation rapide : dropdown par rôle → liste des personnages de la campagne

*Section Étape en cours*
- Pour chaque personnage avec un rôle : champ total + résultat dé-destin (Œil / Gandalf / valeur)
- Si Œil de Sauron : bouton "Déclencher un événement" → ouvre la table d'événements
- Sélection de l'événement → champs conséquence (type, valeur, personnage(s) affecté(s))
- Bouton "Appliquer" → met à jour la fiche du personnage + marque l'événement comme applied

*Section Journal*
- Liste des événements résolus depuis le début du voyage (du plus récent au plus ancien)
- Chaque entrée : type d'événement + personnage(s) + conséquence + date dans l'univers

### TV — Mode Voyage

- Grille hex plein écran avec même rendu terrain que back-office
- Marqueur de groupe animé (transition smooth lors d'un déplacement)
- Trail du chemin parcouru
- Titre de scène en overlay haut : **"3e Âge, 2946 — 14 octobre → Arrivée estimée : 31 octobre"**
- Si "Perdus" : la date d'arrivée se met à jour avec une animation (date qui glisse vers le bas)
- Bandeau bas : dernier événement résolu (fade in/out)

### Téléphone joueur — Onglet "Voyage"

Affiché uniquement quand une scène de type Voyage est active.
Quand aucun voyage n'est en cours : message **"Aucun voyage en cours"**.

Contenu :
- Rôle assigné au personnage (ou "Aucun rôle" si non assigné)
- Compétence à utiliser pour ce rôle
- Fatigue accumulée lors de ce voyage (somme des events appliqués)
- Date courante dans l'univers
- Liste des événements résolus (ordre chronologique) :
  - Type d'événement
  - Personnage déclenché / touché
  - Conséquence appliquée

---

## Lien avec les règles TOR

| Règle | Référence | Couverture app |
|---|---|---|
| Rôles de voyage | `journey.md` | Assignation dans le panneau session, affichage téléphone |
| Jets de Hasard (Standard / Risqué / Insensé) | `journey.md` | Niveau de risque par hex, résolution par étape |
| Fatigue de voyage | `journey.md` | Appliquée sur `TORCharacterData.fatigue` via les événements |
| État Épuisé | `conditions.md` | Calculé automatiquement après chaque modification de fatigue |
| Ombre en régions corrompues | `fear-morale.md` | Événement "L'Ombre s'étend" → `TORCharacterData.shadows` |
| Saisons et difficulté | `journey.md` | Affiché dans le titre de scène, impact sur TN à saisir par le MJ |
| Phase de Communauté | `fellowship-phase.md` | La date dans l'univers est transmise à la phase suivante |
