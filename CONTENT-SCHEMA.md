# CONTENT-SCHEMA — frenchwithfelix.com

Définit la structure de chaque type de contenu du site.
Les fichiers Markdown vivent dans `src/content/`, les JSON dans `src/data/`.

---

## 1. Article de blog

**Emplacement :** `src/content/blog/[slug].md`

### Frontmatter (métadonnées en tête de fichier)

```yaml
---
title: "Le subjonctif en français : guide complet pour les niveaux B1-B2"
description: "Tout ce que vous devez savoir sur le subjonctif français : quand l'utiliser, comment le former, et les erreurs à éviter."
publishDate: 2025-09-15
updatedDate: 2025-10-01         # optionnel — date de mise à jour
slug: french-subjunctive-guide  # URL finale : /blog/french-subjunctive-guide
level: ["B1", "B2"]             # optionnel — niveaux ciblés par l'article
category: grammaire             # grammaire | vocabulaire | culture | methodes | phonetique
tags: ["subjonctif", "verbes", "conjugaison"]
lang: en                        # langue de l'article : en | fr
featuredImage: /images/blog/subjonctif.jpg
featuredImageAlt: "Tableau de conjugaison du subjonctif en français"
readingTime: 8                  # en minutes (calculé automatiquement ou manuel)
featured: false                 # true = mis en avant sur la homepage
draft: false                    # true = non publié
---
```

### Corps de l'article

```markdown
## Introduction
...

## Section 1
...

## Conclusion

[CTA automatique inséré par le layout en fin d'article]
```

### Catégories disponibles

| Slug | Label affiché |
|---|---|
| `grammaire` | Grammar |
| `vocabulaire` | Vocabulary |
| `culture` | French Culture |
| `methodes` | Learning Tips |
| `phonetique` | Pronunciation |

---

## 2. Épisode de podcast

**Emplacement :** `src/content/podcast/[slug].md`

### Frontmatter

```yaml
---
title: "La météo en France : vocabulaire et expressions idiomatiques"
description: "Dans cet épisode, on parle de la météo française, des expressions courantes et de la façon dont les Français parlent du temps."
publishDate: 2025-09-10
slug: meteo-france-vocabulaire
episodeNumber: 47
season: 2                       # optionnel
level: A2                       # A1 | A2 | B1 | B2
duration: "18:32"               # durée au format mm:ss
spotifyUrl: "https://open.spotify.com/episode/XXXXXXX"
spotifyEpisodeId: "XXXXXXX"     # ID Spotify pour l'embed
theme: quotidien                # quotidien | culture | grammaire | voyage | humour | actualite
wordCount: 2400                 # nombre de mots de la transcription
speechRate: lent                # lent | normal | rapide
tags: ["météo", "vocabulaire", "expressions"]
featuredImage: /images/podcast/ep47.jpg
draft: false
---
```

### Corps — structure type

```markdown
## À propos de cet épisode

Résumé en 2-3 phrases. Idéal pour les apprenants de niveau A2 qui veulent enrichir leur vocabulaire du quotidien.

## Vocabulaire clé

| Mot / Expression | Traduction |
|---|---|
| Il fait un temps de chien | The weather is terrible |
| Pleuvoir des cordes | To rain cats and dogs |

## Transcription complète

[Transcription issue du fichier SRT, nettoyée et formatée]

...

## Pour aller plus loin

- Lien vers article de blog lié (optionnel)
- CTA → learn.frenchwithfelix.com
```

### Niveaux et vitesse — définitions

| Niveau | Définition |
|---|---|
| A1 | Débutant absolu, phrases très courtes, vocabulaire de base |
| A2 | Débutant, phrases simples, thèmes du quotidien |
| B1 | Intermédiaire, conversations courantes, quelques expressions |
| B2 | Intermédiaire avancé, sujets variés, expressions idiomatiques |

| Vitesse | Définition |
|---|---|
| `lent` | < 100 mots/minute — Félix parle volontairement lentement |
| `normal` | 100–140 mots/minute — rythme de conversation naturel |
| `rapide` | > 140 mots/minute — rythme natif authentique |

---

## 3. Fiche bibliothèque (ressource externe ou propre)

**Emplacement :** `src/data/library/[slug].json`

> Format JSON car ces fiches sont générées par un outil d'analyse externe (SRT analyser), pas écrites manuellement.

### Structure JSON

```json
{
  "slug": "innerfrench-ep102-habitudes",
  "title": "Mes habitudes du matin en France",
  "source": "externe",
  "sourceLabel": "InnerFrench",
  "youtubeId": "dQw4w9WgXcQ",
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "publishDate": "2025-08-20",
  "addedDate": "2025-09-01",

  "level": "B1",
  "theme": "quotidien",
  "speechRate": "normal",
  "speechRateWPM": 118,
  "wordCount": 1850,
  "duration": "16:45",

  "tags": ["habitudes", "quotidien", "verbes de routine"],

  "transcript": {
    "available": true,
    "partial": "Bonjour à tous. Aujourd'hui je vais vous parler de mes habitudes du matin...",
    "fullAccessLevel": "premium"
  },

  "description": "Hugo parle de sa routine matinale avec un vocabulaire accessible et un rythme modéré. Idéal pour consolider les verbes pronominaux et les expressions du quotidien.",

  "featuredImage": "/images/library/innerfrench-ep102.jpg",
  "featured": false,
  "draft": false
}
```

### Valeurs de `source`

| Valeur | Signification |
|---|---|
| `felix` | Contenu créé par French with Félix |
| `externe` | Contenu YouTube externe analysé et référencé |

### Valeurs de `theme`

```
quotidien | culture | grammaire | voyage | humour | actualite | histoire | gastronomie
```

### Valeurs de `level`

```
A1 | A2 | B1 | B2
```

### Valeurs de `speechRate`

```
lent | normal | rapide
```

### Valeurs de `transcript.fullAccessLevel`

```
public    → transcription complète visible par tous
premium   → transcription complète réservée abonnés learn.
```

---

## 4. Résumé des types de contenu

| Type | Format | Emplacement | Auteur |
|---|---|---|---|
| Article blog | Markdown | `src/content/blog/` | Félix (manuel) |
| Épisode podcast | Markdown | `src/content/podcast/` | Félix (semi-auto depuis SRT) |
| Fiche bibliothèque | JSON | `src/data/library/` | Outil d'analyse externe |

---

## 5. Workflow de production

### Article de blog
1. Écrire en Markdown (VS Code ou Obsidian)
2. Placer dans `src/content/blog/`
3. Astro génère la page automatiquement

### Épisode podcast
1. Exporter le SRT depuis CapCut
2. Nettoyer et formater la transcription (script ou Claude)
3. Remplir le frontmatter
4. Placer dans `src/content/podcast/`

### Fiche bibliothèque
1. Analyser la vidéo YouTube (SRT ou outil WPM)
2. Générer le fichier JSON avec les métadonnées
3. Placer dans `src/data/library/`
4. Astro génère la fiche automatiquement
