# Vision — Compagnon JdR

> **Ce dossier est la référence principale du projet.**
> Tous les autres documents (`/docs/*.md`) doivent rester cohérents avec ce qui est défini ici.
> En cas de contradiction, ce dossier a priorité.

**Dernière mise à jour** : 2026-03-30

---

## C'est quoi ce projet ?

Une application web pour assister le MJ (Game Master) pendant ses sessions de jeu de rôle sur table.

Elle couvre deux grandes phases :

1. **Entre les sessions (back-office)** — préparer les campagnes, créer les fiches de personnages, PNJ, ennemis, encoder les puces NFC des figurines
2. **Pendant la session (live)** — piloter l'affichage spectateur sur TV, gérer les scènes, les entités, le loot, synchroniser tout ce qui se passe en temps réel

---

## Les acteurs

| Acteur | Identité | Interface |
|---|---|---|
| **MJ** | Authentifié (Supabase Auth) | Back-office + panneau session |
| **Joueur** | Anonyme (join_code + localStorage) | Vue téléphone (fiche perso, infos scène) |
| **Affichage TV** | Aucune (URL secrète) | Vue spectateur plein écran |
| **Raspberry Pi Pico** | Token secret partagé | Endpoint NFC uniquement |

---

## Les 4 surfaces de l'application

### 1. Back-office MJ (`/gm/**`)

La zone de préparation. Accessible uniquement au MJ authentifié.

**Gestion des campagnes**
- CRUD campagnes (nom, description, système de jeu)
- CRUD sessions au sein d'une campagne
- Association joueurs ↔ personnages

**Fiches personnages joueurs**
- Feuille de perso complète (stats, compétences, équipement)
- Inventaire gérable
- Le MJ crée et édite les fiches ; le joueur les consulte en session

**Fiches PNJ**
- Similaire aux personnages joueurs
- Inventaire gérable en live pendant la session (depuis le panneau MJ)

