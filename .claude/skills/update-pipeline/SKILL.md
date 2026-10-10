---
name: update-pipeline
description: Deploy edited, already-published posts from the Obsidian vault (~/projects/Notes) — every note in the Updated column, in either language — then build, merge and push in one batch and set the notes back to Published. No arguments → work the queue; or pass note path(s).
---

# update-pipeline

The companion of `publish-pipeline`. The vault note is the single source of truth: the author edits a published note in Obsidian and sets its `status` to `Updated` (a column in `Posts.base`). The note is final and clean, so its content goes into the post as is: no comparing, no proofreading. Each language's note is updated on its own; nothing is carried into the translation.

`P=.claude/skills/publish-pipeline` (shared scripts: `queue.sh`, `fm.sh`, `links.mjs`, `refs.mjs`).

## Frontmatter

Read from the note: `status` (`Updated`), `sitePath` (the post), `title`, `summary`, `project`, `series`, `lang`, `updatedAt` and `updateNote`.

`updatedAt` (optional, `YYYY-MM-DD`) is the "Updated" date the post shows next to "Published". The author sets it to choose the date; otherwise it is the deploy day (`date +%F` when the run starts), and the pipeline writes that back to the note after deploying. So a note's `updatedAt` counts as set by the author only when it differs from the post's current `updatedAt` (or the post has none). A value equal to the post's was recorded by the last update, so the deploy day is used.

`updateNote`: optional, `;`-separated, for this update only:

- `minor`: keep the post's "Updated" date as it is (no `updatedAt` added if it has none), whatever the note's `updatedAt`.
- `slug: <new-slug>`: change the URL (rare; see step 4).
- anything else: an instruction for this update.

The note's `note` property was for the first publish: ignore it. Written afterwards: `updatedAt`, `status`, and `sitePath`/`series` after a URL change; `updateNote` is removed.

## Finding work

```bash
bash .claude/skills/publish-pipeline/queue.sh | awk -F'\t' '$1 == "update" || $1 == "invalid"'
```

## Runs

- **No arguments** (scheduled or one-click routine, nobody to ask): every `update` line. A blocked note stays as it is; report it and go on. Nothing to do → end with no changes and no report.
- **Manual run, no arguments**: the same, but ask instead of skipping. Nothing to do → say so.
- **Manual run with note path(s)**: those notes, whatever their status.

## Steps

1. **Plan.** One `bash $P/fm.sh` call for every note and every post at their `sitePath`s. No post there, or a `placeholder: true` one → blocked: never published, set it to Ready. Branch from an up-to-date main: `update/<YYYY-MM-DD-HHMM>`; first delete leftover `git branch --no-merged main --list 'update/*'` (a failed run; the vault still holds everything).
2. **Write each post.** Read the note, and once per run `sed -n '/^## 3\./,/^## 5\./p' $P/stages/publish.md` (conversion, links and placeholders). The post's new body is the note's body converted by those rules. Don't read the old body: write the whole file through Bash (`cat > <post> <<'__MDX__'`), with the frontmatter from `fm.sh`, changed only as follows:
   - `title`, `summary`, `project`: the note's, when it has them. Never add a `project` to a post in a series folder: series and projects are exclusive (publish-pipeline's SKILL.md, "Series or project"); report the note's `project` under "Check" instead.
   - `updatedAt: "YYYY-MM-DD"` after `publishedAt`: the note's `updatedAt` when the author set it (see Frontmatter), else the deploy day; `minor` → as it was.
   - any other `updateNote` instruction.

   A note with several `sitePath`s: split its body at the same headings as the current posts (`command grep -n '^## ' <posts>`).
3. **Title changed** (the note's `title` differs from the post's old one): the URL stays. `node $P/refs.mjs retitle <lang> <key> "<old title>" "<new title>"` updates link text quoting the old title in every post (key = `sitePath` under its tree, without `.mdx`).
4. **URL change** (`updateNote` has `slug:`, or the note's `series` differs from the post's folder). Scheduled run → blocked. Manual run → confirm, then:
   - `git mv` the post and its other-locale version (same path in the other tree) to the new key; set `slug` in both;
   - a new folder → register it in `app/data/series.json` as publish.md step 2 says;
   - `node $P/refs.mjs move <old key> <new key>` repoints every link in both locales;
   - add permanent redirects for `/posts/<old key>` and `/ja/posts/<old key>` to `next.config.js`, next to the existing ones;
   - in step 7, set `sitePath` (and `series`) on both locales' notes.
5. **Commit** each note's changes: `update: <title> (<lang>)`.
6. **Build, merge, push** as publish.md step 7.2–7.5 (`links.mjs` silent, build with the log filter, restore `public/search-index.json`, merge `--no-ff`, push), logging to `/tmp/update-pipeline-build.log`. A failure one note causes and you can't fix → drop its commit (`git rebase -q --onto <c>^ <c>`), mark it blocked, rebuild. A failure no update caused → all blocked; don't merge.
7. **Record**, only once the push succeeded. One edit per note, `status` last: `updatedAt` = the post's, added if the note has none (skip only when the post has none, i.e. `minor` on a never-updated post); `sitePath`/`series` after a URL change; remove `updateNote`; `status: Published`.

## Rules

- Vault writes: only the properties above, and images copied into `assets/`. Never edit a note's body; never rename or move a note.
- Never commit anything from the vault.
- Run from Claude Code on the Mac (the vault is local, and pushing needs its SSH key).

## Report

Only what the author needs to see or act on, one line per item, empty sections left out.

```
Updated
- <title> (en) → /posts/<folder>/<slug>, updated <date> (or: minor)
Needs you
- Blocked: <note>: <why>
- Invalid: <note>: <detail>
- Check: <link text retitled in N posts, a vault note still quoting the old title or URL (refs.mjs `mention`), a URL change and its redirects, a new placeholder or tag, …>
```
