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

- Affiche un **fond d'écran** en plein écran (voir cascade de résolution plus bas)
- Optionnel : nom de la campagne en surimpression (paramétrable)
- C'est le mode par défaut au lancement de la session

---

### 2. Battlemap

Mode principal pour les scènes de combat, d'exploration ou de partage de loot.

#### Image de fond
- Battlemap uploadée par le MJ sur la scène, affichée en `object-contain` plein écran

#### Tokens des entités
- Chaque entité visible a un token positionné sur la carte (`position.x / position.y` en %)
- Le token affiche une **image** :
  - Personnage joueur → `characters.portrait_url`
  - Ennemi → `enemies.artwork_url`
  - PNJ → portrait de la fiche PNJ
  - Fallback si pas d'image : icône colorée par type (comportement actuel)
- Taille des tokens adaptée à un grand écran (plus grands qu'en vue téléphone)

#### Informations affichées sur les tokens
| Type | Nom | Endurance |
|---|---|---|
| Joueur | ✅ | ✅ restante / max (ex: `12 / 20`) |
| Ennemi | ✅ | ❌ — maintenir le mystère |
| PNJ | ✅ | ❌ par défaut (paramétrable par PNJ) |

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

Mode dédié aux phases de déplacement entre les lieux.

#### Carte interactive
- Carte du monde ou de région — image uploadée au niveau campagne ou session
- **Marqueur de groupe** : position actuelle du groupe, déplaçable par le MJ depuis son panneau
- Le groupe se déplace toujours ensemble (un seul marqueur)

#### Annotations sur la carte
Le MJ peut enrichir la carte avec des marqueurs informatifs :
- **Lieux visités** : marqueurs posés après passage du groupe (nom + notes)
- **Lieux d'intérêt** : marqueurs posés librement par le MJ (ville, donjon, point de repère)
- Chaque marqueur a : nom, icône (type de lieu), notes optionnelles
- Les marqueurs sont persistés sur la campagne (ils survivent entre les sessions)
- Le MJ choisit quels marqueurs sont visibles sur la TV (visible / notes privées)

#### Panneau latéral
- Règles de voyage du système de jeu (texte Markdown, configuré dans la campagne)
- Infos configurables librement : météo actuelle, jours de route restants, événements en cours, etc.

---

### 4. Modes futurs (extensibilité)

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
- **Fiche personnage** (joueur ou PNJ) — portrait + stats clés
- **Fiche ennemi** — artwork + stats (ce que le MJ décide de révéler)
- **Artwork objet** — illustration d'un objet trouvé ou donné
- **Texte libre** — description d'ambiance, résultat d'un jet, annonce narrative
- **Image libre** — n'importe quelle image uploadée par le MJ

---

## Spawn NFC — Animations

Quand un ennemi apparaît via une puce NFC (figurine posée sur la table), la TV joue une animation de spawn.

### Ce que contient la puce
La puce NFC contient les données de l'ennemi encodées en base64 (voir `feature-nfc.md`). Parmi ces données se trouve la **rareté** de l'ennemi. C'est la rareté qui détermine l'animation et le son joués sur la TV.

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

Les fonds sont des images uploadées dans Supabase Storage.

---

## Données nécessaires — Base de données

### Champs à ajouter

| Table | Champ | Type | Usage |
|---|---|---|---|
| `campaigns` | `wallpaper_url` | text | Fond d'écran fallback campagne |
| `campaigns` | `world_map_url` | text | Carte de base du mode Voyage |
| `campaigns` | `travel_rules` | text (markdown) | Règles de voyage affichées en mode Voyage |
| `sessions` | `wallpaper_url` | text | Fond d'écran fallback session |
| `sessions` | `display_mode` | enum | Mode TV actif : `waiting` / `battlemap` / `travel` |
| `scenes` | `wallpaper_url` | text | Fond d'écran spécifique à la scène |
| `scene_entities` | `initiative` | integer\|null | Valeur d'initiative (null = hors combat) |
| `scene_entities` | `in_combat` | boolean | Participe au fil d'initiative |
| `scene_entities` | `is_current_turn` | boolean | C'est son tour actuellement |
| `characters` | `portrait_url` | text | Image du token battlemap + overlay |
| `enemies` | `artwork_url` | text | Image du token battlemap + overlay |
| `enemies` | `rarity` | enum | `common` / `uncommon` / `rare` / `legendary` |
| `npcs` | `portrait_url` | text | Image du token battlemap + overlay |

### Nouvelle table : `map_markers`

Marqueurs posés par le MJ sur la carte du monde (mode Voyage).

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `campaign_id` | uuid FK | Campagne concernée |
| `name` | text | Nom du lieu |
| `position_x` | float | Position X sur la carte (%) |
| `position_y` | float | Position Y sur la carte (%) |
| `icon` | text | Type de lieu (`city`, `dungeon`, `landmark`, `point_of_interest`, …) |
| `notes` | text\|null | Notes privées MJ |
| `visited` | boolean | Lieu déjà visité par le groupe |
| `visible_on_display` | boolean | Affiché sur la TV ou privé |

### Nouvelle table : `overlays`

Overlays actifs sur la TV pour une session donnée.

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `session_id` | uuid FK | Session concernée |
| `type` | enum | `character` / `enemy` / `npc` / `item` / `text` / `image` |
| `reference_id` | uuid\|null | ID de l'entité référencée (si type lié) |
| `content` | jsonb\|null | Contenu libre (texte, URL image) |
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