**Fiches ennemis**
- Stats de combat (endurance, parade, armure, etc.)
- Table de loot associée (objets droppables définis à l'avance)
- Encodage base64 pour export vers les puces NFC
- Un programme Node externe gère l'encodage ; l'app fournit les données à encoder

**Section dédiée ennemis + encodage NFC**
- Interface pour visualiser le contenu d'une puce (décodage base64 → fiche lisible)
- Interface pour préparer et exporter les données d'un ennemi vers une puce

---

### 2. Panneau session MJ (`/gm/.../session/[id]`)

L'interface principale du MJ pendant une session. Tout ce qui se passe ici se reflète immédiatement sur la TV et les téléphones joueurs.

**Gestion des scènes**
- Créer / activer une scène
- Upload d'une battlemap (image)
- Changer de scène active → mise à jour immédiate sur la TV

**Gestion des entités**
- Spawn manuel : PNJ, ennemi, objet, zone
- Spawn automatique via puce NFC (déclenché par le Pico, reçu via endpoint)
- Visibilité par entité (visible ou masqué pour les joueurs)
- Modification des stats en live (HP ennemi, etc.)
- Drag & drop des tokens sur la battlemap

**Gestion du loot**
- Les ennemis ont une table de loot définie sur leur fiche
- Quand un ennemi est vaincu, ses drops peuvent être ajoutés à la scène comme objets invisibles
- Le MJ peut aussi ajouter manuellement des objets invisibles dans la scène
- Le MJ révèle les objets aux joueurs quand il le décide
- Le MJ distribue les objets aux personnages joueurs → mise à jour inventaire en temps réel

**Gestion inventaire PNJ**
- Modifier l'inventaire d'un PNJ directement depuis le panneau session
- Donner / prendre des objets à un PNJ

**Vue synthétique combat**
- État HP de tous les ennemis actifs
- Statuts visuels (blessé, mort, effet)

---

### 3. Affichage spectateur TV (`/display/[sessionId]`)

Une URL ouverte dans le navigateur de la TV. Pas d'authentification, pas d'interface interactive — affichage pur.

- Battlemap plein écran
- Tokens des entités visibles positionnés sur la map
- Animations de spawn (apparition d'un ennemi via NFC ou MJ)
- Nom de la scène active
- Mise à jour 100% temps réel (Supabase Realtime)
- Pas de header, pas de bouton — layout `fullscreen` dédié

---

### 4. Vue joueur téléphone (`/player/**`)

Optionnelle mais enrichissante. Le joueur rejoint la session avec un `join_code` sur son téléphone. Il peut alors :

- Voir sa fiche de personnage (lecture + modifications : HP, notes)
- Voir son inventaire (mis à jour en temps réel quand le MJ distribue du loot)
- Voir les infos de la scène active (entités visibles, nom de scène)
- Recevoir des notifications / messages du MJ

La TV reste la source d'affichage principale à la table. Le téléphone est un écran secondaire personnel.

---

## Système NFC — Architecture

### Matériel
- **Raspberry Pi Pico** + lecteur NFC posé sur la table de jeu
- Quand une figurine (avec puce NFC) est posée, le Pico lit la puce et envoie les données à l'app

### Format des données
- Les données d'un ennemi sont encodées en **base64** sur la puce
- Un programme Node externe (existant) gère l'encodage
- L'app fournit les données source ; le programme Node produit le payload à écrire sur la puce

### Flux de déclenchement
```
Figurine posée sur table
        │
Raspberry Pi Pico lit la puce
        │
POST /api/nfc/trigger
  { payload: "<base64>", scene_id: "<id>" }
  Header: Authorization: Bearer <token_secret>
        │
Server endpoint Nitro
  1. Vérifie le token secret (partagé avec le Pico)
  2. Décode le base64 → données ennemi
  3. Crée l'entité dans la scène active
        │
Supabase Realtime émet l'INSERT
        │
    ┌───┴──────────────────┐
    ▼                      ▼
Panneau MJ             TV + téléphones joueurs
(notification spawn)   (token apparaît sur la map)
```

### Décision : décodage côté backend
Le Pico envoie les données brutes (base64). Le décodage se fait dans le server endpoint Nitro. Avantages :
- Le Pico reste simple (lire + envoyer)
- Le format peut évoluer sans toucher au firmware du Pico
- Les secrets de décodage restent côté serveur

---

## Système de loot — Modèle

```
Fiche ennemi (back-office)     Scène (MJ en live)
  └─ drop[] : Item[]        +   └─ objets ajoutés manuellement
              │                              │
              └──────────────┬──────────────┘
                             ▼
              Objets dans la scène (visible_to_players: false)
                             │
              Le MJ révèle ce qu'il veut quand il veut
                             │
                             ▼
              Joueurs voient les objets (TV + téléphones)
                             │
              MJ distribue un objet à un personnage
                             │
                             ▼
              Inventaire du personnage mis à jour (temps réel)
```

---

## Temps réel — Principe général

Toute modification de l'état de la session (scène active, entités, inventaires, loot) transite par Supabase. Tous les clients écoutent le Realtime.

**Sources de modification :**
- MJ via le panneau session (actions manuelles)
- Pico via endpoint NFC (spawn automatique)
- *(futur)* Actions joueur (déplacement token, modification HP perso)

**Destinataires :**
- Panneau MJ (feedback immédiat)
- Affichage TV (mise à jour visuelle)
- Téléphones joueurs (inventaire, infos scène)

---

## Ce qui n'est PAS dans ce projet

- Gestion des règles du jeu (calcul automatique des jets de dés, etc.) — l'app assiste, elle ne joue pas à la place du MJ
- Système de messagerie complexe — au plus des annonces MJ → joueurs
- Multi-MJ / collaboration — une campagne = un MJ

---

## Documents de référence secondaires

| Document | Rôle |
|---|---|
| `docs/roadmap.md` | Fonctionnalités priorisées + état d'avancement |
| `docs/architecture.md` | Décisions techniques d'implémentation |
| `docs/security.md` | Modèle de sécurité RLS et accès |
| `docs/todo.md` | Bugs connus et petites améliorations |
