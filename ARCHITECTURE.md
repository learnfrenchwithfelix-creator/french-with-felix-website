# ARCHITECTURE — liminalfrench.com

## Vue d'ensemble

Site de contenu personnel pour générer du trafic organique (SEO) et convertir vers la plateforme de cours payants hébergée sur Kajabi, à `learn.liminalfrench.com`.
Les URL officielles (site, plateforme, destination de `/start`) sont centralisées dans `src/config/site.ts`.

**Stack :**
- Framework : Astro
- Styles : Tailwind CSS
- Déploiement : GitHub Pages, via GitHub Actions (`.github/workflows/deploy.yml`) à chaque merge dans `main`. Domaine liminalfrench.com (DNS chez Namecheap).
- Contenu : fichiers Markdown locaux (`.md` / `.mdx`)
- Données bibliothèque : fichiers JSON locaux générés en dehors du site

---

## Structure de dossiers

```
liminalfrench.com/
│
├── public/
│   ├── fonts/
│   ├── images/
│   └── og/                        # Images Open Graph par page
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── SEOHead.astro      # Balises meta, OG, schema.org
│   │   ├── blog/
│   │   │   ├── ArticleCard.astro
│   │   │   └── ArticleGrid.astro
│   │   ├── podcast/
│   │   │   ├── EpisodeCard.astro
│   │   │   └── SpotifyEmbed.astro
│   │   ├── library/
│   │   │   ├── ResourceCard.astro
│   │   │   ├── ResourceFilters.astro  # Filtres niveau / vitesse / thème
│   │   │   └── YouTubeEmbed.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Badge.astro        # Badges niveau (A1, A2, B1, B2)
│   │       └── CTABanner.astro    # Bannière de conversion → learn.
│
│   ├── content/                   # Collections Astro (Markdown)
│   │   ├── blog/
│   │   │   └── [slug].md
│   │   └── podcast/
│   │       └── [slug].md
│
│   ├── data/                      # Données JSON (générées hors site)
│   │   └── library/
│   │       └── [slug].json        # Une fiche par ressource bibliothèque
│
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Layout global (Header + Footer + SEO)
│   │   ├── ArticleLayout.astro    # Layout article de blog
│   │   ├── EpisodeLayout.astro    # Layout épisode podcast
│   │   └── ResourceLayout.astro   # Layout fiche bibliothèque
│
│   └── pages/
│       ├── index.astro            # Homepage
│       ├── about.astro            # À propos
│       ├── start.astro            # Page de conversion → learn.
│       ├── blog/
│       │   ├── index.astro        # Listing articles
│       │   └── [slug].astro       # Article individuel
│       ├── podcast/
│       │   ├── index.astro        # Listing épisodes
│       │   └── [slug].astro       # Épisode individuel
│       └── library/
│           ├── index.astro        # Bibliothèque avec filtres
│           └── [slug].astro       # Fiche ressource individuelle
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── ARCHITECTURE.md                # Ce fichier
```

---

## Pages — rôle et priorité SEO

### `/` — Homepage
- Hero : accroche + proposition de valeur
- Mise en avant des 3 derniers articles de blog
- Mise en avant des 3 derniers épisodes podcast
- CTA → `/start` ou directement la plateforme (`platformUrl`)
- **SEO** : schema.org `Person` + `WebSite`

### `/blog` — Blog
- Listing paginé des articles (12 par page)
- Filtre par catégorie (grammaire, culture, méthodes, vocabulaire...)
- **SEO** : priorité haute — contenu long, mots-clés de niche

### `/blog/[slug]` — Article
- Article complet en Markdown
- Table des matières générée automatiquement
- CTA de conversion en fin d'article
- Articles similaires (même catégorie)
- **SEO** : schema.org `Article`, balises meta complètes, OG image

### `/podcast` — Podcast
- Listing des épisodes avec player Spotify embed
- Filtre par niveau (A1–B2) et par thème
- **SEO** : schema.org `PodcastSeries`

### `/podcast/[slug]` — Épisode
- Player Spotify embed
- Transcription complète issue du SRT
- Vocabulaire clé extrait
- CTA de conversion
- **SEO** : schema.org `PodcastEpisode`, transcription = contenu SEO natif

### `/library` — Bibliothèque d'immersion
- Grille de fiches filtrables (niveau, vitesse, nb de mots, thème)
- Filtres côté client (JavaScript léger, pas de rechargement)
- Badge "French with Félix" vs "Externe"
- **SEO** : page pilier + pages fiches individuelles = longue traîne

### `/library/[slug]` — Fiche ressource
- Vidéo YouTube embed
- Métadonnées complètes (niveau, vitesse, nb mots, thème, durée)
- Transcription partielle visible + accès complet → `learn.` (freemium)
- **SEO** : schema.org `VideoObject`

### `/about` — À propos
- Histoire de Félix, méthode pédagogique, philosophie
- Pas de liens vers les réseaux sur la page (ils sont dans le footer, depuis `src/config/site.ts`)
- **SEO** : schema.org `Person`

### `/start` — Conversion
- Redirection instantanée (page statique, `noindex`, hors sitemap) vers `startUrl` défini dans `src/config/site.ts`
- Utilisée comme lien de conversion depuis tous les CTAs du site

---

## SEO — principes techniques

- **Sitemap** : généré automatiquement par `@astrojs/sitemap`
- **Robots.txt** : généré automatiquement
- **Meta tags** : titre, description, OG, Twitter Card sur chaque page via `SEOHead.astro`
- **Schema.org** : types différents selon le type de page (Article, VideoObject, PodcastEpisode, Person)
- **Performance** : HTML statique par défaut, JavaScript minimal (îlots Astro uniquement pour les filtres et embeds interactifs)
- **Images** : optimisées via `@astrojs/image`, formats WebP automatiques
- **URLs** : en anglais pour le SEO international (`/blog/french-subjunctive-guide` pas `/blog/guide-subjonctif`)

---

## Intégrations Astro requises

```
@astrojs/tailwind
@astrojs/sitemap
@astrojs/image
@astrojs/mdx          # Si articles avec composants interactifs
astro-seo             # Helper SEO
```

## Responsive — règles obligatoires

Toutes les pages et composants doivent être responsive. 
Breakpoints Tailwind à respecter :
- Mobile (défaut) : < 768px — une colonne, padding 24px
- Tablette (md) : 768px–1024px — deux colonnes max
- Desktop (lg) : > 1024px — layout complet

Règles spécifiques :
- Grilles : grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Padding container : px-6 md:px-12 lg:px-12
- Titres hero : text-3xl md:text-5xl lg:text-6xl
- Position sticky : désactivée sur mobile (position relative)
- Tout composant créé doit être testé mentalement sur 
  mobile avant d'être considéré comme terminé