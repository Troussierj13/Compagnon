# Feature — Affichage TV (`/display/[sessionId]`)

> Référence principale : [`README.md`](./README.md)
> Ce document est la spec de référence pour tout ce qui concerne l'affichage spectateur.

---

## Principe général

L'affichage TV est une URL ouverte dans le navigateur de la TV. Pas d'authentification, pas d'interaction — affichage pur piloté à 100% depuis le panneau MJ.

L'URL contient l'UUID de session (difficile à deviner), ce qui suffit comme protection.

Tout est temps réel via Supabase Realtime. Aucun rechargement manuel.

---

## Les modes d'affichage

Le MJ peut switcher entre plusieurs modes depuis son panneau. Un seul mode actif à la fois (hors overlay).

Le mode actif est stocké dans `sessions.display_mode` — toute modification est immédiatement reflétée sur la TV via Realtime.

### 1. Waiting Screen

Affiché quand aucune scène n'est active, ou quand le MJ veut cacher ce qui se prépare.

- **Si la campagne a au moins un voyage terminé** : affiche la carte hexagonale cumulative (trails de tous les voyages passés + position courante de la compagnie). La date in-game est affichée en overlay haut centre (voir section "Date in-game — Overlay global" ci-dessous).
- **Sinon** : affiche un fond d'écran en plein écran (voir cascade de résolution plus bas)
- Optionnel : nom de la campagne en surimpression (paramétrable)
- C'est le mode par défaut au lancement de la session

---

### 2. Battlemap

Mode principal pour les scènes de combat, d'exploration ou de partage de loot.

#### Image de fond
- Battlemap choisie par le MJ depuis la bibliothèque de la campagne (catégorie `battlemap`), affichée en `object-contain` plein écran

#### Tokens des entités
- Chaque entité visible a un token positionné sur la carte (`position.x / position.y` en %)
- Le token affiche une **image** choisie depuis la bibliothèque d'images de la campagne (voir [`feature-media-library.md`](./feature-media-library.md)) :
  - Personnage joueur → `characters.portrait_url` (URL stockée via le picker)
  - Ennemi ou PNJ → `combatants.artwork_url` (URL stockée via le picker, ou résolue depuis les mappings NFC pour les ennemis)
  - Objet → artwork de l'objet (`campaign_items.media_id`)
  - Fallback si pas d'image : icône colorée par type (comportement actuel)
