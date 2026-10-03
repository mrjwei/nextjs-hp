# Publishing workflow (Obsidian -> MDX -> git push)

This repo stores writings in `app/writings/posts/`.

Collections (previously called “series” in the UI) are driven by frontmatter:

- `series`: collection slug (e.g. `ml-journey`)
- `seriesTitle` (optional): display title override
- `seriesOrder` (optional): non-negative integer used to order items within a collection

For convenience/back-compat, if a writing is inside a subfolder (e.g. `app/writings/posts/ml/...`), that folder name is treated as its `series` slug unless `series` is explicitly set.

Folders are topic series at the level a reader would browse (e.g. `cnn`, `ml-metrics`, `cryptography`, `ai-and-design`), not broad categories like "AI" or "design" — tags cover those. Standalone posts live at the root of `app/writings/posts/`. Each folder's display title (EN and JA) lives in `app/data/series.json`; add an entry when creating a folder, otherwise the title falls back to the title-cased folder name. Moving a post to another folder changes its URL, so add a redirect in `next.config.js`.

`partOf` / `partOfTitle` / `partNumber` mark an ordered multi-part sequence (shown as "Part N of M" with prev/next links). It can match the folder (e.g. `cnn`) or be a narrower sequence inside it (e.g. `understanding-jwts` inside `authentication`).

## Posts vs Projects — canonical URL

Every entry lives under `/posts` (`/posts/[slug]`, or `/posts/[collection]/[slug]` for posts in a collection) and that URL is always canonical. `/posts/[slug]` for a post inside a collection permanently redirects to its collection URL.

`/projects` is a *view* over posts, not a separate content directory: any post with a `project` ID in its frontmatter is a project. It is listed at `/projects` (and `/ja/projects`) as well as under `/posts`, and every card for it — on either page, on Home, and in "You May Also Like" — shows the ID as a badge in the top-right corner. The detail page is the normal `/posts` page, with the badge above the title and `ResultBlock` above the body.

To add a new project: set `project: "<ID>"` (one word, at most 12 characters, e.g. `"LingoBun"`, `"AI+Sec"`) — no routing or content-index change needed. Use the same ID on every post that belongs to that project, and on the JA translation.

