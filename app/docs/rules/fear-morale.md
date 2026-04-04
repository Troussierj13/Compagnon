# Peur & Corruption — The One Ring 2e

## Peur (Fear)

### Principe

Certaines créatures terrifiantes (Dragons, Nazgûl, Balrogs, Trolls des cavernes…) imposent un **jet de Peur** au héros qui les rencontre pour la première fois, ou dans des circonstances particulièrement effrayantes.

### Seuil de Peur (Fear Rating)

Chaque créature terrifiante a un **Seuil de Peur** (valeur fixe, ex : Troll = 12, Dragon = 16).

```
TN du jet de Peur = Seuil de Peur de la créature − Rang de Vaillance du héros
```

> Plus la Vaillance est haute, plus le héros résiste naturellement à la terreur.

### Résolution du jet de Peur

Le héros effectue un **jet de Cœur** (Dé du Destin + Dés de Succès du Cœur) :

| Résultat | Effet |
|---|---|
| ≥ TN | Succès — le héros surmonte sa peur, peut agir normalement |
| < TN | Échec — le héros est **Effrayé** (voir ci-dessous) |
| Rune de Gandalf (☆) | Succès exceptionnel — le héros est galvanisé, bonus narratif |
| Œil de Sauron (👁) | Échec automatique quelle que soit la somme (si Mélancolique) |

### État Effrayé

En cas d'échec au jet de Peur, le héros est **Effrayé** :
- Il doit **fuir** la source de peur s'il le peut.
- S'il ne peut pas fuir, il subit un **malus** (−1 dé de Succès ou équivalent) à toutes ses actions tant que la créature est visible.
- L'état Effrayé se lève quand la créature disparaît de la vue ou à la fin de la scène.

> **Vaillance** réduit mécaniquement le TN du jet de Peur — c'est l'un des bénéfices clés de monter Vaillance au-delà du rang 1.

### Seuils de Peur des créatures courantes

| Créature | Seuil de Peur |
|---|---|
| Orque ordinaire | — (pas de jet requis) |
| Warg | 8 |
| Troll des cavernes | 12 |
| Araignée géante | 10 |
| Mort-Vivant | 12 |
| Dragon (sans feu) | 14 |
| Dragon (cracheur de feu) | 16 |
| Nazgûl (Serviteur de l'Anneau) | 18 |

> Ces valeurs sont indicatives. Le MJ ajuste selon la mise en scène et les circonstances.

---

## Corruption & Ombre

### Distinction Ombre vs Corruption

| Concept | Description | Effet |
|---|---|---|
| **Ombre** (`shadows`) | Accumulation de tristesse, doute, exposition au Mal | Déclenche l'état Mélancolique si > Espoir courant |
| **Corruption** | Actes moralement mauvais délibérés | Augmente l'Ombre de façon significative et permanente |

L'Ombre est la **jauge** ; la Corruption est une **cause grave** d'augmentation de cette jauge.

### Causes d'accumulation de l'Ombre

#### Légères (+1 Ombre)
- Assister à la mort d'un allié.
- Traverser des lieux imprégnés de l'Ombre (Forêt de Mirkwood, Montagnes Ombragées…).
- Échec critique sur un jet d'Ombre.

#### Modérées (+2 à +3 Ombre)
- Tuer un adversaire non-malveillant (humain, animal).
- Utiliser un objet corrompu.
- Trahir la confiance d'un allié.

#### Graves — Corruption (+4 à +5 Ombre ou plus)
- Utiliser la magie de l'Ombre ou un Anneau de Pouvoir.
- Commettre un acte de trahison majeure.
- Abandonner un allié en danger pour sauver sa propre vie.
- Succomber à la Cupidité sur un trésor maudit (Dragons, Nains…).

### Jet de Résistance à l'Ombre

Quand un personnage est confronté à une tentation ou un acte moralement difficile, le MJ peut demander un **jet de Résistance à l'Ombre** :

```
TN = 14 (standard) ou ajusté selon la gravité
Jet : Dé du Destin + Dés de Succès de Sagesse (rang Sagesse utilisé)
```

- **Succès** : le personnage résiste — pas d'Ombre (ou réduction de la pénalité).
- **Échec** : le personnage accumule de l'Ombre selon la gravité de la situation.
- **Rune de Gandalf** : résistance héroïque, peut même réduire l'Ombre existante.
- **Œil de Sauron** (si Mélancolique) : échec automatique, risque de Bout de Folie.

> **Sagesse** réduit le risque de corruption — c'est l'un des bénéfices clés de monter Sagesse.

### Réduction de l'Ombre

L'Ombre diminue en Phase de Communauté (voir `fellowship-phase.md`) :

| Activité | Réduction |
|---|---|
| Repos dans un lieu sûr | Jusqu'à Sagesse en points d'Ombre |
| Communauté et célébration (Yule) | Réinitialisation totale possible |
| Soutien d'un Patronage / lieu sanctifié | Bonus supplémentaire |

> **Exception Elfe de Lindon** (La Longue Défaite) : max **1 point d'Ombre** récupéré par Phase de Communauté (hormis Yule).

### Chemin de l'Ombre (Shadow Path)

Chaque personnage a un **Chemin de l'Ombre** lié à sa Vocation — la forme que prend sa corruption si elle progresse :

| Vocation | Chemin de l'Ombre (tentation principale) |
|---|---|
| Capitaine | Orgueil / Tyrannie |
| Champion | Violence / Bestialité |
| Chasseur de trésors | Cupidité / Avarice |
| Messager | Lâcheté / Trahison |
| Protecteur | Désespoir / Nihilisme |
| Érudit | Domination / Obsession |

Quand un **Bout de Folie** survient, le Défaut gagné est lié à ce Chemin de l'Ombre.

---

## Récapitulatif mécanique

| Mécanique | Attribut lié | Résistance |
|---|---|---|
| Jet de Peur | Cœur | Vaillance (réduit le TN) |
| Jet d'Ombre / Corruption | Esprit (Sagesse) | Sagesse (augmente les dés) |
| État Mélancolique | Espoir vs Ombre | Phase de Communauté |
| Bout de Folie | Espoir max | Soins narratifs spéciaux |

> **Note app** : `shadows` est un champ numérique sur le personnage. Les jets de Peur et d'Ombre ne sont pas automatisés — le MJ les demande selon le contexte. Les états Effrayé et Bout de Folie sont gérés manuellement.
