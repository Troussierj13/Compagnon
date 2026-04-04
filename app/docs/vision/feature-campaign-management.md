# Feature — Gestion de Campagne (`feature-campaign-management.md`)

> Vision globale : [`README.md`](./README.md)
> Système de jeu (cultures, vertus, armurerie) : [`feature-game-system.md`](./feature-game-system.md)
> Fiches personnages : [`feature-characters.md`](./feature-characters.md)
> Fiches ennemis & PNJ : [`feature-enemies.md`](./feature-enemies.md)

> ⚠️ **Cette spec est incomplète. Elle décrit l'intention générale et les axes à couvrir. Elle doit être finalisée avant toute implémentation.**

---

## Principe général

La page de gestion de campagne (`/gm/campaigns/[id]`) est le **hub central du MJ**. C'est là qu'il prépare tout ce qui concerne une campagne : personnages, ennemis, sessions, armurerie, carte, configuration générale.

Cette page est utilisée **entre les sessions** (préparation) et **avant de lancer une session** (vérification rapide de l'état). Elle ne remplace pas le panneau session (`/gm/campaigns/[id]/session/[sessionId]`) qui lui est dédié au live.

---

## Ce qu'on veut couvrir

### Hub de navigation

La page est un hub avec accès rapide à toutes les ressources d'une campagne :

| Section | Contenu | Feature associée |
|---|---|---|
| Personnages joueurs | Liste + création + accès aux fiches | `feature-characters.md` |
| Ennemis & PNJ | Liste + création + accès aux fiches | `feature-enemies.md` |
| Sessions | Liste des sessions passées + créer une nouvelle | — |
| Armurerie | Armes, armures, objets de la campagne | `feature-game-system.md` |
| Bibliothèque média | Images uploadées pour la campagne | `feature-media-library.md` |
| Configuration | Paramètres globaux de la campagne | — |

### Configuration de la campagne

Paramètres éditables depuis l'onglet Configuration :

- **Nom** et **description** de la campagne
- **Fond d'écran** de l'écran d'attente TV (`wallpaper_url`) — image choisie depuis la bibliothèque
- **Carte du monde** (`world_map_url`) — image uploadée, utilisée en mode Voyage TV
- **Règles de voyage** (`travel_rules`) — bloc Markdown libre, affiché dans le panneau latéral TV en mode Voyage (météo, conditions actuelles, notes du MJ)
- **Saison courante** — Printemps / Été / Automne / Hiver (affecte les TN de voyage selon les règles TOR)
- **Havre actuel** — lieu de repos de la compagnie (Dale, la Comté, Fondcombe…) — utilisé pour les bonus de Phase de Communauté

### Gestion des sessions

- Liste des sessions de la campagne (nom, date, statut : active / terminée / archivée)
- Créer une nouvelle session
- Reprendre une session active existante
- Archiver / supprimer une session terminée

### Lien avec le système de jeu

Le MJ accède depuis la campagne aux données du système de jeu (cultures, vertus, récompenses, armurerie globale) pour :
- Créer les personnages en partant de la bonne culture
- Configurer l'armurerie spécifique à la campagne (quels objets sont disponibles)
- Assigner les vertus culturelles aux personnages

---

## Axes à spécifier (TODOs)

> Ces points doivent être définis avant implémentation.

- [ ] Layout de la page hub : tabs ? sidebar ? cartes de navigation ? quelle info afficher sur chaque entrée ?
- [ ] Gestion des joueurs : comment le MJ associe un joueur (prénom) à un personnage pour la campagne ?
- [ ] Tableau de bord rapide : état de la dernière session, derniers personnages modifiés, prochaine session planifiée ?
- [ ] Fellowship Pool / Points de Communauté : est-ce que ce compteur partagé est configurable/visible ici ?
- [ ] Havens : est-ce que le MJ configure les Havres de la campagne (bonus de récupération) quelque part ici ?
- [ ] Chronologie de campagne : faut-il un journal/timeline des événements majeurs de la campagne (non lié aux sessions) ?
- [ ] Modèle de données : colonnes manquantes sur `campaigns` (`wallpaper_url`, `world_map_url`, `travel_rules`, `current_season`, `current_haven`)

---

## Lien avec les surfaces

| Surface | Lien avec cette feature |
|---|---|
| Back-office `/gm/campaigns/[id]` | C'est cette page — hub central |
| Panneau session | Accessible depuis ici (bouton "Lancer / Reprendre la session") |
| TV mode Waiting | `wallpaper_url` configuré ici |
| TV mode Voyage | `world_map_url` + `travel_rules` configurés ici |
