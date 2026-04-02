# Feature — Puces NFC

> Référence principale : [`README.md`](./README.md)
> Algorithme d'encodage/décodage : [`feature-nfc-encoding.md`](./feature-nfc-encoding.md)

---

## Principe général

Les puces NFC sont des supports physiques autonomes attachés aux figurines (ou autres objets de jeu). Quand une figurine est posée sur le lecteur NFC, l'app déclenche automatiquement une action sur la scène courante.

**La puce est auto-suffisante** : toutes les données nécessaires sont encodées dessus. Aucun lookup BDD n'est requis pour interpréter le contenu d'une puce — sauf pour retrouver le schéma de décodage (voir ci-dessous).

---

## Ce que contient une puce

Chaque puce encode un payload binaire compressé, converti en base64 pour le transport. Le payload contient toujours :

```
[ version encodeur (1 byte) ][ type_id (ref BDD) ][ valeurs des champs dans l'ordre défini ]
```

- **Version encodeur** : permet la rétrocompatibilité. Une vieille puce reste décodable même si l'algorithme évolue.
- **Type ID** : référence vers un `nfc_entity_type` en BDD — définit quels champs suivent et dans quel ordre.
- **Valeurs** : sérialisées et compressées selon l'algorithme défini dans `feature-nfc-encoding.md`.

Les images ne sont **pas** stockées sur la puce. Elles sont résolues côté app via des champs comme `race`, `rareté`, `sexe` → image prédéfinie.

---

## Système de types — piloté par la BDD

### Principe

L'algorithme d'encodage/décodage est **générique**. C'est la BDD qui définit les schémas de données. Aucun type n'est codé en dur dans le code applicatif.

Le MJ peut créer de nouveaux types d'entité NFC depuis le back-office sans toucher au code.

### Table `nfc_entity_types`

| Champ | Type | Description |
|---|---|---|
| `id` | uuid | Identifiant |
| `name` | text | Nom lisible (ex: `"Ennemi"`, `"Drop"`) |
| `version` | integer | Version du schéma (incrémenté si les champs changent) |
| `fields` | jsonb | Tableau ordonné de champs (voir format ci-dessous) |
| `action` | enum | Action déclenchée à la lecture (voir liste des actions) |
| `created_at` | timestamp | — |

### Format `fields`

```json
[
  { "name": "nom",        "type": "string",  "required": true  },
  { "name": "race",       "type": "string",  "required": true  },
  { "name": "surnom",     "type": "string",  "required": false },
  { "name": "puissance",  "type": "int",     "required": true  },
  { "name": "endurance",  "type": "int",     "required": true  },
  { "name": "rareté",     "type": "enum",    "required": true, "values": ["common", "uncommon", "rare", "legendary"] },
  { "name": "sexe",       "type": "enum",    "required": false, "values": ["m", "f", "n"] },
  { "name": "compétences","type": "string[]","required": false }
]
```

> La liste complète des champs d'un ennemi est à finaliser. Ce qui précède est un début de liste indicatif.

Types de champs supportés : `string`, `int`, `float`, `boolean`, `enum`, `string[]`, `int[]`.

---

## Actions déclenchées à la lecture

Liste fixe définie dans le code, extensible au fil des développements.

| Action | Effet sur la scène courante |
|---|---|
| `spawn_entity` | Fait apparaître un token sur la battlemap (avec animation selon rareté) |
| `drop_loot` | Ajoute des objets invisibles à la scène, distribuables par le MJ |
| `show_overlay` | Affiche une fiche ou image en overlay sur la TV |
| `highlight_entity` | Met en surbrillance une entité existante de la scène |

---

## Flux de lecture (runtime)

```
Figurine posée sur le lecteur NFC
        │
Pico (ou autre matériel) lit la puce → extrait le base64
        │
POST /api/nfc/trigger
  { "data": "<base64>" }
  Header: Authorization: Bearer <nfc_secret>
        │
Server endpoint Nitro
  1. Vérifie le token secret
  2. Lit version + type_id depuis le payload
  3. Lookup BDD → récupère le schéma nfc_entity_types
  4. Décode les valeurs dans l'ordre défini
  5. Exécute l'action associée sur la scène active de la session en cours
        │
Supabase Realtime émet l'événement
        │
    ┌───┴──────────────────┐
    ▼                      ▼
Panneau MJ             TV + téléphones joueurs
(notification)         (animation + token / overlay / loot)
```

**Note** : l'endpoint cible toujours la **scène courante** de la session active. Il n'y a pas de `scene_id` dans le payload — poser une figurine sur la table déclenche l'action sur ce qui est affiché en ce moment.

---

## Pages back-office NFC (`/gm/nfc`)

### `/gm/nfc` — Portail NFC

Page d'entrée. Accès aux outils :
- Encodage d'une puce
- Gestion des types d'entité
- Configuration de la connexion au Pico

---

### `/gm/nfc/encode` — Encodage

**Étape 1 — Sélection du type**
- Liste des `nfc_entity_types` disponibles
- Sélection du type souhaité

**Étape 2 — Saisie des données**
- Formulaire généré dynamiquement depuis les `fields` du type sélectionné
- Aperçu en temps réel du payload base64 généré

**Étape 3 — Écriture sur la puce**
Deux options disponibles :
- **Copier** le base64 pour l'écrire manuellement avec un lecteur externe
- **Envoyer au Pico** configuré → le Pico écrit directement sur la puce posée sur le lecteur

---

### `/gm/nfc/types` — Gestion des types d'entité

- Liste des types existants
- Créer un nouveau type : nom + définition des champs (ordre, type, requis/optionnel) + action associée
- Modifier un type existant (incrémente la `version` automatiquement)
- Supprimer un type (avec avertissement si des puces encodées en dépendent)

---

### `/gm/nfc/pico` — Configuration de la connexion Pico

- Adresse du Pico (IP locale ou URL)
- Token d'authentification (`NFC_SECRET`)
- Bouton de test de connexion
- La configuration est persistée en BDD (disponible sur n'importe quel appareil MJ)

---

## Résolution des images

Les images ne sont pas sur la puce. L'app les résout via une cascade de fallback définie dans [`feature-media-library.md`](./feature-media-library.md) :

```
1. Artwork défini directement sur la fiche de l'entité (ex: enemies.artwork_url)
        ↓ (si absent)
2. Mapping race + rareté + sexe → bibliothèque campagne
        ↓ (si absent)
3. Mapping race + rareté (sexe ignoré) → bibliothèque campagne
        ↓ (si absent)
4. Mapping rareté seule → bibliothèque campagne
        ↓ (si absent)
5. Icône colorée par type (comportement par défaut)
```

Le MJ configure les mappings race/rareté/sexe → image depuis la section *Images NFC* de la bibliothèque de sa campagne (`/gm/campaigns/[id]/media`).

---

## Sécurité

- L'endpoint `/api/nfc/trigger` est protégé par un token secret partagé (`NFC_SECRET`)
- Le token est stocké dans les variables d'environnement serveur (jamais exposé côté client)
- Rate-limiting par IP à prévoir (cf. `todo.md`)
- Procédure de rotation du `NFC_SECRET` à définir avant mise en production
