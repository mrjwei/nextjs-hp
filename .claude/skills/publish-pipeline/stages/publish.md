# Stage: publish

Turn one Ready vault note into a post on the site, with placeholders for the posts it links to that don't exist yet, then merge and push. The note itself is never modified here; after-publish updates its frontmatter. The only vault writes here are a placeholder's note properties (step 4).

## 1. Read and check

- Read the note in full: frontmatter, body and every image reference (`![[image.png]]` or `![alt](path)`).
- It must be finished. Placeholder text ("TODO", "add example here"), sections that are only a heading, or a bullet skeleton where prose should be → blocked: report what's unfinished. Publishing doesn't write missing content.
- **Translation note** (`translationOf` set): also run `fm.sh` on the original note and on the original's published post at its `sitePath`. Every site frontmatter field except `title` and `summary` comes from that post, unchanged.

## 2. Language and path

- Language: `lang`, else detect it from the body. `en` → `app/writings/posts/`, `ja` → `app/writings/posts-ja/`.
- **Series or project** (exactly one; see SKILL.md). A translation takes its original post's. Otherwise, first match wins:
  1. `note` says which (e.g. `series: ai-agent`, `project: Strobe`, "put it in the Strobe project"). It overrides the `series` and `project` properties.
  2. The note sets only one of them: `project`, or a `series` that isn't a project's folder.
  3. Claude's judgment from the post. A write-up of something the author built (its overview, architecture, build decisions, lessons, results) is a project post. A post that teaches a topic and stands on its own for a reader who doesn't care about the project is a series post, even when a project is its running example. Unsure in a manual run → ask.

  Then pick the place. List the folders and the project IDs in use first: `ls app/writings/posts app/writings/posts-ja` and `command grep -rh '^project:' app/writings | sort | uniq -c`.
  - Series: an existing folder whose posts have no `project` and that matches the post's topic, else a new folder. Folders are topic series a reader would browse, not broad categories. See `docs/publish.md`.
  - Project: an existing project's ID and its folder (where its other posts are), else a new project: a new ID (one word, ≤12 chars) and a new folder named after the project. Report a new series or project.
- Path, first match wins:
  1. `sitePath` (a translation note always has it: the mirror of the original's path; a note with a placeholder has it too). It must be `app/writings/posts/` (en) or `app/writings/posts-ja/` (ja), then at most one folder, then `<slug>.mdx`. If `series` is also set, the folder must equal it, and the folder must fit the choice above (the project's folder or the root for a project post, a series folder for a series post). Otherwise → blocked; don't guess which one is meant.
  2. The folder chosen above, plus the slug below.
- Slug: the title lowercased, punctuation dropped, spaces as hyphens. For a Japanese title, a short English slug that says the same thing (`注文フォームUIUXの改善` → `order-form-ui-ux-improvement`). Slugs must be unique within each locale tree.
- A folder that doesn't exist yet (a new series, or a new project's folder): create it, and add its EN and JA display titles to `app/data/series.json` (report them). Name new folders in lowercase with hyphens unless the series is a proper name (`LingoBun`, `AWS`).
- If a file already exists at the path:
  - a `placeholder: true` stand-in → replace it, keeping its series and part fields. If the note is single-language (`requireTranslate: false`) and a placeholder for it exists in the other locale, delete that one too (step 6's link check then lists the links to repoint);
  - already this note's post (an earlier run merged it but stopped before after-publish) → skip to after-publish;
  - anything else → blocked: don't overwrite.
- The other locale's mirror path (`posts` ↔ `posts-ja`) holds a placeholder for this note (or one is moved there to follow a new series folder) → set its `publishedAt` to this post's (step 6), on this branch. A placeholder keeps the date of the post that first linked to it until then, and the translation will take this post's date.

## 3. Convert to MDX

Skip whatever the note already satisfies. Check the house format with `head -n 40` of one sibling post in the target folder.

- Images: find each one in the note's folder or the vault's `assets/`, copy it to `public/<slug>/`, and write it as below. An embed of `assets/<folder>/file` whose file is already at `public/<folder>/file` (a translation, or an imported post) points there instead, with no copy.

  ```mdx
  <figure style={{ textAlign: "center" }}>
    <img src="/<folder>/file.png" alt="…" style={{ marginBottom: "8px" }} />
    <figcaption>Caption, if there is one</figcaption>
  </figure>
  ```

  An image you can't find → blocked. In an embed, text after `|` is the alt text (a number is a width, so ignore it); without it, write the alt text yourself. An italic line directly below an image is its caption. Notes written by the translate stage use both.
- Remove an H1 that only repeats the title. With several H2 sections, add a table of contents after the frontmatter in the format of existing posts (`- [Heading](#heading)`), with anchors from the headings as written.
- Links to other posts: see step 4. Other wikilinks (images aside) → plain text. Callouts → a blockquote or a bold lead-in. Escape bare `<` and `{` outside code. Leave other standard Markdown as it is.

## 4. Links and placeholders

Every link to another post must resolve in this post's locale. A wikilink is a link to a post when its target is a pipeline note (has `status`; check with `fm.sh`, which takes the wikilink as written), or when the sentence points the reader to it as a separate article ("see [[X]]", "[[X|Part 4]]"). A wikilink to this note's own translation, or a passing mention of a study note, is plain text. Unsure: ask in a manual run; in a scheduled run use plain text and list it under "Check".

For each target, in this post's locale:

- Its post exists (a real post or a placeholder; its `sitePath`, else look in the target folder) → link to it, without `#heading` if it's a placeholder.
- Only the other locale's version exists, and the target is single-language (`requireTranslate: false`, or a real post whose note doesn't have `requireTranslate: true`) → link to that version, marked the way neighbouring posts mark it (e.g. `(英語)`).
- Otherwise → create the missing placeholder(s): both locales for a target with no post at all, else this locale only. A single-language target gets one, in its note's language.

