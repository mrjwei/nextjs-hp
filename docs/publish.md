# Publishing workflow (Obsidian -> MDX -> git push)

This repo stores writings in `app/writings/posts/`.

Collections (previously called “series” in the UI) are driven by frontmatter:

- `series`: collection slug (e.g. `ml-journey`)
- `seriesTitle` (optional): display title override
- `seriesOrder` (optional): non-negative integer used to order items within a collection

For convenience/back-compat, if a writing is inside a subfolder (e.g. `app/writings/posts/ml/...`), that folder name is treated as its `series` slug unless `series` is explicitly set.

## Work vs Writings — canonical URL

`/work` is a *view* over writings, not a separate content directory: any writing tagged `casestudy` (via frontmatter `tags: ["casestudy", ...]`) is listed at `/work` (and `/ja/work`) as well as under `/writings`.

The same file is therefore reachable at two URLs — `/writings/[slug]` (or `/writings/[collection]/[slug]`) and `/work/[slug]`. **`/work/[slug]` is canonical**: its `<link rel="canonical">`, OG URL, and sitemap entry all point there, even though the page is still served (and readable) at the `/writings` URL for anyone browsing by tag or collection. No redirect is used — `/writings/[slug]` keeps rendering the same content, just with its canonical tag pointing at `/work/[slug]`.

To add a new case study: tag it `casestudy` and it picks up the canonical `/work/[slug]` URL automatically — no separate routing or content-index change needed.

`/work` also lists any writing that carries a `track` (`"ai-engineering" | "product-design" | "security" | "research"`), even without the `casestudy` tag — this is how a research post or series entry (e.g. a security-pipeline write-up) can double as interim proof on Work while it's the best evidence available. **Only `casestudy`-tagged items get the `/work/[slug]` canonical treatment**: a `track`-only item keeps its natural `/writings` URL as canonical (via `isCaseStudy`/`isWorkItem` in `app/utils/index.ts`), so the two views never fight over which one is canonical. Add `track` once a case study candidate exists to fill the slot properly.

## Case-study frontmatter (Work)

All optional; see `app/_drafts/_case-study-template.mdx` for the full skeleton and `ResultBlock`/`WorkCard` (`components/`) for how they render:

- `featured?: number` — lower sorts earlier on Home/Work; absent = not featured. See `sortWorkItems` in `app/utils/index.ts`.
- `track?: "ai-engineering" | "product-design" | "security" | "research"` — see above.
- `draft?: boolean` — excluded from all grids, sitemap, RSS, and direct URL access in production (`npm run build`/deploy); still fully visible in `npm run dev`. Use this for "coming soon" placeholders instead of publishing them tagged `casestudy` with no real content.
- `result`, `role`, `client`, `industry`, `duration`, `stack: string[]`, `status: "production" | "pilot" | "research" | "shipped" | "archived"`, `confidential?: boolean` — rendered by `ResultBlock` above the MDX body on `/work/[slug]`. `client` should be a type, not a name, unless the client has agreed otherwise; set `confidential: true` instead of vague wording when a detail can't be named.

Array-valued frontmatter (like `stack`) uses the same `[...]` JSON syntax as `tags`, e.g. `stack: ["Next.js", "Redis"]`.

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
