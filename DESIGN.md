# DESIGN — liminalfrench.com

Direction artistique basée sur le brand Limen, validée dans Claude Design (landing page test).
Ce fichier sert de référence pour Claude Code lors du vibe coding.
Version mise à jour suite aux tests de landing page — remplace la version initiale issue de la session DA sur les points de typographie et de forme des composants.

---

## Identité de marque

**Nom de marque :** Limen (Latin : "seuil", "threshold")
**Tagline :** *"French is a journey. Let's take it together."*
**Archétype :** Le compagnon de voyage — pas un professeur traditionnel, quelqu'un qui marche à côté
**Philosophie :** Même sans atteindre la fluidité, le voyage ouvre des portes et laisse une trace durable

---

## Palette de couleurs

### Mode clair (défaut)

```css
:root {
  --color-bg:        #F1F1F0;  /* Blanc cassé — fond principal */
  --color-title:     #2C3A48;  /* Marine (titres) — proche du marine du liseré */
  --color-liseret:   #21456E;  /* Bleu marine profond — liseré de signature en haut de page */
  --color-accent:    #C8312A;  /* Rouge vintage — accent configurable (boutons, CTA, liens actifs) */
  --color-body:      #1C1C1E;  /* Quasi-noir — corps de texte */
  --color-muted:     #6B7280;  /* Gris — textes secondaires, métadonnées, eyebrows */
  --color-surface:   #E8E8E7;  /* Surface légèrement plus sombre — sections alternées, cartes sur fond clair */
  --color-border:    #D1D1CF;  /* Bordures légères, séparateurs */
}
```

`--color-accent` est un token configurable : la landing page Claude Design expose un sélecteur de couleur d'accent (rouge vintage par défaut, avec alternatives bronze, vert sauge, bleu, noir). Garder #C8312A comme défaut mais permettre la variation par contexte (campagne, saison) sans toucher au reste du système.

### Mode sombre

```css
[data-theme="dark"] {
  --color-bg:        #1C1C1E;  /* Fond sombre */
  --color-title:     #F1F1F0;  /* Titres clairs */
  --color-liseret:   #21456E;  /* Liseré — inchangé, reste visible sur fond sombre */
  --color-accent:    #C8312A;  /* Rouge vintage — inchangé */
  --color-body:      #E8E8E7;  /* Corps de texte clair */
  --color-muted:     #9CA3AF;  /* Gris clair */
  --color-surface:   #2A2A2C;  /* Cartes dark mode */
  --color-border:    #3A3A3C;  /* Bordures sombres */
}
```

### Règles d'usage couleur

- **Liseré de page `#21456E`** : bande de 3px en haut de la page (header global), pas du rouge — c'est la nouvelle signature de page. Voir section "Signature visuelle" ci-dessous.
- **Marine `#2C3A48`** : titres (`h1`, `h2`, `h3`) — jamais sur du texte courant
- **Rouge accent `#C8312A`** (ou variante choisie) : boutons CTA, liens actifs au hover, mot mis en valeur dans un titre, prix/chiffres clés. Reste l'élément d'accent principal pour l'action, distinct du liseré de page qui est purement structurel.
- **Fond `#F1F1F0`** : jamais de blanc pur `#FFFFFF` — toujours ce blanc cassé légèrement grisé
- **Texture grain** : micro-grain subtil sur tous les fonds (CSS `filter: url(#grain)` ou SVG filter) — signature visuelle Limen, confirmée dans la landing page (opacité ~0.04)

---

## Typographie

### Familles

```css
/* Google Fonts — à importer */
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Hanken Grotesk', sans-serif;   /* Titres — variable 300 à 700, contraste light/bold dans le même titre */
  --font-body:    'Hanken Grotesk', sans-serif;    /* Corps — même famille que les titres, poids 400 */
  --font-mono:    'Spline Sans Mono', monospace;   /* Eyebrows, labels, métadonnées, badges niveau — signature typographique mono */
}
```

Changement de système par rapport à la session DA initiale : un seul système typographique (Hanken Grotesk) au lieu d'un pairing Nunito/DM Sans, avec Spline Sans Mono en complément pour les éléments d'étiquette. Hanken Grotesk gère tout le spectre — titres en 700/300 pour le contraste, corps en 400 — ce qui simplifie le chargement de polices et garde une cohérence visuelle plus forte.

### Poids configurables pour les titres

Le poids des titres (contraste bold/light) est un token réglable, testé avec 3 presets dans la landing page :

| Preset | Poids light | Poids bold | Usage |
|---|---|---|---|
| Airy (défaut) | 300 | 700 | Contraste fort, aéré — ton éditorial |
| Even | 500 | 600 | Plus équilibré, moins théâtral |
| Confident | 600 | 700 | Dense, assertif |

```css
:root {
  --weight-light: 300;  /* Défaut Airy */
  --weight-bold: 700;
}
```

### Échelle typographique

