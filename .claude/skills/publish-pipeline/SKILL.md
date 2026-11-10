---
name: publish-pipeline
description: Publish posts from the Obsidian vault (~/projects/Notes) end to end — publish Ready notes, write their translations into the vault for review, publish reviewed translations, and update the vault notes afterwards (properties, and the body synced with what was published). No arguments → work the queue; or pass note path(s).
---

# publish-pipeline

The Obsidian vault `~/projects/Notes` (attachments in `/assets`) is the single source of truth for every post on the site and its translation. A translation is its own note, in the same folder as the original. The pipeline's state is the notes' frontmatter (shown as a kanban in `Posts.base`; don't read it).

## Note and post stay in sync

A published note always says what its post says, so the next `/update-pipeline` run (which copies the note as is) never undoes an edit. Every change the pipeline makes to a post's content (proofreading, PII removal, `note` or `updateNote` instructions, alt text it writes, an image it splits or obfuscates, a fix during the build) is made in a **working copy** of the note, and the post is converted from that copy. Once its pull request is merged, the copy's body replaces the note's body. Only the conversion stays in the post alone: MDX figure and video markup, links written for wikilinks, the table of contents, the removed title H1, escaping, callouts as blockquotes, and the frontmatter.

```bash
bash .claude/skills/publish-pipeline/sync.sh copy <note>...   # → copy <working copy> <note>: read and edit that file, never the note
bash .claude/skills/publish-pipeline/sync.sh apply <note>...  # after the PR is merged → synced | same | none | conflict <working copy>
```

In the working copy, images use the translate stage's format (`stages/translate.md` step 3): `![[assets/<folder>/file.png|alt text]]`, where `<folder>/file.png` is the published file under `public/` (copied into the vault's `assets/<folder>/` if it isn't there yet), with its caption, if any, as an italic line directly below. An embed with a width keeps it (`|390`) and gets no alt text. Images the note embedded before stay in the vault untouched. The copies in `public/` are shrunk by `media.mjs` (`stages/publish.md` step 3): an image keeps its file name, and an animated GIF is published as `<name>.webm` while the note keeps embedding the vault's `<name>.gif`.

`apply` keeps the note's current frontmatter, so run it before the stage's property edit. `conflict`: the author edited the note's body during the run, so it is left as it is. `none`: no working copy (an earlier run merged its PR but stopped before syncing). Either way, go on with the properties and report it under "Check".

## Stages

| Stage | Runs on | Does | Instructions |
| --- | --- | --- | --- |
| publish | a Ready note (original or translation) | vault note → MDX post (plus placeholders for posts it links to), built, then merged to main through a pull request | `stages/publish.md` |
| after-publish | the note just published, or a `finish` note | writes the note's pipeline properties | `stages/after-publish.md` |
| translate | a Published original with `requireTranslate: true` | writes the translation note next to it, as Review or Ready | `stages/translate.md` |

Paths are relative to this skill's folder. Read a stage's file only when you're about to run it.

## Frontmatter

The only properties the pipeline reads or writes; ignore the rest. A checkbox is true only when it is `true`. Write lists as Obsidian lists (`status:` then `  - Ready`), wikilinks quoted (`"[[Note name]]"`), dates as `YYYY-MM-DD`.

Set by the author:

| Property | Meaning | If missing |
| --- | --- | --- |
| `status` | One of `Drafting`, `Review` (a translation waiting for the author), `Ready`, `Updated` (a published note edited by the author: `/update-pipeline`), `Published`. | Not a pipeline note, though a note passed by path counts as Ready. Empty → Drafting. Several or unknown → invalid. |
| `scheduledAt` | Queue order (earliest first), earliest publish day, and the publish date unless `publishedAt` is set: a note published late is still dated `scheduledAt`. | Sorts last; publishable now; the publish date is the publish day. |
| `publishedAt` | Overrides the publish date. On a translation: always the original post's. | `scheduledAt`, else the publish day. |
| `series` | Folder, e.g. `ai-agent`. A new folder starts a new series. | Claude decides (see "Series or project"). |
| `project` | Project ID (one word, ≤12 chars, e.g. `Strobe`); lists the post under `/projects`. | Claude decides (see "Series or project"). |
| `note` | `;`-separated instructions applied when publishing (e.g. `lead: true`, case-study fields, editing requests). | None. |
| `requireTranslate` | Checkbox: translate after publishing. Explicitly `false` also makes the post single-language for placeholders and links. | false (but placeholders are made in both locales, see below) |
| `reviewTranslation` | `flagged` / `always` / `never`, read from the original (see "Translation review"). | `flagged`; any other value → `flagged`, and report it. |
| `title` | Post title. | The H1 opening the body, else the filename without a `✅` prefix. |
| `summary` | Post summary. | Claude writes one. |
| `lang` | `en` or `ja`. | Detected from the body; after-publish writes it. |
| `sitePath` | Repo path of the post (a list for a note published as several posts), e.g. `app/writings/posts/ai-agent/<slug>.mdx`. Links note and post. Set by hand only to force a slug. | Derived by publish; written by after-publish, or by publish when it makes a placeholder for the note. |

Updates (`/update-pipeline`) also use `updateNote` and `updatedAt`.

Written by the pipeline only: `translation` (wikilink, on an original: its translation note), `translationOf` (wikilink, on a translation: its original; such a note is never translated), `translated` (checkbox, on an original: its translation is published), `reviewFocus` (list, on a translation: spots for the author to check).

The vault's `status` never goes into a post (case studies have their own site `status`, from `note`).

**One date per post.** Both locale versions of a post, including a placeholder standing in for one, always carry the same `publishedAt`: the publish date of the first real version. Only `updatedAt` may differ between them.

## Series or project

Every post belongs to exactly one series or one project, never both. A series is a topic folder (e.g. `ai-agent`) whose posts have no `project`. A project is a project ID, not a folder: its posts sit at the root of the locale tree, each with the ID. A post never has a `project` while in a series folder, and a series folder never holds a project's posts. The publish stage decides which (`stages/publish.md` step 2); a translation follows its original.

## Placeholders

A placeholder is a post with `placeholder: true`: a "coming soon" stand-in for a post that's linked to but not published yet. The publish stage makes them in both locales whenever a post links to a missing post, except for a single-language target (its note has `requireTranslate: false`), which keeps its one version and is linked to from both locales. A placeholder is never a publication: its note stays Drafting, its original's `translated` stays false, after-publish never links a note to one, publish replaces one at its path, and translate translates over one.

## Finding work

`bash .claude/skills/publish-pipeline/queue.sh` reads frontmatter only and prints one TSV line per note that needs something, in order: `action  scheduledAt  path-in-vault  detail`. `--all` adds `scheduled` and `idle` notes. Don't search the vault for work any other way; plain `grep` finds nothing there (its .gitignore is `*`), so use the scripts or `command grep`.

| Note's frontmatter (checked top to bottom) | action | Do |
| --- | --- | --- |
| several/unknown `status`, or a date not `YYYY-MM-DD` | `invalid` | Report `detail`. |
| `status` empty or Drafting | `idle` | Nothing. |
| Review | `review` | Report as waiting for the author. |
| Ready, `scheduledAt` in the future | `scheduled` | Nothing until then, however the run started. |
| Ready, has `translationOf` | `publish-translation` | publish → after-publish |
| Ready, original | `publish` | publish → after-publish → translate if `requireTranslate` → if the translation is Ready: publish → after-publish |
| Updated | `update` | `/update-pipeline`'s: skip. |
| Published, missing `sitePath`, `lang` or `publishedAt` | `finish` | after-publish (never republishes) |
| Published original, `requireTranslate: true`, no `translation`, `translated` not true | `translate` | translate → if Ready: publish → after-publish |
| Published, anything else | `idle` | Nothing. |

## Keep runs cheap

- Read a note's body only when publishing it or writing its placeholder summary (then only its opening). For any other note, `bash .claude/skills/publish-pipeline/fm.sh <path or wikilink target>...` prints just the frontmatter; it also takes repo `.mdx` paths.
- Read a post in full only when translating it. For format, read the top of one sibling (`head -n 40`), not whole posts.
- Never print `app/data/content-index.json` or build logs whole: use the queries and log filters in `stages/publish.md`.
- Don't re-read a file after editing it, and use `git -q` where it exists.

## Runs

- **Scheduled run** (no arguments, nobody to ask):
  1. Every `finish` line, then every `publish-translation` line.
  2. The first `publish` line, through the whole pipeline. One original per run.
  3. If no `publish` line could be done, the first `translate` line.
  4. A blocked item (unfinished draft, PII you're unsure about, a file conflict, a build failure that isn't the post's) stays untouched; report it and move to the next line of the same action.
  5. Nothing to do → end with no changes and no report.
- **Manual run, no arguments**: the same, but ask instead of skipping when blocked or unsure. Nothing to do → say so.
- **Manual run with note path(s)**: each note's next action from the table, regardless of queue order. A future `scheduledAt` → skip the note and change nothing; just say it's scheduled for that day. No paths and an empty queue → ask for a path.

**Finish the row.** Whatever started the publish (the queue, a path, or a request like "fix it and publish it" in a conversation), an original's pipeline is its whole row in the table: publish → after-publish → translate when `requireTranslate: true` → publish and after-publish of the translation when it's Ready. It isn't done until then, except that a note is never published before its `scheduledAt`: only a `scheduledAt` of today or earlier (or none) can be published, and a later one is left for its day. Before reporting, rerun `queue.sh` and check that no line remains for a note this run touched other than `review`, `scheduled` or a blocked item named in the report.

A failed stage stops that note's pipeline there; earlier stages stay done, and a merged publish is never undone. The next run picks the note up at its first unfinished stage (a Ready note whose post is already on main skips to after-publish).

## Translation review

The translate stage lists in `reviewFocus` only the spots that need a human. The original's `reviewTranslation` then sets the translation's status: `flagged` → Review if `reviewFocus` has anything, else Ready (publishes in the same run); `always` → Review; `never` → Ready (`reviewFocus` still recorded). The author checks Review notes in Obsidian and sets them to Ready; instructions in the translation's `note` are applied when it's published. To start over, the author deletes the translation note and clears `translation` on the original.

## Rules

- Vault writes: only the properties above, new translation notes, images copied into `assets/`, and a published note's body from its working copy (`sync.sh apply`, after the merge). Never edit a note in any other way (changes go into the working copy), never rename or move a note.
- Never run `media.mjs` on, or otherwise resize, recompress or convert, a file in the vault: it shrinks the copies in `public/` only.
- Never commit anything from the vault. Repo changes happen only in the publish stage, one branch and one pull request per published note.
- `main` is protected: never commit to it, push to it or merge into it locally. Every change goes in through a PR merged with `gh pr merge` (`stages/publish.md` step 7).
- Run from Claude Code on the Mac (the Cowork VM can't push via SSH or clear git lock files), with `gh` signed in (`gh auth status`); not signed in → blocked before any publish.

## Report

Only what the author needs to see or act on, one line per item, empty sections left out. Don't list routine property writes, stage-by-stage steps or unchanged things.

```
Published
- <title> (en) → <canonical URL>, <publishedAt> (PR <url>)   (project post: /projects/<project-slug>/<slug>; series post: /posts/<folder>/<slug>; else /posts/<slug>)
Placeholders: /posts/…, /ja/posts/… (note properties set: <note>: Drafting, requireTranslate; …)
Needs you
- Review: <translation note>: "<quote>" (reason); …
- Blocked: <note>: <why> (with the PR's URL when one is left open)
- Invalid: <note>: <detail>
- Check: <non-trivial edit, PII replacement, new tag or series title, a wikilink left as plain text, a note whose body wasn't synced (conflict or none), …>
```
