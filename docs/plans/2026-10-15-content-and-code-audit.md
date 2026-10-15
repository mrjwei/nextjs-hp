# jessewei.net — content and code audit (Oct 2026)

> **Implemented 15 Oct 2026** (Phases 0–7). Retired: the 20 archived posts plus 12 more (§2, Phase 1, and C2). Tags: 17 canonical. Not done by design: the `UIUX` → `WAmazing` rename (X1). Follow-up (16 Oct): no EN WAmazing case study (JA-only by design); JA translations of `designing-infrastructure-not-assets` and `from-requirements-to-assumptions`.

*Prepared 15 Oct 2026 from an audit of the repo, the live site and the vault, for implementation by Claude Code inside `nextjs-hp`. Builds on `docs/plans/2026-10-10-positioning-rebalance.md`; the positioning there is unchanged.*

## 0. Ground rules

- One branch per phase (names below). Commit often; merge into `main` only once the phase is green.
- **Gates for every phase:** `npm run lint && npm run typecheck && npm run build` pass, and `node scripts/check-parity.mjs` shows no new warnings.
- A route-list baseline from `next build` (plus the full prerender list from `.next/prerender-manifest.json`) is saved outside the repo before Phase 1. From Phase 4 onwards the route list must stay identical to the list taken after Phase 3; every difference from the Phase 0 baseline must be a retired post or a Phase 3 slug change.
- **Don't change:** design tokens and typography; live post URLs (except as listed, always with 301s); `.claude/skills/**`; the paths the pipeline depends on: `app/writings/posts/`, `app/writings/posts-ja/`, `app/data/{series,tags,content-index}.json`, `next.config.js` (location), `docs/publish.md`, `docs/templates/case-study.mdx`.
- The Obsidian vault (`~/projects/Notes`) is the source of truth for post content. Title, summary, tags, body and slug changes go through the vault note and `/update-pipeline`. A post with no note is edited in its MDX directly, and the report says so.
- No new dependencies. Don't invent facts.

## 1. Decisions (Jesse, 15 Oct)

| # | Question | Answer |
|---|---|---|
| C1 | Retire list in Phase 1 | As listed |
| C2 | The five 2024 AI tutor/assistant posts (`ai-powered-app-for-speaking-test-prep`, `ai-powered-speaking-tutor`, `multifunctional-ai-assistant/multifunctional-ai-assistant-1/2/3`) | **Retire all five** (Phase 1), including the `multifunctional-ai-assistant` series |
| C3 | Languages | Keep Korean; no French. Chinese (native), English, Japanese, Korean everywhere (`profile.ts`, both About pages, both `meta.description`s, `app/seo/person.ts`) |
| C4 | Location | **Brisbane, Australia** everywhere, EN and JA (eyebrow, `meta.description`, About intro and description) |
| C5 | Legacy `scripts/publish.js` | Delete it, with the `publish` script, `dotenv` and the old docs section |
| C6 | "nearly 15 years ago" in *Prototyping Made Easy* vs "ten years of B2B" | **Ten years.** Fix the post (EN and JA) through the vault |
| X1 | Rename project `UIUX` → `WAmazing` (carried over from the 10 Oct plan P3) | **Not done.** The 10 Oct decision stands: the ID stays `UIUX` because the case study is written not to identify the organisation |
| X2 | JWT slug rename | Through `/update-pipeline` (`updateNote: slug:`) when a vault note exists; otherwise `git mv` + 301s + direct MDX edit |
| X3 | Route-list baseline | Compare from Phase 4 against the post-Phase-3 list |

## 2. Phases

### Phase 0 — `chore/audit-p0`

- Fix the typo "currenly" in the EN About; apply C3 and C4 to the EN/JA About and `profile.ts`.
- Commit this plan.

### Phase 1 — `content/retire-posts`

To retire a post: delete its MDX (git history and the vault keep a copy), add a 301 redirect, and mark its vault note `retired: 2026-10-15` (`status` unchanged).

