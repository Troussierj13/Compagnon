# Feature — Fiche personnage joueur (TOR)

> Référence principale : [`README.md`](./README.md)
> Système de jeu (vertus, récompenses, cultures, armurerie) : [`feature-game-system.md`](./feature-game-system.md)
> Création de personnage : [`feature-character-creation.md`](./feature-character-creation.md)
> Stats live & drag & drop : [`feature-live-stats-dragdrop.md`](./feature-live-stats-dragdrop.md)
> Loot & inventaire : [`feature-loot.md`](./feature-loot.md)
> Affichage TV : [`feature-display-tv.md`](./feature-display-tv.md)
> Export NFC : [`feature-nfc.md`](./feature-nfc.md) + [`feature-nfc-encoding.md`](./feature-nfc-encoding.md)
> Images : [`feature-media-library.md`](./feature-media-library.md)

**Système de règles** : *The One Ring* (TOR) / *Anneau Unique*

---

## Principe général

La fiche personnage est le document central de chaque joueur. Elle modélise un personnage TOR avec ses attributs, compétences, équipement, états et progression. Elle est visible et modifiable depuis plusieurs surfaces selon l'acteur et le contexte.

**Deux acteurs** interagissent avec la fiche :
- **Le MJ** : accès total, peut tout modifier à tout moment (correction d'erreur ou modification classique de session)
- **Le joueur** : accès limité à son propre personnage, selon le contexte (voir section Surfaces)

---

## 1. Modèle de données

### 1.1 Table `characters`

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `campaign_id` | uuid FK | Campagne d'appartenance |
| `culture_id` | uuid FK | Référence vers la table `cultures` |
| `name` | text | Nom du personnage |
| `player_name` | text | Nom du joueur |
| `portrait_url` | text \| null | URL d'une image depuis la Media Library (token battlemap + overlay TV) |
| `data` | jsonb | Toutes les stats TOR — voir `TORCharacterData` ci-dessous |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | — |

### 1.2 Structure `TORCharacterData` (JSONB)

```typescript
interface TORCharacterData {
  // ── En-tête ─────────────────────────────────────────────────────────────
  vocation: string                        // ex: "Messager", "Érudit"
  age: number
  quality_of_life: QualityOfLife          // 'miserable' | 'poor' | 'modest' | 'adequate' | 'prosperous' | 'rich'
  garant: string                          // Protecteur/patron narratif
  particularities: string[]               // Saisie libre, définie à la création
  faults: string[]                        // Saisie libre

  // ── Attributs primaires ─────────────────────────────────────────────────
  attributes: {
    strength: number   // CORPS
    heart: number      // CŒUR
    mind: number       // ESPRIT
  }

  // ── Compétences communes (18) ────────────────────────────────────────────
  strength_skills: Record<StrengthSkillId, SkillData>
  heart_skills: Record<HeartSkillId, SkillData>
  mind_skills: Record<MindSkillId, SkillData>

  // ── Compétences de combat (4) ────────────────────────────────────────────
  combat_skills: Record<CombatSkillId, CombatSkillData>

  // ── Sagesse & Vertus ─────────────────────────────────────────────────────
  sagesse: {
    rank: number            // = nombre de vertus choisies
    virtues: ChosenVirtue[]
  }

  // ── Vaillance & Récompenses ──────────────────────────────────────────────
  vaillance: {
    rank: number            // = nombre de récompenses choisies
    rewards: ChosenReward[]
  }

  // ── Équipement de combat ─────────────────────────────────────────────────
  weapons: WeaponSlot[]    // max 4
  armor: ArmorSlot | null
  helm: ArmorSlot | null
  shield: ShieldSlot | null

  // ── Inventaire (attirail de voyage + objets loot) ─────────────────────────
  inventory: InventoryItem[]
  treasure: number          // En unité de monnaie de la campagne

  // ── État courant ─────────────────────────────────────────────────────────
  current_endurance: number
  current_hope: number
  fatigue: number           // Réduit l'endurance effective
  shadows: number           // Réduit l'espoir effectif
  sequels: number           // Séquelles cumulatives (trauma)

  // ── Conditions ───────────────────────────────────────────────────────────
  states: CharacterStates

  // ── Points de progression ────────────────────────────────────────────────
  adventure_points: number    // Dépensés pour monter Sagesse/Vaillance
  progression_points: number  // Dépensés pour monter les compétences
  community_points: number    // Narratif uniquement, pas de mécanique liée
}

// ── Sous-types ──────────────────────────────────────────────────────────────

interface SkillData {
  favored: boolean    // Compétence favorisée (checkbox)
  rank: number        // 0–6
}

interface CombatSkillData {
  rank: number        // 0–6, pas de favored
}

interface ChosenVirtue {
  virtue_id: string          // FK → table `virtues` (game system)
  chosen_variant: number     // Index du choix retenu (0 = variante par défaut)
  is_cultural: boolean       // true = vertu culturelle (disponible à partir de Sagesse rang 2)
  rank_acquired: number      // Rang de Sagesse auquel cette vertu a été gagnée (1, 2, 3…)
  // Règle : rank_acquired === 1 → is_cultural doit être false (rang 1 = vertu ordinaire obligatoire)
}

interface ChosenReward {
  reward_id: string   // FK → table `rewards` (game system)
  apply_to: RewardTarget  // 'armor' | 'helm' | 'shield' | 'weapon_0' | 'weapon_1' | 'weapon_2' | 'weapon_3'
}

interface WeaponSlot {
  item_id: string | null      // FK → catalogue items (null = arme saisie manuellement)
  name: string                // Dénormalisé pour l'affichage
  dmg: number
  injury_one_hand: number     // Seuil blessure une main (ex: 16–20)
  injury_two_hand: number     // Seuil blessure deux mains
  weight: number
  notes: string | null
  reward_ids: string[]        // IDs des récompenses appliquées à cette arme
}

interface ArmorSlot {
  item_id: string | null
  name: string
  protection: number          // Valeur de dé (ex: 1 pour "1d protection")
  weight: number
  reward_ids: string[]
}

interface ShieldSlot {
  item_id: string | null
  name: string
  parade_bonus: number        // Bonus de parade (ex: +1, +2, +3)
  weight: number
  reward_ids: string[]
}

interface InventoryItem {
  item_id: string | null        // FK → catalogue items (null = objet saisi manuellement)
  name: string                  // Dénormalisé
  quantity: number
  skill_ref: SkillId | null     // Référence compétence (attirail de voyage)
  notes: string | null
  source: 'manual' | 'loot'    // Origine de l'objet
}

interface CharacterStates {
  exhaust: boolean    // Auto : current_endurance < poids_total + fatigue
  melancholic: boolean // Auto : current_hope < shadows
  hurt: boolean        // Toggle manuel
  injury: { value: number; unit: 'hours' | 'days' } | null
}
```

### 1.3 Identifiants de compétences

```typescript
type StrengthSkillId  = 'awe' | 'athletics' | 'awareness' | 'hunting' | 'song' | 'craft'
type HeartSkillId     = 'enhearten' | 'travel' | 'insight' | 'healing' | 'courtesy' | 'battle'
type MindSkillId      = 'persuade' | 'stealth' | 'scan' | 'explore' | 'riddle' | 'lore'
type CombatSkillId    = 'axes' | 'bows' | 'spears' | 'swords'
type SkillId          = StrengthSkillId | HeartSkillId | MindSkillId | CombatSkillId

type QualityOfLife = 'miserable' | 'poor' | 'modest' | 'adequate' | 'prosperous' | 'rich'
type RewardTarget  = 'armor' | 'helm' | 'shield' | 'weapon_0' | 'weapon_1' | 'weapon_2' | 'weapon_3'
```

---

## 2. Attributs primaires & stats dérivées

### 2.1 Attributs primaires

| Attribut | Identifiant | Plage | Description |
|---|---|---|---|
| CORPS | `strength` | 1–10 | Force physique, endurance |
| CŒUR | `heart` | 1–10 | Courage, volonté, espoir |
| ESPRIT | `mind` | 1–10 | Intelligence, perception |

### 2.2 Stats dérivées (calculées, jamais stockées)

| Stat dérivée | Formule | Affectée par modifiers |
|---|---|---|
| Seuil de réussite Corps (SR) | `20 − strength` | Vertu `empowered` (−1 SR) |
| Seuil de réussite Cœur (SR) | `20 − heart` | Vertu `empowered` (−1 SR) |
| Seuil de réussite Esprit (SR) | `20 − mind` | Vertu `empowered` (−1 SR) |
| Endurance max | `strength + culture.endurance_bonus + Σ(modifiers des vertus avec target='endurance_max')` | Vertu `resistance` (+2) |
| Espoir max | `heart + culture.hope_bonus + Σ(modifiers des vertus avec target='hope_max')` | Vertu `assurance` (+2) |
| Parade de base | `mind + culture.parade_bonus + Σ modifiers` | Vertu `liveness` (+1), récompense `reinforced` bouclier |
| Poids total | somme des poids armes + armure + casque + bouclier | Récompense `clever` (−2 poids) |

> **Bonus culture** : chaque culture définit trois bonus fixes (`endurance_bonus`, `hope_bonus`, `parade_bonus`) stockés dans la table `cultures` (voir `feature-game-system.md`). Exemples : Bardide +20/+8/+12 ; Nain +22/+8/+10 ; Hobbit +18/+10/+12. Ces bonus sont ajoutés avant tout modifier de vertu.

> **Règle d'auto-épuisement** : si `current_endurance < poids_total + fatigue` → `states.exhaust = true` (recalcul automatique)
> **Règle de mélancolie** : si `current_hope < shadows` → `states.melancholic = true` (recalcul automatique)
> **`shadows`** : compteur cumulatif d'Ombre (pas un état toggleable). `melancholic` en est toujours dérivé — il ne se modifie jamais indépendamment de `shadows`.

---

## 3. Compétences

### 3.1 Compétences communes (18)

Regroupées par attribut dominant. Chaque compétence a :
- `favored` : case à cocher (compétence favorisée — bonus de dé lors des jets)
- `rank` : 0 à 6

**Compétences CORPS (6)** : Impressionner (`awe`), Athlétisme (`athletics`), Vigilance (`awareness`), Chasse (`hunting`), Chant (`song`), Artisanat (`craft`)

**Compétences CŒUR (6)** : Encourager (`enhearten`), Voyage (`travel`), Perspicacité (`insight`), Guérison (`healing`), Courtoisie (`courtesy`), Combat (`battle`)

**Compétences ESPRIT (6)** : Persuasion (`persuade`), Discrétion (`stealth`), Exploration (`explore`), Scrutation (`scan`), Énigme (`riddle`), Savoir (`lore`)

> La vertu `mastery` permet d'ajouter 2 nouvelles compétences communes favorisées.

### 3.2 Compétences de combat (4)

Pas de `favored`. Rang 0 à 6.

| Identifiant | Nom |
|---|---|
| `axes` | Haches |
| `bows` | Arcs |
| `spears` | Lances |
| `swords` | Épées |

---

## 4. Sagesse & Vertus

### 4.1 Principe

Le rang de Sagesse (`sagesse.rank`) est **égal au nombre de vertus choisies**. Il augmente automatiquement à chaque acquisition d'une vertu.

Il existe deux types de vertus :
- **Vertus ordinaires** : disponibles dès le rang 1 de Sagesse. Définies dans le système de jeu (`feature-game-system.md`).
- **Vertus culturelles** : définies par la culture du personnage, disponibles **à partir du rang 2 de Sagesse uniquement**. Le rang 1 doit obligatoirement être une vertu ordinaire.

### 4.2 Règle de choix

| Rang Sagesse acquis | Choix possible |
|---|---|
| 1 | Vertu ordinaire uniquement |
| 2+ | Vertu ordinaire **ou** vertu culturelle (au choix du joueur) |

### 4.3 Structure d'une vertu (référence `feature-game-system.md`)

Chaque vertu définit :
- Un identifiant unique
- Un nom et une description
- Des **variantes** (0 à N) — le joueur choisit une variante au moment de l'acquisition
- Des **modifiers** attachés à la variante choisie (applicables aux stats dérivées)

Exemples de modifiers existants :
| Vertu | Effet |
|---|---|
| `empowered` | −1 SR sur un attribut choisi (Corps / Cœur / Esprit) |
| `liveness` | +1 Parade |
| `resistance` | +2 Endurance max |
| `mastery` | 2 compétences communes deviennent favorisées |
| `steady` | +1 Corps pour frappe puissante |
| `assurance` | +2 Espoir max |

### 4.4 Coût d'acquisition (points d'aventure)

Voir barème universel section 8.2.

---

## 5. Vaillance & Récompenses

### 5.1 Principe

Le rang de Vaillance (`vaillance.rank`) est **égal au nombre de récompenses choisies**. Il augmente automatiquement.

### 5.2 Structure d'une récompense (référence `feature-game-system.md`)

Chaque récompense définit :
- Un identifiant unique, nom, description
- Une ou plusieurs **cibles** sur lesquelles elle peut s'appliquer (`armor`, `helm`, `shield`, `weapon`)
- Des **modifiers** associés

Exemples existants :
| Récompense | Cible | Effet |
|---|---|---|
| `sharp` | arme | Coup critique sur 9+ |
| `adjusted` | armure ou casque | +2 aux tests de protection |
| `clever` | armure / casque / bouclier | −2 poids |
| `devastating` | arme | +1 dégâts |
| `ferocious` | arme | +2 seuil de blessure |
| `reinforced` | bouclier | +1 parade |

### 5.3 Coût d'acquisition (points d'aventure)

Voir barème universel section 8.2.

---

## 6. Système de modifiers

### 6.1 Principe

Les vertus et récompenses déclarent des **modifiers** au format :
```typescript
interface ModifierParam {
  target: StatIdentifier   // Identifiant de la stat à modifier
  op: '+' | '*'            // Addition ou multiplication
  value: number
}
```

Quand une vertu ou récompense est choisie, ses modifiers sont enregistrés dans une liste. Au moment de l'affichage, les stats dérivées sont calculées en appliquant tous les modifiers actifs.

### 6.2 Calcul

```
valeur_finale = (valeur_base + Σ(modifiers additifs)) × Π(modifiers multiplicatifs)
```

### 6.3 Stats modifiables

`strength_sr`, `heart_sr`, `mind_sr`, `endurance_max`, `hope_max`, `parade`, `weapon_dmg`, `weapon_injury_one_hand`, `weapon_injury_two_hand`, `armor_protection`, `helm_protection`, `shield_parade`, `item_weight`

---

## 7. Équipement de combat

### 7.1 Armes

- Maximum **4 armes** par personnage
- Chaque arme peut être tirée du catalogue (armes de la campagne, voir `feature-game-system.md`) ou saisie manuellement par le MJ
- Des récompenses peuvent être appliquées à chaque arme individuelle

### 7.2 Armure, casque, bouclier

- Un emplacement par type : `armor`, `helm`, `shield`
- Tirés du catalogue ou saisis manuellement
- La parade totale = `mind + culture.parade_bonus` + bonus bouclier (+ modifier `reinforced` si applicable)
- La protection de l'armure et du casque est exprimée en nombre de dés (ex : `2d`)

### 7.3 Poids et épuisement

Le poids total est la somme de toutes les pièces d'équipement (armes + armure + casque + bouclier). La récompense `clever` réduit le poids d'une pièce.

```
poids_total = Σ(poids_armes) + poids_armure + poids_casque + poids_bouclier
épuisé si : current_endurance < poids_total + fatigue
```

---

## 8. Inventaire

### 8.1 Principe

L'inventaire regroupe **l'attirail de voyage et tous les objets reçus** (via loot ou ajout manuel). C'est une liste unifiée d'items.

Chaque item peut référencer un objet du catalogue (`item_id`) ou être saisi librement.

Un item peut avoir une `skill_ref` : référence à une compétence (ex : couteaux de chasse → `hunting`). C'est un indicateur narratif.

L'inventaire est **visible et modifiable par le joueur** (ajout de notes, consommation) et **par le MJ** (tout).

### 8.2 Distribution depuis le loot

Quand le MJ distribue un objet via le système de loot (`feature-loot.md`), l'objet est ajouté directement dans `inventory` avec `source: 'loot'`. Le joueur reçoit une notification (toast).

### 8.3 Trésor

Le champ `treasure` stocke la valeur numérique du trésor (pièces). Il est modifiable par le joueur et le MJ.

---

## 9. États & conditions

| État | Calcul | Modifiable |
|---|---|---|
| `exhaust` (Épuisé) | Auto : `current_endurance < poids_total + fatigue` | Non (lecture seule) |
| `melancholic` (Mélancolique) | Auto : `current_hope < shadows` | Non (lecture seule) |
| `hurt` (Blessé) | Toggle manuel | Joueur + MJ |
| `injury` | Valeur + unité (heures / jours) — visible si `hurt = true` | Joueur + MJ |

---

## 10. Points & progression

### 10.1 Types de points

| Point | Usage mécanique |
|---|---|
| `adventure_points` | Dépensés pour monter les rangs de Sagesse et Vaillance |
| `progression_points` | Dépensés pour monter les rangs de compétences (communes + combat) |
| `community_points` | Narratif uniquement — pas de mécanique liée, +/− libre |

### 10.2 Barème universel (compétences ET sagesse/vaillance)

| Passage de rang | Coût en points |
|---|---|
| 0 → 1 | 4 pts |
| 1 → 2 | 8 pts |
| 2 → 3 | 12 pts |
| 3 → 4 | 20 pts |
| 4 → 5 | 26 pts |
| 5 → 6 | 30 pts |

### 10.3 Distribution par le MJ en fin de session

À la fin de chaque session, le MJ attribue les points aux participants. Le montant distribué par session est configurable au niveau campagne (champ `session_points_adventure` et `session_points_progression` dans la config campagne).

La distribution peut se faire :
- **Automatique** : à tous les participants actifs de la session (bouton "Distribuer les points de session" dans le panneau MJ)
- **Manuelle** : le MJ édite directement les points d'un personnage depuis sa fiche

---

## 11. Mode level-up (Scène de communauté)

### 11.1 Déclenchement

Le mode level-up est activé lorsque la **scène active est de type `community`** (scène de communauté / phase de communauté). Ce type de scène est créé par le MJ comme une scène normale mais avec un type spécial.

Pendant cette scène :
- Un artwork est affiché en fond (sur TV et téléphone) — le temps que les joueurs jouent la phase RP
- Chaque joueur voit sa fiche en **mode édition avancée**

### 11.2 Ce que le joueur peut faire en mode level-up

| Action | Points dépensés | Contrainte |
|---|---|---|
| Monter un rang de compétence commune | `progression_points` | Coût selon barème (section 10.2) |
| Monter un rang de compétence de combat | `progression_points` | Coût selon barème |
| Acquérir une vertu (monter Sagesse) | `adventure_points` | Rang 1 = vertu ordinaire uniquement ; Rang 2+ = ordinaire ou culturelle |
| Acquérir une récompense (monter Vaillance) | `adventure_points` | Coût selon barème |

> Le joueur ne peut pas dépenser plus de points qu'il n'en possède. Le solde de points est affiché en temps réel pendant la dépense.

### 11.3 Sortie du mode level-up

Le mode level-up se termine quand le MJ change de scène (passe à une scène normale). Les modifications effectuées sont sauvegardées en temps réel.

---

## 12. Surfaces d'affichage

### 12.1 Vue joueur téléphone — fiche via `/player/scene`

La fiche est accessible depuis `/player/scene` via un bouton "Feuille de perso" qui ouvre un **slideover plein écran**. Elle est organisée en **7 onglets navigables par swipe** (voir `feature-player-view.md` — E2) :

| # | Onglet | Contenu |
|---|---|---|
| 1 | Identité | Vocation, niveau de vie, garant, particularités, défauts |
| 2 | Vitalité | Endurance, espoir, fatigue, ombres, séquelles, états |
| 3 | Compétences | 18 compétences communes + attributs |
| 4 | Sagesse & Vaillance | Vertus, récompenses, points |
| 5 | Attirail de guerre | Armes (4 slots) + compétences de combat |
| 6 | Défense | Armure, casque, bouclier, parade, protection |
| 7 | Inventaire | Items, trésor |

Un **overlay fixe** affiche en permanence (sur tous les onglets) : `current_endurance`, `current_hope`, états actifs.

**Sections éditables par le joueur** (hors mode level-up) :
- `current_endurance`, `current_hope`, `fatigue`, `shadows`, `sequels` (onglet Vitalité)
- `states.hurt` + `states.injury`
- `treasure`
- `inventory` (ajout de notes, consommation)

**Sections éditables en mode level-up** (scène de type `community`) :
- Rangs de toutes les compétences (si `progression_points` suffisants)
- Acquisition de vertus et récompenses (si `adventure_points` suffisants)

**Sections lecture seule** pour le joueur : attributs, stats dérivées, armes, armures, en-tête identité

> `/player/sheet` redirige vers `/player/scene` — la fiche n'est plus une page indépendante.

### 12.2 Overlay TV — déclenché par le MJ

Quand le MJ "met en avant" un personnage depuis le panneau session, la TV affiche un overlay plein écran par-dessus la scène active. L'overlay montre la fiche complète (lecture seule pour les spectateurs).

- Portrait du personnage affiché en grand
- Stats lisibles à distance (police grande, fort contraste)
- Fermeture de l'overlay : le MJ reprend le contrôle de l'affichage TV

### 12.3 Popover rapide MJ (battlemap / panneau session)

Accessible depuis le token d'un personnage sur la battlemap ou depuis la liste de participants. Permet au MJ d'éditer rapidement :
- `current_endurance`, `current_hope`
- `states.hurt`, `states.injury`
- `fatigue`, `shadows`

Voir `feature-live-stats-dragdrop.md` pour le détail du popover.

### 12.4 Fiche complète MJ

Accès depuis `/gm/campaigns/[id]/characters/[id]`. Le MJ peut tout éditer : attributs, compétences, vertus, récompenses, équipement, inventaire, points, en-tête. Toutes les sections sont éditables.

---

## 13. Export NFC

Un personnage peut être exporté sur une puce NFC (depuis la page de sa fiche dans le back-office MJ).

**Données encodées** (format CBOR, voir `feature-nfc-encoding.md`) :
- `character_id` : identifiant Supabase
- `name` : nom du personnage
- `portrait_url` : URL du portrait (pour résolution d'image sur TV)
- Snapshot des stats essentielles : attributs, endurance max/courante, espoir max/courant, parade

**Comportement au scan NFC** :
- Si une session est active : affiche l'overlay fiche complète sur TV (même comportement que le déclenchement MJ)
- Si hors session : affiche une page de présentation du personnage sur le téléphone

---

## 14. Schéma Supabase

```sql
-- Table principale
create table characters (
  id             uuid primary key default gen_random_uuid(),
  campaign_id    uuid not null references campaigns(id) on delete cascade,
  culture_id     uuid references cultures(id) on delete set null,
  name           text not null,
  player_name    text not null,
  portrait_url   text,
  data           jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Index utiles
create index on characters(campaign_id);
create index on characters(culture_id);

-- RLS
alter table characters enable row level security;

-- MJ : accès complet à ses campagnes
create policy "MJ accès complet" on characters
  for all using (
    campaign_id in (
      select id from campaigns where gm_user_id = auth.uid()
    )
  );

-- Joueur : lecture via server endpoint uniquement (RLS bloque accès direct anon)
-- Les server endpoints utilisent useSupabaseAdmin() et valident le participant_id

-- Realtime activé pour les joueurs (current_endurance, current_hope via payload JSONB)
alter publication supabase_realtime add table characters;
```

> **Note sur les updates fréquents** : `current_endurance`, `current_hope`, `states` et `inventory` sont les champs les plus souvent modifiés. Ils sont dans le JSONB `data` — les updates utilisent `jsonb_set` ou un remplacement partiel ciblé pour éviter de réécrire toute la fiche à chaque changement de stat.

---

## 15. Routes & endpoints

### Pages

| Route | Accès | Description |
|---|---|---|
| `/gm/campaigns/[id]/characters` | MJ | Liste des personnages de la campagne |
| `/gm/campaigns/[id]/characters/[charId]` | MJ | Fiche complète éditable |
| `/player/sheet` | Joueur | Redirige vers `/player/scene` (fiche dans slideover) |

### Server endpoints

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/characters/[id]` | GET | Récupère une fiche complète (MJ auth ou joueur validé) |
| `/api/characters/[id]` | PATCH | Met à jour des champs spécifiques de la fiche |
| `/api/session/[id]/characters` | GET | Liste des personnages de la session (joueur — `id, name, player_name` uniquement) |
| `/api/characters/[id]/level-up` | POST | Dépense des points et applique les modifications (mode level-up) |
| `/api/characters/[id]/distribute-points` | POST | MJ distribue des points à un personnage |
