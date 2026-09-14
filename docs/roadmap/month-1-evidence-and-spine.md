# Month 1 — Evidence and spine (14 Sep → 11 Oct 2026)

Tracks the nextjs-hp portion of Section 4 of `⭐️portfolio-roadmap-2026Q4.md` (Notes vault). Most of that section is writing (Notes vault) or the separate `design_workflows/studio` repo — items are marked "tracked elsewhere" where this repo has nothing to build.

**Goal:** the three case studies exist in draft, the site stops contradicting the positioning, and Studio's verification layer is scoped.

## Week 1 (14–20 Sep)

- [x] **Build here** — Archive Content Creator and Gold Hunt: added `archived: true` to
  `app/portfolio/posts/artworks/content-creator.mdx` and
  `app/portfolio/posts/artworks/gold-hunt.mdx`. Reuses the existing archived-item mechanism
  (hidden from grids via `getAllSortedPortfolio*` in `app/utils/index.ts`, still reachable at
  its URL with an archived banner + `noIndex`) — no new `/archive` route.
- [x] **Build here** — Placeholder cards for the three case studies, so the IA is visible while
  they're written:
  - `app/portfolio/posts/projects/wamazing.mdx`
  - `app/portfolio/posts/projects/gonow-design-ops.mdx`
  - `app/portfolio/posts/projects/case-study-3.mdx` (generic placeholder — retitle once Week 4
    picks DEN or Zerospec)
- [ ] **Tracked elsewhere** — Draft Case Study 1 (WAmazing) full text: Notes vault.
- [ ] **Tracked elsewhere** — Studio verification-layer spec in `STUDIO_PLAN.md`:
  `design_workflows/studio` repo.

## Week 2 (21–27 Sep)

- [ ] **Build here** — Publish Post 1, "Eleven versions of one yellow badge" (GoNOW pipeline
  walkthrough). Workflow: `/new-draft` the source note into
  `app/_drafts/design/eleven-versions-of-one-yellow-badge.mdx`, then `/publish-post` into
  `app/writings/posts/design/eleven-versions-of-one-yellow-badge.mdx` (see `docs/publish.md`).
  Reuses the existing `design` collection and the `casestudy` tag — no new taxonomy.
- [ ] **Tracked elsewhere** — LinkedIn overhaul: external, not a code change.

## Week 3 (28 Sep – 4 Oct)

- [ ] **Tracked elsewhere** — Draft Case Study 2 (GoNOW design-ops pipeline) full text: Notes
  vault, using the placeholder at `app/portfolio/posts/projects/gonow-design-ops.mdx` as the
  eventual landing spot (full content lands here when it's actually published, per the Month 2
  plan).
- [ ] **Tracked elsewhere** — Studio token pipeline (DTCG → Style Dictionary → Tailwind theme):
  `design_workflows/studio` repo.

## Week 4 (5–11 Oct)

- [ ] **Tracked elsewhere** — Draft Case Study 3 (Zerospec or DEN — decide by target audience;
  roadmap's own tiebreaker leans DEN) full text: Notes vault. Once decided, retitle/rewrite
  `app/portfolio/posts/projects/case-study-3.mdx` (consider renaming the file to match the
  chosen slug).
- [ ] **Tracked elsewhere** — Studio: axe-core + Playwright a11y gate against all three preset
  templates: `design_workflows/studio` repo.

## Month 1 exit criteria (from the roadmap)

Three case studies in draft, one published post, portfolio IA fixed, Studio token pipeline +
a11y gate working locally.

- [x] Portfolio IA fixed (archived pieces hidden, three placeholder cards visible)
- [ ] Three case studies in draft (Notes vault)
- [ ] One published post (Post 1)
- [ ] Studio token pipeline + a11y gate working locally (separate repo)
