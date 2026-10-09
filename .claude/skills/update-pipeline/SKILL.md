---
name: update-pipeline
description: Deploy the author's edits to already-published posts from the Obsidian vault (~/projects/Notes) — notes set to Updated, in either language — carrying each change into the translation, then build, merge and push in one batch. No arguments → work the queue; or pass note path(s).
---

# update-pipeline

The companion of `publish-pipeline` (read its SKILL.md only if you need a term defined there). The vault note stays the single source of truth: the author edits a published note in Obsidian and sets its `status` to `Updated`; this skill applies the edit to the post, carries it into the translation, deploys, and sets the note back to `Published`. The kanban in `Posts.base` has an Updated column between Ready and Published.

Scripts are shared: `P=.claude/skills/publish-pipeline` (`queue.sh`, `fm.sh`, `baseline.sh`, `links.mjs`).

## How an update is found

A post is not the note's text: publishing proofreads it, removes PII and applies `note` instructions. So an update never regenerates the post. It applies only what the author changed since the last deploy: `bash $P/baseline.sh diff <note>...` diffs the note (title, summary, body) against its **baseline**, the copy saved when the note was last deployed. Notes published before baselines existed have none; their first update falls back to comparing note and post (see `stages/update.md`).

## Frontmatter

Set by the author (besides editing the note):

| Property | Meaning |
| --- | --- |
| `status` | `Updated`: deploy my edits. A deployed note set to `Ready` by mistake is treated the same when it has a baseline. |
| `updateNote` | Optional, `;`-separated, for this update only (removed after deploying): `minor` (fixes not worth a date: the post's "Updated" date stays as it is), `updatedAt: YYYY-MM-DD` (date to show; default today), `no sync` (don't carry the edit into the translation), anything else = an editing request for this update. |
| `project`, `series`, `title`, `summary` | Changes are applied to the post. A `series` change moves the post (new URL): manual runs only. |

The old `note` property is never re-applied: its instructions were applied when the post was first published.

Written by this skill: `updatedAt` (the post's "Updated" date), `status` back to Published, and on a synced translation `updateNote`, `reviewFocus` (replaced with the spots this sync needs checked, removed if none) and its body. Baselines are written to the vault's `.pipeline/baselines/` (hidden from Obsidian; never committed).

## Finding work

```bash
bash .claude/skills/publish-pipeline/queue.sh | awk -F'\t' '$1 ~ /^(update|update-translation|invalid)$/'
```

`update` = an original, `update-translation` = a translation note. `invalid` lines: report them (other lines belong to `/publish-pipeline`).

## Runs

- **No arguments** (scheduled or one-click routine, nobody to ask): every `update` line, then every `update-translation` line, including translations that this run's syncs set to Updated. A blocked note stays as it is; report it and go on. Nothing to do → end with no changes and no report.
- **Manual run, no arguments**: the same, but ask instead of skipping when blocked or unsure. Nothing to do → say so.
- **Manual run with note path(s)**: those notes, whatever their status, if they have a post and differ from their baseline.

All notes of a run share one branch and one build: follow `stages/update.md`. Read `stages/sync-translation.md` only when an updated original has a `translation`.

## Keep runs cheap

- Never read a whole note or post when a baseline exists: the diff says what changed; find each spot with `command grep -n -F` and read only that window (Read with offset/limit).
- `fm.sh` for frontmatter. Several notes per `fm.sh` / `baseline.sh` call.
- One build per run, filtered as in `publish-pipeline/stages/publish.md` step 7. Don't re-read a file after editing it; `git -q` where it exists.

## Rules

- Vault writes: the properties above, a synced translation note's body, images copied into `assets/`, and baselines. Never edit an original note's body, never rename or move a note.
- Never commit anything from the vault, baselines included.
- Run from Claude Code on the Mac (the vault is local, and pushing needs its SSH key).

## Report

Only what the author needs to see or act on, one line per item, empty sections left out.

```
Updated
- <title> (en) → /posts/<folder>/<slug>, updated <date> (or: minor)
- <title> (ja) → /ja/posts/<folder>/<slug>, synced from the original
Needs you
- Review: <translation note>: "<quote>" (reason); … → set it to Updated when done
- Blocked: <note>: <why>
- Invalid: <note>: <detail>
- Check: <a change skipped because its passage was cut when publishing, PII replaced, a first update without a baseline (what was applied), a new tag or placeholder, …>
```
