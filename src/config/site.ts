// Official URLs of Liminal French, in one place. Never hard-code these elsewhere:
// import them from here (see CLAUDE.md → "Official URLs").

/** The site itself, no trailing slash. astro.config.mjs reads it for `site` (sitemap, Astro.site). */
export const siteUrl = 'https://liminalfrench.com';

/** Kajabi course platform: "Explore courses" buttons and course banners. */
export const platformUrl = 'https://learn.liminalfrench.com';

/** Host shown in copy ("…all at learn.liminalfrench.com"), derived from platformUrl. */
export const platformHost = new URL(platformUrl).host;

/**
 * Where /start redirects: every "Start for free" / "Start Learning" button on the site links to /start.
 * TODO: replace with the Kajabi page that combines sign-in and sign-up (7-day free trial checkout)
 * once it exists. Change it here only.
 */
export const startUrl = 'https://learn.liminalfrench.com';

/**
 * Social profiles and podcast platforms (French with Félix). Used by the footer, the podcast
 * "listen" links and the author's JSON-LD sameAs. An empty string hides the link everywhere.
 */
export const social = {
  youtube:       'https://www.youtube.com/@frenchwithfelix',
  instagram:     'https://www.instagram.com/frenchwithfelix/',
  tiktok:        'https://www.tiktok.com/@frenchwithfelix',
  spotify:       'https://open.spotify.com/show/0XOsew8SJzIGaN4AbC9i2n', // the podcast show
  applePodcasts: 'https://podcasts.apple.com/podcast/id1832184743',       // the podcast show
};

/** Podcast RSS feed (Acast): "RSS" links and <link rel="alternate"> in every page's <head>. */
export const podcastRssUrl = 'https://feeds.acast.com/public/shows/6596d8903a2c300016c9c8f5';
