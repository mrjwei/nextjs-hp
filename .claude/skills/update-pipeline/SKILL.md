---
name: update-pipeline
description: Deploy edited, already-published posts from the Obsidian vault (~/projects/Notes) — every note in the Updated column, in either language — then build and merge them to main through one pull request, sync each note's body with its published post, and set the notes back to Published. No arguments → work the queue; or pass note path(s).
---

# update-pipeline

The companion of `publish-pipeline`. The vault note is the single source of truth: the author edits a published note in Obsidian and sets its `status` to `Updated` (a column in `Posts.base`). The note is final and clean, so its content goes into the post as is: no comparing, no proofreading. Anything else the run changes in a post's content (an `updateNote` instruction such as "refine the new part", alt text, an image, a build fix) is made in the note's working copy first and written back to the note after the merge, so the note keeps saying what its post says (publish-pipeline's SKILL.md, "Note and post stay in sync"). Each language's note is updated on its own; the other language changes only when `updateNote` asks for it (step 2), and then through its own note too.

`P=.claude/skills/publish-pipeline` (shared scripts: `queue.sh`, `fm.sh`, `sync.sh`, `links.mjs`, `refs.mjs`).

## Frontmatter

Read from the note: `status` (`Updated`), `sitePath` (the post), `title`, `summary`, `project`, `series`, `lang`, `updatedAt` and `updateNote`.

`updatedAt` (optional, `YYYY-MM-DD`) is the "Updated" date the post shows next to "Published". The author sets it to choose the date; otherwise it is the deploy day (`date +%F` when the run starts), and the pipeline writes that back to the note after deploying. So a note's `updatedAt` counts as set by the author only when it differs from the post's current `updatedAt` (or the post has none). A value equal to the post's was recorded by the last update, so the deploy day is used.

`updateNote`: optional, `;`-separated, for this update only:

- `minor`: keep the post's "Updated" date as it is (no `updatedAt` added if it has none), whatever the note's `updatedAt`.
- `slug: <new-slug>`: change the URL (rare; see step 4).
- anything else: an instruction for this update (step 2).

The note's `note` property was for the first publish: ignore it. Written afterwards: the body (from the working copy), `updatedAt`, `status`, and `sitePath`/`series` after a URL change; `updateNote` is removed.

## Finding work

```bash
bash .claude/skills/publish-pipeline/queue.sh | awk -F'\t' '$1 == "update" || $1 == "invalid"'
```

## Runs

- **No arguments** (scheduled or one-click routine, nobody to ask): every `update` line. A blocked note stays as it is; report it and go on. Nothing to do → end with no changes and no report.
- **Manual run, no arguments**: the same, but ask instead of skipping. Nothing to do → say so.
- **Manual run with note path(s)**: those notes, whatever their status.

## Steps

1. **Plan.** One `bash $P/fm.sh` call for every note and every post at their `sitePath`s. No post there, or a `placeholder: true` one → blocked: never published, set it to Ready. Branch from an up-to-date main (`git switch -q main && git pull -q --ff-only origin main`): `update/<YYYY-MM-DD-HHMM>`. First clear what a failed run left (the vault still holds everything): close each open update PR and delete its branch (`gh pr list --state open --json headRefName -q '.[].headRefName | select(startswith("update/"))'`, then `gh pr close <branch> --delete-branch`), and delete leftover local `git branch --no-merged main --list 'update/*'`. Make the working copies: `bash $P/sync.sh copy <note>...` (a fresh copy, even if a failed run left one). From here on, read and edit the copies, never the notes.
2. **Write each post.** Read the working copy, and once per run `sed -n '/^## 3\./,/^## 5\./p' $P/stages/publish.md` (conversion, links and placeholders). First apply to the copy any `updateNote` instruction that changes content ("check and refine the new part": edit that part in the copy, proofreading only it, and list non-trivial edits under "Check"), and rewrite new image embeds in it as publish.md step 3 says. The post's new body is the copy's body converted by those rules.

   `updateNote` asks for the other language too ("update JA too"): that locale's note joins this run. Make its working copy, carry the change into it (translated and written as `stages/translate.md` steps 2–3 say), and write its post from it like any other note. Its `updatedAt` follows the same rule, it gets its own commit, and step 7 records it like the others.

   Don't read the old body: write the whole file through Bash (`cat > <post> <<'__MDX__'`), with the frontmatter from `fm.sh`, changed only as follows:
   - `title`, `summary`, `project`: the note's, when it has them. Never add a `project` to a post in a series folder: series and projects are exclusive (publish-pipeline's SKILL.md, "Series or project"); report the note's `project` under "Check" instead.
   - `updatedAt: "YYYY-MM-DD"` after `publishedAt`: the note's `updatedAt` when the author set it (see Frontmatter), else the deploy day; `minor` → as it was.
   - any other `updateNote` instruction about the frontmatter.

   A note with several `sitePath`s: split its body at the same headings as the current posts (`command grep -n '^## ' <posts>`).
