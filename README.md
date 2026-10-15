# jessewei.net

Jesse Wei's personal site: a bilingual (EN/JA) portfolio and blog. EN is served unprefixed at `/`, JA under `/ja`.

## Stack

- Next.js 14 (App Router, statically generated), React 18, TypeScript
- Tailwind CSS 4 (alpha) with design tokens in `app/global.css`; shadcn/ui primitives in `components/ui/`
- MDX via `next-mdx-remote`, with `remark-gfm`, KaTeX math and `sugar-high` code highlighting
- MiniSearch + cmdk for the search palette; zod for frontmatter validation
- Deployed on Vercel (with Vercel Analytics and Speed Insights; GA4 is wired in the layouts)

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Regenerates the content and search indexes (`predev`), then starts the dev server |
| `npm run build` | Runs `prebuild` automatically (content index, search index, parity check), then `next build` |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint (`next lint`) |
| `npm run typecheck` | `tsc --noEmit` |

Quality gates for every change: `npm run lint && npm run typecheck && npm run build`. `scripts/check-parity.mjs` prints a warning (it never fails the build) when a Home pin is missing in one language.

## Layout

- `app/`: routes only, plus the content the pipeline writes: `app/writings/posts{,-ja}/`, `app/data/*.json` and `app/pages-content/`
- `components/`: `ui/` (shadcn primitives), `layout/` (shell, header, footer, search), `home/`, `posts/`, `projects/`
- `components/views/`: one view per page, taking `lang`. The route files in `app/(en)` (served unprefixed) and `app/ja` only declare static params and metadata and render the view. UI strings live in `lib/i18n/dictionaries.ts`
- `lib/`: non-route modules: `content/` (content loading, profile and config), `seo/`, `i18n/`, plus `site.ts`, `fonts.ts`, `icons.tsx`, `analytics.ts` and `utils.ts`
- `scripts/`: index generators and the parity check, run by `prebuild` / `predev`
- Imports always use the `@/` alias

## Content model

- **Posts** are MDX files in `app/writings/posts/` (EN) and `app/writings/posts-ja/` (JA). A JA translation has the same path in the JA tree. A subfolder is a topic series; its display titles live in `app/data/series.json`.
- **Projects** are a view over posts: any post with a `project` ID in its frontmatter is listed at `/projects`. `/posts/...` URLs are always canonical.
- **Frontmatter** (`title`, `summary`, `tags`, `project`, `lead`, `track`, `placeholder`, `draft`, case-study fields, …) is validated in `lib/content/index.ts` and `scripts/generate-content-index.mjs`. Full rules: [`docs/publish.md`](docs/publish.md).
- **Tags** and their colours: `app/data/tags.json` (the `/posts` filter shows exactly these).
- **Positioning** (role, headline, proof strip, Home pins, track order) is data in `lib/content/profile.ts`.
- **About pages**: `app/pages-content/{en,ja}/about.mdx`.
- **Generated, not committed**: `app/data/content-index.json` and `public/search-index.json`, rebuilt by `prebuild` / `predev`.
- **Redirects** for moved and retired URLs: `next.config.js`.

## Where content comes from

Post content lives in the Obsidian vault at `~/projects/Notes`, which is the source of truth for every post and translation. Don't edit a post's MDX on its own if it has a vault note, or the next update will overwrite it. Claude Code skills deploy the vault to this repo:

- `/publish-pipeline`: publishes Ready notes, writes and publishes translations ([`.claude/skills/publish-pipeline/SKILL.md`](.claude/skills/publish-pipeline/SKILL.md))
- `/update-pipeline`: deploys edits to published notes ([`.claude/skills/update-pipeline/SKILL.md`](.claude/skills/update-pipeline/SKILL.md))

The pipeline scripts read the vault from `$VAULT` (default `~/projects/Notes`). They run from Claude Code on the Mac, because pushing needs its SSH key.

## Environment variables

Copy `.env.example` to `.env.local` and fill it in.

- `BUTTONDOWN_USERNAME`: Buttondown account for the footer newsletter form (`components/layout/newsletter-form.tsx` → `app/api/newsletter/subscribe/route.ts`). Without it, the API route answers that the newsletter isn't configured.

## Docs

- [`docs/roadmap.md`](docs/roadmap.md): positioning, current site and open work
- [`docs/publish.md`](docs/publish.md): content model and publishing
- [`docs/plans/`](docs/plans/): dated implementation plans
- [`docs/baseline.md`](docs/baseline.md): Lighthouse and build checks
