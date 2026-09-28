// Publication rules shared by every list, page, sitemap entry and feed (see CLAUDE.md → "Dates").
//
// A piece of content is published when it isn't a draft and its publishDate has passed.
// Production builds leave out everything else: no page, no listing entry, no sitemap entry.
// The daily scheduled deploy (.github/workflows/deploy.yml) then releases scheduled content
// on its date. In `astro dev`, scheduled (future) content stays visible so it can be proofread,
// flagged with a "Scheduled" label; drafts stay hidden everywhere.

interface Publishable {
  publishDate?: Date | string | null;
  draft?: boolean;
}

const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));

/** publishDate is still in the future (content with no date is never scheduled). */
export function isScheduled({ publishDate }: Publishable, now = new Date()): boolean {
  return publishDate != null && toDate(publishDate) > now;
}

/** Whether to build this content: never drafts; scheduled content only in dev. */
export function isPublished(item: Publishable, now = new Date()): boolean {
  if (item.draft) return false;
  return import.meta.env.DEV || !isScheduled(item, now);
}
