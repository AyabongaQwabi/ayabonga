/**
 * Normalize blog image paths for static files under /public.
 * Decodes then re-encodes each path segment so URLs match files with spaces or symbols.
 */
export function normalizeBlogImageSrc(src: string | undefined): string | undefined {
  if (!src?.trim()) return undefined;
  const trimmed = src.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const [pathPart, ...rest] = trimmed.split('?');
  const hashIndex = pathPart.indexOf('#');
  const pathname = hashIndex >= 0 ? pathPart.slice(0, hashIndex) : pathPart;
  const hash = hashIndex >= 0 ? pathPart.slice(hashIndex) : '';

  const segments = pathname.split('/').map((segment, index) => {
    if (segment === '') return segment;
    try {
      return encodeURIComponent(decodeURIComponent(segment));
    } catch {
      return encodeURIComponent(segment);
    }
  });

  const normalized = `${segments.join('/')}${hash}`;
  const query = rest.length > 0 ? `?${rest.join('?')}` : '';
  return `${normalized}${query}`;
}
