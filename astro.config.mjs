// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { siteUrl } from './src/config/site.ts';
import rehypeTrailingSlash from './src/utils/rehype-trailing-slash.mjs';

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
      // /start is only a redirect to the course platform
      filter: (page) => !page.includes('/podcast/') && !page.endsWith('/start/'),
    }),
    mdx(),
  ]
});
