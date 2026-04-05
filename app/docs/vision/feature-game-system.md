# Feature — Système de jeu (CRUD back-office)

> Référence principale : [`README.md`](./README.md)
> Fiche personnage : [`feature-characters.md`](./feature-characters.md)
> Création de personnage : [`feature-character-creation.md`](./feature-character-creation.md)

**Système de règles** : *The One Ring* (TOR) / *Anneau Unique*

---

## Principe général

Le système de jeu regroupe toutes les **données de référence** qui définissent les règles mécaniques : cultures, vertus ordinaires, vertus culturelles, récompenses, armes et armures. Ces éléments étaient précédemment hardcodés dans l'application legacy — ils sont désormais gérés en base de données et éditables via des pages CRUD dédiées.

Il existe deux niveaux de données :

| Niveau | Portée | Description |
|---|---|---|
| **Global** | Toutes les campagnes | Cultures, vertus, récompenses — définissent les règles du jeu TOR |
| **Par campagne** | Une campagne spécifique | Armurerie (armes + armures) — catalogue propre à chaque campagne |

> Les éléments globaux sont créés/modifiés depuis une section admin MJ (`/gm/system`). Les éléments par campagne sont accessibles depuis les pages de la campagne.

---

## 1. Cultures (`/gm/system/cultures`)

### 1.1 Rôle

Une culture définit l'origine d'un personnage. Elle détermine :
- Les **statistiques de départ** proposées lors de la création (voir `feature-character-creation.md`)
- Les **bonus dérivés** fixes qui s'ajoutent aux attributs pour calculer Endurance max, Espoir max et Parade
- Les **compétences favorisées initiales** liées à la culture
- Les **compétences de combat de départ** avec leurs rangs respectifs
- Les **vertus culturelles** accessibles au personnage dès le rang 2 de Sagesse
- Un **nom et une description** narrative

### 1.2 Données d'une culture

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `name` | text | Nom affiché (ex : "Rôdeur du Nord", "Hobbit de la Comté") |
| `description` | text \| null | Présentation narrative (Markdown) |
| `starting_attributes` | jsonb | Valeurs de départ proposées : `{ strength, heart, mind }` |
| `endurance_bonus` | integer | Bonus fixe ajouté à Corps pour calculer l'Endurance max (ex: Bardide = 20, Nain = 22, Hobbit = 18) |
| `hope_bonus` | integer | Bonus fixe ajouté à Cœur pour calculer l'Espoir max (ex: Bardide = 8, Rôdeur = 6, Hobbit = 10) |
| `parade_bonus` | integer | Bonus fixe ajouté à Esprit pour calculer la Parade de base (ex: Bardide = 12, Nain = 10, Rôdeur = 14) |
| `starting_favored_skills` | text[] | IDs des 2 compétences communes favorisées à la création (ex: `["hunting", "lore"]`) |
| `starting_combat_skills` | jsonb | Rangs de départ des compétences de combat : `{ skill_id: rank }` — ex: `{ "bows": 2, "axes": 1, "spears": 1, "swords": 1 }` |
| `created_at` | timestamptz | — |

> **Valeurs de référence TOR 2e** (voir `rules/cultures.md`) :
>
> | Culture | endurance_bonus | hope_bonus | parade_bonus |
> |---|---|---|---|
> | Bardide | 20 | 8 | 12 |
> | Nain de Durin | 22 | 8 | 10 |
> | Elfe de Lindon | 20 | 8 | 12 |
> | Hobbit de la Comté | 18 | 10 | 12 |
> | Homme de Bree | 20 | 10 | 10 |
> | Rôdeur du Nord | 20 | 6 | 14 |

> **Cultures de base TOR** (6 du livre de base, extensibles) : Bardide, Hobbit, Elfe de Lindon, Humain de Bree, Nain de Durin, Rôdeur du Nord. D'autres peuvent être ajoutées pour des campagnes custom.

### 1.3 Page CRUD

- **Liste** : tableau de toutes les cultures, avec leur nom et nombre de vertus culturelles associées
- **Création / Édition** : formulaire avec tous les champs, section dédiée pour gérer les vertus culturelles liées
- **Suppression** : désactivée si des personnages utilisent cette culture

> **NOTE** : Pour les vertus culturelles des 6 cultures TOR 2e de base, se référer à `app/docs/rules/cultures.md`. Ces vertus sont à pré-remplir dans la base de données à l'initialisation du système de jeu.

---

## 2. Vertus ordinaires (`/gm/system/virtues`)

### 2.1 Rôle

Les vertus ordinaires sont acquises en montant le rang de Sagesse. Elles sont disponibles dès le rang 1. Elles appliquent des **modifiers** sur les stats du personnage.

