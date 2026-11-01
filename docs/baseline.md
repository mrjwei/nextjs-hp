# Baseline (Performance + UX)

This doc captures the **before/after** process so changes remain easy to reason about.

## Pages to test

Use the same set of URLs every time:

- Home: `/`
- About: `/about`
- Projects index: `/projects`
- One project page: `/projects/<project-slug>`
- Posts index: `/posts`
- One post with a ResultBlock: `/posts/<collection>/<slug>`
- JA home: `/ja`

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

## Recorded runs

Production (`https://jessewei.net`), Lighthouse mobile preset unless noted. Add a row set after each phase of `docs/plans/2026-11-01-performance-seo-traffic.md` deploys.

### 1 Nov 2026 (before the performance/SEO plan)

Lighthouse 12.8.2, headless Chromium, simulated slow 4G and 4× CPU, one run per page from a US-east cloud container (±5 points of noise).

| Page | Perf | A11y | BP | SEO | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|---|---|
| `/` | 62 | 96 | 100 | 100 | 3.7 s | 1,760 ms | 0 | 679 KiB |
| `/` (desktop) | 82 | 96 | 100 | 100 | 2.3 s | 30 ms | 0 | 701 KiB |
| `/about` | 72 | 93 | 96 | 100 | 3.8 s | 630 ms | 0 | 664 KiB |
| `/posts` | 73 | 96 | 100 | 100 | 4.4 s | 420 ms | 0 | 773 KiB |
| `/projects` | 79 | 95 | 100 | 100 | 3.4 s | 510 ms | 0 | 682 KiB |
| `/ja` | 78 | 96 | 100 | 100 | 3.9 s | 380 ms | 0.006 | 1,334 KiB |
| `/posts/strobe-assistant-extending-strobe-with-an-ai-agent` | 71 | 96 | 100 | 100 | 5.2 s | 240 ms | 0 | 22,781 KiB |
| `/posts/ai-and-design/revamping-my-personal-website-with-claude-design-claude-code` | 64 | 96 | 100 | 100 | 8.5 s | 250 ms | 0 | 8,874 KiB |

Top warnings: Google Tag Manager blocking the main thread (944 ms on `/`); full-size PNGs and GIFs in posts (no `next/image`); `--text-subtle` colour contrast. Build passes; First Load JS 103–117 kB per route. Field data (Speed Insights), GSC and GA4 baselines: to be added in Phase 0 of the plan.
