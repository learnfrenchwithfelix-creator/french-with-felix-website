// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://liminalfrench.com',

  // Pure-JS Markdown processor: the default one (satteri) loads a native .node file
  // that Windows Smart App Control refuses to run on this machine.
  markdown: {
    processor: unified(),
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/podcast/'),
    }),
    mdx(),
  ]
});
