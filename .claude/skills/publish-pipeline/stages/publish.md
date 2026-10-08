# Stage: publish

Turn one Ready vault note into a post on the site, then merge and push it. The note itself is never modified here; after-publish updates its frontmatter.

## 1. Read and check

- Read the note in full: frontmatter, body and every image reference (`![[image.png]]` or `![alt](path)`).
- It must be finished. Placeholder text ("TODO", "add example here"), sections that are only a heading, or a bullet skeleton where prose should be → blocked: report what's unfinished. Publishing doesn't write missing content.
- **Translation note** (`translationOf` set): also read the original's frontmatter (follow the link) and the original's published post at its `sitePath`. Every site frontmatter field except `title` and `summary` comes from that post, unchanged.

## 2. Language and path

- Language: `lang`, else detect it from the body. `en` → `app/writings/posts/`, `ja` → `app/writings/posts-ja/`.
- Path: `sitePath` if set (a translation note always has it: the mirror of the original's path). Otherwise:
  - Slug: the title lowercased, punctuation dropped, spaces as hyphens. For a Japanese title, use a short English slug that says the same thing (e.g. `注文フォームUIUXの改善` → `order-form-ui-ux-improvement`).
  - Folder: list the existing subfolders of both locale trees and match the post's topic, or follow `note` (e.g. `series: …`). Folders are topic series a reader would browse; standalone posts go at the root. See `docs/publish.md`. A new folder needs its EN and JA titles in `app/data/series.json`.
  - Slugs must be unique within each locale tree (the content index fails on duplicates).
- If a file already exists at the path:
  - a `placeholder: true` stand-in for this post → replace it, keeping its series and part fields;
  - already this note's post (an earlier run merged it but stopped before after-publish) → skip to after-publish;
  - anything else → blocked: don't overwrite.

## 3. Convert to MDX

Skip whatever the note already satisfies. Look at a sibling post in the target folder for the house format first.

- Images: find each one in the note's folder or the vault's `assets/`, copy it to `public/<slug>/` (a translation reuses the original's files there), and write it as:

  ```mdx
  <figure style={{ textAlign: "center" }}>
    <img src="/<slug>/file.png" alt="…" style={{ marginBottom: "8px" }} />
    <figcaption>Caption, if there is one</figcaption>
  </figure>
  ```

  An image you can't find → blocked.
- Remove an H1 that only repeats the title. With several H2 sections, add a table of contents after the frontmatter in the format of existing posts (`- [Heading](#heading)`), with anchors from the headings as written.
- Wikilinks → plain text, or a site link when the target is clearly another post (use the target locale's version when it exists). Callouts → a blockquote or a bold lead-in. Escape bare `<` and `{` outside code. Leave other standard Markdown as it is.

## 4. Edit

- Proofread and lightly refine: clear typos, grammar, awkward phrasing. English in UK/AU spelling; Japanese in natural written style matching its neighbours. Don't change the argument, opinions or voice. Fix factual errors only when you're sure, and list every non-trivial edit for the report.
- A translation note: proofread only. The author has approved its wording.
- PII: find and obfuscate anything identifying (company names, real people's names, email addresses, phone numbers, internal URLs or hostnames, account IDs, including inside images and diagrams) before anything reaches the repo. Replace it with a neutral placeholder or remove it. Scheduled run and unsure → blocked; manual run and unsure → ask.
- Apply every instruction in `note`, e.g. `project: Strobe` sets that frontmatter field, and "add placeholder pages for referenced pages that do not exist yet" means creating stand-ins in the format of existing ones (`placeholder: true`, a "Coming soon" summary, series and part fields).

## 5. Frontmatter

```mdx
---
title: "…"
slug: "…"            # when the post is in a subfolder
publishedAt: "YYYY-MM-DD"
summary: "…"
tags: ["…"]
---
```

- `title`, `summary`: the note's properties, else the defaults in SKILL.md.
- `publishedAt`: the note's `publishedAt`, else `scheduledAt`, else today (`date +%F`).
- `tags`: a non-empty array (the build fails otherwise). Reuse keys from `app/data/tags.json`; add a new tag only when none fits. Register a new tag there with colour `hsl(hue, 80%, 40%)` as hex, where hue = (sum of the tag's char codes) mod 360, keeping the file's existing entries and 2-space indentation.
- Other fields (`project`, `lead`, `track`, `series*`, `partOf*`, case-study fields) come from `note`, a replaced placeholder, or, for a translation, the original post. See `docs/publish.md` and `docs/templates/case-study.mdx`. Never add `result`. The vault's pipeline properties (`status`, `scheduledAt`, `requireTranslate`, …) never go into the post.

## 6. Build, merge, push

1. Branch from main: `post/<slug>`, or `post/<slug>-ja` / `post/<slug>-en` for a translation.
2. `node scripts/generate-content-index.mjs`: confirm the post is picked up (and a translation is paired with its original by path), then `npm run build`. Fix failures the post causes. A failure that isn't the post's → blocked: don't merge.
3. Restore `public/search-index.json` (Vercel regenerates it), commit with a message like the earlier `post:` commits, merge `--no-ff` into main and push.
4. Go on to after-publish only once the push has succeeded.
