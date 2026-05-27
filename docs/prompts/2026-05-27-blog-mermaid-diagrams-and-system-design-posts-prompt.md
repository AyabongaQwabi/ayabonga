## Goal

Publish multiple long-form posts with Mermaid diagrams and make sure Mermaid code blocks render as diagrams on the blog post page.

## Context

- **Already exists**
  - Blog content in `src/content/blog/*.md`
  - Blog rendering via `react-markdown` in `src/pages/BlogPost.tsx`
  - Markdown posts include fenced Mermaid blocks (` ```mermaid `)
- **Missing**
  - Mermaid rendering support in the blog UI (code blocks currently render as literal `<pre><code>`)
  - A safe, client-side Mermaid renderer that turns Mermaid source into inline SVG

## Scope

- **In scope**
  - Repo: `ayabonga`
  - Blog UI and content: `src/pages/BlogPost.tsx`, `src/components/*`, `src/content/blog/*`
  - Supporting docs and assets for the new posts under `docs/` and `public/images/blog/`
- **Out of scope**
  - Changing global lint rules or fixing unrelated existing lint errors across the repo
  - Any changes to the `ayabonga-business` repo (tracked separately)

## Plan link

None.

## Implementation instructions

1. Add Mermaid as a dependency.
2. Implement a small lazy Mermaid loader that initializes Mermaid once.
3. Add a `BlogMermaid` component that:
   - Renders Mermaid source to SVG on the client
   - Injects the SVG into the DOM
   - Shows a readable fallback if rendering fails
4. Update the blog markdown renderer so `language-mermaid` code blocks render via `BlogMermaid`.
5. Add and publish the new posts and images.

## Acceptance

- Mermaid blocks inside blog posts render as diagrams (not raw Mermaid text).
- Non-Mermaid code blocks still render as code blocks.
- Build succeeds (`npm run build`).

