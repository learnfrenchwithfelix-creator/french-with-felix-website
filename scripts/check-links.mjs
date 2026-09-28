// Checks the built site (dist/) against the URL convention: every internal link to a page ends
// with "/" and points to a page that exists. Run after `npm run build`: `npm run check:links`.
// Files (a dot in the last path segment), anchors and external links are skipped.
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

if (problems.size === 0) {
  console.log(`check:links OK: ${pages.length} pages, every internal link ends with "/" and resolves.`);
} else {
  for (const [key, where] of problems) {
    const [issue, href] = key.split('|');
    console.log(`${issue}: ${href}  (on ${[...where].slice(0, 3).join(', ')}${where.size > 3 ? `, +${where.size - 3} more` : ''})`);
  }
  console.log(`\ncheck:links FAILED: ${problems.size} problem(s).`);
  process.exit(1);
}
