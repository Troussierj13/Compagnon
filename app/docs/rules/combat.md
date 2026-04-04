# Combat — The One Ring 2e

## Structure d'un combat

Un combat se déroule en **rounds**. À chaque round :
1. Les joueurs choisissent leur **posture**.
2. Les héros attaquent (ordre d'initiative).
3. Les ennemis attaquent (en même temps ou après, selon les règles du MJ).

---

## Postures (Stances)

Chaque héros choisit sa posture **au début de chaque round**. La posture modifie le nombre de Dés de Succès pour les attaques et la défense.

| Posture | Clé app | Attaque | Ennemi vs ce héros | Règle |
|---|---|---|---|---|
| **Offensif** (Forward) | `forward` | +1 dé de Succès | +1 dé de Succès ennemi | En avant, pression maximale |
| **Ouvert** (Open) | `open` | Normal | Normal | Position équilibrée par défaut |
| **Défensif** (Defensive) | `defensive` | −1 dé de Succès | −1 dé de Succès ennemi | Priorité à la protection |
| **Arrière** (Rearward) | `rearward` | Armes à distance uniquement | Hors de portée mêlée | Archers, soigneurs |

> La **valeur de Parade** ne change pas avec la posture. Ce sont les **pools de dés** qui varient.

> **Note app** : la posture doit être sélectionnable par entité pendant un combat actif.

---

## Ordre d'initiative

- Déterminé en début de combat.
- **Drag & drop** dans l'interface (voir `feature-initiative.md`).
- Les héros jouent généralement avant les ennemis, sauf règle spéciale.

---

## Jet d'attaque (Héros → Ennemi)

```
TN = SR Corps de l'attaquant ± modificateur de Parade de la cible
```

- Lancer : Dé du Destin + rang de la compétence de combat utilisée (Dés de Succès).
- Si total ≥ TN → **touché**, infliger des dégâts.
- Chaque **6** (Tengwar) sur un Dé de Succès = Succès remarquable (voir ci-dessous).

---

## Jet d'attaque (Ennemi → Héros)

```
TN = valeur de Parade du héros ciblé
```

- L'ennemi lance son pool de dés basé sur sa Compétence de combat.
- Si l'attaque passe la Parade → le héros perd de l'Endurance (dégâts − protection).

---

## Dégâts

```
Dégâts infligés = valeur de dégâts de l'arme + modificateurs
```

- Si le héros porte une armure/casque → **jet de protection** (Nd6) pour réduire ou annuler les dégâts.
- Les dégâts non réduits → soustraits à l'**Endurance courante**.

---

## Succès remarquables (6 sur les Dés de Succès — Tengwar)

Chaque 6 obtenu peut être dépensé pour une action spéciale :

| Action | Effet | Coût |
|---|---|---|
| **Coup puissant** (Heavy Blow) | +Corps en dégâts supplémentaires | 1 Tengwar |
| **Percer** (Pierce) | +2 au résultat du Dé du Destin (aide à déclencher un Coup Perforant) | 1 Tengwar |
| **Parer** (Fend Off) | −1 dé de Succès à la prochaine attaque ennemie | 1 Tengwar |
| **Coup d'écu** (Shield Thrust) | Repousser l'ennemi, avantage tactique | 1 Tengwar + bouclier équipé |

---

## Coup Perforant (Piercing Blow) → Blessure

Le Coup Perforant est **déclenché automatiquement** quand le **Dé du Destin montre 10 ou la Rune de Gandalf (☆)**.

Les Tengwar peuvent être dépensés pour **Pierce** (+2 au résultat du Dé du Destin), ce qui permet de transformer un 8 ou 9 en 10+ et ainsi déclencher un Coup Perforant.

### Résolution du Coup Perforant

Une fois un Coup Perforant déclenché, la **cible fait un jet de protection** :
- Lancer : `(protection armure + protection casque) d6`
- Si le résultat ≥ valeur d'injury de l'arme → blessure évitée
- Si le résultat < valeur d'injury → la cible est **Blessée**

> La valeur `injury_one_hand` / `injury_two_hand` représente la **difficulté du jet de protection** (TN du défenseur). Une valeur plus haute = plus difficile à résister = arme plus dangereuse.

**La Rune de Gandalf (☆)** déclenche toujours un Coup Perforant (compte comme 12).

**Effets d'une Blessure :**
- Le personnage est marqué **Blessé** (`hurt = true`).
- Durée de la blessure enregistrée : `injury.value + injury.unit` (heures ou jours).
- Pénalités aux jets selon la gravité.

---

## Jet de protection (Armure)

Quand un héros subit des dégâts normaux (hors Coup Perforant) :

```
Lancer : (protection_armure + protection_casque) dés de Succès
Si résultat total ≥ dégâts subis → dégâts annulés
Sinon → (dégâts − résultat) soustrait à l'Endurance
```

---

## Statistiques des Ennemis

| Stat | Description | Usage app |
|---|---|---|
| **Niveau d'attribut** | Dangerosité globale de l'ennemi | Affiché sur la fiche ennemi |
| **Puissance** (Power) | Nombre d'attaques par round | Combien de fois l'ennemi attaque par round |
| **Compétence de combat** | Pool de dés pour les jets d'attaque | TN contre la Parade des héros |
| **Haine / Détermination** | Type : `hatred` ou `determination` | Ressource spéciale de l'ennemi |
| **Valeur Haine** | Points de Haine/Détermination | Dépensable pour effets spéciaux |
| **Capacités redoutables** | Pouvoirs spéciaux | Listés sur la fiche (champ texte) |
| **Seuil de blessure** | Valeur d'injury pour les Coups Perforants | Utilisé lors des jets de protection |

### Haine vs Détermination

- **Haine** : créatures maléfiques (Orques, Trolls…) — dépensent des points pour des effets offensifs.
- **Détermination** : créatures nobles ou puissantes — dépensent pour résister ou amplifier leur puissance.

---

## Fin de combat

- Combat terminé quand tous les ennemis sont vaincus (Endurance à 0) ou fuient.
- Les héros marqués **Inconscients** (Endurance = 0) reprennent connaissance avec 1 point d'Endurance après 1 heure.
- Les **Blessures** persistent jusqu'à soins.
