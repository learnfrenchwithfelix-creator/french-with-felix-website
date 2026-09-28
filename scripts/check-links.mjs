// Checks the built site (dist/). Run after `npm run build`: `npm run check:links`.
// 1. URL convention: every internal link to a page ends with "/" and points to a page that exists.
//    Files (a dot in the last path segment), anchors and external links are skipped.
//    No placeholder links: href="#" or an empty href fails.
// 2. Indexing: the sitemap lists exactly the pages that aren't noindex (e.g. an episode page is in
//    the sitemap if and only if it is indexable).
// 3. Language: on episode pages the H1 carries a lang and every transcript paragraph is lang="fr";
//    every episode card title carries a lang (the site itself is <html lang="en">).
// 4. No duplicated content: the same heading text never appears twice at the same level (h1, h2
//    or h3) on one page, e.g. a section rendered once for mobile and once for desktop. Different
//    levels are allowed (the podcast listing's featured h2 repeats the first card's h3 on purpose).
// 5. Structured data: every page has exactly one JSON-LD script, valid JSON, whose nodes carry the
//    fields their type needs and whose @id references all resolve inside the graph.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const pages = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
};
walk(dist);

const problems = new Map(); // "issue|href" -> set of pages
const note = (issue, href, page) => {
  const key = `${issue}|${href}`;
  if (!problems.has(key)) problems.set(key, new Set());
  problems.get(key).add('/' + relative(dist, page).replace(/\\/g, '/').replace(/index\.html$/, ''));
};

for (const page of pages) {
  const html = readFileSync(page, 'utf-8');
  for (const [, href] of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
    if (href === '#' || href.trim() === '') { note('placeholder link (href="#" or empty)', href || '(empty)', page); continue; }
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const path = href.split(/[?#]/)[0];
    if (path === '' ) continue;
    const last = path.split('/').pop();
    if (last.includes('.')) {
      if (!existsSync(join(dist, path))) note('missing file', href, page);
      continue;
    }
    if (!path.endsWith('/')) note('no trailing slash', href, page);
    const target = join(dist, path.endsWith('/') ? path : path + '/', 'index.html');
    if (!existsSync(target)) note('broken link', href, page);
  }
}

// ── Indexing: sitemap ⇔ pages without noindex ──
const sitemapPaths = new Set();
for (const file of readdirSync(dist).filter(f => /^sitemap-\d+\.xml$/.test(f))) {
  for (const [, loc] of readFileSync(join(dist, file), 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapPaths.add(new URL(loc).pathname);
  }
}
const pagePath = page => '/' + relative(dist, page).replace(/\\/g, '/').replace(/index\.html$/, '');
const indexablePages = new Set();
for (const page of pages) {
  if (page.endsWith('404.html')) continue;
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(readFileSync(page, 'utf-8'));
  const path = pagePath(page);
  if (noindex && sitemapPaths.has(path)) note('noindex page in sitemap', path, page);
  if (!noindex) {
    indexablePages.add(path);
    if (!sitemapPaths.has(path)) note('indexable page missing from sitemap', path, page);
  }
}
for (const path of sitemapPaths) {
  if (!existsSync(join(dist, path, 'index.html'))) problems.set(`sitemap URL without a page|${path}`, new Set(['sitemap']));
}

// ── Language attributes on French content ──
let transcriptParas = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf-8');
  const path = pagePath(page);
  if (/^\/podcast\/[^/]+\/$/.test(path) && html.includes('transcript-para')) {
    if (!/<h1\b[^>]*\slang="(fr|en)"/.test(html)) note('episode H1 without lang', path, page);
    const paras = html.split('class="transcript-para"').slice(1);
    transcriptParas += paras.length;
    if (paras.some(p => !/<p\b[^>]*\slang="fr"/.test(p.split('</p>')[0] + '</p>'))) {
      note('transcript paragraph without lang="fr"', path, page);
    }
  }
  // Episode cards are <a class="episode-card …"> links; check the <h3> inside each one
  for (const [card] of html.matchAll(/<a\b[^>]*class="episode-card[^"]*"[\s\S]*?<\/a>/g)) {
    const h3 = card.match(/<h3\b[^>]*>/)?.[0];
    if (h3 && !/\slang="(fr|en)"/.test(h3)) { note('episode card title without lang', path, page); break; }
  }
}

// ── Duplicated headings ──
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
for (const page of pages) {
  const seen = new Set();
  for (const [, level, inner] of readFileSync(page, 'utf-8').matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const t = text(inner);
    if (!t) continue;
    if (seen.has(`${level}|${t}`)) note(`h${level} duplicated on the page`, t, page);
    seen.add(`${level}|${t}`);
  }
}

// ── Structured data (JSON-LD) ──
const REQUIRED = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  Person: ['name', 'url'],
  ProfilePage: ['mainEntity'],
  Article: ['headline', 'datePublished', 'dateModified', 'author', 'publisher'],
  BreadcrumbList: ['itemListElement'],
  PodcastSeries: ['name', 'url', 'webFeed'],
  PodcastEpisode: ['name', 'url', 'partOfSeries'],
  VideoObject: ['name', 'description', 'thumbnailUrl', 'uploadDate'],
};
const typeCount = {};
for (const page of pages) {
  const html = readFileSync(page, 'utf-8');
  if (/http-equiv="refresh"/.test(html)) continue; // redirect pages (/start/, legacy /podcast/N/)
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (scripts.length !== 1) { note(`${scripts.length} JSON-LD scripts (expected 1)`, pagePath(page), page); continue; }
  let graph;
  try { graph = JSON.parse(scripts[0][1])['@graph']; } catch (e) { note('invalid JSON-LD', e.message, page); continue; }
  const nodeIds = new Set(graph.map(n => n['@id']).filter(Boolean));
  for (const node of graph) {
    const type = node['@type'];
    typeCount[type] = (typeCount[type] ?? 0) + 1;
    for (const field of REQUIRED[type] ?? []) {
      const v = node[field];
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) note(`${type} without ${field}`, pagePath(page), page);
    }
    // Every {"@id": …} reference must point to a node of this graph
    JSON.stringify(node, (k, v) => {
      if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 1 && v['@id'] && !nodeIds.has(v['@id'])) {
        note('JSON-LD reference to a missing @id', v['@id'], page);
      }
      return v;
    });
    if (type === 'BreadcrumbList') {
      for (const item of node.itemListElement) {
        const p = new URL(item.item).pathname;
        if (!existsSync(join(dist, p, 'index.html'))) note('breadcrumb to a missing page', item.item, page);
      }
    }
  }
}

if (problems.size === 0) {
  console.log(`check:links OK: ${pages.length} pages, every internal link ends with "/" and resolves; ` +
    `sitemap = the ${indexablePages.size} indexable pages; ${transcriptParas} transcript paragraphs marked lang="fr".`);
  console.log(`JSON-LD nodes: ${Object.entries(typeCount).map(([t, n]) => `${t} ${n}`).join(', ')}.`);
} else {
  for (const [key, where] of problems) {
    const [issue, href] = key.split('|');
    console.log(`${issue}: ${href}  (on ${[...where].slice(0, 3).join(', ')}${where.size > 3 ? `, +${where.size - 3} more` : ''})`);
  }
  console.log(`\ncheck:links FAILED: ${problems.size} problem(s).`);
  process.exit(1);
}