### 2.2 Données d'une vertu

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `identifier` | text unique | Clé technique (ex : `"assurance_virtue"`) |
| `name` | text | Nom affiché (ex : "Assurance") |
| `description` | text | Description générale de la vertu |
| `variants` | jsonb | Tableau de variantes (voir ci-dessous) |
| `created_at` | timestamptz | — |

**Structure d'une variante** :
```typescript
interface VirtueVariant {
  name: string
  description: string
  modifiers: ModifierParam[]  // Liste de modifiers appliqués si cette variante est choisie
}

interface ModifierParam {
  target: string   // Identifiant stat (ex: 'hope_max', 'parade', 'strength_sr')
  op: '+' | '*'
  value: number
}
```

**Exemple** — vertu `empowered` (3 variantes) :
```json
{
  "identifier": "empowered_virtue",
  "name": "Pouvoir décuplé",
  "description": "Réduit le seuil de réussite d'un attribut.",
  "variants": [
    { "name": "Corps", "description": "SR Corps −1", "modifiers": [{ "target": "strength_sr", "op": "+", "value": -1 }] },
    { "name": "Cœur", "description": "SR Cœur −1",  "modifiers": [{ "target": "heart_sr",    "op": "+", "value": -1 }] },
    { "name": "Esprit", "description": "SR Esprit −1","modifiers": [{ "target": "mind_sr",     "op": "+", "value": -1 }] }
  ]
}
```

> Si la vertu n'a pas de choix (une seule variante), `variants` contient un seul élément.

### 2.3 Page CRUD

- **Liste** : tableau avec nom, identifiant, nombre de variantes
- **Création / Édition** : formulaire avec gestion dynamique des variantes et de leurs modifiers
- **Suppression** : désactivée si des personnages possèdent cette vertu

---

## 3. Vertus culturelles (`/gm/system/cultures/[id]/cultural-virtues`)

### 3.1 Rôle

Les vertus culturelles sont des **vertus spécifiques à une culture**, choisies à la place d'une vertu ordinaire à partir du rang 2 de Sagesse. Chaque culture possède jusqu'à 6 vertus culturelles (livre de base), éventuellement plus.

Mécaniquement, une vertu culturelle fonctionne exactement comme une vertu ordinaire (modifiers, variantes). La différence est qu'elle est **liée à une culture** et n'est disponible qu'aux personnages de cette culture.

### 3.2 Données d'une vertu culturelle

Identiques à une vertu ordinaire, avec une FK `culture_id` supplémentaire.

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `culture_id` | uuid FK | Culture à laquelle appartient cette vertu |
| `identifier` | text | Clé technique (unique par culture) |
| `name` | text | Nom affiché |
| `description` | text | Description |
| `variants` | jsonb | Tableau de variantes (même structure que vertus ordinaires) |
| `created_at` | timestamptz | — |

### 3.3 Page CRUD

Accessible depuis la page d'édition d'une culture (section "Vertus culturelles"). Formulaire identique aux vertus ordinaires. Maximum recommandé : 6 vertus culturelles par culture (pas de limite technique).

---

## 4. Récompenses (`/gm/system/rewards`)

### 4.1 Rôle

Les récompenses sont acquises en montant le rang de Vaillance. Elles s'appliquent à une pièce d'équipement spécifique (arme, armure, casque ou bouclier) et modifient ses stats.

### 4.2 Données d'une récompense

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `identifier` | text unique | Clé technique (ex : `"devastating_reward"`) |
| `name` | text | Nom affiché (ex : "Dévastatrice") |
| `description` | text | Description |
| `valid_targets` | text[] | Cibles valides : `["armor", "helm", "shield", "weapon"]` (subset possible) |
| `modifiers` | jsonb | Tableau de `ModifierParam` appliqués à la cible |
| `created_at` | timestamptz | — |

