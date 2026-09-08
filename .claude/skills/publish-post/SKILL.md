---
name: publish-post
description: Publish one or more drafts from the drafts directory.
---

# Publish Post

Publish one or more drafts from `app/_drafts/` by moving them into `app/writings/posts/`, where the site's content index (`scripts/generate-content-index.mjs`) picks them up.

**Usage:** `/publish-post [draft ...]`

`$ARGUMENTS` is zero or more drafts to publish, given as a slug (filename without `.mdx`, e.g. `zod`), or a path relative to `app/_drafts/` or the repo root (e.g. `design-reflections/disrupt-or-conform` or `app/_drafts/design-reflections/disrupt-or-conform.mdx`).

- **No arguments**: publish exactly one draft — whichever unpublished draft in `app/_drafts/` has a `publishedAt` closest to the current moment (smallest absolute time difference; ties broken by path, alphabetically first).
- **One or more arguments**: publish each named draft.

## Steps

### 1. Inventory the drafts

Recursively list all `.mdx` files under `app/_drafts/`. Every file here is unpublished by construction — once a post is published it's moved out of this directory, so there's no separate "already published" check to do.

### 2. Resolve which draft(s) to publish

**If `$ARGUMENTS` is empty:**

- Parse the frontmatter of every `.mdx` file under `app/_drafts/` and read `publishedAt`. `/new-draft` stamps it with a full timestamp (`YYYY-MM-DDTHH:MM:SS`) so same-day drafts can be told apart; some older drafts predate that and are date-only (`YYYY-MM-DD`) — treat those as midnight on that date.
- Get the current actual date and time (e.g. via `date +"%Y-%m-%dT%H:%M:%S"`).
- Compute `abs(now - publishedAt)` for each draft and pick the smallest. Break ties by full path, alphabetically.
- Skip any candidate whose filename starts with `WIP` (case-insensitive) — that's an explicit work-in-progress marker used in this repo (e.g. `WIP-austride-user-research.mdx`). Move to the next-closest candidate instead. If literally every draft is `WIP`-prefixed, stop and tell the user instead of guessing.
- Selected exactly one draft.

**If `$ARGUMENTS` has one or more tokens:**

- For each token, resolve it to a file under `app/_drafts/`:
  1. Try it as a path relative to the repo root.
  2. Try it as a path relative to `app/_drafts/`.
  3. Try it as a bare slug — search recursively under `app/_drafts/` for `<slug>.mdx`.
- If a token doesn't resolve to exactly one file (not found, or the same slug exists in more than one subfolder), stop and ask the user to disambiguate rather than guessing.
- A `WIP`-prefixed file named explicitly by the user is still published — the WIP skip only applies to auto-selection.

### 3. For each selected draft, determine its destination category

Do **not** assume the draft's current subfolder under `app/_drafts/` is the right final category — some existing drafts predate this convention and use folder names (e.g. `design-reflections`, `ml-journey`, `system-design`, `student-life`) that don't match the site's actual taxonomy. Instead, infer the category the same way `/new-draft` does: match the post's topic/tags against the existing subfolders in `app/writings/posts/`:

- `security/` — cryptography, auth, MCP, security topics
- `design/` — UX/UI design, process, case studies
- `devops/` — deployment, CI/CD, infrastructure
- `ml/` — machine learning, data science, numpy/pandas
- `number-systems/` — binary, number theory
- `LingoBun/` — LingoBun product posts
- `AI/` — broad AI topics (not dev-specific)
- *(root)* — general dev, React, JavaScript, CSS, tools, tutorials that don't fit a specific category

If no existing category fits well, publish at the root level. (Placing a post under a subfolder auto-tags it with that folder name via the content index's series inference — so getting the category right matters for the post's tags, not just its file location.)

### 4. Update the frontmatter

- **`publishedAt`**: overwrite with today's actual date only, no time (`YYYY-MM-DD`), regardless of what value the draft had (including any timestamp component). The stored value — timestamp or not — was a placeholder/target used only for step 2's selection; published posts elsewhere in the site use date-only values, so drop the time here.
- **`tags`**: `app/writings/posts/` requires a non-empty `tags` array (the content-index build fails otherwise). If the draft has no `tags` field (some older drafts don't), infer tags from the content — read `app/data/tags.json` for the site's current tag vocabulary and prefer reusing an existing tag when it fits, but a new tag is fine if nothing existing matches — and add the field.
- **`slug`**: if the post is going into a subfolder and doesn't already have a `slug` field, add one matching the filename, for consistency with existing posts (this field isn't read by the build, it's just convention).
- Leave everything else (`title`, `summary`, `seriesTitle`, `seriesSlug`, `order`, etc.) untouched.

### 4a. Register any new tags

`app/data/tags.json` is the site's single source of truth for known tags (`{ "<tag>": { "color": "#rrggbb" } }`) — it drives which tags render at all (`components/tags.tsx` silently drops any tag not present as a key) and is also read by `scripts/publish.js` for its separate AI-publish flow. A tag used in a post's frontmatter but missing from this file will be silently invisible on the site, so it must never be allowed to drift out of sync.

After finalizing each post's `tags` array (whether it came with the draft or was inferred in step 4):

1. Read `app/data/tags.json` and diff the post's tags against its keys.
2. For each tag not already a key, add an entry with a generated color: derive a hue deterministically from the tag string (e.g. sum of char codes mod 360) and use `hsl(hue, 80%, 40%)` converted to hex — this keeps new colors visually consistent with the existing palette (all existing entries sit in roughly the same saturation/lightness range) without needing to hand-pick one.
3. Write the updated JSON back, keeping existing entries and their colors untouched and preserving 2-space-indented formatting.

This runs for every selected draft before the move in step 5, so the registry is updated in the same batch as the posts that introduce the new tags.

### 5. Move the file

`app/_drafts/` is gitignored (the `_*` rule in `.gitignore`), so every draft is untracked — `git mv` will fail on it. Use a plain `mv` to move the draft to its destination:
- `app/writings/posts/<category>/<slug>.mdx` if a category was chosen
- `app/writings/posts/<slug>.mdx` if placed at root

`app/writings/posts/` *is* tracked, so the moved file will show up as untracked (`git status`) at its new path until it's added — leave staging/committing to the user's normal workflow; don't `git add` or commit it yourself unless asked.

Do not move or touch anything under `public/<slug>/` — image paths are keyed by slug at the public root, independent of which category folder the post lives in, so no asset migration is needed.

If `app/_drafts/<original-subfolder>/` is now empty after the move, remove the empty directory. Leave it alone if other drafts remain in it.

### 6. Validate

Run `node scripts/generate-content-index.mjs` to confirm the newly published post(s) pass frontmatter validation (valid dates, non-empty tags, no duplicate slugs, etc.). This is the same check `npm run build` runs via its `prebuild` step. If it fails, fix the offending frontmatter and re-run before reporting success.

### 7. Report back

For each published post, print:
- Its slug, title, and final path under `app/writings/posts/`
- The category it was placed in (and, if it differs from the draft's original `app/_drafts/` subfolder, a note why)
- The `publishedAt` date it was stamped with
- Any tags that were inferred/added because they were missing
- Any tags newly registered in `app/data/tags.json` (tag name and assigned color)

Also report:
- How many drafts remain in `app/_drafts/` (and, if selection was automatic, which ones were passed over)
- Any `WIP`-prefixed drafts skipped during auto-selection