- Taille des tokens adaptée à un grand écran (plus grands qu'en vue téléphone)

#### Informations affichées sur les tokens
| Type | Nom | Endurance |
|---|---|---|
| Joueur | ✅ | ✅ restante / max (ex: `12 / 20`) |
| Ennemi | ✅ | ❌ — maintenir le mystère |
| PNJ | ✅ | ❌ par défaut (paramétrable par PNJ) |

> **Calcul de l'Endurance max affichée** : la valeur max est `strength + culture.endurance_bonus + Σ(modifiers des vertus avec target='endurance_max')`. Elle est calculée depuis `characters.data` — jamais stockée en colonne propre. Voir `feature-characters.md` section 2.2 pour les formules complètes (Endurance, Espoir, Parade).

#### Fil d'initiative

Bandeau affiché en bas de l'écran TV pour suivre l'ordre de jeu pendant un combat. Optionnel — le MJ l'active quand un combat commence.

**Démarrer un combat :**
Avant d'activer le fil, le MJ définit les participants depuis son panneau :
- Sélection des entités de la scène qui participent au combat
- Saisie de leur valeur d'initiative (ou tri manuel par drag)
- Une fois validé, le fil apparaît sur la TV

**Affichage du fil :**
- Bandeau horizontal avec les participants dans l'ordre d'initiative
- Chaque entrée : token miniature + nom + valeur d'initiative
- L'entité dont c'est le tour est mise en évidence (bordure lumineuse, surbrillance)
- Le MJ avance le tour depuis son panneau → mise à jour temps réel

**Fin de combat :**
Le MJ désactive le fil depuis son panneau — le bandeau disparaît de la TV.

---

### 3. Voyage

Mode dédié aux phases de déplacement. Activé automatiquement quand une scène de type `journey` est active.

> **Spec complète** : voir [`feature-journey.md`](./feature-journey.md) — section "TV — Mode Voyage".

#### Résumé

- **Grille hexagonale plein écran** avec rendu par terrain (couleur selon type : route, plaine, forêt…)
- **Marqueur de groupe animé** sur la position courante (transition smooth lors d'un déplacement)
- **Trail du chemin parcouru** (ligne colorée) + chemin planifié (ligne pointillée)
- **Points d'intérêt** : hexes labellisés (`hex_tiles.label`) et icônes de POI révélés par le MJ
- **Titre de scène en overlay haut** : `"3e Âge, 2946 — 14 octobre → Arrivée estimée : 31 octobre"` (voir section Date in-game ci-dessous)
- **Bandeau bas** : dernier événement résolu (fade in/out)
- Si événement "Perdus" : la date d'arrivée se met à jour avec animation

#### Données
La carte provient de `journey_maps` + `hex_tiles`. Le chemin et les positions viennent de la table `journeys` (scène active). Les POIs révélés sont filtrés sur `hex_tiles.poi_hidden = false`.

> `map_markers` (ancienne table) est supprimée — remplacée par les POIs intégrés dans `hex_tiles`.

#### Panneau latéral
- Règles de voyage (texte Markdown, configuré dans `campaigns.travel_rules`)
- Infos libres : météo actuelle, jours de route restants, événements en cours

---

### 4. Scène de communauté (Phase de Communauté)

Quand la scène active est de type `community`, la TV reste en mode `battlemap` (ou `waiting` si aucune battlemap n'est définie) avec un **overlay informatif** affiché en surimpression.

#### Overlay Phase de Communauté

Positionné en haut à gauche (ou coin configurable), non bloquant :

- **Nom du havre actuel** (ex : "Dale")
- **Bonus du havre** : `+X Espoir` récupérable au-delà de Cœur
- Icône sanctuary (type `i-heroicons-home`)

Cet overlay est visible tant que la scène de type `community` est active. Il disparaît quand le MJ change de scène.

> Le havre et ses bonus sont configurés dans le système de jeu global (`/gm/system/havens`) et le havre actif est sélectionné dans les settings de la campagne.

**Flux de données :**
1. MJ sélectionne `campaigns.current_haven_id` dans `/gm/campaigns/[id]/settings`
2. La TV récupère le havre via le server endpoint session state
3. `game_system_havens[current_haven_id]` → `name` + `hope_bonus`
4. TV affiche : "Dale — +1 Espoir" (ou autre havre configuré)

---

### 5. Modes futurs (extensibilité)

L'architecture doit permettre d'ajouter facilement d'autres modes. Exemples envisagés :
- Mode **Repos** (ambiance, récapitulatif de session)
- Mode **Marchand** (inventaire d'une boutique présenté aux joueurs)
- Mode **Résultat de combat** (loot à distribuer en plein écran)

---

## Overlay — Mise en évidence plein écran

À tout moment, quel que soit le mode actif, le MJ peut pousser un ou plusieurs **overlays** par-dessus l'affichage courant.

### Comportement général
- L'overlay s'affiche par-dessus le mode en cours (battlemap, voyage, waiting screen)
- Plusieurs overlays peuvent être actifs simultanément
- Le MJ ferme chaque overlay individuellement depuis son panneau
- Transition animée à l'apparition / disparition

### Disposition en cascade
Les overlays sont empilés visuellement (légèrement décalés) pour indiquer qu'il y en a plusieurs. Le MJ peut **mettre un overlay en évidence** depuis son panneau : il passe au premier plan, agrandi, bien lisible depuis la TV. Les autres restent visibles en retrait.

```
[ Overlay mis en évidence — grand, centré, bien lisible ]
  [ Overlay 2 — décalé en arrière ]
    [ Overlay 3 — décalé en arrière ]
```

### Contenu possible d'un overlay
- **Fiche personnage compacte** : portrait, nom, vocation, attributs (Corps/Cœur/Esprit), Endurance/Espoir/Parade, équipement principal. Voir `feature-characters.md` pour le layout complet.
- **Fiche ennemi** — artwork + stats (ce que le MJ décide de révéler)
- **Artwork objet** — illustration d'un objet trouvé ou donné
- **Texte libre** — description d'ambiance, résultat d'un jet, annonce narrative
- **Image libre** — n'importe quelle image uploadée par le MJ

---

## Annonces MJ

Le MJ peut envoyer des messages texte libres depuis le panneau session. Selon la cible choisie, l'annonce peut s'afficher sur la TV, sur les téléphones joueurs, ou les deux. Voir `feature-player-view.md` — E4 pour le comportement côté téléphone.

### Affichage sur la TV

**Toast d'annonce** :
- Position : coin supérieur droit de l'écran (non bloquant)
- Icône `megaphone` + texte du message
- Durée d'affichage : 8 secondes, avec animation de sortie
- Si plusieurs annonces arrivent rapidement : les toasts s'empilent verticalement

**Historique des annonces** :
- Un fil discret (coin inférieur droit ou bas de l'écran, hors bandeau initiative) liste les dernières annonces reçues
- Affiche les N dernières annonces (N configurable, suggestion : 5)
- Chaque entrée : horodatage relatif + texte (police petite, opacité réduite pour ne pas gêner la battlemap)
- Le fil ne prend pas de place fixe — il s'affiche en overlay semi-transparent par-dessus le contenu

### Condition d'affichage

L'annonce est affichée sur la TV uniquement si `target IN ('tv', 'all')`. Filtrage appliqué côté client TV sur les événements Realtime de `session_announcements`.

---

## Spawn NFC — Animations

Quand un ennemi apparaît via une puce NFC (figurine posée sur la table), la TV joue une animation de spawn.

### Ce que contient la puce
La puce NFC contient les données de l'ennemi encodées en base64 (voir `feature-nfc.md`). Parmi ces données se trouve la **rareté** de l'ennemi. C'est la rareté qui détermine l'animation et le son joués sur la TV.

> **Note** : Les animations de spawn NFC s'appliquent aux ennemis spawned via le Pico uniquement. Les PJ et PNJ ajoutés manuellement par le MJ utilisent les options "Discret" ou "Dramatique" (voir section Spawn manuel).

### Paramétrage par rareté

Dans les **paramètres globaux de l'app**, le MJ associe à chaque rareté :
- Une animation d'apparition (choisie dans une liste prédéfinie)
- Un son d'apparition (choisi dans une bibliothèque de sons intégrés à l'app)

| Rareté | Animation par défaut | Son par défaut |
|---|---|---|
| Commun | Fondu simple (`fade-in`) | Aucun |
| Peu commun | Flash blanc (`flash`) | Son discret |
| Rare | Effet de fumée (`smoke`) | Son impactant |
| Légendaire | Flash + tremblement (`flash-shake`) | Son épique |

Tous ces paramètres sont modifiables. Les sons sont des fichiers intégrés à l'app (pas d'upload custom).

### Spawn manuel (MJ)
Lors de l'ajout manuel d'une entité depuis le panneau session, le MJ choisit :
- **Discret** : aucune animation, token apparaît directement
- **Dramatique** : animation complète selon la rareté de l'entité

---

## Date in-game — Overlay global

La date in-game de la campagne est **toujours visible sur la TV**, dans tous les modes (waiting, battlemap, voyage, communauté).

**Position** : haut centre de l'écran, sous le titre de la scène active.

**Format affiché** : `3e Âge, 2946 — 14 octobre` (en italique, taille secondaire, opacité légèrement réduite pour ne pas gêner le fond)

```
         [ Titre de la scène ]
    [ 3e Âge, 2946 — 14 octobre ]     ← italique, toujours affiché
```

En mode Voyage, la ligne est enrichie avec la date d'arrivée estimée :

```
[ 3e Âge, 2946 — 14 octobre → Arrivée estimée : 31 octobre ]
```

La date est lue depuis `campaigns.current_date` via la session active. Mise à jour en temps réel via Realtime sur tout changement de `campaigns.current_date`.

---

## Fond d'écran — Cascade de résolution

Applicable au Waiting Screen et en fond des modes Voyage / Battlemap si aucune carte/battlemap n'est définie.

```
1. Fond défini sur la scène active
        ↓ (si absent)
2. Fond défini sur la session
        ↓ (si absent)
3. Fond défini sur la campagne
        ↓ (si absent)
4. Fond noir (défaut)
```

Les fonds sont des images choisies depuis la **bibliothèque d'images de la campagne** (voir [`feature-media-library.md`](./feature-media-library.md)). La catégorie `background` est proposée en premier dans le picker, mais toute image de la bibliothèque peut être utilisée.

---

## Données nécessaires — Base de données

### Nouvelle table : `session_announcements`

Définie dans `feature-player-view.md` — E4. La TV souscrit à cette table via Realtime (filtre `session_id`).

### Champs à ajouter

| Table | Champ | Type | Usage |
|---|---|---|---|
| `campaigns` | `wallpaper_url` | text | Fond d'écran fallback campagne (si aucun voyage terminé) |
| `campaigns` | `travel_rules` | text (markdown) | Règles de voyage affichées en mode Voyage |
| `sessions` | `wallpaper_url` | text | Fond d'écran fallback session |
| `sessions` | `display_mode` | enum | Mode TV actif : `waiting` / `battlemap` / `travel` |
| `scenes` | `wallpaper_url` | text | Fond d'écran spécifique à la scène |
| `scene_entities` | `initiative_order` | integer\|null | Position dans le fil d'initiative (null = hors combat) |
| `scene_entities` | `in_combat` | boolean | Participe au fil d'initiative |
| `scene_entities` | `is_current_turn` | boolean | C'est son tour actuellement |
| `characters` | `portrait_url` | text | Image du token battlemap + overlay |
| `combatants` | `artwork_url` | text | Image du token battlemap + overlay (ennemis et PNJ) |
| `combatants` | `rarity` | enum | `common` / `uncommon` / `rare` / `legendary` |

### Nouvelle table : `overlays`

Overlays actifs sur la TV pour une session donnée.

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `session_id` | uuid FK | Session concernée |
| `type` | enum | `character` / `combatant` / `item` / `text` / `image` |
| `reference_id` | uuid\|null | ID de l'entité référencée : `characters.id` / `combatants.id` / `campaign_items.id` selon le type |
| `content` | jsonb\|null | Contenu libre (texte, URL image) — utilisé pour les types `text` et `image` |
| `is_featured` | boolean | Mis en évidence (au premier plan) |
| `position` | integer | Ordre dans la pile |
| `created_at` | timestamp | Pour tri |

---

## Résumé des interactions MJ → TV

| Action MJ (panneau session) | Effet sur la TV |
|---|---|
| Changer de mode (`waiting` / `battlemap` / `travel`) | Switch immédiat |
| Activer une scène | Passage en mode battlemap |
| Ajouter une entité visible | Token apparaît sur la battlemap |
| Masquer une entité | Token disparaît |
| Déplacer un token | Token se déplace en temps réel |
| Démarrer un combat (définir participants + initiative) | Fil d'initiative apparaît en bas |
| Avancer le tour | Entité suivante mise en évidence dans le fil |
| Terminer le combat | Fil d'initiative disparaît |
| Poser une figurine (NFC) | Animation selon rareté + token apparaît |
| Ajouter un overlay | Overlay apparaît en cascade sur le mode actif |
| Mettre un overlay en évidence | Overlay passe au premier plan, agrandi |
| Fermer un overlay | Overlay disparaît |
| Révéler un objet (loot) | Token objet apparaît sur la battlemap |
| Déplacer le marqueur de groupe (mode Voyage) | Marqueur se déplace sur la carte |
| Ajouter / modifier un marqueur de carte | Marqueur visible ou mis à jour sur la carte |
| Envoyer une annonce (`target: 'tv'` ou `'all'`) | Toast en haut à droite + entrée dans l'historique |
