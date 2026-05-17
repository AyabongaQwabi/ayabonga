import { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="not-prose my-8">
      {!loaded && (
        <div
          className="mb-2 block min-h-[200px] animate-pulse rounded-xl bg-muted/40 motion-reduce:animate-none"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full rounded-xl border border-border/50 object-cover transition-opacity duration-300 motion-reduce:transition-none ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
