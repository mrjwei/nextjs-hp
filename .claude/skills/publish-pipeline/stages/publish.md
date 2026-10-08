# Stage: publish

Turn one Ready vault note into a post on the site, then merge and push it. The note itself is never modified here; after-publish updates its frontmatter.

## 1. Read and check

- Read the note in full: frontmatter, body and every image reference (`![[image.png]]` or `![alt](path)`).
- It must be finished. Placeholder text ("TODO", "add example here"), sections that are only a heading, or a bullet skeleton where prose should be → blocked: report what's unfinished. Publishing doesn't write missing content.
- **Translation note** (`translationOf` set): also read the original's frontmatter (follow the link) and the original's published post at its `sitePath`. Every site frontmatter field except `title` and `summary` comes from that post, unchanged.

## 2. Language and path

- Language: `lang`, else detect it from the body. `en` → `app/writings/posts/`, `ja` → `app/writings/posts-ja/`.
- Path, first match wins:
  1. `sitePath` (a translation note always has it: the mirror of the original's path). It must be `app/writings/posts/` (en) or `app/writings/posts-ja/` (ja), then at most one folder, then `<slug>.mdx`. If `series` is also set, the folder must equal it. Otherwise → blocked; don't guess which one is meant.
  2. `series` as the folder, plus the slug below.
  3. Claude's choice: list the existing folders of both locale trees and match the post's topic; standalone posts go at the root. Folders are topic series a reader would browse, not broad categories. See `docs/publish.md`.
- Slug: the title lowercased, punctuation dropped, spaces as hyphens. For a Japanese title, use a short English slug that says the same thing (e.g. `注文フォームUIUXの改善` → `order-form-ui-ux-improvement`). Slugs must be unique within each locale tree (the content index fails on duplicates).
- A folder that doesn't exist yet is a new series: create it, and add its EN and JA display titles to `app/data/series.json` (report them, so the author can change them). Name new folders in lowercase with hyphens unless the series is a proper name (`LingoBun`, `AWS`).
- If a file already exists at the path:
  - a `placeholder: true` stand-in for this post → replace it, keeping its series and part fields;
  - already this note's post (an earlier run merged it but stopped before after-publish) → skip to after-publish;
  - anything else → blocked: don't overwrite.

## 3. Convert to MDX

Skip whatever the note already satisfies. Look at a sibling post in the target folder for the house format first.

- Images: find each one in the note's folder or the vault's `assets/`, copy it to `public/<slug>/`, and write it as below. An embed of `assets/<folder>/file` whose file is already at `public/<folder>/file` (a translation, or an imported post) points there instead, with no copy.

  ```mdx
  <figure style={{ textAlign: "center" }}>
    <img src="/<folder>/file.png" alt="…" style={{ marginBottom: "8px" }} />
    <figcaption>Caption, if there is one</figcaption>
  </figure>
  ```

  An image you can't find → blocked. In an embed, text after `|` is the alt text (a number is a width, so ignore it); without it, write the alt text yourself. An italic line directly below an image is its caption. Notes written by the translate stage use both.
- Remove an H1 that only repeats the title. With several H2 sections, add a table of contents after the frontmatter in the format of existing posts (`- [Heading](#heading)`), with anchors from the headings as written.
- Wikilinks → plain text, or a site link when the target is clearly another post (use the target locale's version when it exists). Callouts → a blockquote or a bold lead-in. Escape bare `<` and `{` outside code. Leave other standard Markdown as it is.

## 4. Edit

- Proofread and lightly refine: clear typos, grammar, awkward phrasing. English in UK/AU spelling; Japanese in natural written style matching its neighbours. Don't change the argument, opinions or voice. Fix factual errors only when you're sure, and list every non-trivial edit for the report.
- A translation note: proofread only. The author has approved its wording.
- PII: find and obfuscate anything identifying (company names, real people's names, email addresses, phone numbers, internal URLs or hostnames, account IDs, including inside images and diagrams) before anything reaches the repo. Replace it with a neutral placeholder or remove it. Scheduled run and unsure → blocked; manual run and unsure → ask.
- Apply every instruction in `note`, e.g. `lead: true` sets that frontmatter field, and "add placeholder pages for referenced pages that do not exist yet" means creating stand-ins in the format of existing ones (`placeholder: true`, a "Coming soon" summary, series and part fields).

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
- `project`: the note's `project`. A post in a series folder also takes `slug`, and `seriesOrder`/`partOf`/`partOfTitle`/`partNumber` when its siblings use them (follow the siblings' numbering, e.g. "Part 3" → 3).
- Other fields (`lead`, `track`, case-study fields) come from `note` or a replaced placeholder. A translation takes every field except `title` and `summary` from the original post. See `docs/publish.md` and `docs/templates/case-study.mdx`. Never add `result`. The vault's pipeline properties (`status`, `scheduledAt`, `requireTranslate`, …) never go into the post.

## 6. Build, merge, push

1. Branch from main: `post/<slug>`, or `post/<slug>-ja` / `post/<slug>-en` for a translation.
2. `node scripts/generate-content-index.mjs`: confirm the post is picked up (and a translation is paired with its original by path), then `npm run build`. Fix failures the post causes. A failure that isn't the post's → blocked: don't merge.
3. Restore `public/search-index.json` (Vercel regenerates it), commit with a message like the earlier `post:` commits, merge `--no-ff` into main and push.
4. Go on to after-publish only once the push has succeeded.
