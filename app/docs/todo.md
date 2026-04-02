# TODO — Bugs connus et améliorations à faire

> Référence principale : [`vision/README.md`](./vision/README.md)
> Pour les fonctionnalités à implémenter, voir [`roadmap.md`](./roadmap.md).

**Dernière mise à jour** : 2026-04-03

---

## 🔴 Bugs bloquants

*Aucun bug bloquant connu à ce jour.*

---

## 🟠 Bugs non-bloquants / Comportements incorrects

### Pages GM non auditées
Les pages suivantes ont été modifiées mais pas encore relues ni testées en profondeur :
- `pages/gm/campaigns/[id]/index.vue` — détail campagne + gestion personnages
- `pages/gm/campaigns/[id]/session/[sessionId].vue` — session live MJ
- `pages/gm/campaigns/[id]/characters/[charId].vue` — feuille de perso MJ

**Risques potentiels** :
- Jointures Supabase ambiguës — vérifier tous les `.select()` avec des relations jointes (cf. `architecture.md`)
- Gestion d'erreur absente sur certaines opérations (create/update/delete)

### Partage d'état entre player/scene.vue et player/sheet.vue
`player/scene.vue` et `player/sheet.vue` appellent chacun `usePlayerSession()` indépendamment → deux instances d'état séparées → `restore()` appelé deux fois.

**Impact** : double appel réseau, état non synchronisé.
**Solution** : singleton (refs au niveau module) ou `provide/inject` depuis un layout partagé.

### Pas de gestion d'erreur visible dans gm/index.vue
`createCampaign()` fait un `console.error` en cas d'échec mais n'affiche rien à l'utilisateur.
**Fix** : ajouter un `ref<string | null>('error')` et afficher un `UAlert`.

---

## 🟡 Améliorations UX / DX

### Validation longueur join_code sur le bouton submit
Le bouton "Rejoindre" est activé dès que `joinCode` est non vide, même si < 6 caractères.
**Fix** : `:disabled="!joinCode.trim() || !playerName.trim() || joinCode.length < 6"`

### STORAGE_KEY dupliqué
La constante `'compagnon_player_session'` est définie à deux endroits :
- `composables/usePlayerSession.ts`
- `middleware/player-session.ts`

**Fix** : extraire dans `utils/storage.ts` → auto-importé.

### Nommage incohérent entre composables
- `useGMSession` expose `subscribeToSession(sessionId)`
- `usePlayerSession` expose `subscribeToSessionUpdates()`

Même concept, noms différents. À uniformiser.

---

## 🔵 Sécurité — Points d'attention

### Rate-limiting sur `/api/session/join`
Sans rate-limiting, un brute-force distribué sur les `join_code` reste possible.
**Solution** : middleware Nitro de rate-limiting par IP.

### Rate-limiting sur `/api/nfc/trigger`
Limiter les appels par IP pour éviter le spam depuis un Pico compromis.

### TTL des sessions actives
Les sessions `active` ne s'arrêtent jamais automatiquement.
**Solution** : trigger Postgres ou job cron Supabase.

### Rotation du NFC_SECRET
Pas de procédure de rotation définie. À prévoir avant la mise en production.

---

## 🟣 Améliorations TypeScript

### Type discriminant pour EntityData
`EntityData = EnemyData | ItemData | ZoneData | Record<string, unknown>` — le fallback `Record<string, unknown>` affaiblit la sûreté de type.
**Solution** :
```typescript
type EntityPayload =
  | { type: 'enemy'; data: EnemyData }
  | { type: 'item';  data: ItemData  }
  | { type: 'zone';  data: ZoneData  }
  | { type: 'npc';   data: NPCData   }
```

### Champ `wounds` absent de `TORCharacterData`
Le popover PJ (feature `feature-live-stats-dragdrop.md`) expose un champ "Blessures" qui n'est pas encore défini dans `TORCharacterData`.
**À définir** dans `feature-characters.md` (fiche personnage complète) avant d'implémenter le popover PJ.

### `NPCData` non défini dans `rpg.ts`
Les PNJ ont un type `EntityData` générique. Un type `NPCData` (endurance, endurance_max, portrait_url) est nécessaire pour le type discriminant et les popovers.
**À ajouter** dans `types/rpg.ts` lors de l'implémentation des fiches PNJ.

---

## ✅ Validé en tests réels (2026-03-30)

| Endpoint | Scénario couvert | Résultat |
|---|---|---|
| `GET /api/session/[code]` | Code valide, code inconnu, session ended | ✅ |
| `POST /api/session/join` | Body vide (400), code valide + nom | ✅ |
| `GET /api/session/[id]/state` | Sans participant_id (400), UUID inconnu (403), participant valide (200), cross-session (403) | ✅ |
| `GET /api/session/[id]/characters` | Participant valide — retourne id/name/player_name uniquement | ✅ |
| `POST /api/session/create` | Sans cookie (401), cookie expiré (401) | ✅ |

> `POST /api/session/create` n'a pas été testé avec un cookie valide (JWT expiré à 17:06 UTC). Le comportement 401 sur token expiré est correct.

---

## ✅ Corrigé (2026-03-30)

| Problème | Fichier(s) |
|---|---|
| `gm_user_id` exposé via `campaign:campaigns(*)` dans endpoint joueur | `state.get.ts` |
| `select('*')` dans endpoints joueur | `state.get.ts` |
| Double appel réseau dans `restore()` | `usePlayerSession.ts` |
| `catch {}` silencieux dans `restore()` | `usePlayerSession.ts` |
| Validation `participant_id` dupliquée | `validateParticipant.ts` |
| `useSupabaseAdmin` non-singleton | `supabaseAdmin.ts` |
| `colorMap`/`iconMap` dupliqués | `entityDisplay.ts` |
| Assertion `as Record<string, unknown>` dans EntityCard | `EntityCard.vue` |
| Jointure ambiguë PostgREST `scenes(*)` → `scenes!active_scene_id(*)` | `useGMSession.ts` |
