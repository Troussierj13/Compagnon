# Feature — Algorithme d'encodage/décodage NFC

> Référence principale : [`feature-nfc.md`](./feature-nfc.md)
> Ce document spécifie l'algorithme utilisé pour sérialiser les données sur les puces NFC.

---

## Statut

✅ **Spécifié** — Ce document est complet. L'implémentation NFC peut démarrer.

---

## Puce cible

**NTAG216** — 888 bytes de mémoire utilisateur disponibles.

Les données sont encapsulées dans un **enregistrement NDEF** sur la puce (format standard NFC). Le Pico gère la lecture/écriture NDEF de façon transparente : il extrait uniquement le payload utile avant de l'envoyer à l'endpoint. L'app ne voit jamais le framing NDEF.

**Overhead NDEF estimé : ~12–15 bytes** (TLV wrapper + header NDEF record + terminateur), ce qui laisse **~873 bytes utiles** pour notre payload.

---

## Algorithme : CBOR

Le payload utilise **CBOR** (Concise Binary Object Representation — RFC 7049).

CBOR est un format de sérialisation binaire conçu pour les contraintes IoT/mémoire. Il gère nativement :
- Le type de chaque valeur (string, integer, float, boolean, array, map…) dans le premier octet de chaque valeur
- Les longueurs de chaînes et tableaux
- L'optimisation automatique de la taille des entiers (un petit entier tient en 1–2 bytes)

Librairie recommandée côté Nitro (Node.js) : `cbor-x` (la plus rapide, support TypeScript natif).

---

## Format du payload sur la puce

```
[ version : 1 byte ] [ CBOR map ]
```

### Byte de version

- `0x01` pour la version courante de l'algorithme
- Permet la rétrocompatibilité : une vieille puce reste identifiable même si l'algorithme évolue
- Si le byte de version est inconnu → puce marquée **illisible** (voir section Erreurs)

### Map CBOR

La map contient tous les champs de l'entité avec leurs noms complets en clés string. Le champ `_t` est réservé pour le type de l'entité.

```json
{
  "_t": "ennemi",
  "nom": "Gobelin des cavernes",
  "famille": "gobelin",
  "puissance": 12,
  "endurance": 8,
  "rareté": "common",
  "compétences_combat": [
    { "nom": "Cimeterre", "niveau": 2, "dégâts": 2, "perforant": 14 }
  ]
}
```

**Règles :**

- `_t` est **obligatoire** — c'est le type de l'entité, correspond au champ `name` de `nfc_entity_types` en BDD
- Les noms de champs sont en **noms complets** (pas d'abréviations) — la puce doit rester lisible sans référence externe
- Les **champs optionnels absents sont simplement omis** de la map — ne pas encoder de valeur nulle
- Les types CBOR natifs sont utilisés directement : `string`, `integer`, `float`, `boolean`, `array`
- Les `enum` sont encodés comme des `string` (ex: `"common"`, `"rare"`)
- Les tableaux (`string[]`, `int[]`) sont encodés comme des CBOR arrays

---

## Auto-suffisance

La puce est **entièrement auto-suffisante** : elle contient son type et toutes ses valeurs. L'app n'a besoin d'aucun lookup BDD pour décoder le contenu d'une puce.

La BDD (`nfc_entity_types`) est utilisée uniquement pour :
1. Valider que le type `_t` est connu
2. Exécuter l'action associée au type (`spawn_entity`, `drop_loot`, etc.)
3. Construire le formulaire d'encodage dans le back-office

Si le type `_t` est absent de la BDD → puce **illisible** (voir section Erreurs).

---

## Transport Pico → endpoint

Le Pico lit les bytes bruts de la mémoire utilisateur de la puce et les envoie à l'endpoint en **base64 dans un JSON** :

```http
POST /api/nfc/trigger
Authorization: Bearer <NFC_SECRET>
Content-Type: application/json

{
  "data": "<base64 des bytes bruts de la puce>"
}
```

Côté endpoint Nitro, le décodage suit ces étapes :
1. Décoder le base64 → `Buffer`
2. Lire le premier byte → version de l'algorithme
3. Décoder le reste avec CBOR → map
4. Lire `_t` → lookup BDD pour récupérer l'action associée
5. Exécuter l'action sur la scène active

---

## Comportement en cas d'erreur

Tous les cas d'erreur remontent une **alerte MJ** visible dans le panneau session et lors du test pre-session (`/gm/nfc`). Aucune erreur n'est silencieuse.

| Cas | Comportement |
|---|---|
| Token d'authentification invalide | HTTP 401, rien en BDD |
| Byte de version inconnu | Puce marquée **illisible**, alerte MJ |
| Décodage CBOR échoue (payload corrompu ou tronqué) | Puce marquée **illisible**, alerte MJ |
| Champ `_t` absent de la map | Puce marquée **illisible**, alerte MJ |
| Type `_t` inconnu en BDD | Puce marquée **illisible** avec le type lu affiché (pour que le MJ puisse créer le type manquant) |
| Champ `required` manquant dans la map | Puce marquée **incomplète**, alerte MJ avec les champs manquants listés |

> Le MJ teste les puces avant chaque session depuis `/gm/nfc`. C'est le point d'entrée principal pour diagnostiquer les puces illisibles ou incomplètes.

---

## Versioning

Le byte de version (`0x01` actuellement) protège contre les incompatibilités futures.

- Si le schéma d'un type NFC évolue (champ ajouté, supprimé, renommé), incrémenter la `version` du `nfc_entity_type` en BDD suffit — les puces encodées avec l'ancienne structure restent décodables tant que les champs présents correspondent
- Si l'algorithme CBOR lui-même doit évoluer (cas rare), incrémenter le byte de version du payload et implémenter un décodeur dédié pour cette version dans `server/utils/nfc/decoder.ts`

---

## Localisation du code

```
server/utils/nfc/
├── encoder.ts   ← encode un objet JS → Buffer (version byte + CBOR)
└── decoder.ts   ← decode un Buffer → objet JS + version + type
```

Les deux fonctions sont des utilitaires purs (pas d'appel BDD) — le lookup `nfc_entity_types` se fait dans l'endpoint `/api/nfc/trigger`.

---

## Exemple de payload encodé

Entité ennemi minimale :

```json
{ "_t": "ennemi", "nom": "Gobelin", "puissance": 8, "endurance": 5, "rareté": "common" }
```

Taille estimée après encodage CBOR + version byte : **~50–60 bytes** sur ~873 bytes utiles disponibles (888 bytes NTAG216 moins ~15 bytes d'overhead NDEF). Très large marge, même avec des champs riches (compétences, description longue).
