# Feature — Gestion de Campagne (`feature-campaign-management.md`)

> Vision globale : [`README.md`](./README.md)
> Système de jeu (cultures, vertus, armurerie) : [`feature-game-system.md`](./feature-game-system.md)
> Fiches personnages : [`feature-characters.md`](./feature-characters.md)
> Fiches ennemis & PNJ : [`feature-enemies.md`](./feature-enemies.md)
> Voyages : [`feature-journey.md`](./feature-journey.md)
> Affichage TV : [`feature-display-tv.md`](./feature-display-tv.md)

---

## Principe général

La page de gestion de campagne (`/gm/campaigns/[id]`) est le **hub central du MJ**. C'est là qu'il prépare tout ce qui concerne une campagne : personnages, ennemis, sessions, armurerie, carte, configuration générale.

Cette page est utilisée **entre les sessions** (préparation) et **avant de lancer une session** (vérification rapide de l'état). Elle ne remplace pas le panneau session (`/gm/campaigns/[id]/session/[sessionId]`) qui est dédié au live.

**Règle de navigation** : max 1 niveau de sous-page. Toutes les sections du hub sont accessibles en 1 clic depuis le dashboard. Il n'y a pas de navigation imbriquée au-delà de `/gm/campaigns/[id]/[section]`.

---

## Layout du hub

### Page principale — `/gm/campaigns/[id]`

**En-tête** : nom de la campagne + date in-game courante + bouton "Lancer / Reprendre la session active".

**Corps** : grille de cards de navigation. Chaque card est un raccourci vers une sous-page. Elle affiche :
- Titre de la section
- Icône
- Compteur (ex: "5 personnages", "3 sessions", "12 objets")
- CTA secondaire si pertinent (ex: "Nouvelle session")

| Card | Sous-page | Compteur |
|---|---|---|
| Personnages joueurs | `/characters` | N personnages |
| Ennemis & PNJ | `/combatants` | N combatants |
| Sessions | `/sessions` | N sessions (dont X active) |
| Armurerie | `/armory` | N objets dans la campagne |
| Bibliothèque média | `/media` | N images |
| Carte de campagne | `/map` | N voyages effectués |
| Configuration | `/settings` | — |

---

## Sous-pages

### `/gm/campaigns/[id]/characters`

Liste des personnages joueurs de la campagne. Lien vers la fiche complète de chaque personnage (spec : `feature-characters.md`). Bouton "Nouveau personnage".

> Il n'y a pas d'association explicite joueur ↔ personnage. Les joueurs choisissent eux-mêmes un personnage disponible au moment de rejoindre la session.

### `/gm/campaigns/[id]/combatants`

Liste des ennemis et PNJ de la campagne. Lien vers la fiche complète de chaque entité (spec : `feature-enemies.md`). Bouton "Nouvel ennemi / PNJ".

### `/gm/campaigns/[id]/sessions`

Liste des sessions de la campagne, triées par date de création décroissante.

Chaque entrée affiche : nom, statut (active / terminée / archivée), date de création.

Actions disponibles :
- **Créer une nouvelle session** (voir ci-dessous)
- **Reprendre** une session active
- **Archiver / supprimer** une session terminée

#### Création d'une nouvelle session

Formulaire minimal :
- **Nom** de la session (texte libre, ex: "La Forêt Noire")
- **Jours écoulés depuis la dernière session** (optionnel, entier ≥ 0, défaut : 0)
  - Si renseigné, avance la `current_date` de la campagne du nombre de jours saisi **au moment de la validation**
  - La session créée hérite de la `current_date` résultante de la campagne

### `/gm/campaigns/[id]/armory`

Accès à l'armurerie spécifique à la campagne : quels objets, armes et armures sont disponibles pour cette campagne. Spec : `feature-game-system.md`.

### `/gm/campaigns/[id]/media`

Bibliothèque d'images de la campagne. Spec : `feature-media-library.md`.

### `/gm/campaigns/[id]/map`

**Carte cumulative des voyages** de la campagne.

Affiche la carte hexagonale de la campagne avec, en overlay :
- Le trail de **tous les voyages terminés** de la campagne (chemin parcouru agrégé)
- La position courante de la compagnie (dernier hex atteint)
- Les points d'intérêt révélés jusqu'ici

Pas d'interaction ni de détail des événements — c'est une vue de synthèse "où est allée la compagnie depuis le début".

La carte est générée dynamiquement en superposant les trails (`actual_path`) de tous les `journeys` dont `status = 'completed'` et `campaign_id = current_campaign` sur l'image de fond de la `journey_maps` associée. Ce n'est pas une image statique stockée — c'est une vue synthétique calculée.

### `/gm/campaigns/[id]/settings`

**Configuration générale de la campagne.** Tous les paramètres éditables :

| Champ | Type | Description |
|---|---|---|
| Nom | text | Nom de la campagne |
| Description | text | Description libre |
| Date de début | date in-game | Point de départ de la chronologie (`start_date`) |
| Date courante | date in-game | Peut être avancée manuellement ici (contrôle `+X jours`) |
| Saison courante | enum (auto) | Calculée depuis `current_date` — cosmétique uniquement (habillage visuel selon saison). Peut être overridée manuellement. |
| Havre actuel | picker | Sélection parmi les havres définis dans `/gm/system/havens`. Détermine le bonus d'Espoir en Phase de Communauté. |
| Règles de voyage | markdown | Notes libres affichées dans le panneau latéral TV en mode Voyage |
| Image d'attente | image picker | `wallpaper_url` — fallback si aucun voyage n'a encore eu lieu |

**Contrôle d'avance manuelle de la date** : un champ `+X jours` avec bouton "Appliquer" permet au MJ de faire avancer la date courante hors voyage (temps narratif, repos, déplacements courts).

---

## Date in-game — Principe central

La date in-game (`current_date`) est un attribut de la campagne. Elle représente "où on en est dans le calendrier de la Terre du Milieu".

### Comment elle avance

| Action | Mécanisme |
|---|---|
| Voyage terminé | La date avance automatiquement selon les jours écoulés du voyage (`journey.current_date` → `campaigns.current_date`) |
| Création d'une nouvelle session | Option "X jours écoulés" → avance manuellement `current_date` de X jours |
| Contrôle manuel | Champ `+X jours` dans `/settings` → avance directement |

### Format d'affichage

`3e Âge, 2946 — 14 octobre`

**Format interne (JSONB)** :
```json
{ "year": 2946, "month": 10, "day": 14 }
```
- `year` : entier (ex: 2946 = Troisième Âge)
- `month` : entier 1–12 (correspondance calendrier humain standard)
- `day` : entier 1–30 (30 jours par mois, convention simplifiée TOR)

Les noms de mois en français (janvier → décembre) sont calculés côté affichage depuis l'entier `month`.

### Calcul automatique de la saison

La saison est déduite de `current_date.month` :
| Mois | Saison |
|---|---|
| 3–5 | Printemps |
| 6–8 | Été |
| 9–11 | Automne |
| 12, 1–2 | Hiver |

La saison n'a pas d'impact mécanique calculé automatiquement — elle sert à l'habillage visuel (ambiance TV, couleurs) et d'indication pour le MJ lors des voyages (TN saisis manuellement). Elle peut être overridée manuellement dans les settings si le MJ veut une saison spécifique hors du calendrier.

### Affichage TV

La date est **toujours visible sur l'affichage TV**, dans tous les modes (attente, scène, voyage) :
- Positionnée **en haut au centre**
- Sous le titre de scène
- En italique, taille secondaire

```
[ Titre de la scène ]
[ 3e Âge, 2946 — 14 octobre ]    ← italique, toujours affiché
```

### Affichage back-office

Visible dans l'en-tête du hub de campagne et dans `/settings`.

### Affichage smartphone joueur

Non affiché — pas nécessaire.

---

## TV mode attente — Carte cumulative

Quand aucune session n'est active, l'affichage TV passe en **mode attente**.

**Si la campagne a au moins un voyage terminé** : la TV affiche la carte hexagonale cumulative (tous les trails de voyages passés), avec la position courante de la compagnie. La date in-game est affichée en overlay selon les règles ci-dessus.

**Si aucun voyage n'a encore eu lieu** : la TV affiche le `wallpaper_url` configuré dans les settings (image libre, ex: une illustration de la Terre du Milieu).

---

## Lien avec les règles TOR

| Règle | Impact sur cette feature |
|---|---|
| Phase de Communauté | La date in-game détermine si une Yule a eu lieu (récupération totale Espoir/Ombre). Le havre actuel (`current_haven_id`) conditionne le bonus d'Espoir récupérable. Affiché sur TV et téléphone joueur lors d'une scène `community`. |
| Saisons | Calculée automatiquement depuis `current_date`, overridable. Impact visuel (habillage TV) + référence pour le MJ pour les TN de voyage (saisis manuellement). |
| Fellowship Points | Narratif uniquement sur les fiches personnages (`community_points`). Pas de mécanique partagée dans l'app pour l'instant. |
| Havres (bonus de récupération) | Définis globalement dans `/gm/system/havens`. Le MJ sélectionne ici **lequel est actif** via `current_haven_id`. |

---

## Modèle de données — Colonnes à ajouter sur `campaigns`

La table `campaigns` actuelle ne contient que : `id`, `gm_user_id`, `name`, `description`, `system`, `created_at`, `updated_at`.

Colonnes à ajouter :

| Colonne | Type | Description |
|---|---|---|
| `start_date` | jsonb | Date de début de la campagne `{year, month, day}` |
| `current_date` | jsonb | Date courante de la campagne (avancée par voyages / sessions / contrôle manuel) |
| `current_season` | text \| null | Enum : `spring` / `summer` / `autumn` / `winter`. Null = calculé automatiquement depuis `current_date`. Renseigné si le MJ override manuellement. |
| `current_haven_id` | uuid FK \| null | FK → `game_system_havens.id`. Null si aucun havre n'est défini pour la campagne. |
| `travel_rules` | text | Markdown libre — notes de voyage affichées sur la TV |
| `wallpaper_url` | text | URL image d'attente (fallback si aucun voyage) |

> `world_map_url` n'est plus nécessaire : la carte TV est générée depuis les données `journey_maps` + `journeys`. Si aucun voyage n'existe, le fallback est `wallpaper_url`.

---

## Lien avec les surfaces

| Surface | Lien avec cette feature |
|---|---|
| Back-office `/gm/campaigns/[id]` | C'est cette page — hub central |
| Panneau session | Accessible depuis ici via "Lancer / Reprendre la session" |
| TV mode attente | Affiche la carte cumulative des voyages (ou wallpaper si aucun voyage) |
| TV toutes scènes | Date in-game toujours visible en haut au centre, sous le titre de scène |
| Téléphone joueur | Date non affichée |
