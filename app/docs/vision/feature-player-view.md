# Feature — Vue joueur téléphone

> Référence principale : [`README.md`](./README.md)
> Fiche personnage : [`feature-characters.md`](./feature-characters.md)
> Loot & inventaire : [`feature-loot.md`](./feature-loot.md)
> Affichage TV : [`feature-display-tv.md`](./feature-display-tv.md)
> Stats live : [`feature-live-stats-dragdrop.md`](./feature-live-stats-dragdrop.md)

**Réf. roadmap** : E1, E2, E3, E4

---

## Principe général

Le téléphone du joueur est son **écran secondaire personnel** pendant la session. Après avoir rejoint via un `join_code`, il peut :

- Voir la scène active (mode spectateur, identique à la TV)
- Sélectionner son personnage et consulter/modifier sa fiche
- Recevoir les objets loottés et les annonces du MJ en temps réel

La TV reste la source d'affichage principale à la table. Le téléphone est un complément individuel.

---

## 1. Flux de join enrichi (E1)

### 1.1 Étapes

Le join se déroule en deux étapes successives sur `/player/join`.

**Étape 1 — Identification** *(existante)*
- Saisie du `join_code` (6 caractères) + prénom/pseudo
- Prévisualisation du nom de campagne en live (debounce 300ms)
- `POST /api/session/join` → retourne `session_id` + `participant_id` (sauvegardés en localStorage)

**Étape 2 — Sélection du personnage** *(nouvelle)*
- Après un join réussi, affiche la liste des personnages disponibles dans la campagne
- Un personnage est **disponible** si aucun enregistrement `session_participants` de cette session n'a ce `character_id` avec le statut actif. Un participant est considéré actif dès l'instant où il a rejoint la session (entrée dans `session_participants`) et jusqu'à la fin de la session.
- Un participant = une entrée dans la table `session_participants` avec un `character_id` non nul
- Le joueur clique sur un personnage → `PATCH /api/session/[id]/participants/[pid]/character` → sauvegarde `character_id` en localStorage
- Le joueur peut aussi **passer sans personnage** ("Continuer sans personnage") → mode spectateur uniquement
- Après sélection (ou skip) → redirection vers `/player/scene`

### 1.2 Affichage de la liste

Chaque carte personnage affiche :
- Nom du personnage
- Nom du joueur associé (pré-rempli sur la fiche, indicatif)
- Portrait (si disponible)
- Culture / vocation (résumé en une ligne)

### 1.3 Pas de changement de personnage entre sessions

Le `character_id` persisté dans le localStorage est définitif pour la session. Un joueur ne peut pas re-sélectionner un autre personnage sans effacer son localStorage (= quitter et rejoindre).

### 1.4 Réassignation par le MJ

Le MJ peut réassigner un personnage (ou un PNJ) à n'importe quel participant depuis le panneau session — par exemple si un personnage meurt et que le joueur doit jouer un PNJ. Cela met à jour `session_participants.character_id` en base, ce qui déclenche un événement Realtime. Le client joueur écoute ce changement et met à jour son `character_id` local + recharge les données du personnage.

### 1.5 Modèle de données — table `session_participants`

Ajout de la colonne `character_id` :

```sql
alter table session_participants
  add column character_id uuid references characters(id) on delete set null;

create index on session_participants(character_id);
```

### 1.6 Endpoints

| Endpoint | Méthode | Acteur | Description |
|---|---|---|---|
| `/api/session/[id]/characters/available` | GET | Joueur (validé) | Personnages de la campagne non assignés dans cette session |
| `/api/session/[id]/participants/[pid]/character` | PATCH | Joueur (validé) | Assigne `character_id` au participant |
| `/api/session/[id]/participants/[pid]/character` | PATCH | MJ (auth) | Réassigne un personnage à n'importe quel participant |

---

## 2. Mode spectateur (joueur sans personnage)

Si le joueur a rejoint sans sélectionner de personnage, `/player/scene` affiche le **mode spectateur** :

