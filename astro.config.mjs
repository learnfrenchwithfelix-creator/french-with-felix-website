// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { siteUrl } from './src/config/site.ts';
import rehypeTrailingSlash from './src/utils/rehype-trailing-slash.mjs';
import { indexableEpisodeSlugs } from './src/utils/episode-meta.mjs';

// Episodes with a summary_en in src/content/podcast/<slug>.md (the only indexable ones)
const indexableEpisodes = indexableEpisodeSlugs();

// https://astro.build/config
export default defineConfig({
  site: siteUrl,

  // URL convention: every page URL ends with "/" (GitHub Pages serves /blog/index.html at /blog/
  // and 301-redirects /blog). Internal links, sitemap and canonicals all follow it; see CLAUDE.md.
  // trailingSlash stays 'ignore': 'always' breaks the /podcast/[slug]/transcript.txt endpoint
  // (Astro renders it as ".../transcript.txt/"). `npm run check:links` enforces the convention instead.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },

  // Pure-JS Markdown processor: the default one (satteri) loads a native .node file
  // that Windows Smart App Control refuses to run on this machine.
  markdown: {
    processor: unified(),
    // Markdown links to site pages get their trailing slash at build time (sources untouched)
    rehypePlugins: [rehypeTrailingSlash],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        // /start/ is only a redirect to the course platform
        if (path === '/start/') return false;
        // Episode pages: only the indexable ones. /podcast/2/ … are legacy redirects (not in the set).
        const episode = path.match(/^\/podcast\/([^/]+)\/$/);
        if (episode) return indexableEpisodes.has(episode[1]);
        return true; // the /podcast/ listing included
      },
    }),
    mdx(),
  ]
});
