# Feature — Système de loot et objets

> Référence principale : [`README.md`](./README.md)
> Images des objets : [`feature-media-library.md`](./feature-media-library.md)

---

## Principe général

Les objets sont définis dans un **catalogue par campagne**. Une fois créés, ils sont réutilisables partout : tables de loot d'ennemis, ajouts manuels en scène, craft. Le MJ peut enrichir le catalogue à n'importe quel moment — avant, pendant, ou entre les sessions.

Ce document couvre deux systèmes fortement liés :
1. **Les objets** — catalogue, types, inventaires
2. **Le loot** — tables de drop, résolution, distribution en scène

---

## 1. Catalogue d'objets (`/gm/campaigns/[id]/items`)

### Types d'objets

Le type détermine dans quelle section de l'inventaire d'un personnage l'objet atterrit automatiquement.

| Type | Label UI | Destination inventaire |
|---|---|---|
| `item` | Objet | Inventaire général |
| `weapon` | Arme | Attirail de guerre |
| `armor` | Armure / Équipement | Attirail de guerre |
| `consumable` | Consommable | Inventaire général |
| `currency` | Monnaie | Trésor |
| `crafting_component` | Composant de craft | Réserve de craft |

### Rareté des objets

Tous les objets ont une rareté. Elle est particulièrement significative pour les composants de craft (voir section Craft).

| Rareté | Usage |
|---|---|
| `common` | Objets courants, composants basiques |
| `uncommon` | Objets peu communs, composants de qualité |
| `rare` | Objets rares, composants précieux |
| `legendary` | Objets légendaires, matériaux d'exception |

### Données d'un objet

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `campaign_id` | uuid FK | Campagne |
| `name` | text | Nom |
| `description` | text\|null | Description libre (Markdown) |
| `type` | enum | Voir types ci-dessus |
| `rarity` | enum | `common` / `uncommon` / `rare` / `legendary` |
| `media_id` | uuid FK\|null | Artwork depuis la bibliothèque d'images |
| `unit` | text\|null | Unité d'affichage pour les monnaies (ex: "pièces d'or") |
| `craft_tags` | text[]\|null | Tags pour le système de craft (ex: `["métal", "forgeron"]`) |
| `created_at` | timestamp | — |

### Page catalogue

- Grille / liste de tous les objets de la campagne
- Filtres : type, rareté, recherche par nom
- Créer / modifier / supprimer un objet
- Suppression bloquée si l'objet est dans une table de loot active ou un inventaire

---

## 2. Ajout rapide d'objet en scène

Pendant une scène, le MJ peut avoir besoin d'ajouter un objet qu'il n'avait pas prévu. Le flux doit être rapide, sans sortir du panneau session.

### Deux chemins depuis le panneau session

**Option A — Depuis le catalogue**
Picker qui liste les objets existants de la campagne (filtrable par type/nom). L'objet sélectionné est ajouté directement à la scène (masqué par défaut).

**Option B — Création à la volée**
Formulaire minimal : nom + type (obligatoires), rareté, description optionnelle.
- L'objet est immédiatement ajouté à la scène (masqué)
- Une option "Sauvegarder dans le catalogue" est cochée par défaut — si validée, l'objet est persisté dans la campagne pour une réutilisation future

---

## 3. Table de loot des ennemis

Chaque fiche ennemi dans le catalogue peut avoir une table de loot. Elle définit les objets potentiellement droppés quand cet ennemi est vaincu.

### Structure d'une entrée

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `combatant_id` | uuid FK | Ennemi ou PNJ concerné (référence `combatants.id`) |
| `item_id` | uuid FK | Objet depuis le catalogue |
| `probability` | integer | Probabilité de drop en % (1–100, défaut : 100) |
| `quantity_min` | integer | Quantité minimale droppée (défaut : 1) |
| `quantity_max` | integer | Quantité maximale droppée (défaut : 1) |

Si `quantity_min == quantity_max`, la quantité est fixe. Sinon, un entier aléatoire est tiré dans l'intervalle à la résolution.

### Exemple de table

| Objet | Probabilité | Quantité |
|---|---|---|
| Épée courte rouillée | 100% | 1 |
| Potion de soin | 40% | 1 |
| Pièces d'or | 100% | 2–8 |
| Lingot de fer (commun) | 25% | 1–2 |

---

## 4. Résolution du loot

### Déclenchement

Quand le MJ marque un ennemi comme **vaincu** dans le panneau session, un bouton "Résoudre le loot" apparaît. Il peut aussi l'ignorer (pas de loot pour cet ennemi).

### Résolution automatique

Le système tire aléatoirement pour chaque entrée de la table :
1. Tirage de probabilité (drop ou non)
2. Si drop : tirage de quantité dans l'intervalle

Le résultat s'affiche dans un **panneau de validation** avant d'être poussé dans la scène.

### Override MJ (obligatoire avant confirmation)

Avant de valider, le MJ peut modifier librement le résultat :
- Retirer un objet du drop
- Modifier la quantité d'un objet
- Ajouter manuellement un objet (depuis le catalogue ou création à la volée)
- Relancer le tirage entier

### Confirmation → objets dans la scène

Une fois validé, les objets sont créés comme entités de scène avec `visible_to_players: false`. Ils sont invisibles pour les joueurs jusqu'à révélation.

---

## 5. Overlay de distribution

Quand le MJ est prêt à distribuer le loot, il ouvre l'**overlay de distribution** depuis le panneau session.

### Disposition

