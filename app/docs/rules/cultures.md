# Cultures — The One Ring 2e

## Les 6 cultures disponibles

| Clé app | Nom FR | Nom EN |
|---|---|---|
| `bardide` | Bardide | Bardings (peuple de Dale) |
| `lindonElf` | Elfe de Lindon | Elves of Lindon |
| `hobbit` | Hobbit de la Comté | Hobbits of the Shire |
| `breeHuman` | Homme de Bree | Men of Bree |
| `durinDwarf` | Nain du peuple de Durin | Dwarves of Durin's Folk |
| `northRanger` | Rôdeur du Nord | Rangers of the North |

---

## Lecture des données de culture

Chaque culture définit :
- **Échantillons d'attributs** : 6 combinaisons Corps/Cœur/Esprit au choix (somme ≤ 14 max).
- **Bonus dérivés** : formule `attribut + bonus` pour Endurance, Espoir, Parade.
- **Compétences communes de départ** : tableau de 18 valeurs (index = ordre compétences, voir `skills.md`).
- **Compétences favorisées de départ** : 2 index de compétences communes.
- **Compétences de combat** : rang par défaut + liste des armes possibles.
- **Particularités** : 2 à choisir parmi une liste culturelle.
- **Avantages culturels** : 1 à 2 bonus spéciaux propres à la culture.
- **Niveau de vie de départ** : détermine le Trésor initial.

---

## Avantages culturels

Chaque culture a des avantages mécaniques propres. Ils sont affichés sur la fiche personnage.

| Clé | Nom FR | Culture | Effet mécanique |
|---|---|---|---|
| `intrepid` | Intrépide | Bardide | Tests de Vaillance favorisés (2 Dés du Destin, garder le meilleur) |
| `elvenPrecision` | Précision elfique | Elfe de Lindon | Tant que non Mélancolique : dépenser 1 Espoir → **Réussite automatique** sur un jet de Compétence **non-combat** (une fois par session) |
| `longDefeat` | La Longue Défaite | Elfe de Lindon | En Phase de Communauté : ne peut récupérer que **1 point d'Ombre** maximum |
| `goodSense` | Bon sens Hobbit | Hobbit | Tests de Sagesse favorisés + 1d bonus sur les tests d'Ombre vs Cupidité |
| `semiMan` | Semi-Hommes | Hobbit | Restrictions d'équipement (voir ci-dessous) |
| `fromBree` | Originaire de Bree | Homme de Bree | Chaque Homme de Bree dans la Compagnie augmente les Fellowship Points de 1 |
| `tireless` | Infatigable | Nain de Durin | Poids armure + casque ÷2 (arrondi supérieur). Bouclier non concerné. |
| `naugrim` | Naugrim | Nain de Durin | Ne peut pas utiliser : grand arc, grande lance, grand bouclier |
| `kingOfMen` | Rois des Hommes | Rôdeur du Nord | +1 à un Attribut de son choix (à la création) |
| `dunedainAllegiance` | Allégeance des Dúnedain | Rôdeur du Nord | Phase de Communauté (hormis Yule) : récupération Espoir max = ⌈Cœur ÷ 2⌉ |

### Restrictions Semi-Hommes (Hobbit)
Armes autorisées uniquement : arc, dague, épée courte, gourdin, hache, lance, lance courte, massue.
Bouclier interdit : grand bouclier.

---

## Bardide (Bardings)

**Peuple de Dale** — guerriers et marchands du Lac.

### Attributs de départ (choisir une ligne)

| Corps | Cœur | Esprit |
|---|---|---|
| 5 | 7 | 2 |
| 4 | 7 | 3 |
| 5 | 6 | 3 |
| 4 | 6 | 4 |
| 5 | 5 | 4 |
| 6 | 6 | 2 |

### Stats dérivées (bonus culture)

| Stat | Formule |
|---|---|
| Endurance max | Corps + **20** |
| Espoir max | Cœur + **8** |
| Parade | Esprit + **12** |

### Compétences communes (rangs de départ)

Ordre des index : awe, athletics, awareness, hunting, song, craft, enhearten, travel, insight, healing, courtesy, battle, persuade, stealth, explore, scan, riddle, lore

| Compétence | Rang |
|---|---|
| Impressionner (awe) | 1 |
| Athlétisme (athletics) | 1 |
| Vigilance (awareness) | 0 |
| Chasse (hunting) | 2 |
| Chant (song) | 1 |
| Artisanat (craft) | 1 |
| Encourager (enhearten) | 2 |
| Voyage (travel) | 1 |
| Perspicacité (insight) | 2 |
| Guérison (healing) | 0 |
| Courtoisie (courtesy) | 2 |
| Combat (battle) | 2 |
| **Persuasion (persuade)** | **3** |
| Discrétion (stealth) | 0 |
| Exploration (explore) | 1 |
| Scrutation (scan) | 1 |
| Énigme (riddle) | 0 |
| Savoir (lore) | 1 |

**Favorisées** : Athlétisme (index 1), Encourager (index 6)

