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
