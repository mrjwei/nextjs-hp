---
name: publish-pipeline
description: Publish posts from the Obsidian vault (~/projects/Notes) end to end — publish Ready notes, write their translations into the vault for review, publish reviewed translations, and update the vault notes afterwards. No arguments → work the queue; or pass note path(s).
---

# publish-pipeline

The Obsidian vault `~/projects/Notes` (attachments in `/assets`) is the single source of truth for every post on the site and its translation. A translation is its own note, in the same folder as the original. The pipeline's state is the notes' frontmatter (shown as a kanban in `Posts.base`; don't read it).

## Stages

| Stage | Runs on | Does | Instructions |
| --- | --- | --- | --- |
| publish | a Ready note (original or translation) | vault note → MDX post (plus placeholders for posts it links to), built, merged to main and pushed | `stages/publish.md` |
| after-publish | the note just published, or a `finish` note | writes the note's pipeline properties | `stages/after-publish.md` |
| translate | a Published original with `requireTranslate: true` | writes the translation note next to it, as Review or Ready | `stages/translate.md` |

Paths are relative to this skill's folder. Read a stage's file only when you're about to run it.

## Frontmatter

The only properties the pipeline reads or writes; ignore the rest. A checkbox is true only when it is `true`. Write lists as Obsidian lists (`status:` then `  - Ready`), wikilinks quoted (`"[[Note name]]"`), dates as `YYYY-MM-DD`.

Set by the author:

| Property | Meaning | If missing |
| --- | --- | --- |
| `status` | One of `Drafting`, `Review` (a translation waiting for the author), `Ready`, `Published`. | Not a pipeline note, though a note passed by path counts as Ready. Empty → Drafting. Several or unknown → invalid. |
| `scheduledAt` | Queue order (earliest first), earliest publish day, default publish date. | Sorts last; publishable now; date = publish day. |
| `publishedAt` | Overrides the publish date. | `scheduledAt`, else publish day. |
| `series` | Series folder, e.g. `strobe-assistant`. A new folder starts a new series. | Claude matches a series or uses the root. |
| `project` | Project ID (one word, ≤12 chars, e.g. `Strobe`); lists the post under `/projects`. | None. |
| `note` | `;`-separated instructions applied when publishing (e.g. `lead: true`, case-study fields, editing requests). | None. |
| `requireTranslate` | Checkbox: translate after publishing. Explicitly `false` also makes the post single-language for placeholders and links. | false (but placeholders are made in both locales, see below) |
| `reviewTranslation` | `flagged` / `always` / `never`, read from the original (see "Translation review"). | `flagged`; any other value → `flagged`, and report it. |
| `title` | Post title. | The H1 opening the body, else the filename without a `✅` prefix. |
| `summary` | Post summary. | Claude writes one. |
| `lang` | `en` or `ja`. | Detected from the body; after-publish writes it. |
| `sitePath` | Repo path of the post (a list for a note published as several posts), e.g. `app/writings/posts/strobe-assistant/<slug>.mdx`. Links note and post. Set by hand only to force a slug. | Derived by publish; written by after-publish, or by publish when it makes a placeholder for the note. |

Written by the pipeline only: `translation` (wikilink, on an original: its translation note), `translationOf` (wikilink, on a translation: its original; such a note is never translated), `translated` (checkbox, on an original: its translation is published), `reviewFocus` (list, on a translation: spots for the author to check).

The vault's `status` never goes into a post (case studies have their own site `status`, from `note`).

## Placeholders

A placeholder is a post with `placeholder: true`: a "coming soon" stand-in for a post that's linked to but not published yet. The publish stage makes them in both locales whenever a post links to a missing post, except for a single-language target (its note has `requireTranslate: false`), which keeps its one version and is linked to from both locales. A placeholder is never a publication: its note stays Drafting, its original's `translated` stays false, after-publish never links a note to one, publish replaces one at its path, and translate translates over one.

## Finding work

`bash .claude/skills/publish-pipeline/queue.sh` reads frontmatter only and prints one TSV line per note that needs something, in order: `action  scheduledAt  path-in-vault  detail`. `--all` adds `scheduled` and `idle` notes. Don't search the vault for work any other way; plain `grep` finds nothing there (its .gitignore is `*`), so use the scripts or `command grep`.

| Note's frontmatter (checked top to bottom) | action | Do |
| --- | --- | --- |
| several/unknown `status`, or a date not `YYYY-MM-DD` | `invalid` | Report `detail`. |
| `status` empty or Drafting | `idle` | Nothing. |
| Review | `review` | Report as waiting for the author. |
| Ready, `scheduledAt` in the future | `scheduled` | Nothing until then. |
| Ready, has `translationOf` | `publish-translation` | publish → after-publish |
| Ready, original | `publish` | publish → after-publish → translate if `requireTranslate` → if the translation is Ready: publish → after-publish |
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
- **Manual run with note path(s)**: each note's next action from the table, regardless of queue order. A future `scheduledAt` → ask: publish now (date = today unless `publishedAt`) or wait. No paths and an empty queue → ask for a path.

A failed stage stops that note's pipeline there; earlier stages stay done, and a merged publish is never undone. The next run picks the note up at its first unfinished stage (a Ready note whose post is already on main skips to after-publish).

## Translation review

The translate stage lists in `reviewFocus` only the spots that need a human. The original's `reviewTranslation` then sets the translation's status: `flagged` → Review if `reviewFocus` has anything, else Ready (publishes in the same run); `always` → Review; `never` → Ready (`reviewFocus` still recorded). The author checks Review notes in Obsidian and sets them to Ready; instructions in the translation's `note` are applied when it's published. To start over, the author deletes the translation note and clears `translation` on the original.

## Rules

- Vault writes: only the properties above, new translation notes, and images copied into `assets/`. Never edit a note's body (except the translation note being created), never rename or move a note.
- Never commit anything from the vault. Repo changes happen only in the publish stage, one branch per published note.
- Run from Claude Code on the Mac (the Cowork VM can't push via SSH or clear git lock files).

## Report

Only what the author needs to see or act on, one line per item, empty sections left out. Don't list routine property writes, stage-by-stage steps or unchanged things.

```
Published
- <title> (en) → /posts/<folder>/<slug>, <publishedAt>
Placeholders: /posts/…, /ja/posts/… (note properties set: <note>: Drafting, requireTranslate; …)
Needs you
- Review: <translation note>: "<quote>" (reason); …
- Blocked: <note>: <why>
- Invalid: <note>: <detail>
- Check: <non-trivial edit, PII replacement, new tag or series title, untranslated text in an image, a wikilink left as plain text, …>
```