**Compétences de combat** : Arcs ou Épées rang 2 — autres rang 1

**Niveau de vie** : Prospère (`prosperous`, 90 Trésors)

**Avantages culturels** : Intrépide

**Particularités** (choisir 2) : Beau, Courageux, Entêté, Fier, Généreux, Grand, Impétueux, Passionné

---

## Nain du peuple de Durin (Dwarves of Durin's Folk)

### Attributs de départ

| Corps | Cœur | Esprit |
|---|---|---|
| 7 | 2 | 5 |
| 7 | 3 | 4 |
| 6 | 3 | 5 |
| 6 | 4 | 4 |
| 5 | 4 | 5 |
| 6 | 2 | 6 |

### Stats dérivées

| Stat | Formule |
|---|---|
| Endurance max | Corps + **22** |
| Espoir max | Cœur + **8** |
| Parade | Esprit + **10** |

### Compétences communes (rangs de départ)

| Compétence | Rang |
|---|---|
| Impressionner (awe) | 2 |
| Athlétisme (athletics) | 1 |
| Vigilance (awareness) | 0 |
| Chasse (hunting) | 0 |
| Chant (song) | 1 |
| Artisanat (craft) | 2 |
| Encourager (enhearten) | 0 |
| **Voyage (travel)** | **3** |
| Perspicacité (insight) | 0 |
| Guérison (healing) | 0 |
| Courtoisie (courtesy) | 1 |
| Combat (battle) | 1 |
| Persuasion (persuade) | 0 |
| Discrétion (stealth) | 0 |
| **Exploration (explore)** | **3** |
| Scrutation (scan) | 2 |
| Énigme (riddle) | 2 |
| Savoir (lore) | 1 |

**Favorisées** : Artisanat (index 5), Voyage (index 7)

**Compétences de combat** : Haches ou Épées rang 2 — autres rang 1

**Niveau de vie** : Prospère (`prosperous`, 90 Trésors)

**Avantages culturels** : Infatigable (poids armure+casque ÷2, arrondi sup), Naugrim (restrictions armes lourdes)

**Particularités** (choisir 2) : Circonspect, Entêté, Fier, Impétueux, Majestueux, Malin, Secret, Sévère

---

## Rôdeur du Nord (Rangers of the North)

### Attributs de départ

| Corps | Cœur | Esprit |
|---|---|---|
| 7 | 5 | 2 |
| 7 | 4 | 3 |
| 6 | 5 | 3 |
| 6 | 4 | 4 |
| 5 | 5 | 4 |
| 6 | 6 | 2 |

### Stats dérivées

| Stat | Formule |
|---|---|
| Endurance max | Corps + **20** |
| Espoir max | Cœur + **6** |
| Parade | Esprit + **14** |

### Compétences communes (rangs de départ)

| Compétence | Rang |
|---|---|
| Impressionner (awe) | 1 |
| Athlétisme (athletics) | 2 |
| Vigilance (awareness) | 2 |
| **Chasse (hunting)** | **2** |
| Chant (song) | 0 |
| Artisanat (craft) | 0 |
| Encourager (enhearten) | 0 |
| Voyage (travel) | 2 |
| Perspicacité (insight) | 0 |
| Guérison (healing) | 2 |
| Courtoisie (courtesy) | 0 |
| Combat (battle) | 2 |
| Persuasion (persuade) | 0 |
| Discrétion (stealth) | 2 |
| Exploration (explore) | 1 |
| Scrutation (scan) | 2 |
| Énigme (riddle) | 0 |
| **Savoir (lore)** | **2** |

**Favorisées** : Chasse (index 3), Savoir (index 17)

**Compétences de combat** : Lances ou Épées rang 2 — autres rang 1

**Niveau de vie** : Modeste (`modest`, 0 Trésors)

**Avantages culturels** : Rois des Hommes (+1 Attribut au choix), Allégeance des Dúnedain (récup Espoir Phase de Communauté = ⌈Cœur÷2⌉, hormis Yule)

**Particularités** (choisir 2) : Courageux, Grand, Honorable, Rapide, Secret, Sévère, Sincère, Subtil

---

## Elfe de Lindon (Elves of Lindon)

### Attributs de départ

| Corps | Cœur | Esprit |
|---|---|---|
| 5 | 2 | 7 |
| 4 | 3 | 7 |
| 5 | 3 | 6 |
| 4 | 4 | 6 |
| 5 | 4 | 5 |
| 6 | 2 | 6 |

### Stats dérivées

| Stat | Formule |
|---|---|
| Endurance max | Corps + **20** |
| Espoir max | Cœur + **8** |
| Parade | Esprit + **12** |

### Compétences communes (rangs de départ)

| Compétence | Rang |
|---|---|
| Impressionner (awe) | 2 |
| Athlétisme (athletics) | 2 |
| Vigilance (awareness) | 2 |
| Chasse (hunting) | 0 |
| **Chant (song)** | **2** |
| Artisanat (craft) | 2 |
| Encourager (enhearten) | 1 |
| Voyage (travel) | 0 |
| Perspicacité (insight) | 0 |
| Guérison (healing) | 1 |
| Courtoisie (courtesy) | 0 |
| Combat (battle) | 0 |
| Persuasion (persuade) | 0 |
| **Discrétion (stealth)** | **3** |
| Exploration (explore) | 0 |
| Scrutation (scan) | 0 |
| Énigme (riddle) | 0 |
| **Savoir (lore)** | **3** |