`/projects` (and Home's "Selected projects") show **one card per project** (`groupProjects` in `app/utils/index.ts`). Projects are ordered newest first by each project's most recent post, the same as `/posts`. The card shows the project's lead post (the one with `lead: true`, else the most recent), so mark the overview post `lead: true`. When a project spans several posts, the card shows an "N articles" badge and links to `/projects/<project-slug>`, a page listing every post in the project. The slug is the lowercased ID with non-alphanumerics as hyphens, e.g. `AI+Sec` → `/projects/ai-sec`. A single-post project's card links straight to the post. The project badge on post pages links to the project page.

Home shows 4 projects and 4 posts, newest first, skipping posts already shown as a project card. To pin something there regardless of date, add its project ID or post slug to `highlights` in `app/content/profile.ts`. Pins come first in the listed order and the remaining slots fill with the latest. One list covers EN and JA.

The `casestudy` tag is an ordinary tag; it has no effect on routing or on `/projects`.

Old URLs (`/writings/*`, `/work`, `/work/[slug]`, and the `/ja` equivalents) permanently redirect to their `/posts` / `/projects` counterparts (`next.config.js`).

## Project frontmatter

All optional; see `docs/templates/case-study.mdx` for the full skeleton and `ResultBlock`/`WorkCard` (`components/`) for how they render:

- `project?: string` — see above.
- `lead?: boolean` — marks the post that represents its project on cards (one per project). It doesn't affect list order. See `groupProjects` in `app/utils/index.ts`.
- `track?: "ai-engineering" | "product-design" | "security" | "research"` — powers the track filter on `/projects`.
- `draft?: boolean` — excluded from all grids, search, sitemap, RSS, and direct URL access in production (`npm run build`/deploy); still fully visible in `npm run dev`. Unfinished drafts don't live in this repo: they stay outside it (e.g. in the Obsidian vault) until published with `/publish-post <path>`.
- `archived?: boolean` — excluded from all grids, search, sitemap and RSS, and its URL returns 404 (in dev too).
- `role`, `client`, `industry`, `duration`, `stack: string[]`, `status: "production" | "pilot" | "research" | "shipped" | "archived"`, `confidential?: boolean` — case-study fields. Do not add a `result` field; it has been retired. `client` should be a type, not a name, unless the client has agreed otherwise; set `confidential: true` instead of vague wording when a detail can't be named.

Array-valued frontmatter (like `stack`) uses the same `[...]` JSON syntax as `tags`, e.g. `stack: ["Next.js", "Redis"]`.

## Publishing with Claude Code

Drafts live outside this repo. To publish one, run `/publish-post <path-to-draft>` (`.md` or `.mdx`, several paths allowed). The skill copies the draft into `app/writings/posts/`, converts Obsidian syntax, copies images to `public/<slug>/`, stamps `publishedAt`, registers new tags and validates the content index. It never modifies the source file. See `.claude/skills/publish-post/SKILL.md`.

The `npm run publish` script below is the older alternative and works without Claude Code.

## Quick start

### Publish from a specific file

```bash
npm run publish "My Post Title" -- --file /absolute/path/to/My Post Title.md
```

Note: when you pass `--file`, the published title (first argument) does *not* need to match the source filename.

If the path contains spaces, quoting is recommended (but the script also supports unquoted paths):

```bash
npm run publish "My Post Title" -- --file "/absolute/path/with spaces/My Post Title.md"
```

### Publish by searching an Obsidian vault

```bash
export OBSIDIAN_VAULT=/absolute/path/to/YourVault
npm run publish "My Post Title"
```

If your Obsidian note filename differs from the published title, pass `--source`:

```bash
export OBSIDIAN_VAULT=/absolute/path/to/YourVault
npm run publish "My Published Title" -- --source "My Obsidian Note Filename"
```

### Publish into a collection folder

```bash
npm run publish "My Post Title" -- --series LingoBun --file /absolute/path/to/My Post Title.md
```

If you’re searching a vault (no `--file`) and the source filename differs from the published title:

```bash
export OBSIDIAN_VAULT=/absolute/path/to/YourVault
npm run publish "My Published Title" -- --series LingoBun --source "My Obsidian Note Filename"
```

## Images (Obsidian assets -> public/<slug>/)

If your Obsidian uses an assets folder (e.g. embeds like `![[image.png]]` stored under `/path/to/vault/assets`), set one of:

```bash
export OBSIDIAN_ASSETS=/absolute/path/to/vault/assets
```

or pass it explicitly:

```bash
npm run publish "My Post Title" -- --assets /absolute/path/to/vault/assets --file /absolute/path/to/My Post Title.md
```

The script copies any referenced `/<slug>/<file>` images into `public/<slug>/`.

## Table of contents

The script auto-generates (or replaces) a TOC block after frontmatter, similar to the output you get from the VS Code “Markdown All in One” extension.

Disable it with:

```bash
npm run publish "My Post Title" -- --no-toc --file /absolute/path/to/My Post Title.md
```

## AI transform (optional)

If `OPENAI_API_KEY` is set, the script will attempt an AI Markdown->MDX transform. Otherwise it falls back to a safe basic conversion.

```bash
export OPENAI_API_KEY=...
# optional
export OPENAI_MODEL=gpt-4o-mini
export OPENAI_BASE_URL=https://api.openai.com/v1
```

## Options

- `--no-ai`: skip AI even if API key is set
- `--dry-run`: print the plan only
- `--no-commit`: write the file but skip git commit/push
- `--no-push`: commit locally but skip git push
- `--resume`: if output exists, update TOC/assets and run git steps
- `--overwrite`: overwrite output file if it exists

## Obsidian syntax handled

- Wiki links: `[[Page]]` or `[[Page|Label]]` -> plain text
- Embeds: `![[image.png]]` -> `![](/<slug>/image.png)`

If you use embeds, put the referenced images under `public/<slug>/`.
