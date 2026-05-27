import type { Mermaid } from 'mermaid';

let mermaidPromise: Promise<Mermaid> | null = null;

/**
 * Lazy-load and initialize Mermaid once for blog diagrams.
 */
export function getMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}