- Delete the 20 posts already marked `archived: true` (they already 404).
- Delete the newly retired posts (none has a JA version): `number-systems/{number-systems-1,number-systems-2,representing-negative-binary-numbers}` (and remove `number-systems` from `app/data/series.json`), `how-to-reorder-and-squash-with-git`, `github-actions-ec2-deployment-troubleshooting-guide`, `how-i-made-my-program-140-times-faster`, `vibe-coding-as-learning-experience`, plus the C2 posts.
- Delete `app/series/` (Perfmate parts 1–2), which nothing reads.
- `next.config.js`: permanent redirects from every retired slug, with or without its old collection folder, to `/posts`; also the retired series index pages.
- Repoint any live post or vault note that links to a retired post; remove tags from `app/data/tags.json` that no longer have posts.

### Phase 2 — `fix/placeholder-hygiene`

- Exclude "Coming soon" placeholders from `app/sitemap.ts`, the search index, and the `/posts` all-posts list and tag counts in both locales. They stay on series and project pages.
- Placeholder post pages get `noindex, follow` via the `noIndex` option in `app/seo/metadata.ts`.

### Phase 3 — `content/fixes`

- `authentication/understaning-jwts-part-2`: write a correct summary from the body.
- Rename `understaning-jwts-part-1/2` → `understanding-jwts-part-1/2`, with 301s.
- Typo pass over live post titles, summaries and headings (`npx cspell`, one-off); fix real typos only.
- JA About: KOD is the client; the manuals belong to its manufacturer customer (match the EN wording).
- C6 fix in *Prototyping Made Easy* (EN and JA).
- Tags: propose a canonical list (≤ ~20, aligned with the work tracks) and apply it only after Jesse's OK.
- JA translations of `designing-infrastructure-not-assets` and `from-requirements-to-assumptions`: published 16 Oct.

### Phase 4 — `refactor/dead-code-and-config`

- Delete dead code (re-checked with grep): `components/sidebar/`, `app/data/categories.ts`, `components/ui/{card,dialog,input,separator,skeleton}.tsx`, the `includeRelative` branch of `formatDate`.
- C5 deletions.
- `package.json`: `build` is just `next build` (`prebuild` runs automatically); `@radix-ui/react-slot` and `class-variance-authority` to dependencies; `@types/*` to devDependencies.
- Stop committing `public/search-index.json` (generated at build time).
- Fix stale references; rewrite `README.md`; add `.env.example` (names only).

### Phase 5 — `refactor/structure`

`app/` holds routes plus the pipeline's content directories only.

- `app/writings/*.tsx` → `components/posts/`.
- Non-route modules → `lib/`: `app/utils` → `lib/content/`, `app/content/{config,profile}.ts` → `lib/content/`, `app/seo` → `lib/seo/`, `app/i18n` → `lib/i18n/`, `app/analytics.ts` → `lib/`, `app/data/{fonts.ts,icons.tsx}` → `lib/`. `app/data/*.json`, `app/writings/posts*` and `app/pages-content` stay.
- Components: kebab-case filenames, grouped into `ui/`, `layout/`, `home/`, `posts/`, `projects/`, moved with `git mv`.
- One import style: `@/`.
- Update the paths cited in `scripts/*.mjs`, docs and comments.

### Phase 6 — `refactor/locale-views`

- Shared views in `components/views/` that take `lang`; route files keep only `generateStaticParams`, `generateMetadata` and `<View lang=… />`. EN stays unprefixed; no middleware, no `[lang]` segment.
- Inline EN/JA ternaries move into dictionaries in `lib/i18n`.
- Resolve each EN/JA drift deliberately and record the choice.
- Gates: identical route list; HTML diff (via `next start` + curl) of home, about, `/posts`, one series, one project, one post and one placeholder in both locales, every difference explained; screenshots at 360 px and 1120 px in EN and JA.

### Phase 7 — `docs/sync`

- `docs/publish.md`: how retirement works, and where placeholders are visible.
- `docs/roadmap.md`: mark this audit done; record the decisions above.
- Out of scope (mention only): Tailwind 4.0.0-alpha.13 → stable 4.x; Next 14 → 15.
