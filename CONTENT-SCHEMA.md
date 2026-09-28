# CONTENT-SCHEMA — liminalfrench.com

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
level: ["B1"]                   # UN seul niveau (A1 | A2 | B1 | B2) : l'apprenant à qui l'article sert le plus
category: grammaire             # grammaire | vocabulaire | culture | methodes | phonetique
tags: ["subjonctif", "verbes", "conjugaison"]
lang: en                        # langue de l'article : en | fr
featuredImage: /images/blog/subjonctif.jpg
featuredImageAlt: "Tableau de conjugaison du subjonctif en français"
readingTime: 8                  # en minutes (calculé automatiquement ou manuel)
featured: false                 # true = mis en avant sur la homepage
draft: false                    # true = non publié
updatedDate: 2025-10-01         # optionnel — dernière mise à jour importante (JSON-LD dateModified)
relatedEpisode: le-running      # optionnel — slug de l'épisode dont l'article est tiré (bloc « Listen to the episode »)
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

Un épisode est défini par **trois fichiers**, tous identifiés par son `slug` :

| Source | Emplacement | Contenu |
|---|---|---|
| CSV (source principale) | `src/data/liminal_podcast.csv`, exporté du Google Sheet | numéro, slug, titre (YouTube), niveau, thème, vitesse, wpm, nb de mots, durée, `youtube_id`, `publishDate` |
| Transcription | `src/content/podcast/<slug>.srt` | sous-titres horodatés, découpés en paragraphes au build |
| Extras (optionnel) | `src/content/podcast/<slug>.md` | uniquement les champs ajoutés ci-dessous |

Le lien Spotify de l'épisode est récupéré au build via l'API Spotify (numéro `#NN` dans le titre Spotify).

### Fichier d'extras `<slug>.md`

Frontmatter uniquement, pas de corps. Tous les champs sont optionnels.

```yaml
---
summary_en: >
  Two or three sentences in English about the episode: what Félix talks about and
  who it is for. Shown as "About this episode" at the top of the page.
key_vocab:                      # ~10 mots ou expressions tirés de l'épisode
  - fr: "passer un cap"
    en: "to reach a milestone"
  - fr: "lire en diagonale"
    en: "to skim"
---
```

- **Indexation** : un épisode est indexable (balise robots + sitemap) **seulement si `summary_en` est rempli**. Sinon sa page reste en `noindex, follow` et hors sitemap.
- Le build échoue si un fichier `<slug>.md` ne correspond à aucun slug du CSV, si `summary_en` est présent mais vide, ou si un mot de `key_vocab` n'a pas de traduction.
- `npm run podcast:missing` liste les épisodes publiés pas encore enrichis.
- `seoTitle` (optionnel) : remplace tel quel la balise `<title>` de la page. Par défaut, le titre est
  `<titre YouTube nettoyé> — French Podcast Ep. NN (NIVEAU)` (le `#NN` de l'épisode et les mentions
  génériques comme « slow french comprehensible input » sont retirés). Le H1 reste le titre YouTube.
  `npm run podcast:titles -- --long` liste les titres de plus de 60 caractères, candidats à un `seoTitle`.
- Meta description : `summary_en` s'il est rempli, sinon un modèle en anglais
  (« Episode NN of the Liminal French podcast: … Level B1 · 22:16 · 153 wpm. Full French transcript. »).
- `titleLang` (optionnel, `fr` ou `en`) : langue du titre YouTube, quand la détection automatique se
  trompe (ex. `easy-french-news.md`). Sert à l'attribut `lang` du H1 et des cartes d'épisode.
- `appleEpisodeUrl` (optionnel, URL) : page de l'épisode sur Apple Podcasts. Sans lui, le bouton Apple
  mène à l'émission. Le bouton Spotify mène à l'épisode dès que l'API Spotify le trouve.
- `relatedArticle` (optionnel, slug d'article) : article affiché dans le bloc « Read the article ». Par
  défaut, c'est l'article dont le `relatedEpisode` est cet épisode ; ce champ ne sert qu'à forcer un autre choix.

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