**Favorisées** : Chant (index 4), Savoir (index 17)

**Compétences de combat** : Arcs ou Lances rang 2 — autres rang 1

**Niveau de vie** : Modeste (`modest`, 0 Trésors)

**Avantages culturels** : Précision elfique, La Longue Défaite

**Particularités** (choisir 2) : Beau, Circonspect, Jovial, Majestueux, Patient, Rapide, Subtil, Vue perçante

---

## Hobbit de la Comté (Hobbits of the Shire)

### Attributs de départ

| Corps | Cœur | Esprit |
|---|---|---|
| 3 | 6 | 5 |
| 3 | 7 | 4 |
| 2 | 7 | 5 |
| 4 | 6 | 4 |
| 4 | 5 | 5 |
| 2 | 6 | 6 |

### Stats dérivées

| Stat | Formule |
|---|---|
| Endurance max | Corps + **18** |
| Espoir max | Cœur + **10** |
| Parade | Esprit + **12** |

### Compétences communes (rangs de départ)

| Compétence | Rang |
|---|---|
| Impressionner (awe) | 0 |
| Athlétisme (athletics) | 0 |
| Vigilance (awareness) | 2 |
| Chasse (hunting) | 0 |
| Chant (song) | 2 |
| Artisanat (craft) | 1 |
| Encourager (enhearten) | 0 |
| Voyage (travel) | 0 |
| Perspicacité (insight) | 2 |
| Guérison (healing) | 1 |
| **Courtoisie (courtesy)** | **2** |
| Combat (battle) | 0 |
| Persuasion (persuade) | 2 |
| **Discrétion (stealth)** | **3** |
| Exploration (explore) | 0 |
| Scrutation (scan) | 0 |
| Énigme (riddle) | 3 |
| Savoir (lore) | 0 |

**Favorisées** : Courtoisie (index 10), Discrétion (index 13)

**Compétences de combat** : Arcs ou Épées (taille réduite) rang 2 — autres rang 1

**Niveau de vie** : Courant (`adequate`, 30 Trésors)

**Avantages culturels** : Bon sens Hobbit (tests de Sagesse favorisés), Semi-Hommes (restrictions d'équipement)

**Particularités** (choisir 2) : Affable, Curieux, Honorable, Jovial, Loyal, Passionné, Rustre, Vue perçante

---

## Homme de Bree (Men of Bree)

### Attributs de départ

| Corps | Cœur | Esprit |
|---|---|---|
| 2 | 5 | 7 |
| 3 | 4 | 7 |
| 3 | 5 | 6 |
| 4 | 4 | 6 |
| 4 | 5 | 5 |
| 2 | 6 | 6 |

### Stats dérivées

| Stat | Formule |
|---|---|
| Endurance max | Corps + **20** |
| Espoir max | Cœur + **10** |
| Parade | Esprit + **10** |

### Compétences communes (rangs de départ)

| Compétence | Rang |
|---|---|
| Impressionner (awe) | 0 |
| Athlétisme (athletics) | 1 |
| Vigilance (awareness) | 1 |
| Chasse (hunting) | 1 |
| Chant (song) | 1 |
| Artisanat (craft) | 2 |
| Encourager (enhearten) | 2 |
| Voyage (travel) | 1 |
| **Perspicacité (insight)** | **2** |
| Guérison (healing) | 0 |
| **Courtoisie (courtesy)** | **3** |
| Combat (battle) | 0 |
| Persuasion (persuade) | 2 |
| Discrétion (stealth) | 1 |
| Exploration (explore) | 1 |
| Scrutation (scan) | 1 |
| Énigme (riddle) | 2 |
| Savoir (lore) | 0 |

**Favorisées** : Perspicacité (index 8), Énigme (index 16)

**Compétences de combat** : Haches ou Lances rang 2 — autres rang 1

**Niveau de vie** : Courant (`adequate`, 30 Trésors)

**Avantages culturels** : Originaire de Bree (+1 Fellowship Point par Homme de Bree dans la Compagnie)

**Particularités** (choisir 2) : Affable, Curieux, Généreux, Loyal, Malin, Patient, Rustre, Sincère

---

## Niveau de vie — Trésor de départ

| Niveau de vie | Clé app (`QualityOfLife`) | Trésors |
|---|---|---|
| Misérable | `miserable` | 0 |
| Pauvre | `poor` | 0 |
| Modeste | `modest` | 0 |
| Courant | `adequate` | 30 |
| Prospère | `prosperous` | 90 |
| Riche | `rich` | 180 |

> Le niveau de vie est calculé depuis la valeur de Trésor courante.
> Les clés suivent le type `QualityOfLife` de `feature-characters.md`.
