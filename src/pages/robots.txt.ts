import type { APIRoute } from 'astro';
import { siteUrl } from '../config/site';

// robots.txt, built from siteUrl so the sitemap address follows the domain. Everything is crawlable;
// pages that must stay out of search results use a robots noindex meta tag instead (e.g. episodes
// without a summary_en, /start/), which crawlers can only see if they're allowed to fetch the page.
export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap-index.xml`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