**Exemple** — récompense `devastating` (s'applique aux armes) :
```json
{
  "identifier": "devastating_reward",
  "name": "Dévastatrice",
  "description": "Augmente les dégâts de l'arme de 1.",
  "valid_targets": ["weapon"],
  "modifiers": [{ "target": "weapon_dmg", "op": "+", "value": 1 }]
}
```

**Exemple** — récompense `clever` (s'applique armure/casque/bouclier) :
```json
{
  "identifier": "clever_reward",
  "name": "Légère",
  "description": "Réduit le poids de 2.",
  "valid_targets": ["armor", "helm", "shield"],
  "modifiers": [{ "target": "item_weight", "op": "+", "value": -2 }]
}
```

### 4.3 Page CRUD

- **Liste** : tableau avec nom, identifiant, cibles valides
- **Création / Édition** : formulaire avec multi-sélection des cibles et gestion des modifiers
- **Suppression** : désactivée si des personnages possèdent cette récompense

---

## 5. Armurerie — Armes (`/gm/campaigns/[id]/armory/weapons`)

### 5.1 Rôle

Catalogue des armes disponibles dans une campagne. Le MJ peut l'enrichir à tout moment. Les personnages équipent des armes issues de ce catalogue (ou saisies manuellement).

### 5.2 Données d'une arme

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `campaign_id` | uuid FK | Campagne |
| `name` | text | Nom (ex : "Grand Lance", "Épée courte") |
| `dmg` | integer | Valeur de dégâts |
| `injury_one_hand` | integer | Seuil de blessure à une main (ex : 16 = blessure sur 16-20) |
| `injury_two_hand` | integer | Seuil de blessure à deux mains |
| `weight` | integer | Poids (contribue au poids total) |
| `notes` | text \| null | Notes libres |
| `created_at` | timestamptz | — |

### 5.3 Page CRUD

Tableau simple avec toutes les armes de la campagne. Formulaire de création/édition. Suppression désactivée si l'arme est équipée par un personnage.

---

## 6. Armurerie — Armures & boucliers (`/gm/campaigns/[id]/armory/armors`)

### 6.1 Rôle

Catalogue des pièces de protection de la campagne : armures, casques, boucliers. Tirés du livre de règles ou créés sur mesure.

### 6.2 Données d'une armure

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `campaign_id` | uuid FK | Campagne |
| `type` | enum | `armor` / `helm` / `shield` |
| `name` | text | Nom |
| `protection` | integer \| null | Nombre de dés de protection (armure/casque) |
| `parade_bonus` | integer \| null | Bonus de parade (bouclier uniquement) |
| `weight` | integer | Poids |
| `created_at` | timestamptz | — |

**Données de base TOR (à pré-remplir à la création d'une campagne)** :

| Type | Nom | Protection | Parade | Poids |
|---|---|---|---|---|
| armor | Chemise de cuir | 1d | — | 3 |
| armor | Corselet à manches longues | 2d | — | 6 |
| armor | Cotte de mailles courte | 3d | — | 9 |
| armor | Cotte de mailles longue | 4d | — | 12 |
| helm | Heaume | 1d | — | 4 |
| shield | Petit bouclier | — | +1 | 2 |
| shield | Bouclier | — | +2 | 4 |
| shield | Grand bouclier | — | +3 | 6 |

### 6.3 Page CRUD

Tableau filtrable par type (`armor` / `helm` / `shield`). Formulaire de création/édition. Option "Pré-remplir avec les données TOR de base" à la création d'une nouvelle campagne.

> **NOTE** : Les armes et armures (`campaign_weapons`, `campaign_armors`) constituent l'**armurerie**. Les objets génériques (attirail de voyage, consommables, objets de loot, composants) constituent le **catalogue d'objets** dans `campaign_items` — voir `feature-loot.md`. Ces deux catalogues sont distincts et complémentaires.

---

## 7. Havres (`/gm/system/havens`)

### 7.1 Rôle

Les Havres sont des **lieux sanctifiés alliés** (Dale, la Comté, Fondcombe, Mines de la Moria reconquise…) où la compagnie peut passer sa Phase de Communauté. Chaque Havre offre un bonus de récupération d'Espoir au-delà du score de Cœur de base.

Ces données sont **globales** (partagées entre toutes les campagnes). Le MJ peut en créer de nouveaux pour des campagnes personnalisées.

Dans chaque campagne, le MJ sélectionne le havre actif dans les settings (`campaigns.current_haven` → FK vers `game_system_havens.id`).

> Référence règles : [`fellowship-phase.md`](../rules/fellowship-phase.md) — sections "Havre" et "Récupération de l'Espoir".

### 7.2 Données d'un Havre

| Champ | Type | Description |
|---|---|---|
| `id` | uuid PK | Identifiant |
| `name` | text | Nom affiché (ex : "Dale", "La Comté", "Fondcombe") |
| `description` | text \| null | Description narrative (Markdown) |
| `hope_bonus` | integer | Espoir supplémentaire récupérable au-delà de Cœur (ex : `2` → récupère jusqu'à `Cœur + 2`) |
| `created_at` | timestamptz | — |

> **Havres de base TOR** (à pré-remplir à l'initialisation du système de jeu) :
>
> | Havre | hope_bonus |
> |---|---|
> | La Comté | 2 |
> | Dale | 1 |
> | Fondcombe | 3 |
> | Edoras | 1 |

### 7.3 Page CRUD

- **Liste** : tableau avec nom et `hope_bonus`
- **Création / Édition** : formulaire simple (nom, description, bonus)
- **Suppression** : désactivée si des campagnes référencent ce havre comme havre actif

---

## 8. Schéma Supabase

```sql
-- Cultures
create table cultures (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  description             text,
  starting_attributes     jsonb not null default '{}'::jsonb,
  endurance_bonus         integer not null default 20,  -- Bonus Endurance max (Corps + bonus)
  hope_bonus              integer not null default 8,   -- Bonus Espoir max (Cœur + bonus)
  parade_bonus            integer not null default 12,  -- Bonus Parade (Esprit + bonus)
  starting_favored_skills text[] not null default '{}',
  starting_combat_skills  jsonb not null default '{}'::jsonb,  -- { skill_id: rank } ex: {"bows":2,"axes":1,"spears":1,"swords":1}
  created_at              timestamptz not null default now()
);

-- Vertus ordinaires
create table virtues (
  id          uuid primary key default gen_random_uuid(),
  identifier  text unique not null,
  name        text not null,
  description text not null,
  variants    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- Vertus culturelles
create table cultural_virtues (
  id          uuid primary key default gen_random_uuid(),
  culture_id  uuid not null references cultures(id) on delete cascade,
  identifier  text not null,
  name        text not null,
  description text not null,
  variants    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  unique(culture_id, identifier)
);

-- Récompenses
create table rewards (
  id             uuid primary key default gen_random_uuid(),
  identifier     text unique not null,
  name           text not null,
  description    text not null,
  valid_targets  text[] not null default '{}',
  modifiers      jsonb not null default '[]'::jsonb,
  created_at     timestamptz not null default now()
);

-- Armes (par campagne)
create table campaign_weapons (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  name        text not null,
  dmg         integer not null default 0,
  injury_one_hand  integer not null default 20,
  injury_two_hand  integer not null default 20,
  weight      integer not null default 0,
  notes       text,
  created_at  timestamptz not null default now()
);

-- Armures & boucliers (par campagne)
create table campaign_armors (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references campaigns(id) on delete cascade,
  type         text not null check (type in ('armor', 'helm', 'shield')),
  name         text not null,
  protection   integer,
  parade_bonus integer,
  weight       integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Havres (globaux)
create table game_system_havens (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  hope_bonus  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Index
create index on cultural_virtues(culture_id);
create index on campaign_weapons(campaign_id);
create index on campaign_armors(campaign_id);

-- RLS : accès MJ uniquement (toutes ces tables sont en back-office)
alter table cultures             enable row level security;
alter table virtues              enable row level security;
alter table cultural_virtues     enable row level security;
alter table rewards              enable row level security;
alter table campaign_weapons     enable row level security;
alter table campaign_armors      enable row level security;
alter table game_system_havens   enable row level security;

-- Policies MJ (lecture publique pour cultures/vertus/récompenses/havres car utiles côté joueur via endpoints)
create policy "Lecture publique cultures"   on cultures for select using (true);
create policy "Lecture publique vertus"     on virtues  for select using (true);
create policy "Lecture publique récompenses" on rewards for select using (true);
create policy "Lecture publique vertus culturelles" on cultural_virtues for select using (true);
create policy "Lecture publique havres"     on game_system_havens for select using (true);

-- Écriture MJ uniquement
create policy "MJ écriture cultures"  on cultures  for all using (auth.role() = 'authenticated');
create policy "MJ écriture vertus"    on virtues   for all using (auth.role() = 'authenticated');
create policy "MJ écriture récompenses" on rewards for all using (auth.role() = 'authenticated');
create policy "MJ écriture vertus culturelles" on cultural_virtues for all using (auth.role() = 'authenticated');
create policy "MJ écriture havres"    on game_system_havens for all using (auth.role() = 'authenticated');

-- Armes et armures : accès via campagne
create policy "MJ accès armes campagne" on campaign_weapons
  for all using (
    campaign_id in (select id from campaigns where gm_user_id = auth.uid())
  );
create policy "MJ accès armures campagne" on campaign_armors
  for all using (
    campaign_id in (select id from campaigns where gm_user_id = auth.uid())
  );
```

---

## 8. Navigation back-office

```
/gm/system
├── /cultures                         ← Liste + CRUD des cultures
│   └── /[id]
│       └── /cultural-virtues         ← Vertus culturelles de cette culture
├── /virtues                          ← Liste + CRUD des vertus ordinaires
├── /rewards                          ← Liste + CRUD des récompenses
└── /havens                           ← Liste + CRUD des Havres

/gm/campaigns/[id]
├── /armory
│   ├── /weapons                      ← Catalogue armes de la campagne
│   └── /armors                       ← Catalogue armures/casques/boucliers
└── /characters                       ← Fiches personnages (feature-characters.md)
```
