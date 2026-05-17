import { useState } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function HeroImage({ src, alt, priority = true }: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="not-prose relative mb-10 overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
      {!loaded && (
        <div
          className="absolute inset-0 min-h-[280px] animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted motion-reduce:animate-none"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ maxHeight: 'min(52vh, 520px)' }}
      />
    </figure>
  );
}
