# TODO — Notes techniques et points d'attention

> Pour le plan d'implémentation et le suivi de progression, voir `app/docs/technical/build-order.md`.

**Dernière mise à jour** : 2026-04-06

---

## 🔴 Bugs bloquants

*Aucun — le code a été réécrit from scratch.*

---

## 🔵 Sécurité — À implémenter avant mise en production

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

## 🟣 Points TypeScript à valider à l'implémentation

### Type discriminant pour EntityPayload
Lors de l'implémentation de `feature-enemies.md`, utiliser un type discriminant :
```typescript
type EntityPayload =
  | { type: 'combatant'; data: CombatantData }
  | { type: 'item';      data: ItemData      }
  | { type: 'zone';      data: ZoneData      }
```
Éviter le fallback `Record<string, unknown>` qui affaiblit la sûreté de type.

### Champ `wounds` dans `TORCharacterData`
Le popover PJ (`feature-live-stats-dragdrop.md`) expose un champ "Blessures".
Vérifier que `wounds` est bien défini dans `types.md` → `TORCharacterData` avant d'implémenter le popover.

---

## 🟡 Pièges d'implémentation connus

> Ces points ont causé des bugs dans le code legacy. À ne pas reproduire.

### Jointures Supabase ambiguës (PostgREST)
Quand deux FK existent entre deux tables, spécifier la FK explicitement :
```typescript
.select('*, active_scene:scenes!active_scene_id(*)')  // ✅
.select('*, active_scene:scenes(*)')                   // ❌ PostgREST error
```

### Realtime — payload INSERT sans relations jointes
Sur `postgres_changes` INSERT, `payload.new` ne contient que les colonnes directes.
Faire un fetch ciblé après l'event pour récupérer les relations.

### Partage d'état entre composables
`usePlayerSession()` appelé dans deux composants → deux instances séparées → double fetch.
**Pattern correct** : `provide/inject` depuis le layout parent, ou composable appelé une seule fois dans la page racine.

### Clés localStorage — utiliser une constante partagée
Ne pas dupliquer `'compagnon:session_id'` etc. Centraliser dans `utils/storage.ts` (auto-importé).

---

## ✅ Endpoints validés en tests (legacy — à re-valider après réécriture)

| Endpoint | Scénarios testés |
|---|---|
| `GET /api/session/[code]` | Code valide, code inconnu, session ended |
| `POST /api/session/join` | Body vide (400), code valide + nom |
| `GET /api/session/[id]/state` | Sans participant_id (400), UUID inconnu (403), valide (200), cross-session (403) |
| `GET /api/session/[id]/characters` | Retourne id/name/player_name uniquement |
| `POST /api/session/create` | Sans cookie (401), cookie expiré (401) |
