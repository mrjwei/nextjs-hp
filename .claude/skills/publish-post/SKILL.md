---
name: publish-post
description: Publish one or more drafts, given by path, into the site's posts.
---

# Publish Post

Publish one or more drafts into `app/writings/posts/`, where the site's content index (`scripts/generate-content-index.mjs`) picks them up. Drafts live **outside this repo** (e.g. an Obsidian vault) — the user gives the path every time. This repo has no drafts folder.

**Usage:** `/publish-post <draft-path> [<draft-path> ...]`

`$ARGUMENTS` is one or more paths to draft files (`.md` or `.mdx`), absolute or relative to the current directory. Paths may contain spaces; if the split is ambiguous, ask.

- **No arguments**: ask the user for the draft path(s). Don't search for drafts or guess.
- A path that doesn't exist or isn't a `.md`/`.mdx` file: stop and tell the user.

Use UK/AU English spelling and grammar in anything you write or edit.

## Steps

### 1. Read each draft

Read the file in full, including frontmatter (if any) and every image reference (Obsidian `![[image.png]]` or standard `![alt](path)`).

Check the draft is actually finished. If it has placeholder text ("TODO", "add example here"), sections that are only headings, or a bullet-point skeleton where prose should be, **stop and report what's unfinished** instead of publishing. Publishing doesn't write the missing content for the user.

The source file is the user's. **Never move, edit or delete it.** Write a new file in the repo.

### 2. Determine slug and category

- **Slug**: use the frontmatter `slug` if present, otherwise derive it from the filename: lowercase, spaces become hyphens, special characters removed (`"My Article On React.md"` → `my-article-on-react`).
- **Category**: match the post's topic and tags against the existing subfolders in `app/writings/posts/` (list them; don't rely on memory). Folders are topic series at the level a reader would browse (e.g. `cnn`, `ml-metrics`, `cryptography`, `ai-and-design`), not broad categories. Standalone posts go at the root. See `docs/publish.md` for the series conventions.
  - Placing a post in a subfolder auto-assigns that folder as its `series`, so the category affects the post's collection as well as its path.
  - Creating a new subfolder: add its EN/JA display title to `app/data/series.json`.
- If a post with the same slug already exists anywhere under `app/writings/posts/`, stop and ask. Don't overwrite it.

### 3. Handle images

- Resolve each referenced image on disk. Look in the draft's own directory, then the vault's usual attachment folders (`attachments/`, `assets/`, `_attachments/`) up to 2–3 levels above the draft.
- Copy each one into `public/<slug>/`, creating that folder if needed.
- Replace the reference in the body with:

```mdx
<figure style={{ textAlign: "center" }}>
  <img
    src="/<slug>/filename.ext"
    alt="alt text or caption"
    style={{ marginBottom: "8px" }}
  />
  <figcaption>Caption if available</figcaption>
</figure>
```

Leave out `<figcaption>` when there's no caption. Record any image you can't find so you can report it.

### 4. Convert the body to MDX

Skip any of these that the draft already satisfies (for example, an `.mdx` draft that is already in site format):

- **H1**: remove an H1 that only repeats the title. Keep `##` and lower headings.
- **Table of contents**: if there are several H2 sections and no TOC, add a bulleted TOC of anchor links right after the frontmatter, using the format of existing posts: `- [Section Title](#section-title)` (lowercased, spaces → hyphens).
- **Wikilinks**: turn `[[Page]]` / `[[Page|Label]]` into plain text, or into a relative link when the target is clearly another post on this site.
- **Callouts** (`> [!NOTE]`): convert to a plain blockquote or a bold lead-in sentence.
- Keep standard markdown (bold, italics, code, fenced code blocks with language tags, external links, `---` rules) unchanged.
- Escape anything MDX would parse as JSX or expressions (bare `<`, `{`) outside code.

Light editorial pass only: fix clear typos and UK/AU spelling. If you notice factual errors you're confident about, fix them and list each change in the report. If you're unsure, flag it and leave the text alone. Don't change the author's argument, opinions or voice.

### 5. Write the frontmatter

```mdx
---
title: "..."
slug: "..."          # only when the post is in a subfolder
publishedAt: "YYYY-MM-DD"
summary: "..."
tags: ["tag1", "tag2"]
---
```

- **`title`**: keep it if the draft has one; otherwise use the H1, otherwise the filename.
- **`publishedAt`**: today's date with no time (`date +%F`), whatever value the draft had.
- **`summary`**: keep it if present; otherwise write one or two sentences.
- **`tags`**: must be a non-empty array (the content-index build fails otherwise). Keep the draft's tags, or infer them from the content. Read `app/data/tags.json` and reuse existing tags where they fit. Use a new tag only when no existing one fits.
- Keep any other frontmatter the draft has (`project`, `featured`, `track`, `result`, `series*`, `partOf*`, etc.). For project and case-study fields, see `docs/publish.md` and `docs/templates/case-study.mdx`.
- Drop Obsidian-only frontmatter the site doesn't use (`aliases`, `cssclasses`, `created`, `updated`, etc.).

### 5a. Register new tags

`app/data/tags.json` (`{ "<tag>": { "color": "#rrggbb" } }`) is the site's source of truth for tags. `components/tags.tsx` silently drops any tag that isn't a key in it. For each tag in the post that isn't a key yet:

1. Add an entry for it, keeping the existing entries and their colours unchanged.
2. Generate its colour deterministically: hue = (sum of the tag's char codes) mod 360, then convert `hsl(hue, 80%, 40%)` to hex.
3. Keep the file's 2-space indentation.

### 6. Write the post

Write it to `app/writings/posts/<category>/<slug>.mdx`, or to `app/writings/posts/<slug>.mdx` for a root-level post. Don't stage or commit it unless the user asks.

### 7. Validate

Run `node scripts/generate-content-index.mjs`. This is the check `npm run build` runs in its `prebuild` step: valid dates, non-empty tags, no duplicate slugs. If it fails, fix the frontmatter and run it again before reporting success.

### 8. Report back

For each post, report:
- Slug, title and final path under `app/writings/posts/`
- Its category, and why you chose it if that wasn't obvious
- The `publishedAt` date
- Tags you inferred, and tags newly added to `app/data/tags.json` with their colours
- The `public/<slug>/` folder, if you copied images, plus any images you couldn't find
- Content changes (corrections, conversions) and any uncertainties you flagged
- Any Obsidian syntax you couldn't convert

Also say that the source draft was left untouched, so the user can archive or delete it.
