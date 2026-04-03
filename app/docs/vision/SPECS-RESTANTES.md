# Specs restantes à rédiger

> Ce fichier liste les features qui n'ont pas encore leur fichier `feature-xxx.md`.
> Aucune implémentation ne peut démarrer sans que la spec correspondante soit complète.
> Mettre à jour ce fichier au fur et à mesure que les specs sont rédigées.

**Dernière mise à jour** : 2026-04-03

---

## 🔴 Phase 2 — Bloquant

### `feature-characters.md` — Fiche personnage joueur enrichie
**Réf. roadmap** : A3
**Bloque** : distribution de loot vers inventaire joueur, popover blessures/espoir MJ, vue joueur téléphone

À spécifier :
- Structure complète de la fiche TOR : stats (Corps, Cœur, Esprit), compétences, vertus, récompenses, équipement
- Champ `espoir` (équivalent mana/ressource narrative) + règle de blessures côté PJ
- `portrait_url` pour le token battlemap
- Inventaire : géré par le MJ (attribution loot) et le joueur (notes, consommables)
- Popover édition rapide MJ : endurance courante, espoir courant, blessures (lien avec `feature-live-stats-dragdrop.md`)
- Structure du JSONB `characters.data` (`TORCharacterData`) — à finaliser pour typage TypeScript

---

## 🟠 Phase 3 — Non bloquant pour Phase 2

### `feature-player-view.md` — Vue joueur téléphone enrichie
**Réf. roadmap** : E1, E2, E3, E4
**Bloque** : toute la Phase 3

À spécifier :
- **E1** — Sélection de personnage au join : liste des persos disponibles après saisie du join_code + nom, persistance `character_id` en localStorage
- **E2** — Feuille de perso interactive : modification endurance/espoir/blessures depuis `/player/scene`, prise de notes, transit obligatoire par server endpoint
- **E3** — Inventaire temps réel : souscription Realtime sur `character_inventory`, toast de réception d'objet
- **E4** — Annonces MJ → joueurs : messages narratifs/alertes envoyés depuis le panneau session, overlay toast sur téléphone + optionnellement sur TV

---

## ⚪ Phase 4 — Basse priorité (pas urgent)

### `feature-session-panel.md` — Layout panneau MJ en combat
**Réf. roadmap** : —
**Mentionné dans** : `feature-initiative.md`

À spécifier :
- Layout complet du panneau session pendant un combat actif
- Disposition des zones : fil d'initiative, tokens, actions rapides, stats ennemis

---

### `feature-shortcuts.md` — Raccourcis clavier
**Réf. roadmap** : —
**Mentionné dans** : `feature-initiative.md`

À spécifier :
- Raccourci "Tour suivant" pendant un combat
- Autres raccourcis globaux du panneau session MJ

---

### Features Phase 4 sans spec (F1–F4)
Peuvent être spécifiées à la demande, pas de fichier dédié pour l'instant.

| Feature | Réf. | Résumé |
|---|---|---|
| Mode préparation de session | F1 | Préparer scènes et entités avant de lancer la session |
| Statuts visuels sur tokens | F2 | Icônes ou couleurs : blessé, mort, effet de statut |
| Dés virtuels | F3 | Interface de lancer de dés sur téléphone, résultats publics ou privés |
| Historique de session | F4 | Log des événements clés — utile pour le compte-rendu post-session |

---

## ✅ Specs complètes (ne plus modifier sauf correction)

| Fichier | Complété le |
|---|---|
| `feature-nfc-encoding.md` | 2026-04-03 |
| `feature-display-tv.md` | 2026-04-03 |
| `feature-nfc.md` | 2026-04-03 |
| `feature-media-library.md` | 2026-04-03 |
| `feature-loot.md` | 2026-04-03 |
| `feature-initiative.md` | 2026-04-03 |
| `feature-live-stats-dragdrop.md` | 2026-04-03 |
| `feature-enemies.md` | 2026-04-03 |
