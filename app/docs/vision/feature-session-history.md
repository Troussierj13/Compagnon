# Feature — Historique de session (`feature-session-history.md`)

> Vision globale : [`README.md`](./README.md)
> Gestion de campagne : [`feature-campaign-management.md`](./feature-campaign-management.md)

> ⚠️ **Cette spec est incomplète. Elle décrit l'intention générale. Elle doit être finalisée avant toute implémentation.**
> 📌 **Priorité : basse (Phase 4).** Ne bloque aucune autre feature.

---

## Principe général

L'historique de session est un **log des événements clés** qui se sont produits pendant une session. Il est utile pour :

- Le **compte-rendu post-session** (le MJ ou les joueurs veulent se rappeler ce qui s'est passé)
- La **continuité narrative** entre les sessions (qui a rejoint, qui est mort, quel loot a été distribué)
- Une future export en résumé de session (note de session, post de campagne)

L'app n'automatise pas le jeu — les jets de dés sont physiques. Les événements loggés sont donc soit **automatiques** (déclenchés par des actions dans l'app), soit **saisis manuellement** par le MJ.

---

## Ce qu'on veut couvrir

### Événements automatiques

Ces événements sont loggés automatiquement par l'app quand une action correspondante est effectuée :

| Événement | Déclencheur |
|---|---|
| Début de session | Lancement de session |
| Fin de session | Clôture de session |
| Personnage rejoint | Joueur se connecte et sélectionne son perso |
| Entité spawnée | Spawn manuel ou via NFC |
| Entité retirée / vaincue | MJ retire une entité de la scène |
| Combat démarré | Activation du fil d'initiative |
| Combat terminé | Désactivation du fil d'initiative |
| Loot distribué | Attribution d'un objet à un personnage |
| Scène changée | MJ active une nouvelle scène |
| Déplacement du groupe | Marqueur de voyage déplacé (mode Voyage) |

### Notes manuelles MJ

- Le MJ peut ajouter une **note libre** à tout moment pendant la session
- La note est horodatée et apparaît dans le flux

### Affichage

- Le log est accessible depuis la page de la session (back-office) une fois la session terminée
- Affichage chronologique, du plus récent au plus ancien
- Filtrable par type d'événement
- Exportable en texte Markdown (résumé de session)

---

## Axes à spécifier (TODOs)

> Ces points doivent être définis avant implémentation.

- [ ] Modèle de données : table `session_events` (type, payload JSON, timestamp, session_id, créé par)
- [ ] Quels événements loguer vs. ce qui surchargerait le log (ex : chaque déplacement de token ?)
- [ ] Interface d'affichage : dans le back-office campagne ? Onglet dédié sur la page session ?
- [ ] Export Markdown : format du résumé généré, quelles infos inclure
- [ ] Accès joueur : est-ce que les joueurs voient un résumé de session sur leur téléphone après ?
- [ ] Lien avec les notes MJ : fusion avec un système de notes de campagne plus large ?
