# Roadmap fonctionnelle — Compagnon JdR

> Référence principale : [`vision/README.md`](./vision/README.md)
> Pour le détail des features, voir les fichiers dédiés dans `/vision/`.

**Dernière mise à jour** : 2026-04-05

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

### 🔴 Phase 0 — Préalable critique (bloquant pour tout le reste)

Ces features structurent les données de référence du jeu. Aucune fiche (personnage, ennemi, PNJ) ne peut être complète sans elles.

#### G0 — Système de jeu global (`/gm/system`)
- CRUD cultures : stats de départ, bonus Endurance/Espoir/Parade, compétences favorisées initiales, compétences de combat de départ
- CRUD vertus ordinaires : identifiant, variantes, modifiers (SR, Endurance max, Espoir max, Parade…)
- CRUD vertus culturelles : liées à une culture, disponibles à partir du rang 2 de Sagesse
- CRUD récompenses : cibles valides (arme/armure/casque/bouclier), modifiers
- CRUD Havres : nom, bonus d'Espoir en Phase de Communauté

*Spec : `vision/feature-game-system.md`*

#### H0 — Gestion de campagne enrichie (`/gm/campaigns/[id]`)
- Hub central MJ : grille de cards de navigation (personnages, ennemis, sessions, armurerie, médiathèque, carte, configuration)
- En-tête campagne : nom + date in-game courante + bouton "Lancer / Reprendre la session"
- Date in-game (`campaigns.current_date`) : format `{year, month, day}`, affichée sur TV dans tous les modes (haut centre, sous le titre de scène)
- Avance manuelle de la date : champ `+X jours` dans `/settings` + option "X jours écoulés" à la création d'une session
- Configuration campagne : `start_date`, `current_date`, `current_season` (calculée ou overridée), `current_haven_id`, `travel_rules`, `wallpaper_url`
- Armurerie par campagne : catalogue armes (`campaign_weapons`) + armures/casques/boucliers (`campaign_armors`) avec pré-remplissage données TOR de base

*Spec : `vision/feature-campaign-management.md` + `vision/feature-game-system.md` (sections 5, 6, 7)*

