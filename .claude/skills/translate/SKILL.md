---
name: translate
description: Translate specified articles and/or portfolio entries, or work through the "require translation" entries in the publish queue.
---

# Translate

Translate one or more articles and/or portfolio entries between English and Japanese and put them in the matching location in the site's content structure.

**Usage:** `/translate [article ...]`

`$ARGUMENTS` is zero or more articles and/or portfolio entries, given as a slug (filename without `.mdx`, e.g. `zod`), or a path relative to the repo root or an absolute path.

- **One or more arguments**: translate each named entry (see "Translating an entry").
- **No arguments**: work through the publish queue backlog (see below). If the queue has no entries marked "require translation", say so and stop.

## Backlog: the publish queue

The backlog is the queue note used by the `publish-blog-post` skill: `~/projects/Notes/Publish Queue.md` (one checklist line per entry; see `.claude/skills/publish-blog-post/SKILL.md` for its conventions).

Scan only the `## Log` section of the queue note for candidates, not the checklist above it. Translation happens after the original is published, and published entries are moved into `## Log`. Entries still in the checklist above `## Log` are unpublished; ignore them even if they carry the label.

An entry in `## Log` may carry an optional `require translation` label somewhere on its line (after the link, among any free-text notes). Entries without it are not touched.

For each entry in `## Log` labelled `require translation`, top to bottom:

1. **Find the existing version** in this project that matches the entry name. The name is the link target or label (e.g. `[[WAmazing/注文フォームUIUXの改善|注文フォームUIUXの改善]]`), which may be a slug, a title, or a vault path. Search both locales for a matching filename/slug (ignoring any `✅` prefix and the folder in the vault path) and then by `title:` frontmatter. Search:
   - `app/writings/posts/` (EN) and `app/writings/posts-ja/` (JA)
   - `app/gallery/posts/` (EN) and `app/gallery/posts-ja/` (JA)
2. **Pick the direction from the existing version's language**: English → translate to Japanese; Japanese → translate to English.
3. **Translate it** (see below), writing the new file to the mirrored path in the other locale's directory.
4. **Only after the file is written**, change that entry's label from `require translation` to `translated`. Change nothing else on the line, and touch no other line.

Don't relabel an entry that was skipped or failed. Skip and report it when:
- no matching existing version is found, or several are equally plausible (ask which);
- both language versions already exist (don't overwrite; report it and ask whether to relabel as `translated` or retranslate);
- the entry is in `## Log` but no version is found in the project (nothing to translate from).

Never edit anything else in the vault; the queue note is the only file there you write to, and only to flip these labels.

## Translating an entry

1. Read the source file in full.
2. Write the translation to the same relative path under the other locale's directory (`posts` ↔ `posts-ja`), keeping the same filename/slug and subfolder. `scripts/generate-content-index.mjs` pairs translations by that path, so the path must mirror exactly. If the target already exists, stop and ask; don't overwrite.
3. Frontmatter: translate `title` and `summary`; keep every other field (`publishedAt`, `image`, `tags`, `project`, `track`, `lead`, `stack`, `series`, `seriesOrder`, `partOf`, etc.) identical to the source. Reuse the project's existing `project` ID unchanged.
4. Body: translate prose, headings, image alt text and captions. Leave code blocks, inline code, URLs, image paths and JSX/component props untouched (translate only user-visible string props). Keep the MDX structure identical: same headings in the same order, same components, same images. For a table of contents, regenerate the anchors from the translated headings, following the format in the target-locale posts.
5. Follow the conventions of existing translations in the target directory (look at a sibling file first): Japanese in natural written style (です・ます調 unless the neighbours use otherwise), a space or punctuation style consistent with them, and UK/AU English when translating into English. Keep technical terms and product names in their conventional form.
6. If the content has links to other posts on the site, point them at the target locale's equivalent when one exists.
7. Run the content index script (`npm run` script that calls `generate-content-index.mjs`, check `package.json`) and confirm the new file is picked up as a translation of the source, and that the MDX compiles. Report any problem rather than hiding it.

## Branches and commits

Follow the repo's CLAUDE.md: do the work on a new branch (e.g. `translate/<slug>`), commit with a clear message, and merge back to `main` when done. Don't commit the queue note; it lives outside this repo.

## Report

List each entry handled: source path → new path, direction, and whether its label was flipped to `translated`; then anything skipped and why.
