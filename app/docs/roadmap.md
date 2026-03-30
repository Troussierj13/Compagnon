# Roadmap fonctionnelle — Compagnon JdR

> Référence principale : [`vision/README.md`](./vision/README.md)
> Pour le détail des features, voir les fichiers dédiés dans `/vision/`.

**Dernière mise à jour** : 2026-03-30

---

## État actuel — Ce qui existe

### Back-office MJ

| Fonctionnalité | État |
|---|---|
| Authentification (email + mot de passe) | ✅ |
| Dashboard des campagnes | ✅ |
| Détail campagne + liste personnages | ✅ (non audité) |
| Feuille de personnage joueur (MJ) | ✅ (non audité) |
| Fiches PNJ | ❌ |
| Fiches ennemis + encodage NFC | ❌ |

### Panneau session MJ

| Fonctionnalité | État |
|---|---|
| Créer / activer une scène | ✅ |
| Upload battlemap | ✅ |
| Ajouter une entité (ennemi, PNJ, objet, zone) | ✅ |
| Visibilité par entité | ✅ |
| Tokens sur la battlemap (position fixe) | ✅ |
| Drag & drop des tokens | ❌ |
| Voir les joueurs connectés en temps réel | ✅ |
| Code de session partageable | ✅ |
| Terminer une session | ✅ |
| Contrôle mode affichage TV | ❌ |
| Gestion overlays TV | ❌ |
| Fil d'initiative | ❌ |
| Gestion loot post-combat | ❌ |
| Gestion inventaire PNJ en live | ❌ |

### Affichage TV

