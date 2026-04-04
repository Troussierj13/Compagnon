# Système de dés — The One Ring 2e

## Les dés

| Dé | Notation | Faces |
|---|---|---|
| **Dé du Destin** (Feat die) | 1d12 | 1–10, Rune de Gandalf (☆), Œil de Sauron (👁) |
| **Dé de Succès** (Success die) | 1d6 | 1–5, Tengwar (✦) sur le 6 |

---

## Composition d'un jet

```
Résultat total = Dé du Destin + somme des Dés de Succès
```

- Le **nombre de dés de Succès** = rang de la compétence utilisée (0 à 6).
- La **cible par défaut** (TN, Target Number) = **14** pour la plupart des jets.
- Pour les jets d'attribut : TN = SR de l'attribut (voir `attributes-stats.md`).

---

## Résultats du Dé du Destin

| Résultat | Effet |
|---|---|
| **1–10** | Valeur numérique ajoutée au total |
| **Rune de Gandalf (☆)** | Succès automatique **ET** résultat exceptionnel possible. Compte comme 12 pour le total. |
| **Œil de Sauron (👁)** | Le jet vaut **0** sur le Dé du Destin. Si le personnage est **Mélancolique**, c'est un échec automatique quelle que soit la somme des dés de Succès. |

---

## Compétences favorisées (Favoured)

Quand une compétence est **favorisée** :
- Lancer **2 Dés du Destin** au lieu d'un.
- Garder le **meilleur résultat** des deux.
- Avantage similaire au système "Advantage" de D&D 5e.

---

## Degrés de succès

| Total obtenu | Résultat |
|---|---|
| < TN | Échec |
| ≥ TN | Succès |
| Rune de Gandalf (☆) | Succès automatique + Succès extraordinaire potentiel |

### Dés de Succès — le 6 (Tengwar ✦)

Chaque **6** obtenu sur un dé de Succès est un **succès remarquable** qui peut être dépensé pour :

| Action | Effet |
|---|---|
| **Coup puissant** (Heavy Blow) | +Corps en dégâts supplémentaires |
| **Coup perforant** (Piercing Blow) | Si total ≥ seuil de blessure de l'arme → Blessure |
| **Parer** (Fend Off) | −1 dé de Succès à la prochaine attaque ennemie |
| **Coup d'écu** (Shield Thrust) | Repousser un ennemi, avantage tactique (requiert bouclier) |
| **Riposte** (Parry) | Annuler une attaque ennemie déclarée |

> **Note app** : les 6 sont des résultats actifs — l'UI doit permettre au joueur de choisir comment les dépenser pendant un combat.

---

## Dé de Protection (Armure)

Quand un personnage est touché et porte une armure/casque :
- Lancer **Nd6** (N = valeur de protection de l'armure + casque).
- Si le résultat ≥ dégâts de l'attaque → pas de perte d'Endurance.
- Si le résultat < dégâts → l'excédent est soustrait à l'Endurance.

---

## Jets de risque (Hazard Rolls)

Certains jets sont classifiés par niveau de risque :

| Niveau | Conséquence en cas d'échec |
|---|---|
| **Standard** | Échec simple OU succès avec complication |
| **Risqué** | Échec avec complication (Woe) |
| **Insensé** | Désastre garanti en cas d'échec |

---

## Valeur cible TN standard

- **TN 14** : difficulté normale (valeur par défaut dans le jeu).
- Le MJ peut ajuster entre **10** (facile) et **20+** (héroïque).
- Les jets d'attaque contre un ennemi : TN = SR Corps de l'attaquant, **modifié par la Parade de la cible**.
- Les jets d'attaque d'un ennemi contre un héros : TN = valeur de **Parade** du héros.