```css
:root {
  --text-xs:   0.75rem;   /* 12px — labels, badges niveau, eyebrows mono */
  --text-sm:   0.875rem;  /* 14px — métadonnées, captions */
  --text-base: 1rem;      /* 16px — corps de texte */
  --text-lg:   1.125rem;  /* 18px — lead paragraphe */
  --text-xl:   1.25rem;   /* 20px — sous-titres */
  --text-2xl:  1.5rem;    /* 24px — h3 */
  --text-3xl:  1.875rem;  /* 30px — h2 */
  --text-4xl:  2.25rem;   /* 36px — h1 section */
  --text-5xl:  3rem;      /* 48px — hero title */
  --text-6xl:  3.875rem;  /* 62px — hero title large, validé dans la landing page */
}
```

### Règles typographiques

- **Titres grands (h1, hero)** : `letter-spacing: -0.045em` — légèrement condensé
- **Titres moyens (h2)** : `letter-spacing: -0.02em` à `-0.03em`
- **Eyebrows / labels mono** : `font-family: var(--font-mono)`, `font-size: 12px`, `letter-spacing: 0.1em`, `text-transform: uppercase`, couleur `--color-muted` ou `--color-accent` selon contexte
- **Corps de texte** : `letter-spacing: 0` — neutre
- **Contraste bold/light** : dans un même titre, mélanger le poids light et bold (voir presets ci-dessus) pour créer du rythme visuel — confirmé comme mécanisme central du système, pas seulement une option ponctuelle

---

## Signature visuelle : le liseré marine en haut de page

**Règle mise à jour** : un liseré marine `#21456E` de **3px en haut de la page entière** (pas par carte). C'est un élément structurel global, pas répété sur chaque composant.

```css
body::before {
  content: '';
  display: block;
  height: 3px;
  background: var(--color-liseret);
  width: 100%;
}
```

Différence avec la version initiale de la session DA : le liseré rouge répété sur chaque carte est abandonné. À la place, on a un seul liseré marine en haut de la page, et le rouge accent est réservé aux éléments d'action (boutons, liens actifs, hover). Cela évite la surcharge visuelle d'un rouge répété partout et clarifie la hiérarchie : marine = structure, rouge = action.

---

## Forme des composants : coins arrondis configurables

**Changement majeur par rapport à la session DA** : les cards ne sont plus à angles vifs (`border-radius: 0`). La landing page introduit un système de "roundness" configurable avec 3 presets :

```css
:root {
  /* Preset "Soft" — défaut validé dans la landing page */
  --radius-card: 14px;
  --radius-button: 10px;
}
```

| Preset | Radius card | Radius bouton | Usage |
|---|---|---|---|
| Sharp | 4px | 4px | Éditorial strict, angulaire |
| Soft (défaut) | 14px | 10px | Équilibré, chaleureux sans être enfantin |
| Round | 24px | 999px (pill) | Doux, très arrondi |

Le bouton CTA principal ("Start Learning →") utilise systématiquement `--radius-button`. Les cards (articles, épisodes, reviews, stats) utilisent `--radius-card`. Garder Soft comme valeur par défaut pour le site sauf décision contraire.

---

## Badges de niveau

Inchangé par rapport à la version initiale — confirmé dans la landing page avec les mêmes couleurs.

```css
.badge {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 999px; /* toujours pill, indépendamment du preset de roundness des cards */
}

.badge-a1 { background: #DBEAFE; color: #1E40AF; }  /* Bleu doux */
.badge-a2 { background: #D1FAE5; color: #065F46; }  /* Vert doux */
.badge-b1 { background: #FEF3C7; color: #92400E; }  /* Ambre doux */
.badge-b2 { background: #FCE7F3; color: #9D174D; }  /* Rose doux */
```

---

## Espacement et layout

```css
:root {
  --spacing-xs:  0.5rem;    /* 8px */
  --spacing-sm:  1rem;      /* 16px */
  --spacing-md:  1.5rem;    /* 24px */
  --spacing-lg:  2rem;      /* 32px */
  --spacing-xl:  3rem;      /* 48px */
  --spacing-2xl: 5rem;      /* 80px */
  --spacing-3xl: 8rem;      /* 128px */

  --container-max: 1180px;  /* confirmé dans la landing page (1180px, pas 1200px) */
  --container-padding: 1.5rem;  /* 24px padding latéral mobile, 48px en desktop */

  --radius-sm:  4px;
  --radius-md:  10px;   /* aligné sur --radius-button du preset Soft */
  --radius-lg:  14px;   /* aligné sur --radius-card du preset Soft */
  --radius-section: 32px;  /* sections alternées (fond --color-surface) — grands blocs arrondis */
}
```

### Règle layout

