# Règles de Voyage — The One Ring 2e

## Présentation

Les voyages entre les lieux sont une part centrale du jeu. Ils génèrent de la **Fatigue** et des **événements** via des jets de Hasard. La Fatigue accumulée peut mener à l'état **Épuisé** (voir `conditions.md`).

---

## Rôles de voyage

Avant de partir, les membres de la Compagnie se répartissent des **rôles** :

| Rôle | Compétence associée | Responsabilité |
|---|---|---|
| **Guide** (Guide) | Voyage (`travel`) | Définit le chemin, choisit l'itinéraire. Fait le jet de Voyage. |
| **Éclaireur** (Scout) | Chasse (`hunting`) ou Scrutation (`scan`) | Détecte les dangers à l'avance. |
| **Gardien** (Lookout) | Vigilance (`awareness`) | Monte la garde la nuit — réduit les rencontres nocturnes. |
| **Pourvoyeur** (Hunter) | Chasse (`hunting`) | Assure la nourriture — peut réduire la Fatigue du groupe. |

> Il peut y avoir plusieurs Éclaireurs mais un seul Guide et un seul Gardien efficace.

---

## Déroulement d'un voyage

1. Le Guide fait un jet de **Voyage** (TN variable selon la région et la saison).
2. Des **jets de Hasard** déterminent les événements en chemin (rencontres, obstacles, découvertes).
3. À l'arrivée, la Fatigue accumulée est comptabilisée.

---

## Fatigue de voyage

La Fatigue est générée lors du voyage via :
- Échecs ou demi-succès aux jets de Hazard.
- Conditions difficiles (météo, terrain, nuit sans repos).
- Certains événements de voyage.

### Effet de la Fatigue

```
Épuisé si : current_endurance < poids_équipement + fatigue
```

La Fatigue s'**additionne** au poids de l'équipement pour le calcul de l'état Épuisé.

> **Note app** : `fatigue` est un champ distinct dans `TORCharacterData`. Il est géré manuellement par le MJ en session — l'app affiche l'état Épuisé calculé automatiquement.

### Récupération de la Fatigue

- **Repos court** (quelques heures) : réduit partiellement la Fatigue.
- **Repos long** (nuit complète) : remet la Fatigue à 0.
- La Fatigue est réinitialisée en **Phase de Communauté**.

---

## Jets de Hasard (Hazard Rolls)

Pendant un voyage, le MJ peut demander des jets selon le niveau de risque de la région :

| Niveau de risque | Conséquence en cas d'échec |
|---|---|
| **Standard** | Fatigue ou complication narrative |
| **Risqué** | Fatigue + événement négatif (Woe) |
| **Insensé** | Rencontre hostile ou désastre |

---

## Compétences de voyage et leurs usages

| Compétence | Clé | Usage en voyage |
|---|---|---|
| Voyage (travel) | `travel` | Jet principal du Guide — définit la réussite globale du trajet |
| Vigilance (awareness) | `awareness` | Gardien — détecte les embuscades nocturnes |
| Chasse (hunting) | `hunting` | Éclaireur et Pourvoyeur — repère le danger et la nourriture |
| Exploration (explore) | `explore` | Trouver des passages, raccourcis, lieux secrets |
| Guérison (healing) | `healing` | Soigner les blessures et récupérer de l'Endurance en route |

---

## Saisons et difficulté

La saison affecte le TN du jet de Voyage et les types d'événements rencontrés :

| Saison | Effet |
|---|---|
| Printemps | TN standard, peu de risques |
| Été | TN standard, voyages plus faciles |
| Automne | TN légèrement augmenté, jours plus courts |
| Hiver | TN élevé, risques de Fatigue supplémentaires, nuits dangereuses |

---

## Lien avec la mécanique app

| Champ | Impact voyage |
|---|---|
| `fatigue` | Accumulée pendant les voyages, contribue au calcul Épuisé |
| `current_endurance` | Peut être réduite par des événements de voyage (attaques, accidents) |
| `shadows` | Certaines régions corrompues génèrent des points d'Ombre |
| `states.exhaust` | Calculé auto : `current_endurance < poids_total + fatigue` |