3. **Title changed** (the note's `title` differs from the post's old one): the URL stays. `node $P/refs.mjs retitle <lang> <key> "<old title>" "<new title>"` updates link text quoting the old title in every post (key = `sitePath` under its tree, without `.mdx`).
4. **URL change** (`updateNote` has `slug:`, or the note's `series` differs from the post's folder). Scheduled run → blocked. Manual run → confirm, then:
   - `git mv` the post and its other-locale version (same path in the other tree) to the new key; set `slug` in both;
   - a new folder → register it in `app/data/series.json` as publish.md step 2 says;
   - `node $P/refs.mjs move <old key> <new key>` repoints every link in both locales;
   - add permanent redirects for `/posts/<old key>` and `/ja/posts/<old key>` to `next.config.js`, next to the existing ones;
   - in step 7, set `sitePath` (and `series`) on both locales' notes.
5. **Commit** each note's changes: `update: <title> (<lang>)`.
6. **Build, open a PR, merge** as publish.md step 7.2–7.5 (`links.mjs` silent, build with the log filter, restore `public/search-index.json`, push the branch, one PR titled `update: <titles>` listing each post's URL, `gh pr merge --merge --delete-branch`, pull main), logging to `/tmp/update-pipeline-build.log`. A fix to a post's wording or images goes into its working copy too. A failure one note causes and you can't fix → drop its commit (`git rebase -q --onto <c>^ <c>`), mark it blocked (its working copy is never applied), rebuild. A failure no update caused → all blocked; don't open a PR. A failing check or a merge `gh` refuses → all blocked; leave the PR open and report its URL.
7. **Record**, only once the PR is merged, for the notes in it. First the bodies: `bash $P/sync.sh apply <note>...`; `conflict` (the author edited the note during the run) or `none` → leave the body, report under "Check", and go on. Then one property edit per note, `status` last: `updatedAt` = the post's, added if the note has none (skip only when the post has none, i.e. `minor` on a never-updated post); `sitePath`/`series` after a URL change; remove `updateNote`; `status: Published`.

## Rules

- Vault writes: only the properties above, images copied into `assets/`, and each note's body from its working copy (step 7). Never edit a note in any other way (changes go into the working copy); never rename or move a note.
- Never commit anything from the vault.
- `main` is protected: never commit to it, push to it or merge into it locally; the run's changes go in through its one PR.
- Run from Claude Code on the Mac (the vault is local, and pushing needs its SSH key), with `gh` signed in (`gh auth status`).

## Report

Only what the author needs to see or act on, one line per item, empty sections left out.

```
Updated
- <title> (en) → /posts/<folder>/<slug>, updated <date> (or: minor)
PR: <url>
Needs you
- Blocked: <note>: <why> (with the PR's URL when one is left open)
- Invalid: <note>: <detail>
- Check: <a refined passage or other non-trivial edit, a note whose body wasn't synced (conflict or none), link text retitled in N posts, a vault note still quoting the old title or URL (refs.mjs `mention`), a URL change and its redirects, a new placeholder or tag, …>
```
