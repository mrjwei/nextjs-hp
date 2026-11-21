---
name: run-board
description: Work the whole blog Posts board (Posts.base in the Obsidian vault ~/projects/Notes) in one go — finalise drafts in Stage, stage Ready posts and their translations, record posts that went live, and deploy notes in Updated — running only the skills whose lanes have work. Use for "run the posts board", "process my posts", "run the blog pipeline", or the scheduled posts run. No arguments.
---

# run-board

`Posts.base` is a kanban of the vault's post notes grouped by `status`: **Drafting → Stage → Review → Ready → Updated → Published**. This skill reads the lanes and runs this plugin's other skills where there's work, in this order:

| Lane (queue action) | Skill | Does |
| --- | --- | --- |
| Stage (`finalise`) | `post-pipeline:finalise-post-draft` | Proofreads, fact-checks and fleshes out each draft, then sets it to Ready (or leaves it in Stage and says why) |
| Ready, and Published notes with work left (`publish`, `publish-translation`, `live`, `finish`, `translate`) | `post-pipeline:publish-pipeline` | Stages Ready notes on main through PRs (they go live on their date via the Vercel deploy hook), records posts that went live, writes and stages translations |
| Updated (`update`) | `post-pipeline:update-pipeline` | Deploys edits to published posts in one PR and sets the notes back to Published |
| Review (`review`) | none | Translations waiting for Jesse: report them |
| `invalid` | none | Report each once |

Drafting, `scheduled` (staged, not live yet) and idle Published notes need nothing.

## Setup

- Work in the site repo: `cd ~/projects/nextjs-hp` (each Bash call starts there or needs the `cd`).
- `Q=${CLAUDE_SKILL_DIR}/../publish-pipeline/queue.sh` reads the notes' frontmatter (the same thing the board shows) and prints `action  scheduledAt  path  detail` per note with work. Write the expanded path in each command. Never read `Posts.base` itself or search the vault another way.
- `gh auth status`. Not signed in → finalise can still run; publish and update are blocked (report it).

## Run

1. `bash $Q`. Nothing printed → end: no changes, and no report on an unattended run (a manual run says "Nothing on the board to do").
2. Any `finalise` line → run `post-pipeline:finalise-post-draft` with no arguments.
3. `bash $Q` again (finalise has just moved notes to Ready). Any `publish`, `publish-translation`, `live`, `finish` or `translate` line → run `post-pipeline:publish-pipeline` with no arguments.
4. `bash $Q` again. Any `update` line → run `post-pipeline:update-pipeline` with no arguments.
5. Report (below).

Each skill keeps its own rules. **Unattended** (a scheduled task, nobody to answer): every skill follows its "Scheduled run" rules, so a blocked note is skipped and reported, never asked about. **Manual**: their manual rules (ask when blocked). A skill that fails stops only itself: go on to the next lane and report the failure.

Don't redo a skill's work here: don't edit notes, posts or frontmatter yourself, and don't call a skill for a lane with nothing in it.

## Report

One report for the whole run. Under a heading per skill that ran (`Finalised`, `Published`, `Updated`), the essentials of that skill's own report, then one combined `Needs you` section: Review translations, blocked or invalid notes, drafts left in Stage and why, `Check` items. Leave out empty sections and skills that didn't run. For every note finalise set Ready and publish then staged, give its title, its URL and the day it goes live, since it went out without Jesse reading it first; and remind him that `git diff` in the vault shows finalise's edits.