#### I0 — Media Library (`/gm/campaigns/[id]/media`)
- Bibliothèque d'images par campagne : upload, organisation par catégorie (`portrait`, `artwork`, `battlemap`, `map`, `item`, `other`)
- Image Picker transverse : composant réutilisable depuis toute page back-office MJ (sélection d'une image par catégorie)
- Mappings NFC : liaison famille d'ennemi → image par défaut (résolution automatique au spawn NFC)

*Spec : `vision/feature-media-library.md`*

---

### 🔴 Phase 1 — Fondations session live

#### C1+C2 — Affichage TV : Waiting Screen + Battlemap complets
- Waiting Screen : cascade de résolution du fond d'écran (scène → session → campagne → wallpaper_url → noir) ; si la campagne a au moins un voyage terminé → affiche la carte cumulative des voyages
- Images sur les tokens : portrait PJ (`characters.portrait_url`), artwork ennemi/PNJ (`combatants.artwork_url`), fallback icône colorée
- `sessions.display_mode` piloté depuis le panneau MJ
- Date in-game toujours visible en haut centre de la TV (tous modes), en italique sous le titre de scène

*Spec : `vision/feature-display-tv.md`*

#### D1+D2+D3 — Intégration NFC complète
- Endpoint `/api/nfc/trigger` avec auth `NFC_SECRET`
- Décodage base64 (CBOR) → création entité dans la scène active
- Résolution image depuis les mappings NFC (famille ennemi → `artwork_url`)
- Animation de spawn selon rareté sur la TV

*Spec : `vision/feature-nfc.md` + `vision/feature-nfc-encoding.md`*

#### B1 — Stats en live + Drag & drop tokens
- Drag & drop libre des tokens sur la battlemap, sync temps réel TV (throttle ~30/s, update direct Supabase client MJ)
- Position stockée en % (0–100) dans `scene_entities.position`
- Entités cachées (`visible_to_players = false`) : semi-transparentes sur la map MJ, absentes de la TV ; révélation manuelle par le MJ
- Popover édition rapide ennemis/PNJ : endurance
- Popover édition rapide PJ : endurance, espoir, blessures (via server endpoint sur `characters.data`)

*Spec : `vision/feature-live-stats-dragdrop.md`*

#### B5 — Fil d'initiative
- Modal de préparation : sélection des entités de la scène, saisie initiative ou drag & drop ordre
- Ajout d'entités à la volée pendant le combat (invocations, embuscades)
- Bandeau TV style BG3 en bas de la battlemap : portrait, nom, endurance PJ visible, ennemis/PNJ masqués
- Entité active mise en avant ; compteur de rounds discret
- Entités à 0 endurance grisées, tour sauté automatiquement
- Fin de combat déclenchée par le MJ (ou auto si tous les ennemis à 0)
- Champs : `sessions.combat_active`, `sessions.combat_round`, `scene_entities.in_combat`, `scene_entities.initiative_order`, `scene_entities.is_current_turn`

*Spec : `vision/feature-initiative.md`*

---

### 🔴 Phase 2 — Fiches & Loot

#### A1+A2 — Fiches ennemis & PNJ
- Table unifiée `combatants` (`kind: 'enemy' | 'npc'`)
- Stats TOR : niveau d'attribut, endurance, puissance, haine/détermination, parade, armure, seuil de blessure
- Compétences de combat (tableau) + capacités redoutables (tableau)
- Artwork uploadable via Image Picker, famille pour résolution image NFC
- Table de loot sur la fiche (ennemis + PNJ optionnel)
- Inventaire PNJ gérable en live depuis le panneau session
- Export données ennemi → base64 (CBOR) pour puce NFC

*Spec : `vision/feature-enemies.md`*

#### A3 — Fiche personnage joueur complète (TOR)
- Modèle `TORCharacterData` (JSONB) : vocation, âge, niveau de vie, garant, particularités, défauts
- Attributs primaires (Corps/Cœur/Esprit) + stats dérivées calculées (SR, Endurance max, Espoir max, Parade)
- 18 compétences communes (rang + favorisé) + 4 compétences de combat (rang)
- Sagesse & Vertus : rangs, vertus ordinaires + culturelles avec variantes et modifiers
- Vaillance & Récompenses : rangs, récompenses appliquées à l'équipement avec modifiers
- Équipement : 4 slots d'armes, armure/casque/bouclier (tirés du catalogue ou saisis librement)
- Inventaire unifié (attirail + loot) + trésor
- États auto (Épuisé, Mélancolique) + états manuels (Blessé, blessure avec durée)
- Points : aventure, progression, communauté
- Mode level-up (scène de type `community`) : dépense des points pour monter compétences, Sagesse, Vaillance
- `portrait_url` pour token battlemap et overlay TV
- Export NFC (snapshot stats essentielles en CBOR)

*Spec : `vision/feature-characters.md`*

#### B3 — Gestion loot post-combat
- Drop ennemi vaincu → tirage probabiliste depuis la table de loot → objets invisibles dans la scène
- Ajout manuel d'objets invisibles
- Overlay de distribution : sélection objet → sélection destinataire → inventaire mis à jour en temps réel
- Items `source: 'loot'` distingués dans l'inventaire joueur

*Spec : `vision/feature-loot.md`*

#### B4 — Gestion inventaire PNJ en live
- Ouvrir l'inventaire d'un PNJ depuis le panneau session
- Donner / prendre des objets à un PNJ ou à un joueur

*Spec : `vision/feature-enemies.md`*

#### E3 — Inventaire joueur temps réel
- Souscription Realtime sur les changements `characters.data.inventory`
- Toast de réception d'objet (nom, quantité, 5 s, non bloquant)

*Spec : `vision/feature-player-view.md`*

---

### 🟠 Phase 3 — Vue joueur enrichie & Mode Voyage

#### E1 — Sélection de personnage au join
- Étape 2 du join : liste des personnages disponibles (non assignés à un participant actif)
- Persistance `character_id` dans localStorage
- Mode spectateur si le joueur passe sans personnage
- Réassignation possible par le MJ depuis le panneau session

*Spec : `vision/feature-player-view.md`*

#### E2 — Fiche personnage joueur interactive (8 onglets)
- Slideover plein écran depuis `/player/scene`, navigation par swipe
- Onglets : Identité · Vitalité · Compétences · Sagesse & Vaillance · Attirail de guerre · Défense · Inventaire · Voyage (contextuel, visible seulement si scène de type `journey`)
- Overlay persistant bas d'écran : endurance courante/max, espoir courant/max, états actifs
- Sections éditables par le joueur : `current_endurance`, `current_hope`, `fatigue`, `shadows`, `sequels`, `states.hurt`, `states.injury`, `treasure`, notes inventaire
- Mode level-up (scène `community`) : bandeau havre actuel + bonus Espoir, contrôles de dépense de points activés sur onglets Compétences, Attirail de guerre, Sagesse & Vaillance
- Toutes les modifications transitent par server endpoints (jamais d'écriture directe Supabase côté joueur)

*Spec : `vision/feature-player-view.md` + `vision/feature-characters.md`*

#### C5 — Mode Voyage
- Scènes de type `journey` : grille hexagonale interactive avec terrain coloré, marqueur de groupe, trail du chemin parcouru
- Pathfinding automatique (chemin minimal en jours) + modification manuelle hex par hex
- Calcul étapes (1 étape = 7 jours), total de jours, date d'arrivée estimée
- Rôles de voyage (Guide, Éclaireur, Gardien, Pourvoyeur) : assignation dans le panneau session, compétences associées
- Résolution d'étape : saisie des jets par personnage, détection Œil de Sauron → table d'événements (Maladie, Mauvais Temps, Perdus, L'Ombre s'étend, Rencontre, Mésaventure)
- Événement "Perdus" : recalcul automatique des étapes et de la date d'arrivée
- Application des conséquences mécaniques en 1 clic (Fatigue, Ombre sur `TORCharacterData`)
- Journal du voyage : log chronologique des événements résolus
- Fin de voyage : position mémorisée pour le prochain voyage, `campaigns.current_date` mise à jour
- TV mode Voyage : grille hex plein écran, titre overlay "3e Âge, XXXX — JJ mois → Arrivée estimée : JJ mois", bandeau bas dernier événement
- Téléphone joueur : onglet Voyage contextuel (rôle, fatigue accumulée, événements)
- Carte cumulative TV (mode attente) : tous les trails de voyages passés + position courante
- Back-office : CRUD cartes hex dans `/gm/system/maps` (image de fond, calibrage grille, terrain par hex, points d'intérêt)

*Spec : `vision/feature-journey.md` + `vision/feature-campaign-management.md`*

#### C3+C4 — Overlays TV
- Overlays en cascade poussés depuis le panneau MJ : fiches personnage, artworks, textes libres
- Mise en évidence d'un overlay (premier plan, agrandi)
- Overlay fiche personnage complète sur TV (déclenché par MJ ou scan NFC)

*Spec : `vision/feature-display-tv.md`*

#### E4 — Annonces MJ → joueurs
- Zone de texte + radio de ciblage dans le panneau session (joueurs / TV / tout le monde)
- Toast non bloquant sur `/player/**` (5 s)
- Toast + historique sur la TV

*Spec : `vision/feature-player-view.md`*

---

### 🟡 Phase 4 — Polish & infrastructure

#### F1 — Mode préparation de session
- Préparer scènes et entités avant de lancer la session (sans session active)

#### F2 — Statuts visuels sur les tokens
- Icônes ou couleurs sur les tokens : blessé, mort, effet de statut

#### F4 — Historique de session
- Log des événements clés d'une session
- Compte-rendu post-session, export Markdown

*Spec : `vision/feature-session-history.md` (à finaliser)*

#### G1 — Rate-limiting
- `/api/session/join` et `/api/nfc/trigger` — middleware Nitro par IP

#### G2 — TTL sessions
- Fermeture automatique des sessions inactives via trigger Postgres ou cron Supabase

#### G3 — PWA
- Manifest + service worker pour l'expérience mobile joueur

#### G4 — Audit pages GM
- Vérifier jointures ambiguës et gestion d'erreur sur les pages non auditées

#### G5 — Layout panneau session en combat
- Layout complet panneau MJ pendant un combat actif : zones initiative, tokens, actions rapides, stats ennemis

*Spec : `vision/feature-session-panel.md` (à rédiger)*

#### G6 — Raccourcis clavier
- Raccourci "Tour suivant" pendant un combat, autres raccourcis globaux du panneau session

*Spec : `vision/feature-shortcuts.md` (à rédiger)*

---

## Ordre d'implémentation suggéré

```
Phase 0 — Préalable critique
  └─ Système de jeu global (cultures, vertus, récompenses, havres)
  └─ Gestion de campagne enrichie (hub, date in-game, armurerie)
  └─ Media Library (upload, Image Picker, mappings NFC)

Phase 1 — Fondations session live
  └─ Affichage TV complet (modes + fond d'écran + images tokens + date in-game)
  └─ Endpoint NFC + animations spawn
  └─ Modification stats en live + drag & drop tokens
  └─ Fil d'initiative

Phase 2 — Fiches & Loot
  └─ Fiche ennemi + table de loot
  └─ Fiche PNJ + inventaire
  └─ Fiche joueur TOR complète (attributs, compétences, vertus, récompenses, équipement, mode level-up)
  └─ Gestion loot post-combat + distribution
  └─ Inventaire joueur temps réel

Phase 3 — Vue joueur enrichie & Mode Voyage
  └─ Sélection personnage au join
  └─ Fiche joueur interactive (8 onglets, overlay endurance/espoir, mode level-up)
  └─ Mode Voyage (carte hex, pathfinding, rôles, étapes, événements, calendrier)
  └─ Overlays TV en cascade
  └─ Annonces MJ → joueurs

Phase 4 — Polish & infra
  └─ Statuts visuels, historique de session
  └─ Rate-limiting, TTL, PWA, audit
  └─ Layout panneau session combat, raccourcis clavier
```
