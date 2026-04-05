# Feature — Fiches ennemis & PNJ

> Référence principale : [`README.md`](./README.md)
> Loot : [`feature-loot.md`](./feature-loot.md)
> Export NFC : [`feature-nfc.md`](./feature-nfc.md) + [`feature-nfc-encoding.md`](./feature-nfc-encoding.md)
> Images & artwork : [`feature-media-library.md`](./feature-media-library.md)

**Système de règles** : *The One Ring* (TOR) / *Anneau Unique*

---

## Principe général

Ennemis et PNJ partagent **exactement la même structure de fiche** : statistiques de combat, compétences, capacités redoutables. Ils sont stockés dans une seule table `combatants` avec un champ `kind` qui détermine leur rôle.

Les différences entre les deux types sont minimes et purement sémantiques :

| | Ennemi (`kind: 'enemy'`) | PNJ (`kind: 'npc'`) |
|---|---|---|
| Attribut spécial | `haine` **ou** `détermination` (choix MJ) | `détermination` uniquement (toujours) |
| Table de loot | Oui | Optionnel |
| Inventaire | Non | Oui (`npc_inventory`) |
| Export NFC | Oui | Non (pour l'instant) |
| Animations spawn TV | Oui (selon rareté) | Non (spawn discret) |

---

## 1. Structure commune de la fiche

### 1.1 Présentation

| Champ | Type | Description |
|---|---|---|
| `kind` | enum | `enemy` / `npc` — détermine le comportement et les sections affichées |
| `name` | text | Nom (ex : `"Marcus"`, `"Gobelin Éclaireur"`) |
| `subname` | text \| null | Sous-nom ou titre (ex : `"fils des premiers hommes"`) |
| `traits` | text[] \| null | 1 à 2 particularités descriptives (ex : `["Cruel et endurci", "Fort et vigilant"]`) |
| `family` | text \| null | Famille/race (ex : `"Gobelin"`, `"Pillard"`) — sert à la résolution d'artwork |
| `rarity` | enum | `common` / `uncommon` / `rare` / `legendary` |
| `artwork_url` | text \| null | Illustration principale (token battlemap + overlay TV) |
| `notes` | text \| null | Notes libres du MJ (Markdown) |

**Particularités (`traits`)** : champ libre, 1 ou 2 entrées max. Caractérise rapidement l'entité à la table sans lire toute la fiche (ex : *"Rapide et imprévisible"*).

**Famille (`family`)** : utilisée pour la résolution d'image NFC (cascade race → rareté → défaut). Pas de liste fermée — saisie libre.

**Rareté** : pour les ennemis, détermine les animations de spawn NFC et l'importance dramatique. Pour les PNJ, c'est un indicateur de puissance/importance narrative.

---

### 1.2 Statistiques de combat

| Champ | Type | Description |
|---|---|---|
| `attribute_level` | integer | Niveau d'attribut — remplace Corps/Cœur/Esprit. Mesure la dangerosité globale |
| `endurance` | integer | Points d'endurance max (équivalent HP). Mort/inconscient à 0 |
| `power` | integer | Puissance — nombre d'attaques disponibles par tour |
| `hatred_type` | enum | `haine` ou `détermination` — **toujours `détermination` pour les PNJ**, choix libre pour les ennemis |
| `hatred_value` | integer | Points disponibles sur **toute la durée du combat** (attaques spéciales via capacités redoutables) |
| `parry` | integer | Parade — difficulté pour toucher cette entité |
| `armor` | integer | Armure — valeur du jet de protection contre les coups perforants |
| `wound_threshold` | integer | Nombre de blessures avant inconscience (1 pour les entités ordinaires, 2 pour les plus puissantes) |

**Règle blessures** : une blessure est infligée lors d'un coup perforant (jet de protection raté). Quand `wounds_received` atteint `wound_threshold`, l'entité est inconsciente/morte — indépendamment de l'endurance restante.

> ⚠️ **Extension maison** : le mécanisme `wound_threshold` / `wounds_received` sur les ennemis est une **adaptation propre à cette app**, absente des règles TOR 2e standard. Dans le livre de base, les blessures (Piercing Blows) s'appliquent aux héros joueurs, pas aux ennemis. Cette mécanique est introduite pour simuler une résilience accrue des ennemis puissants. Le MJ peut la désactiver en laissant `wound_threshold = 999` si la mort doit être déterminée uniquement par l'endurance.

**Distinction haine / détermination** : le type est uniquement un **label affiché** dans l'UI, la mécanique est identique. `haine` = serviteurs de l'Ennemi (Orcs, Nazgûl, disciples de Sauron). `détermination` = tout le reste (humains, faune, PNJ alliés ou neutres).

---

### 1.3 Compétences de combat

Tableau des attaques de base. Chaque ligne est une compétence.

| Champ | Type | Description |
|---|---|---|
| `name` | text | Nom (ex : `"Lance"`, `"Morsure"`, `"Cimeterre"`) |
| `level` | integer | Niveau de la compétence (dé de combat) |
| `damage` | integer | Dégâts infligés si l'attaque touche |
| `piercing_threshold` | integer \| null | Seuil de coup perforant. `null` si la compétence n'est pas perforante |
| `sort_order` | integer | Ordre d'affichage |

**Format affiché** : `Lance 3 (2/16)` → niveau 3, 2 dégâts, perforante à 16+. Sans perforant : `Griffe 2 (3)`.

Une entité peut avoir plusieurs compétences (ex : attaque à distance + corps à corps). Pour chaque attaque disponible dans son tour (nombre = `power`), le MJ choisit librement quelle compétence utiliser — ou dépense 1 point de haine/détermination pour une capacité redoutable à la place. L'app n'impose aucune contrainte sur ce choix.

---

### 1.4 Capacités redoutables

Tableau des capacités spéciales, déclenchées en dépensant 1 point de haine/détermination.

| Champ | Type | Description |
|---|---|---|
| `name` | text | Nom (ex : `"Cri de guerre"`, `"Frappe dévastatrice"`) |
| `description` | text | Effet de la capacité (Markdown supporté) |
| `sort_order` | integer | Ordre d'affichage |

À chaque attaque disponible dans un tour, le MJ peut remplacer une compétence de combat par une capacité redoutable (coût : 1 point de haine/détermination). L'app se contente d'afficher les capacités et de permettre la décrémentation rapide des points.

---

## 2. Ce qui diffère selon le type

### 2.1 Table de loot (ennemis uniquement, optionnel pour PNJ)

La table de loot est définie sur la fiche. Structure complète dans [`feature-loot.md`](./feature-loot.md) — section *3. Table de loot des ennemis*.

Chaque entrée : objet du catalogue campagne + probabilité (%) + quantité (min/max).

Quand une entité est marquée "vaincue", le MJ peut déclencher la résolution du loot si une table est définie.

### 2.2 Inventaire (PNJ uniquement)

Les PNJ ont un inventaire gérable depuis le panneau session. Structure dans [`feature-loot.md`](./feature-loot.md) — table `npc_inventory`.

> **NOTE** : Les armes et armures sont dans `campaign_weapons` / `campaign_armors` (voir `feature-game-system.md`). Les objets génériques (attirail, loot, composants) sont dans `campaign_items` (voir `feature-loot.md`).

Le MJ peut donner ou prendre des objets à un PNJ directement en session, sans quitter la vue de la scène.

### 2.3 Export NFC (ennemis uniquement)

Les données d'un ennemi peuvent être exportées en base64 pour écriture sur puce NFC. Voir [`feature-nfc.md`](./feature-nfc.md) et [`feature-nfc-encoding.md`](./feature-nfc-encoding.md).

Les PNJ ne sont pas exportables sur puce NFC pour l'instant.

---

## 3. Pages back-office

### Ennemis — `/gm/campaigns/[id]/enemies`

- Grille ou liste de tous les ennemis de la campagne
- Filtres : famille, rareté, recherche par nom
- Badge rareté coloré sur chaque card
- Aperçu : nom, sous-nom, famille, endurance, niveau d'attribut
- Bouton "Nouvel ennemi" — accès rapide (clic sur la card)

### PNJ — `/gm/campaigns/[id]/npcs`

- Même structure de liste que les ennemis
- Bouton "Nouveau PNJ"
- Pas de badge rareté mis en avant (moins pertinent pour les PNJ)

---

### Formulaire création/édition (commun aux deux types)

`/gm/campaigns/[id]/enemies/[id]` et `/gm/campaigns/[id]/npcs/[id]`

**Section Présentation**
- Nom, sous-nom, particularités (chips éditables, max 2), famille, rareté
- Upload artwork (Image Picker — `feature-media-library.md`)
- Notes libres (Markdown)

**Section Statistiques**
- Champs numériques : niveau d'attribut, endurance, puissance, parade, armure, seuil de blessure
- Sélecteur haine / détermination + valeur — **masqué pour les PNJ** (toujours `détermination`, label affiché directement)

**Section Compétences de combat**
- Tableau éditable ligne par ligne : nom, niveau, dégâts, seuil perforant (optionnel)
- Drag & drop pour réordonner
- Prévisualisation en temps réel : `"Lance 3 (2/16)"`

**Section Capacités redoutables**
- Tableau éditable ligne par ligne : nom + description (Markdown)
- Drag & drop pour réordonner

**Section Table de loot** *(ennemis uniquement, section masquée pour les PNJ sans loot)*
- Picker objets du catalogue + probabilité + quantité min/max

**Section Export NFC** *(ennemis uniquement)*
- Bouton "Préparer l'encodage NFC" → `/gm/nfc/encode` pré-rempli
- Ou : payload base64 affiché directement avec option copier

---

## 4. Données de session — instanciation en scène

Quand une entité est ajoutée à une scène (manuellement ou via NFC pour les ennemis), une **entité de scène** est créée. La fiche `combatants` est la référence immuable ; les valeurs courantes vivent sur `scene_entities`.

### Champs à ajouter sur `scene_entities`

| Champ | Type | Description |
|---|---|---|
| `combatant_id` | uuid FK \| null | Référence vers `combatants` (null pour les entités sans fiche — objets, zones) |
| `endurance_current` | integer \| null | Endurance actuelle (initialisée à `combatants.endurance` au spawn) |
| `wounds_received` | integer \| null | Blessures reçues (0 au spawn) |
| `hatred_current` | integer \| null | Points de haine/détermination restants (initialisé à `combatants.hatred_value`) |
| `is_defeated` | boolean | Vaincu — déclenche la résolution du loot si une table est définie |

**Séparation fiche / instance** : la fiche ne change jamais en session. Si la même entité est spawnée deux fois, deux instances distinctes sont créées avec leur propre état.

---

## 5. Interactions depuis le panneau session

### Principe d'ergonomie

Le MJ doit pouvoir modifier tous les attributs d'une entité **sans quitter la vue de la scène**. Le popover s'ouvre au clic sur le token. Toutes les valeurs trackées sont modifiables en 1 à 2 gestes — pas de formulaire, modification directe et immédiate.

### Contenu du popover (identique pour ennemis et PNJ)

```
┌─────────────────────────────────────────┐
│ Gobelin Éclaireur                       │
│ "rapide et imprévisible"                │
├─────────────────────────────────────────┤
│ Endurance      [  8  ] / 12  [−]  [+]  │
│ Blessures      ◆ ◇   (1/1)  [Blesser] │
│ Détermination  [  2  ] / 3   [−]  [+]  │
├─────────────────────────────────────────┤
│ Compétences de combat                   │
│  • Cimeterre 3 (2/14)                   │
│  • Javelot 2 (1)                        │
│ Capacités redoutables                   │
│  • Cri de ralliement — …                │
├─────────────────────────────────────────┤
│         [ Marquer vaincu ]              │
└─────────────────────────────────────────┘
```

Pour les PNJ, un bouton supplémentaire **"Inventaire"** ouvre un panneau latéral de gestion de l'inventaire (donner/prendre des objets).

### Tableau des interactions

| Action MJ | Effet |
|---|---|
| Clic sur un token | Ouvre le popover |
| `[−]` / `[+]` sur l'endurance | Décrémente / incrémente `endurance_current` — mise à jour immédiate |
| Saisie directe endurance | Champ numérique pour entrer une valeur exacte |
| `[Blesser]` | Incrémente `wounds_received` de 1 |
| `[−]` / `[+]` sur haine/détermination | Décrémente / incrémente `hatred_current` de 1 |
| Marquer vaincu | `is_defeated → true` — déclenche le loot si table définie |
| Inventaire PNJ | Ouvre le panneau inventaire (PNJ uniquement) |
| Spawn manuel | "Ajouter à la scène" sur la fiche → entité créée avec toutes les valeurs initiales |

Compétences et capacités redoutables sont en **lecture seule** dans le popover — référence rapide. Modification uniquement en back-office.

---

## 6. Base de données — récapitulatif

### Table principale : `combatants`

| Champ | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `campaign_id` | uuid | FK → campaigns |
| `kind` | enum | `enemy` / `npc`, NOT NULL |
| `name` | text | NOT NULL |
| `subname` | text | nullable |
| `traits` | text[] | nullable, max 2 éléments |
| `family` | text | nullable |
| `rarity` | enum | `common` / `uncommon` / `rare` / `legendary`, NOT NULL |
| `artwork_url` | text | nullable |
| `notes` | text | nullable |
| `attribute_level` | integer | NOT NULL |
| `endurance` | integer | NOT NULL, > 0 |
| `power` | integer | NOT NULL, > 0 |
| `hatred_type` | enum | `haine` / `détermination`, NOT NULL |
| `hatred_value` | integer | NOT NULL, >= 0 |
| `parry` | integer | NOT NULL, >= 0 |
| `armor` | integer | NOT NULL, >= 0 |
| `wound_threshold` | integer | NOT NULL, DEFAULT 1, CHECK (wound_threshold IN (1, 2)) |
| `created_at` | timestamp | DEFAULT now() |

**Contrainte applicative** : si `kind = 'npc'`, alors `hatred_type` est forcé à `détermination` (validé côté serveur, pas en DB pour garder la flexibilité).

---

### Table : `combatant_combat_skills`

| Champ | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `combatant_id` | uuid | FK → combatants ON DELETE CASCADE |
| `name` | text | NOT NULL |
| `level` | integer | NOT NULL |
| `damage` | integer | NOT NULL |
| `piercing_threshold` | integer | nullable |
| `sort_order` | integer | NOT NULL, DEFAULT 0 |

---

### Table : `combatant_fearsome_abilities`

| Champ | Type | Contraintes |
|---|---|---|
| `id` | uuid | PK |
| `combatant_id` | uuid | FK → combatants ON DELETE CASCADE |
| `name` | text | NOT NULL |
| `description` | text | NOT NULL |
| `sort_order` | integer | NOT NULL, DEFAULT 0 |

---

### Champs ajoutés sur les tables existantes

| Table | Champ | Type | Description |
|---|---|---|---|
| `scene_entities` | `combatant_id` | uuid FK \| null | Référence vers `combatants` |
| `scene_entities` | `endurance_current` | integer \| null | HP courants |
| `scene_entities` | `wounds_received` | integer \| null | Blessures reçues |
| `scene_entities` | `hatred_current` | integer \| null | Points haine/détermination restants |
| `scene_entities` | `is_defeated` | boolean | DEFAULT false |
| `enemy_loot_table` | `combatant_id` | uuid FK | Référence vers `combatants` |

### Champs NULL selon le type d'entité

| Type | `combatant_id` | `endurance_current` | `wounds_received` | `hatred_current` | `is_defeated` |
|---|---|---|---|---|---|
| `enemy` | FK ennemi | Valeur | Valeur | Valeur | false / true |
| `npc` | FK PNJ | Valeur | Valeur | Valeur | false |
| `item` | null | null | null | null | false |
| `zone` | null | null | null | null | false |

---

## 7. RLS & sécurité

- Table `combatants` : lecture/écriture réservée au MJ authentifié (`auth.uid() = campaigns.gm_user_id` via join)
- Les joueurs n'accèdent jamais directement aux fiches — les entités de scène visibles exposent uniquement `name`, `artwork_url`, et la position du token
- Les stats (endurance, blessures, haine) sont visibles du MJ uniquement — jamais exposées dans les endpoints joueur

---

## 8. Liens avec les autres features

| Feature | Interaction |
|---|---|
| `feature-loot.md` | Table de loot sur la fiche. `npc_inventory` pour l'inventaire PNJ. Résolution au marquage "Vaincu" |
| `feature-nfc.md` | Export des données ennemi → base64 pour encodage NFC (ennemis uniquement) |
| `feature-nfc-encoding.md` | Algorithme de sérialisation des champs |
| `feature-media-library.md` | Upload artwork. Résolution d'image par famille + rareté |
| `feature-live-stats-dragdrop.md` | Popover édition endurance/blessures/haine sur le token |
| `feature-initiative.md` | Ennemis et PNJ participent au fil d'initiative |
| `feature-display-tv.md` | Animations spawn NFC selon rareté (ennemis). Overlay fiche sur TV |