- Cards d'article, d'épisode, de review, de stat : utilisent `--radius-card` (preset Soft = 14px par défaut) — voir section "Forme des composants" ci-dessus
- Sections alternées en pleine largeur sur fond `--color-surface` (ex : bloc newsletter, bloc podcast) : `border-radius: 32px`, padding généreux (56–64px), pour créer une respiration visuelle entre les sections sur fond `--color-bg`
- Bouton CTA principal : utilise `--radius-button`

### Composant : bloc "section sur fond surface"

Une grande inset card pleine largeur, contenant un encadré (ex : newsletter signup, podcast highlights) :

```css
.section-block {
  background: var(--color-surface);
  border-radius: var(--radius-section);
  padding: 64px 56px;
  max-width: var(--container-max);
  margin: 0 auto;
}
```

C'est un nouveau pattern confirmé dans la landing page, à utiliser pour mettre en avant 1 à 2 sections par page (pas plus, pour garder l'effet de contraste).

---

## Composants clés

### Header

```
[LIMEN]                    [Blog] [Podcast] [Library] [Start Learning →]
─────────────────────────────────────────────────────────────────────────
border-bottom: 1px solid var(--color-border) — pas de liseré rouge ici
```

- Logo "LIMEN" en Hanken Grotesk 700, letter-spacing 0.04em, couleur marine
- Navigation en Hanken Grotesk 500
- CTA "Start Learning →" en accent (rouge par défaut), avec `--radius-button`
- Sticky au scroll, fond `#F1F1F0` à ~88% d'opacité avec `backdrop-filter: blur(8px)` — effet "glassy" confirmé dans la landing page
- Le liseré marine de page reste au-dessus du header, pas intégré au header lui-même

### Card article / épisode

```
┌─────────────────────────────┐
│  [BADGE NIVEAU]  [CATEGORIE] │
│                              │
│  Titre de l'article          │
│  en Hanken Grotesk 700       │
│                              │
│  Description courte en       │
│  Hanken Grotesk 400...       │
│                              │
│  8 min · 15 sept. 2025   →   │
└─────────────────────────────┘
border-radius: var(--radius-card) — pas de liseré rouge en haut
```

Changement notable : plus de liseré rouge en haut de chaque card. La card est délimitée par une simple bordure `--color-border` et le radius du preset choisi ; le hover ajoute `transform: translateY(-3px)`.

### CTA Banner (fin d'article)

```
┌─────────────────────────────────────┐
│                                      │
│  Ready to go further?                │
│  Join French with Félix →            │
│                                      │
│  [Start Learning — bouton accent]    │
└─────────────────────────────────────┘
```

Peut utiliser le pattern "section sur fond surface" décrit ci-dessus pour se détacher visuellement du reste de la page.

---

## Animations

**Principe :** animations fonctionnelles uniquement — pas de décorations animées gratuites.

### Scroll reveal (articles, cards)
```css
/* Fade + légère montée au scroll */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Déclenché via `IntersectionObserver` — pas de librairie externe requise.

### Hover card
```css
.card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
  /* Pas de box-shadow — style plat intentionnel */
}
```

### Soulignement accent au hover (liens de nav)
```css
nav a::after {
  content: '';
  display: block;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
nav a:hover::after { transform: scaleX(1); }
```

**Ce qu'on évite :**
- Parallax
- Transitions de page complexes
- Animations d'entrée multiples simultanées
- Toute animation > 300ms

---

## Texture grain

Signature subtile sur tous les fonds — ajoute du caractère sans alourdir.

```html
<!-- Dans BaseLayout.astro, dans le <body> -->
<svg style="position:fixed;top:0;left:0;width:0;height:0">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feBlend in="SourceGraphic" mode="multiply"/>
  </filter>
</svg>
```

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: url("data:image/svg+xml,..."); /* grain SVG */
  opacity: 0.04;  /* valeur confirmée dans la landing page */
  pointer-events: none;
  z-index: 9999;
}
```

Note d'implémentation : le grain utilise `body::after` (pas `body::before`) car `body::before` est déjà réservé au liseré marine de page (voir section "Signature visuelle" plus haut). Garder les deux pseudo-éléments distincts pour éviter tout conflit de sélecteur CSS dans l'implémentation Astro.

---

## Ce qu'on n'utilise pas

- ❌ Blanc pur `#FFFFFF` — toujours `#F1F1F0`
- ❌ Bleu marine sur du texte courant — réservé aux titres et au liseré de page
- ❌ Rouge accent utilisé comme couleur structurelle répétée (ex : liseré sur chaque card) — réservé à l'action (CTA, hover, liens actifs)
- ❌ Ombres portées lourdes (`box-shadow` fort) — préférer `transform: translateY()` au hover
- ❌ Gradients — style plat, sauf le motif diagonal subtil utilisé en placeholder de cover (gris sur gris, très discret)
- ❌ Photos de fond
- ❌ Emojis dans l'UI
- ❌ Mélanger plusieurs presets de roundness sur une même page (rester sur un seul preset : Sharp, Soft, ou Round)
