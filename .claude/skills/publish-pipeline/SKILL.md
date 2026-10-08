---
name: publish-pipeline
description: Publish posts from the Obsidian vault (~/projects/Notes) end to end — publish Ready notes, write their translations into the vault for review, publish reviewed translations, and update the vault notes afterwards. No arguments → work the queue; or pass note path(s).
---

# publish-pipeline

The Obsidian vault `~/projects/Notes` (attachments in `/assets`) is the single source of truth for every post and project write-up on the site, and for their translations. Every page on the site comes from a vault note. A translation is its own note, saved in the same folder as the original. The pipeline's state is the notes' own frontmatter, shown as a kanban in `~/projects/Notes/Posts.base` (don't read the .base file).

## Stages

| Stage | Runs on | Does | Instructions |
| --- | --- | --- | --- |
| publish | a Ready note (original or translation) | vault note → MDX post, built, merged to main and pushed | `stages/publish.md` |
| after-publish | the note just published | frontmatter updates, `✅ ` rename | `stages/after-publish.md` |
| translate | a Published original with `requireTranslate: true` | writes the translation note next to it, as Review or Ready | `stages/translate.md` |

Paths are relative to this skill's folder. Read a stage's file when you're about to run that stage, not before.

## Frontmatter

These are the only properties the pipeline reads or writes; ignore every other property. A checkbox counts as true only when it is `true`. Write lists as Obsidian lists (`status:` then `  - Ready`), wikilinks quoted (`"[[Note name]]"`) and dates as `YYYY-MM-DD`.

Set by the author:

| Property | Type | Meaning | If missing |
| --- | --- | --- | --- |
| `status` | list, one of `Drafting`, `Review`, `Ready`, `Published` | Where the note is in the pipeline. `Review` = a translation waiting for the author's check. | Not a pipeline note, but a note passed by path is treated as Ready. Empty → Drafting. Several values or an unknown one → invalid: skip and report. |
| `scheduledAt` | date | Queue order (earliest first), the day from which it may be published, and the default publish date. | Sorts last, can be published right away, publish date = the day it's published. Not a valid date → invalid. |
| `publishedAt` | date | Overrides the publish date shown on the site. | `scheduledAt`, else the day it's published. Not a valid date → invalid. |
| `note` | text | Instructions for Claude, `;`-separated, applied when publishing (e.g. `project: Strobe; add placeholder pages for referenced pages that do not exist yet`). | No extra instructions. |
| `requireTranslate` | checkbox | Translate the post after publishing it. | false |
| `reviewTranslation` | text: `flagged`, `always`, `never` | When the translation waits for the author (see "Translation review"). Read from the original. | `flagged`. Any other value → `flagged`, and report it. |
| `title` | text | The post's title. | The note's H1 if it opens the body, else the filename without the `✅` prefix. |
| `summary` | text | The post's summary. | Claude writes one. |
| `lang` | text: `en`, `ja` | The note's language. | Detected from the body; after-publish writes it. |
| `sitePath` | text | The post's path in the repo, e.g. `app/writings/posts/strobe-assistant/<slug>.mdx`. Set it to choose the folder or slug. | The publish stage chooses one; after-publish writes it. |

Written by the pipeline only:

| Property | Type | Meaning | If missing |
| --- | --- | --- | --- |
| `translation` | wikilink | On an original: its translation note. | No translation note yet. |
| `translationOf` | wikilink | On a translation note: its original. Marks the note as a translation, which is never translated itself. | The note is an original. |
| `translated` | checkbox | On an original: its translation is published. | false |
| `reviewFocus` | list | On a translation note: the spots the author should check. | Nothing flagged. |

The vault's `status` drives this pipeline only. Never copy it into a post (case studies have their own site `status` field; it comes from `note`).

## Finding work

Run `bash .claude/skills/publish-pipeline/queue.sh`. It reads frontmatter only and prints one TSV line per note that needs something, in the order to handle them: `action  scheduledAt  path  detail`. Read only the notes you act on, and don't search the vault for work any other way. Plain `grep` finds nothing in the vault (its .gitignore is `*`); use the script or `command grep`. `--all` also lists notes scheduled for later (`scheduled`) and notes with nothing to do (`idle`).

| action | Meaning | Do |
| --- | --- | --- |
| `finish` | Published, but not renamed with `✅`: an after-publish stopped part-way. | after-publish |
| `publish-translation` | A translation note set to Ready, by the author after review or by the translate stage. | publish → after-publish |
| `publish` | A Ready original whose `scheduledAt` has come. | publish → after-publish → translate if `requireTranslate` → if the translation came out Ready: publish → after-publish |
| `translate` | A Published original with `requireTranslate: true` and no translation note yet. | translate → if Ready: publish → after-publish |
| `review` | A translation waiting for the author. | Nothing; list it in the report. |
| `invalid` | Malformed frontmatter; `detail` says what. | Nothing; report it. |

## Runs

- **Scheduled run** (no arguments, nobody to ask):
  1. Do every `finish` line, then every `publish-translation` line.
  2. Take the first `publish` line through the whole pipeline. One original per run.
  3. If there was no `publish` line to do, take the first `translate` line instead.
  4. If an item is blocked (unfinished draft, PII you're unsure about, a file conflict, a build failure you can't attribute to the post), leave it untouched, report why, and move to the next line of the same action.
  5. Nothing to do → end without changes or a report.
- **Manual run, no arguments**: the same, but ask instead of skipping when something is blocked or unclear. If there's nothing to do, say so.
- **Manual run with note path(s)**: run each note's next action from the table, whatever its place in the queue. A future `scheduledAt` → ask whether to publish now (then the publish date is today unless `publishedAt` is set) or wait. No paths and nothing in the queue → ask for a path.

A failed stage stops that note's pipeline there; earlier stages stay done (if translation fails, the original stays live). Never undo a merged publish. The frontmatter records progress, so the next run picks the note up at the first unfinished stage.

## Translation review

The translate stage reviews its own translation and records in `reviewFocus` only the spots that need a human: where it had to interpret, or where it can't be sure the meaning or terminology is right. The original's `reviewTranslation` then sets the translation's status:

- `flagged` (default): Review if `reviewFocus` has anything, Ready otherwise. A clean translation publishes in the same run; the author only checks the flagged ones.
- `always`: always Review.
- `never`: always Ready. `reviewFocus` is still recorded, for reading later.

The author reviews in Obsidian: open the note from the board's Review column, check the `reviewFocus` spots, edit the body if needed, and set `status` to Ready. To have Claude revise it instead, write the instructions in the translation note's `note` and set it to Ready; the publish stage applies them. To start over, delete the translation note and clear `translation` on the original.

## Rules for every stage

- Vault writes are limited to what the stage files list: the properties above, `✅ ` renames and new translation notes. Never edit a note's body, except the translation note you're creating. Change nothing else in the vault.
- The vault is outside the repo; never commit anything from it.
- Repo changes happen only in the publish stage, one branch per published note. See `stages/publish.md`.
- Run from Claude Code on the Mac. The Cowork VM can't push via SSH or clear git lock files.

## Report

For each note handled: the actions done; the vault path → site path; the publish date; non-trivial edits and PII replacements; for translations, the status (with the `reviewFocus` items if Review); and the vault properties written. Then: items skipped or blocked and why, translations waiting for review, and invalid notes.