```
┌─────────────────────────────────────────────────┐
│  LOOT DISPONIBLE                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Épée     │ │ Potion   │ │ 5 pièces │  ...   │
│  │ courte   │ │ de soin  │ │ d'or     │        │
│  └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────┤
│  JOUEURS                                        │
│  ┌──────────────┐ ┌──────────────┐ ...          │
│  │ Aldric       │ │ Mira         │              │
│  │ (Guerrier)   │ │ (Rôdeuse)    │              │
│  └──────────────┘ └──────────────┘              │
└─────────────────────────────────────────────────┘
```

### Interactions

- **Drag & drop** d'un objet du loot vers la card d'un joueur → l'objet est transféré dans son inventaire (temps réel sur son téléphone)
- **Clic sur un objet** → option "Révéler sur la TV" (sans distribuer) : l'objet devient visible sur la battlemap/overlay TV
- **Clic sur un objet** → option "Ignorer" : retire l'objet de la scène sans le distribuer

### Résultat d'un transfert

Quand un objet est distribué à un joueur :
1. L'entité de scène est supprimée (ou marquée comme distribuée)
2. L'objet est ajouté à l'inventaire du personnage joueur (table `character_inventory`)
3. Le téléphone du joueur reçoit la mise à jour en temps réel

---

## 6. Inventaire des personnages

### Structure

L'inventaire des personnages joueurs est stocké dans le JSONB `characters.data.inventory` (voir `feature-characters.md` — `TORCharacterData.inventory`). C'est une liste d'`InventoryItem` :

```typescript
interface InventoryItem {
  item_id: string | null   // FK → catalogue items (null = objet saisi manuellement)
  name: string             // Dénormalisé
  quantity: number
  skill_ref: SkillId | null
  notes: string | null
  source: 'manual' | 'loot'
}
```

> **Pas de table `character_inventory` séparée** — tout est dans `characters.data`. Les updates utilisent `jsonb_set` ciblé pour éviter de réécrire toute la fiche.

**Sections affichées dans la fiche joueur :**
- **Inventaire** — objets, consommables (onglet 7 de la fiche — voir `feature-player-view.md`)
- **Attirail de guerre** — armes, armures (onglet 5 & 6)
- **Trésor** — champ `data.treasure`
- **Réserve de craft** — items avec type `crafting_component` (groupés dans l'inventaire général)

Le MJ peut modifier les inventaires depuis :
- La fiche personnage en back-office
- Le panneau session (directement pendant la session)

### Notification de réception (temps réel)

Quand un objet est distribué à un joueur et que `characters.data` est mis à jour via Supabase Realtime, le téléphone du joueur détecte les nouveaux items et affiche un **toast de réception** (nom de l'objet + image si disponible). Voir `feature-player-view.md` — E3.

---

## 7. Composants de craft

Les composants de craft sont des objets de type `crafting_component`. Ils se comportent comme tous les autres objets (ils droppent des ennemis, vont dans la réserve de craft de l'inventaire), mais ont des attributs supplémentaires pour le système de craft.

### Exemples

| Composant | Rareté | Tags |
|---|---|---|
| Lingot de fer | `common` | `métal`, `forgeron` |
| Lingot d'acier | `uncommon` | `métal`, `forgeron` |
| Cuir épais | `common` | `cuir`, `cordonnier`, `armurier` |
| Gemme de feu | `rare` | `gemme`, `enchanteur` |
| Écaille de dragon | `legendary` | `écaille`, `forgeron`, `enchanteur` |

Les `craft_tags` permettent au système de craft (feature à détailler séparément) de filtrer les composants disponibles selon le type d'artisan rencontré.

> **Note** : Le système de craft (recettes, interface avec un PNJ artisan, résultat) est une feature à part entière à spécifier dans `feature-craft.md`. Ce document pose uniquement les bases des composants en tant qu'objets droppables.

> **NOTE** : Le système de craft complet (tables de recettes, interface artisan, résultats de fabrication) est hors scope de cette spec. Si ce système est implémenté dans le futur, il devra faire l'objet d'un fichier `feature-craft.md` dédié.

---

## 8. Données — Base de données (récapitulatif)

### Nouvelles tables

| Table | Rôle |
|---|---|
| `campaign_items` | Catalogue d'objets par campagne |
| `enemy_loot_table` | Entrées de la table de loot par ennemi/PNJ (`combatant_id` FK → `combatants`) |
| `npc_inventory` | Inventaire des PNJ (`combatant_id` FK → `combatants` où `kind = 'npc'`) |

> **Inventaire des PJ** : stocké dans `characters.data.inventory` (JSONB) — pas de table séparée. Voir `feature-characters.md`.

### Champs à ajouter sur les tables existantes

| Table | Champ | Type | Usage |
|---|---|---|---|
| `scene_entities` | `item_id` | uuid FK\|null | Référence à `campaign_items` pour les entités de type objet |

> **Note** : les tables `enemies` et `npcs` n'existent pas en tant que tables séparées — tout passe par `combatants` (voir `feature-enemies.md`). `npc_inventory.combatant_id` référence `combatants.id` où `kind = 'npc'`.

---

## 9. Résumé des interactions MJ → session

| Action MJ | Effet |
|---|---|
| Ennemi marqué vaincu | Bouton "Résoudre le loot" apparaît |
| Résoudre le loot | Tirage automatique + panneau de validation |
| Override + confirmation | Objets créés dans la scène (masqués) |
| Ouvrir overlay distribution | Vue liste objets + cards joueurs |
| Drag objet → joueur | Objet ajouté à l'inventaire, téléphone mis à jour |
| Révéler un objet | Token objet visible sur TV / overlay |
| Ajout rapide en scène | Picker catalogue ou création à la volée |
