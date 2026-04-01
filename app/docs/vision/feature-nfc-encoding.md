# Feature — Algorithme d'encodage/décodage NFC

> Référence principale : [`feature-nfc.md`](./feature-nfc.md)
> Ce document spécifie l'algorithme utilisé pour sérialiser et compresser les données sur les puces NFC.

---

## Statut

> ⚠️ **À définir** — L'algorithme d'encodage/décodage n'a pas encore été spécifié.
> Ce fichier est un placeholder. La feature NFC ne peut pas être implémentée tant que ce document n'est pas complet.

---

## Contraintes connues

- Les puces NFC ont une capacité mémoire limitée (variable selon le modèle — à préciser)
- L'encodage doit être **sans perte** : toutes les données doivent être récupérables à l'identique après décodage
- L'algorithme doit être **implémentable côté backend Nitro** (Node.js / TypeScript)
- Le payload doit commencer par : `[version encodeur (1 byte)][type_id]` — voir `feature-nfc.md`
- L'algorithme doit rester **performant** : le décodage se fait à chaque lecture de puce en temps réel

---

## Questions ouvertes

- Quelle capacité mémoire cible pour les puces ? (NTAG213 = 144 bytes, NTAG215 = 504 bytes, NTAG216 = 888 bytes)
- Algorithme de compression envisagé ? (ex: encodage binaire sur mesure, MessagePack, CBOR, compression LZ...)
- Comment encoder les `string[]` et `int[]` de façon compacte ?
- Comment gérer les champs optionnels absents sans gaspiller d'octets ?
- Format du `type_id` dans le payload : UUID (16 bytes) ou identifiant court (2-4 bytes) ?

---

## À spécifier

- Format exact du payload byte par byte
- Gestion du versioning (rétrocompatibilité entre versions de l'encodeur)
- Limites par type de champ (longueur max d'une string, valeur max d'un int, etc.)
- Comportement en cas de payload tronqué ou corrompu
- Localisation du code : `server/utils/nfc/encoder.ts` + `server/utils/nfc/decoder.ts`
