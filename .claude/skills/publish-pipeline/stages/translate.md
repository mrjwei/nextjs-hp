# Stage: translate

Write the translation of a Published original as a new vault note in the same folder, then set its status for review or publishing. This stage changes only the vault, never the repo.

## 1. Source and target

- Read the original's frontmatter and its published post at `sitePath` (always set by now: a Published note without it goes through `finish` first). If `sitePath` is a list (one note published as several posts), translate each post into its own translation note, named with the post's slug: `<original's name without a ✅ prefix> (JA, <slug>).md`, and record them all in `translation` as a list.
- **Translate from the published post, not the note's body.** The post has the publish stage's edits and PII removals; the note doesn't.
- Direction from the post's locale: `posts/` (en) → ja, `posts-ja/` (ja) → en. Target path: the same path with `posts` ↔ `posts-ja` swapped, same subfolder and filename. The content index pairs translations by that path.
- Translation note: `<original's name without a ✅ prefix> (JA).md` (or `(EN).md`), in the original's folder.
- Something already exists:
  - the translation note, with `translationOf` pointing at this original (an earlier run stopped part-way) → skip to step 5;
  - a post at the target path (translated before this pipeline) → import it: write the translation note from that post as in step 3 (status Published, no `reviewFocus`), then do step 5 and set `translated: true` on the original;
  - a note with that name that isn't this original's translation → blocked.

## 2. Translate

- Prose, headings, image alt text and captions. Leave code blocks, inline code, URLs, file names and maths untouched. Keep the structure identical: same headings in the same order, same images, same lists and tables.
- Read a sibling post in the target locale first and follow it: Japanese in です・ます調 unless the neighbours differ, English in UK/AU spelling. Translate recurring terms the way the existing translations do; keep product names and technical terms in their conventional form.
- Links to other posts: the target locale's version when it exists, else leave the link as it is.

## 3. Write the note

Write the body as ordinary Obsidian Markdown, as the original note is written: no table of contents (publish regenerates it) and no MDX wrappers. Each image becomes an embed with its translated alt text, `![[assets/<folder>/file.png|alt text]]`, with its caption, if any, as an italic line directly below. `<folder>/file.png` is the image's path under `public/`. If that file isn't in the vault's `assets/<folder>/` yet, copy it there. Frontmatter:

```yaml
status:
  - Review            # or Ready, see step 4
scheduledAt: …        # the original's, else today: keeps it next to the original on the board
publishedAt: …        # the original post's publishedAt: both versions share the date
title: "…"            # translated
summary: "…"          # the original post's summary, translated
lang: ja              # or en
series: …             # the original's, if any
project: …            # the original's, if any
sitePath: "…"         # the target path
translationOf: "[[<original's name>]]"
requireTranslate: false
reviewFocus:
  - "…"
```

## 4. Self-review and status

Compare the translation with the source section by section: nothing left out or added, and numbers, names, code and links unchanged. Fix what you find. Then list in `reviewFocus` only what a human should decide, each as a short quote of the translation plus the reason, for example:
- a source sentence that's ambiguous, where you picked one reading;
- an idiom, joke or cultural reference you adapted rather than translated;
- a term with no established translation on the site, or where you departed from the existing one;
- a passage you restructured substantially.

Don't pad the list: an empty list means a clean translation that publishes without review. Untranslated text in images or diagrams goes in the report, not in `reviewFocus`.

Status from the original's `reviewTranslation` (see SKILL.md): `flagged` → Review if `reviewFocus` has anything, else Ready; `always` → Review; `never` → Ready.

## 5. Link the original

Set `translation: "[[<translation note's name>]]"` on the original. If the translation is Ready, continue with publish for it in this run.
