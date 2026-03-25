# Baseline (Performance + UX)

This doc captures the **before/after** process so changes remain easy to reason about.

## Pages to test

Use the same set of URLs every time:

- Home: `/`
- Writings index: `/writings`
- One writing: `/writings/<some-slug>`
- Artworks index: `/artworks`
- One artwork: `/artworks/<some-slug>`

## Lighthouse (manual)

1. Run the site locally: `npm run dev`.
2. In Chrome, open DevTools → **Lighthouse**.
3. Run:
   - Device: **Mobile** (primary)
   - Categories: Performance, Accessibility, Best Practices, SEO
4. Repeat once for **Desktop**.
5. Save reports (Export → HTML) under a local folder (don’t commit unless you want to).

### What to record

- LCP, INP, CLS
- Performance score
- Accessibility score
- Biggest warnings (top 3)

## Build time baseline

Run:

- `npm run build`

Record:

- Total build time (roughly)
- Any warnings

## Code quality guardrails

These should remain green during the brush-up:

- `npm run lint`
- `npm run typecheck`
