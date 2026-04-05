# Feature — Bibliothèque d'images (`/gm/campaigns/[id]/media`)

> Référence principale : [`README.md`](./README.md)

---

## Principe général

La bibliothèque d'images est un espace centralisé par campagne où le MJ uploade une fois toutes ses images. Chaque fois que l'app a besoin d'une image (fond d'écran, carte, portrait, artwork ennemi, etc.), le MJ choisit depuis cette bibliothèque plutôt que d'uploader à la volée.

**Règle de base : une image uploadée une fois est réutilisable dans tous les contextes de la campagne.**

---

## Portée

La bibliothèque est **par campagne**. Les images uploadées dans une campagne ne sont pas visibles dans une autre.

> Évolution future possible : bibliothèque globale MJ partagée entre campagnes.

---

## Catégories d'images

Pour faciliter la navigation, les images sont taguées à l'upload avec une catégorie principale :

| Catégorie | Utilisée typiquement pour |
|---|---|
| `map` | Cartes du monde, cartes de région (mode Voyage) |
| `battlemap` | Plans de combat (mode Battlemap) |
| `background` | Fonds d'écran (Waiting Screen, fallback) |
| `portrait` | Portraits de personnages joueurs et PNJ |
| `artwork` | Artworks d'ennemis, objets |
| `other` | Tout ce qui ne rentre pas dans les catégories précédentes |

Les catégories ne sont **pas restrictives** : une image de type `map` peut être utilisée comme fond d'écran si le MJ le décide. Elles servent uniquement à filtrer dans le picker.

---

## Image Picker — composant transverse

Partout où une image est à définir dans l'app, un composant **Image Picker** s'ouvre en modal. Il permet :

1. **Parcourir la bibliothèque** — affichage en grille, filtre par catégorie, recherche par nom
2. **Uploader une nouvelle image** — drag & drop ou sélection fichier, avec choix de catégorie et nom
3. **Sélectionner** l'image voulue → l'URL Supabase Storage est enregistrée dans le champ cible

### Contextes où le picker est utilisé

| Contexte | Champ cible |
|---|---|
| Fond d'écran d'une campagne | `campaigns.wallpaper_url` |
| Fond d'écran d'une session | `sessions.wallpaper_url` |
| Fond d'écran d'une scène | `scenes.wallpaper_url` |
| Battlemap d'une scène | `scenes.battlemap_url` |
| Carte hexagonale (mode Voyage) | générée depuis `journey_maps` + `journeys` — pas de champ URL sur `campaigns` |
| Portrait d'un personnage joueur | `characters.portrait_url` |
| Artwork d'un ennemi ou PNJ | `combatants.artwork_url` |
| Image libre dans un overlay TV | `overlays.content.url` |
| Mapping image pour résolution NFC | `nfc_image_mappings.media_id` |

---

## Résolution des images NFC

Les puces NFC ne stockent pas d'image. L'app résout l'image à afficher via une cascade de fallback. Avec la bibliothèque, le MJ peut **personnaliser ce mapping** depuis le back-office de la campagne.

### Mapping famille × rareté

Dans les paramètres de la campagne, section *Images NFC*, le MJ peut associer une combinaison de champs à une image de la bibliothèque :

```
famille: "Gobelin"  + rareté: "common"    → [image bibliothèque]
famille: "Gobelin"  + rareté: "rare"      → [image bibliothèque]
famille: "Dragon"   + rareté: "legendary" → [image bibliothèque]
famille: —          + rareté: "legendary" → [image générique légendaire]
```

> Le champ `famille` correspond à `combatants.family` — valeur libre saisie par le MJ sur la fiche (ex : `"Gobelin"`, `"Orc"`, `"Pillard"`).

### Cascade de résolution complète

```
1. Artwork défini directement sur la fiche (combatants.artwork_url)
        ↓ (si absent)
2. Mapping famille + rareté → bibliothèque campagne
        ↓ (si absent)
3. Mapping rareté seule → bibliothèque campagne
        ↓ (si absent)
4. Icône colorée par type (comportement par défaut)
```

---

## Page back-office `/gm/campaigns/[id]/media`

### Vue principale — Bibliothèque

- Grille de toutes les images de la campagne
- Filtres : catégorie, recherche par nom
- Actions sur chaque image : renommer, changer de catégorie, supprimer
  - Suppression bloquée (ou avertissement) si l'image est actuellement utilisée quelque part
- Bouton d'upload (upload multiple possible)

### Section "Mappings NFC"

- Tableau des mappings définis (race, rareté, sexe → image de la bibliothèque)
- Ajouter / modifier / supprimer un mapping
- Aperçu de la cascade de résolution pour une combinaison donnée (outil de debug)

---

## Stockage

Les images sont stockées dans **Supabase Storage**, bucket `campaign-media`, organisé par `campaign_id` :

```
campaign-media/
└── {campaign_id}/
    ├── {image_id}.jpg
    ├── {image_id}.png
    └── ...
```

Les URLs sont **publiques** (lecture sans auth) pour permettre l'affichage sur la TV et les téléphones joueurs sans authentification.

---

## Données — Base de données

### Table `campaign_media`

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `campaign_id` | uuid FK | Campagne |
| `name` | text | Nom lisible (saisi à l'upload ou déduit du nom de fichier) |
| `category` | enum | `map` / `battlemap` / `background` / `portrait` / `artwork` / `other` |
| `storage_url` | text | URL publique Supabase Storage |
| `file_size` | integer | Taille en octets |
| `created_at` | timestamp | — |

### Table `nfc_image_mappings`

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `campaign_id` | uuid FK | Campagne |
| `family` | text\|null | Famille de l'entité (`null` = toutes les familles) — correspond à `combatants.family` |
| `rarity` | enum\|null | Rareté (`null` = toutes) |
| `media_id` | uuid FK | Image dans `campaign_media` |

Index unique sur `(campaign_id, family, rarity)` pour éviter les doublons.

---

## Contraintes & limites

- Formats acceptés : JPEG, PNG, WebP, GIF (animé supporté)
- Taille max par fichier : à définir (suggestion : 10 Mo)
- Quota de stockage par campagne : à définir