| Fonctionnalité | État |
|---|---|
| Layout plein écran `/display/[sessionId]` | ✅ (implémenté, non testé) |
| Waiting Screen (fond d'écran + cascade) | ❌ |
| Mode Battlemap (battlemap + tokens) | ✅ partiel (pas d'images sur tokens) |
| Fil d'initiative | ❌ |
| Mode Voyage (carte interactive + marqueurs) | ❌ |
| Overlays en cascade | ❌ |
| Animations spawn NFC par rareté | ❌ |

### Intégration NFC

| Fonctionnalité | État |
|---|---|
| Endpoint `/api/nfc/trigger` | ❌ |
| Décodage base64 côté serveur | ❌ |
| Authentification Pico (NFC_SECRET) | ❌ |

### Vue joueur (téléphone)

| Fonctionnalité | État |
|---|---|
| Rejoindre via join_code + nom | ✅ |
| Sélection de personnage au join | ❌ |
| Voir la scène active + battlemap | ✅ |
| Tokens des entités visibles | ✅ |
| Feuille de perso interactive (HP, notes) | ❌ (lecture seule) |
| Inventaire temps réel | ❌ |
| Annonces MJ → joueurs | ❌ |

---

## Ce qui reste à construire

### 🔴 Phase 1 — Fondations session live

#### C1+C2 — Affichage TV : Waiting Screen + Battlemap complets
- Cascade de résolution du fond d'écran (scène → session → campagne → noir)
- Images sur les tokens (portrait joueur, artwork ennemi/PNJ)
- `sessions.display_mode` piloté depuis le panneau MJ

*Spec détaillée : `vision/feature-display-tv.md`*

#### D1+D2+D3 — Intégration NFC complète
- Endpoint `/api/nfc/trigger` avec auth `NFC_SECRET`
- Décodage base64 → création entité dans la scène active
- Animation de spawn selon rareté sur la TV

*Spec détaillée : à écrire dans `vision/feature-nfc.md`*

#### B1 — Modification des stats en live
- Modifier l'endurance d'un ennemi depuis `GMEntityBadge`
- Drag & drop des tokens sur la battlemap + sync Realtime

#### B5 — Fil d'initiative
- Démarrer un combat : sélection participants + valeurs d'initiative
- Bandeau sur la TV, avancement du tour depuis le panneau MJ
- Champs `in_combat`, `initiative`, `is_current_turn` sur `scene_entities`

---

### 🔴 Phase 2 — Loot & inventaires

#### A1 — Fiche ennemi complète
- Stats de combat (endurance, parade, armure, etc.)
- Rareté (`common` / `uncommon` / `rare` / `legendary`)
- Table de loot (objets droppables définis à l'avance)
- Artwork uploadable (token battlemap + overlay TV)
- Export données → base64 pour écriture sur puce NFC

#### A2 — Fiche PNJ
- Stats légères + portrait
- Inventaire gérable en live depuis le panneau session

#### A3 — Fiche personnage joueur enrichie
- Structure complète (stats, compétences, équipement)
- Inventaire géré par le MJ (attribution loot) et le joueur (notes, consommables)
- `portrait_url` pour le token battlemap

#### B3 — Gestion loot post-combat
- Drop ennemi vaincu → objets invisibles dans la scène
- Ajout manuel d'objets invisibles
- Révélation + distribution aux joueurs → inventaire mis à jour en temps réel

#### B4 — Gestion inventaire PNJ en live
- Ouvrir l'inventaire d'un PNJ depuis le panneau session
- Donner / prendre des objets à un PNJ ou à un joueur

#### E3 — Inventaire joueur temps réel
- Souscription Realtime sur les changements d'inventaire
- Notification toast à la réception d'un objet

---

### 🟠 Phase 3 — Vue joueur enrichie & overlays TV

#### E1 — Sélection de personnage au join
- Liste des personnages disponibles après saisie du join_code + nom
- Persistance `character_id` dans localStorage

#### E2 — Feuille de perso interactive
- Modification HP / endurance depuis `/player/scene`
- Prise de notes personnelles
- Transite par un server endpoint (jamais écriture directe côté joueur)

#### C3+C4 — Overlays TV & mode Voyage
- Overlays en cascade : fiches, artworks, textes libres poussés depuis le panneau MJ
- Mise en évidence d'un overlay (premier plan, agrandi)
- Mode Voyage : carte monde + marqueur de groupe + annotations MJ + règles de voyage

*Spec détaillée : `vision/feature-display-tv.md`*

#### E4 — Annonces MJ → joueurs
- Messages narratifs / alertes envoyés depuis le panneau session
- Overlay toast sur `/player/scene` et optionnellement sur la TV

---

### 🟡 Phase 4 — Polish & infrastructure

#### F1 — Mode préparation de session
Préparer scènes et entités avant de lancer la session.

#### F2 — Statuts visuels sur les tokens
Icônes ou couleurs (blessé, mort, effet de statut).

#### F3 — Dés virtuels
Interface de lancer de dés sur téléphone. Résultats publics ou privés.

#### F4 — Historique de session
Log des événements clés — utile pour le compte-rendu post-session.

#### G1 — Rate-limiting
`/api/session/join` et `/api/nfc/trigger` — middleware Nitro par IP.

#### G2 — TTL sessions
Fermeture automatique des sessions inactives via trigger Postgres ou cron Supabase.

#### G3 — PWA
Manifest + service worker pour l'expérience mobile joueur.

#### G4 — Audit pages GM
Vérifier jointures ambiguës et gestion d'erreur sur les pages non auditées.

---

## Ordre d'implémentation suggéré

```
Phase 1 — Fondations session live
  └─ Affichage TV complet (modes + fond d'écran + images tokens)
  └─ Endpoint NFC + animations spawn
  └─ Modification stats en live + drag & drop tokens
  └─ Fil d'initiative

Phase 2 — Loot & inventaires
  └─ Fiche ennemi + table de loot
  └─ Fiche PNJ + inventaire
  └─ Fiche joueur enrichie
  └─ Gestion loot post-combat + distribution
  └─ Inventaire joueur temps réel

Phase 3 — Vue joueur enrichie & overlays TV
  └─ Sélection personnage au join
  └─ Feuille de perso interactive
  └─ Overlays TV en cascade
  └─ Mode Voyage
  └─ Annonces MJ → joueurs

Phase 4 — Polish & infra
  └─ Statuts visuels, dés, historique
  └─ Rate-limiting, TTL, PWA, audit
```
