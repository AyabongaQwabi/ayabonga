/** Strip inline markdown for TOC labels. */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
}

/** Plain-text label from a markdown heading line (no HTML / inline icons). */
export function headingLabelFromRaw(raw: string): string {
  const imgAlts = [...raw.matchAll(/<img[^>]*\salt=["']([^"']*)["'][^>]*\/?>/gi)].map(
    (m) => m[1].trim(),
  );

  let text = raw
    .replace(/<img[^>]*\/?>/gi, '')
    .replace(/<[^>]+>/g, '');

  text = stripInlineMarkdown(text).replace(/\s+/g, ' ').trim();

  if (!text && imgAlts.length > 0) {
    return imgAlts[0];
  }

  return text;
}

export function headingToId(text: string): string {
  return headingLabelFromRaw(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Extract `##` / `###` headings from markdown for table of contents. */
export function extractHeadingsFromMarkdown(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of markdown.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const h2 = trimmed.match(/^##\s+(.+)$/);
    const h3 = trimmed.match(/^###\s+(.+)$/);
    const raw = h2?.[1] ?? h3?.[1];
    if (!raw) continue;

    const text = headingLabelFromRaw(raw);
    let id = headingToId(raw);
    const count = seen.get(id) ?? 0;
    if (count > 0) id = `${id}-${count + 1}`;
    seen.set(headingToId(raw), count + 1);

    entries.push({
      id,
      text,
      level: h2 ? 2 : 3,
    });
  }

  return entries;
}