Creating a placeholder:

- Path: the target note's `sitePath`, else derived as in step 2 from the note's `series`, else the series of this post when the target clearly belongs to it (e.g. its next part), else Claude's choice. The other locale's placeholder mirrors it (`posts` ↔ `posts-ja`).
- Content: copy the format of an existing placeholder (`command grep -rl 'placeholder: true' app/writings`; prefer one in the same folder): title, `slug` (in a folder), `publishedAt` = the target's real post's when one locale already has one, else this post's, a summary starting "Coming soon." / "近日公開。", this post's tags, part fields like its siblings, `project` only in a project's folder (its siblings' ID), `placeholder: true`, and a body saying it's still being written plus a link to a related published post in the same locale. Base the title and summary on the target note's title and opening lines (`head -n 30`), not the whole note.
- The target note, if it exists, in one edit: `sitePath` = the placeholder path in the note's language (so its publish replaces the placeholder); `status: Drafting` if it has no status; `requireTranslate: true` if both locales got a placeholder and the property is missing. Change nothing else. A target with no vault note gets only the placeholders; report it.

Older `note` instructions like "add placeholder pages for referenced pages that do not exist yet" are covered by this step; nothing extra to do.

## 5. Edit

- Proofread and lightly refine: clear typos, grammar, awkward phrasing. English in UK/AU spelling; Japanese in natural written style matching its neighbours. Don't change the argument, opinions or voice. Fix factual errors only when you're sure; keep a list of non-trivial edits for the report.
- A translation note: proofread only. The author has approved its wording.
- PII: find and obfuscate anything identifying (company names, real people's names, email addresses, phone numbers, internal URLs or hostnames, account IDs, including inside images and diagrams) before anything reaches the repo. Replace it with a neutral placeholder or remove it. Scheduled run and unsure → blocked; manual run and unsure → ask.
- Apply every instruction in `note` (e.g. `lead: true` sets that frontmatter field).

## 6. Frontmatter

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
- `publishedAt`: the note's `publishedAt`, else today (`date +%F`). Never `scheduledAt`: a note blocked past its scheduled day is published on the day it actually goes out. A translation: the original post's, even if its note says otherwise (see "One date per post" in SKILL.md).
- `tags`: a non-empty array (the build fails otherwise). Reuse keys from `app/data/tags.json`; add a new tag only when none fits. Register a new tag there with colour `hsl(hue, 80%, 40%)` as hex, where hue = (sum of the tag's char codes) mod 360, keeping the file's existing entries and 2-space indentation.
- `project`: the ID chosen in step 2, for a project post only. A series post never has one, even when the note sets `project`. A post in a folder also takes `slug`, and `seriesOrder`/`partOf`/`partOfTitle`/`partNumber` when its siblings use them (follow the siblings' numbering, e.g. "Part 3" → 3).
- Other fields (`lead`, `track`, case-study fields) come from `note` or a replaced placeholder. A translation takes every field except `title` and `summary` from the original post. See `docs/publish.md` and `docs/templates/case-study.mdx`. Never add `result`. The vault's pipeline properties (`status`, `scheduledAt`, `requireTranslate`, …) never go into the post.

## 7. Build, merge, push

1. Branch from main: `post/<slug>`, or `post/<slug>-ja` / `post/<slug>-en` for a translation.
2. `node .claude/skills/publish-pipeline/links.mjs` prints nothing when every post link resolves. Otherwise fix each line on this branch, even in other posts, as step 4 says, and rerun until it's silent:
   - `placeholder <path>`: create it (its counterpart in the other locale is the model);
   - `relink <file> <url> <new url>`: change the link, and drop a language mark like `(英語)` if the link is now same-locale;
   - `broken <file> <url>`: a typo → fix it; else a missing post → placeholders per step 4.
3. `npm run build > /tmp/publish-pipeline-build.log 2>&1; echo $?` (it regenerates the content index first). Non-zero → read only the errors: `command grep -n -i -m 20 -B2 -A8 'error' /tmp/publish-pipeline-build.log`. Fix failures the post causes; one that isn't the post's → blocked: don't merge.
4. Check the post (and a translation's pairing) is indexed: `node -e 'for (const p of require("./app/data/content-index.json").writings) if (p.slug === process.argv[1]) console.log(p.metadata.lang, p.filePath)' <slug>` lists one line per locale version.
5. Restore `public/search-index.json` (Vercel regenerates it), commit with a message like the earlier `post:` commits, merge `--no-ff` into main and push.
6. Go on to after-publish only once the push has succeeded. The note's pipeline isn't finished there (see "Finish the row" in SKILL.md).
