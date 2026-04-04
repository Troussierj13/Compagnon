# Équipement — The One Ring 2e

## Armes

### Propriétés d'une arme

| Propriété | Clé app | Description |
|---|---|---|
| **Dégâts** | `damage` | Valeur fixe soustraite à l'Endurance en cas de touche |
| **Seuil de blessure 1 main** | `injury_one_hand` | TN du jet de protection du défenseur lors d'un Coup Perforant à 1 main |
| **Seuil de blessure 2 mains** | `injury_two_hand` | TN du jet de protection du défenseur lors d'un Coup Perforant à 2 mains |
| **Poids** (Load) | `load` | Charge ajoutée au total pour le calcul Épuisé |
| **Compétence** | `skill_ref` | Compétence de combat associée (swords, axes, bows, spears) |

### Comment fonctionne le seuil de blessure

Le Coup Perforant est **déclenché automatiquement** quand le **Dé du Destin de l'attaquant montre 10+ ou ☆**. Les Tengwar (6 sur un Dé de Succès) peuvent être dépensés pour l'action **Pierce** (+2 au Dé du Destin), permettant de transformer un 8 ou 9 en 10+.

Une fois déclenché :
1. Le **défenseur** lance son jet de protection : `(protection armure + protection casque) d6`.
2. Comparer le résultat au seuil de l'arme selon la prise :
   - 1 main → comparer à `injury_one_hand`.
   - 2 mains → comparer à `injury_two_hand` (généralement plus bas = plus difficile à bloquer).
3. Résultat du défenseur ≥ seuil → Blessure évitée.
4. Résultat du défenseur < seuil → **Blessure infligée**.
5. **Rune de Gandalf (☆)** sur le Dé du Destin = valeur 12 → dépasse toujours le seuil.

> Seuil bas = difficile à bloquer pour le défenseur = arme plus dangereuse. Seuil haut = plus facile à bloquer.

---

## Armure (Corselet)

| Propriété | Clé app | Description |
|---|---|---|
| **Protection** | `protection` | Nombre de Dés de Succès pour le jet de protection |
| **Poids** | `load` | Charge portée |

### Règle nain (Infatigable)
Les Nains du peuple de Durin divisent par 2 le poids de leur **armure et casque** (bouclier **non concerné**), arrondi **au supérieur**.
> Exemple : armure poids 5 → ⌈5÷2⌉ = **3**.

---

## Casque (Helm)

| Propriété | Clé app | Description |
|---|---|---|
| **Protection** | `protection` | Dés de Succès bonus ajoutés au jet de protection (s'additionne avec l'armure) |
| **Poids** | `load` | Charge portée |

> Le jet de protection total = armure + casque : `(N_armure + N_casque) d6`.

---

## Bouclier (Shield)

| Propriété | Clé app | Description |
|---|---|---|
| **Bonus Parade** | `parade_bonus` | Valeur ajoutée à la Parade du porteur |
| **Poids** | `load` | Charge portée |

> Le bouclier n'est **pas** affecté par la règle Infatigable des Nains.

### Coup d'écu (Shield Thrust)
Nécessite de porter un bouclier. Dépenser 1 Tengwar → effet tactique (repousser l'ennemi).

---

## Charge totale et Épuisé

```
Charge totale = Σ poids(armes équipées) + poids(armure) + poids(casque) + poids(bouclier) + Fatigue voyage
Épuisé si : endurance_current < charge_totale
```

> **Note app** : seul l'équipement **équipé** (pas juste possédé) compte dans la charge.

---

## Valeurs de base TOR — Armes

> Ces valeurs sont celles du livre de règles TOR 2e. Elles servent de référence pour pré-remplir l'armurerie d'une campagne. Source : legacy projet + feature-game-system.md.

### Armes de mêlée

| Nom | Compétence | Dégâts | Injury 1 main | Injury 2 mains | Poids | Notes |
|---|---|---|---|---|---|---|
| Dague | swords | 3 | 16 | — | 1 | Arme légère, portée cachée |
| Épée courte | swords | 4 | 16 | 18 | 2 | Disponible Hobbit |
| **Épée longue** | swords | **5** | **16** | **18** | **3** | Arme standard |
| Grande épée | swords | 6 | — | 16 | 4 | 2 mains uniquement |
| Hache | axes | 5 | 16 | 18 | 3 | Polyvalente |
| Grande hache | axes | 7 | — | 16 | 5 | 2 mains uniquement |
| Lance | spears | 4 | 16 | 14 | 3 | Avantage à 2 mains |
| Grande lance | spears | 5 | — | 14 | 4 | 2 mains uniquement, interdit Hobbit |
| Gourdin | axes | 3 | 16 | — | 2 | Disponible Hobbit |
| Massue | axes | 4 | 16 | 16 | 2 | Disponible Hobbit |

> **Injury 1 main / 2 mains** : valeur minimale du jet de protection ennemi pour bloquer la blessure. Une valeur basse = blessure difficile à éviter = arme plus perçante.

### Armes à distance

| Nom | Compétence | Dégâts | Injury | Poids | Notes |
|---|---|---|---|---|---|
| Arc court | bows | 3 | 14 | 2 | Disponible Hobbit |
| **Arc long** | bows | **3** | **14** | **3** | Arme standard archer |
| Grand arc | bows | 4 | 14 | 4 | Interdit Hobbit et Nain |

> Les armes à distance n'ont qu'une seule valeur d'injury (pas de distinction 1/2 mains).

---

## Valeurs de base TOR — Protections

Source confirmée : `feature-game-system.md` section 6.2 + legacy `armors.js`.

### Armures

| Nom | Protection (dés) | Poids |
|---|---|---|
| Chemise de cuir | 1d | 3 |
| Corselet à manches longues | 2d | 6 |
| Cotte de mailles courte | 3d | 9 |
| Cotte de mailles longue | 4d | 12 |

### Casques

| Nom | Protection (dés) | Poids |
|---|---|---|
| Heaume | 1d | 4 |

### Boucliers

| Nom | Bonus Parade | Poids |
|---|---|---|
| Petit bouclier (Rondache) | +1 | 2 |
| Bouclier | +2 | 4 |
| Grand bouclier | +3 | 6 |

> Grand bouclier **interdit aux Hobbits** (Semi-Hommes) et aux **Nains** (Naugrim).

### Exemple de calcul — Nain avec Cotte de mailles longue + Heaume

```
Poids armure brut : 12 → ÷2 arrondi sup → 6
Poids casque brut : 4  → ÷2 arrondi sup → 2
Poids bouclier   : non modifié (règle Infatigable ne s'applique pas)
```

---

## Rareté des objets

| Rareté | Clé app | Disponibilité |
|---|---|---|
| Commun | `common` | Trouvable partout |
| Peu commun | `uncommon` | Marchands spécialisés |
| Rare | `rare` | Quêtes ou récompenses |
| Légendaire | `legendary` | Artefacts uniques |

---

## Trésor (Treasure)

- Monnaie générique du jeu (pas de distinction pièces d'or/argent dans l'app).
- Stocké sur le personnage : champ `treasure`.
- Détermine le **Niveau de vie** actuel (voir `cultures.md`).

---

## Attirail de voyage (Travel Gear)

Objets portés lors des journeys :
- Contribuent au poids total.
- Peuvent avoir des effets sur les jets de Voyage.
- Stockés dans l'inventaire avec `type = travel`.

---

## Attirail de guerre (War Gear)

Armes, armures, boucliers, casques portés en combat.
- Stockés dans l'inventaire avec `type = weapon`, `armor`, `helm`, `shield`.
- L'état **équipé** vs **transporté** influe sur la charge.
