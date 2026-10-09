# Stage: update

Apply every queued note's edits to its post on one branch, build once, merge, push, then record each note. `P=.claude/skills/publish-pipeline`.

## 1. Plan

- `bash $P/fm.sh <notes>...` and `bash $P/baseline.sh diff <notes>...`, then `bash $P/fm.sh <each sitePath>...` for the posts.
- Per note:
  - No post at `sitePath`, or the post is a `placeholder: true` stand-in → blocked: never published; tell the author to set it to Ready.
  - `(unchanged)`, and `updateNote`, `project` and `series` ask for nothing → nothing to deploy: go straight to step 4 (status only, no date) and report "no changes found".
  - `(no baseline)` → step 2 with the fallback.
- Branch from an up-to-date main: `update/<YYYY-MM-DD-HHMM>`. Delete leftover unmerged `update/*` branches first (`git branch --no-merged main --list 'update/*'`): a failed run left them, and the vault still holds everything they had.

## 2. Apply each note (originals first)

For each diff hunk, in the post (and in every post of a note with several `sitePath`s, routed by content):

- Find the passage: `command grep -n -F '<a distinctive phrase>' <post>` from the hunk's context or removed lines, then Read just that window. The post's wording may differ from the baseline's (publish edits it): match by meaning.
- Rewrite only that passage so the post says what the note now says, converted as in `$P/stages/publish.md` step 3 (images copied into the post's existing `public/<folder>/`, MDX figure, callouts, escapes) and edited as in step 5 (light proofreading in UK/AU English or natural Japanese, PII removed) — applied to the new text only. Read those steps only when a hunk has an image, a callout or a link to another post.
- New links to other posts: as in publish.md step 4 (placeholders included).
- A heading added, renamed or removed → update the table of contents.
- `title:` / `summary:` lines in the diff → the post's frontmatter.
- A hunk whose passage isn't in the post (cut when it was published) → skip it and list it under "Check".

No baseline (fallback): read the note and the post in full. Differences that publishing explains (proofreading, PII removal, TOC, MDX wrappers, the `note` instructions) stay as the post has them; apply the rest as above, and list what you applied under "Check".

Then, in the post's frontmatter:

- `updatedAt: "YYYY-MM-DD"` after `publishedAt`: `updatedAt` from `updateNote`, else today. `minor` → leave it as it is.
- `project` from the note if it differs. A changed `series` moves the post: in a scheduled run → blocked. In a manual run, ask, then `git mv` both locales' posts (slug unchanged), add permanent redirects for both URLs in `next.config.js`, and update `series`/`sitePath` on both notes in step 4.
- Apply any other `updateNote` instruction.

Commit the note's changes: `update: <title> (<lang>)`. Then, for an original with a `translation`, run `stages/sync-translation.md`.

## 3. Build, merge, push

1. `node $P/links.mjs` must print nothing; fix lines as in publish.md step 7.2.
2. `npm run build > /tmp/update-pipeline-build.log 2>&1; echo $?`. Non-zero → `command grep -n -i -m 20 -B2 -A8 'error' /tmp/update-pipeline-build.log`. Fix what the updates caused. If one note's change can't be fixed, drop its commit (`git rebase -q --onto <c>^ <c>`, and its translation's, if synced in this run), mark it blocked and rebuild. A failure no update caused → all blocked: don't merge.
3. Restore `public/search-index.json`, merge `--no-ff` into main (message `Merge branch 'update/…'`), push. Go on only once the push has succeeded.

## 4. Record each deployed note

In one edit per note, `status` last:

- `updatedAt`: the post's `updatedAt`, if it has one.
- `sitePath`, `series`: only after a move.
- remove `updateNote`.
- `status`: Published.

Then `bash $P/baseline.sh save <notes>...` for every deployed note, including "no changes found" notes without a baseline.
