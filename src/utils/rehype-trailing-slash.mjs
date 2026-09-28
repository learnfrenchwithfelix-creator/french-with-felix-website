// Rehype plugin: adds the trailing slash to internal page links written in Markdown
// (`[text](/podcast/some-episode)` → `/podcast/some-episode/`), so articles follow the
// site's trailingSlash: 'always' convention without editing their source.
// Left alone: external links, anchors, links that already end in "/", and files (a dot in
// the last path segment, e.g. /podcast/x/transcript.txt). Query strings and hashes are kept.

const needsSlash = href => {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  const path = href.split(/[?#]/)[0];
  if (path.endsWith('/')) return false;
  const last = path.split('/').pop();
  return !last.includes('.');
};

const addSlash = href => {
  const i = href.search(/[?#]/);
  return i === -1 ? `${href}/` : `${href.slice(0, i)}/${href.slice(i)}`;
};

const walk = node => {
  if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
    if (needsSlash(node.properties.href)) node.properties.href = addSlash(node.properties.href);
  }
  node.children?.forEach(walk);
};

export default function rehypeTrailingSlash() {
  return tree => walk(tree);
}