- Identique au contenu de `/display/[sessionId]` (battlemap, tokens, entités visibles)
- Adapté au layout mobile (pas de header MJ, pas d'interface interactive)
- Toujours mis à jour en temps réel via Supabase Realtime
- Un bouton "Choisir un personnage" est visible dans la barre de status (si des personnages sont encore disponibles)

---

## 3. Vue scène joueur (`/player/scene`) avec personnage

### 3.1 Structure de la page

La page est divisée en deux zones :

**Zone haute — Scène active**
- Battlemap + tokens des entités visibles (identique au mode spectateur)
- Nom de la scène active
- En attente de scène : message d'attente

**Barre de status fixe (top)**
- Prénom du joueur + nom du personnage
- Badge statut session (active / en attente)
- Bouton "Feuille de perso" → ouvre le slideover fiche
- Bouton "Quitter"

**Overlay endurance/espoir (toujours visible)**
- Affiché en position fixe bas d'écran, par-dessus toutes les zones
- Voir section 4.5

**Panneau entités (bas)**
- Liste compacte des ennemis, PNJ, objets visibles (existant)

### 3.2 Ouverture de la fiche

Un bouton dans la barre de status ouvre la fiche en **plein écran** (`USlideover` côté droit, `w-full`). La fiche prend toute la hauteur et largeur de l'écran sur mobile.

---

## 4. Fiche personnage joueur — navigation par onglets (E2)

### 4.1 Structure

La fiche est organisée en **7 onglets fixes + 1 onglet contextuel** navigables par swipe (ou via une barre de navigation fixe en bas de la fiche). Chaque onglet est un affichage vertical scrollable.

| # | Onglet | Icône | Contenu | Visibilité |
|---|---|---|---|---|
| 1 | **Identité** | `i-heroicons-user` | Vocation, niveau de vie, garant, particularités, défauts | Toujours |
| 2 | **Vitalité** | `i-heroicons-heart` | Endurance max/courante, charge totale, fatigue, espoir max/courant, ombres, séquelles | Toujours |
| 3 | **Compétences** | `i-heroicons-academic-cap` | 18 compétences communes (Corps / Cœur / Esprit), rang + favorisé | Toujours |
| 4 | **Sagesse & Vaillance** | `i-heroicons-star` | Vertus choisies, récompenses choisies, rangs Sagesse/Vaillance, points (aventure / progression / communauté) | Toujours |
| 5 | **Attirail de guerre** | `i-heroicons-shield-check` | 4 emplacements armes, compétences de combat (rang) | Toujours |
| 6 | **Défense** | `i-heroicons-shield-exclamation` | Armure, casque, bouclier, parade totale, valeur de protection | Toujours |
| 7 | **Inventaire** | `i-heroicons-archive-box` | Attirail de voyage, objets lootés, trésor | Toujours |
| 8 | **Voyage** | `i-heroicons-map` | Rôle, compétence associée, fatigue du voyage, événements résolus | Seulement si `activeScene.type === 'journey'` |

> L'ordre des onglets est fixe. L'onglet Voyage apparaît dynamiquement en fin de liste quand un voyage est en cours. Sur téléphone, la navigation par swipe gauche/droite est la principale.

### 4.2 Onglet 1 — Identité

Lecture seule pour le joueur (ces données sont créées et éditées par le MJ uniquement).

- Nom du personnage + portrait (si disponible)
- Culture (nom affiché, lien vers fiche culture si pertinent)
- Vocation
- Niveau de vie (`quality_of_life`)
- Garant
- Particularités (liste)
- Défauts (liste)

### 4.3 Onglet 2 — Vitalité

C'est l'onglet principal pour les modifications en cours de jeu.

**Lecture seule :**
- Endurance max (calculée : `strength + culture.endurance_bonus + Σ modifiers`)
- Espoir max (calculé : `heart + culture.hope_bonus + Σ modifiers`)
- Charge totale (poids armes + armure + casque + bouclier, après modifiers `clever`)

**Modifiable par le joueur :**
- `current_endurance` : champ numérique +/− avec indicateur max
- `current_hope` : champ numérique +/− avec indicateur max
- `fatigue` : champ numérique +/−
- `shadows` : champ numérique +/−
- `sequels` : champ numérique +/−

**États auto (lecture seule, calculés en live) :**
- `exhaust` : affiché si `current_endurance < charge_totale + fatigue`
- `melancholic` : affiché si `current_hope < shadows`

**Modifiable par le joueur :**
- `states.hurt` : toggle manuel (interrupteur)
- `states.injury` : valeur + unité (heures / jours) — visible seulement si `hurt = true`

### 4.4 Onglet 3 — Compétences

Lecture seule hors mode level-up.

Trois groupes (Corps / Cœur / Esprit), chacun avec son attribut affiché en en-tête (valeur + SR calculé).

Chaque compétence :
- Nom
- Case "favorisé" (cochée ou non)
- Rang (affiché sous forme de points ou de chiffre)

**En mode level-up** (scène de type `community`) :
- Boutons +/− pour monter les rangs (si `progression_points` suffisants)
- Coût affiché à côté de chaque rang cible
- Solde de points mis à jour en temps réel pendant la dépense

### 4.5 Onglet 4 — Sagesse & Vaillance

**Sagesse** :
- Rang actuel
- Liste des vertus choisies (nom, variante retenue, description courte)

**Vaillance** :
- Rang actuel
- Liste des récompenses choisies (nom, cible, description courte)

**Points** :
- `adventure_points` (points d'aventure)
- `progression_points` (points de progression)
- `community_points` (points de communauté)

**En mode level-up** :
- Bouton "Acquérir une vertu" → ouvre un sélecteur des vertus disponibles (ordinaires + culturelles selon rang)
- Bouton "Acquérir une récompense" → ouvre un sélecteur des récompenses disponibles
- Coût affiché, solde mis à jour en temps réel

### 4.6 Onglet 5 — Attirail de guerre

Lecture seule pour le joueur (les armes sont gérées par le MJ).

**Armes (4 emplacements) :**
- Nom, dégâts, seuil blessure 1 main / 2 mains, poids
- Récompenses appliquées (icônes ou labels)
- Emplacement vide = case grisée

**Compétences de combat :**
- `axes`, `bows`, `spears`, `swords` — rang uniquement (pas de favorisé)

**En mode level-up** :
- Boutons +/− pour monter les rangs (si `progression_points` suffisants)

### 4.7 Onglet 6 — Défense

Lecture seule pour le joueur.

- **Armure** : nom, protection (Xd), poids, récompenses
- **Casque** : nom, protection (Xd), poids, récompenses
- **Bouclier** : nom, bonus parade, poids, récompenses
- **Parade totale** : calculée (`mind + culture.parade_bonus` + bonus bouclier + modifiers)
- Emplacement vide = case grisée

### 4.8 Onglet 7 — Inventaire

- Liste de tous les items (`inventory`) avec nom, quantité, notes
- Items `source: 'loot'` distingués visuellement (icône ou badge)
- `skill_ref` affichée si présente (nom de la compétence liée)
- **Modifiable par le joueur** : ajout de notes sur un item, suppression (consommation)
- **Trésor** : champ numérique éditable

### 4.10 Onglet 8 — Voyage (contextuel)

Visible uniquement quand `activeScene.type === 'journey'`. Si aucun voyage n'est en cours : message **"Aucun voyage en cours"** (onglet masqué ou grisé).

> Spec complète : voir [`feature-journey.md`](./feature-journey.md) — section "Téléphone joueur — Onglet Voyage".

**Contenu :**
- Rôle assigné au personnage (Guide / Éclaireur / Gardien / Pourvoyeur), ou "Aucun rôle"
- Compétence à utiliser pour ce rôle (ex: "Voyage" pour Guide)
- Fatigue accumulée lors de ce voyage (somme des événements `fatigue` appliqués)
- Date courante dans l'univers (`campaigns.current_date`)
- Liste des événements résolus (ordre chronologique) :
  - Type d'événement (Maladie, Mauvais Temps, Perdus…)
  - Personnage déclenché / touché
  - Conséquence appliquée (ex: "+2 Fatigue")

---

### 4.9 Overlay endurance/espoir (persistant)

Un bandeau fixe affiché **en bas de la fiche, sur tous les onglets** (position sticky bottom) :

```
[ ❤️ 14 / 18 ]  [ ✨ 7 / 12 ]  [ 🩹 Blessé ]  [ 😰 Épuisé ]
```

- Endurance courante / max
- Espoir courant / max
- États actifs (icônes) : épuisé, mélancolique, blessé, blessure (durée)
- Tap sur endurance ou espoir → ouvre directement l'onglet Vitalité

---

## 5. Mode level-up (scène de type `community`)

Quand `activeScene.type === 'community'`, la fiche passe automatiquement en **mode level-up** :

- Un bandeau "Scène de communauté — Mode progression" s'affiche en haut de la fiche, avec :
  - Le **nom du havre actuel** (`campaigns.current_haven` → `game_system_havens.name`)
  - Le **bonus de récupération** du havre (ex: "+2 Espoir au-delà de Cœur")
  - Icône sanctuary
- Les onglets Compétences, Attirail de guerre et Sagesse & Vaillance activent leurs contrôles d'édition
- Les points disponibles sont affichés en permanence dans l'overlay bas (à côté des états)
- Le mode se désactive automatiquement quand le MJ change de scène (événement Realtime)

Les modifications level-up transitent par `/api/characters/[id]/level-up` (POST) — voir `feature-characters.md` section 15.

---

## 6. Inventaire temps réel (E3)

### 6.1 Souscription Realtime

Le client joueur souscrit aux changements de la table `characters` pour son `character_id`. Sur tout événement `UPDATE` :

1. Fetch ciblé de la fiche via `/api/characters/[id]`
2. Mise à jour locale des données (réactif)
3. Si le diff contient de nouveaux items dans `data.inventory` → déclenche un toast de réception

### 6.2 Toast de réception d'objet

Affiché **partout dans `/player/**`** (via un composable global ou un composant de layout).

Contenu du toast :
- Icône ou petite image de l'objet (si `item_id` référencé dans le catalogue avec une image)
- Nom de l'objet
- Quantité si > 1
- Message : "Vous avez reçu **[Nom]**"
- Durée : 5 secondes, non bloquant

> Si plusieurs objets arrivent en même temps (distribution groupée), un toast par objet est empilé.

---

## 7. Annonces MJ (E4)

### 7.1 Table Supabase

```sql
create table session_announcements (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  message    text not null,
  target     text not null check (target in ('players', 'tv', 'all')),
  created_at timestamptz not null default now()
);

create index on session_announcements(session_id, created_at desc);

alter table session_announcements enable row level security;

-- MJ : accès complet
create policy "MJ accès complet" on session_announcements
  for all using (
    session_id in (
      select s.id from sessions s
      join campaigns c on c.id = s.campaign_id
      where c.gm_user_id = auth.uid()
    )
  );

-- Joueur : lecture via server endpoint uniquement
-- (Realtime sur la table est activé — le filtre `target` est appliqué côté client)

alter publication supabase_realtime add table session_announcements;
```

### 7.2 Envoi depuis le panneau MJ

Dans le panneau session MJ, un composant "Annonce" (zone de texte + radio de ciblage) :

| Option | Comportement |
|---|---|
| **Joueurs uniquement** | Toast sur tous les téléphones joueurs, rien sur TV |
| **TV uniquement** | Toast + historique sur TV, rien sur les téléphones |
| **Tout le monde** | Toast téléphones + Toast/historique TV |

Bouton "Envoyer" → `POST /api/session/[id]/announcements` (MJ auth).

### 7.3 Réception sur téléphone joueur

Le client joueur souscrit à la table `session_announcements` via Realtime (filtre sur `session_id`).

Sur un INSERT avec `target IN ('players', 'all')` :
- Affiche un toast non bloquant (5 secondes)
- Icône narrative (ex. `i-heroicons-megaphone`)
- Contenu : message brut tel qu'envoyé par le MJ
- Visible partout dans `/player/**`
- **Pas d'historique côté téléphone** — les toasts disparaissent

### 7.4 Réception sur TV

L'affichage TV (`/display/[sessionId]`) souscrit à `session_announcements`.

Sur un INSERT avec `target IN ('tv', 'all')` :
- Toast affiché en overlay (haut ou bas de l'écran, à définir dans `feature-display-tv.md`)
- L'annonce est également ajoutée à un **historique des événements** sur la TV (fil de log latéral ou bottom bar — voir `feature-display-tv.md` pour le layout)

### 7.5 Endpoint

| Endpoint | Méthode | Acteur | Description |
|---|---|---|---|
| `/api/session/[id]/announcements` | POST | MJ (auth) | Crée une annonce avec `message` + `target` |

---

## 8. Routes & layout

| Route | Accès | Description |
|---|---|---|
| `/player/join` | Anonyme | Étape 1 (code + nom) puis Étape 2 (sélection personnage) |
| `/player/scene` | Joueur (middleware) | Vue principale : scène + accès fiche via slideover |
| `/player/sheet` | Joueur (middleware) | Redirige vers `/player/scene` (la fiche est accessible via le slideover) |

> `/player/sheet` est conservé en tant que route pour compatibilité (bookmarks existants) mais redirige vers `/player/scene` qui gère tout.

**Layout** : `default` sur `/player/join`, layout custom mobile-first sur `/player/scene` (pas de sidebar MJ, header réduit).

---

## 9. Résumé des modifications Supabase

| Table | Modification |
|---|---|
| `session_participants` | Nouvelle colonne `character_id uuid references characters(id)` |
| `session_announcements` | Nouvelle table (voir section 7.1) |

---

## 10. Résumé des nouveaux endpoints

| Endpoint | Méthode | Acteur | E |
|---|---|---|---|
| `/api/session/[id]/characters/available` | GET | Joueur | E1 |
| `/api/session/[id]/participants/[pid]/character` | PATCH | Joueur + MJ | E1 |
| `/api/characters/[id]` | GET | Joueur | E2/E3 |
| `/api/session/[id]/announcements` | POST | MJ | E4 |
