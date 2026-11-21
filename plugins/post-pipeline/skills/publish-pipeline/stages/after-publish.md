# Stage: after-publish

Record a post in its vault note, in two parts (SKILL.md, "Staged, then live"):

- **Record**: after every publish stage (the post is now on main, staged or live), and alone for a `finish` line (a Published note missing pipeline properties).
- **Go live**: once the post's date has come. Right after Record when that's today or earlier, or alone for a `live` line (a staged note whose date has since come: the cloud has made it live).

It writes the note's frontmatter and, after a publish, its body from the working copy (SKILL.md, "Note and post stay in sync"); never a rename. Every step checks first and skips what's already right, so running it twice is harmless. "Today" is `TZ=Australia/Brisbane date +%F`.

## Record

1. Find the post. After a publish, it's the post just merged. For `finish`, use `sitePath` if set; otherwise search both locale trees without opening posts: by the slug derived from the note's `title` or name (without a `✅` prefix) with `find app/writings -name '<slug>.mdx'`, then by title with `command grep -rl '^title: "<title>"' app/writings`. A placeholder (`placeholder: true`) is never the note's post. No match, or several equally likely → blocked; never republish to fill a gap.
2. After a publish (not for a `finish` line): `bash $P/sync.sh apply <note>`. `synced` or `same` → go on (as does `none` when this stage already synced the note earlier in the run). `conflict`, or `none` because an earlier run merged its PR but stopped before syncing → go on too, and report under "Check": `<note>: body not synced with the post` (with the working copy's path for a conflict).
3. Set on the note, in one edit:
   - `sitePath`: the post's repo path (a list if the note was published as several posts)
   - `lang`: the post's locale
   - `series`: the post's folder, if it's in one
   - `project`: the post's `project`, if it has one; otherwise remove `project` from the note (a series post has none)
   - for a `finish` line only: `publishedAt`: the post's `publishedAt` (the first post's, for a list)

   When `series` or `project` is now a property, remove the matching item (e.g. `project: Strobe`) from `note`, and remove `note` if nothing is left. Leave `status` (Ready until it goes live) and an author-set `publishedAt` as they are.
4. **File the note** where the vault mirrors the site (`Posts/`, see the vault's `Vault Guide.md`), unless it's already there: a series post's note goes to `Posts/Series/<the folder's EN title in app/data/series.json>/`, a project post's to `Posts/Projects/<project ID>/`, any other to `Posts/Standalone/`; a translation goes next to its original. Create the folder if it's missing and move the note with `mv` under its current name (never rename it; wikilinks find it by name). Images embedded as `assets/...` resolve from the vault root, so nothing else moves.
5. After a publish: set `stagedHash` to the first column of `bash $P/sync.sh hash <note>`, as the last edit of this part (the hash covers the properties above). After a `conflict` in step 2, set `stagedHash: stale` instead, so the next run restages the author's edit.
6. Next, unless this was a `finish` line: the post's `publishedAt` is today or earlier → **Go live** now. Otherwise the post is staged: an original with `requireTranslate: true` and no translation note → `stages/translate.md` now, even when the request only said "publish"; anything else → done until its date.

## Go live

1. Check the post at `sitePath` (`fm.sh`): not a placeholder, and its `publishedAt` is today or earlier. Otherwise → blocked: note and post disagree; report it (a restage will fix it).
2. A translation note: set `translated: true` on its original (follow `translationOf`).
3. Set on the note, in one edit, with `status` last:
   - `publishedAt`: the post's `publishedAt` (the first post's, for a list)
   - remove `stagedHash`
   - `status`: Published
4. Next, in the same run: an original with `requireTranslate: true` and no translation note → `stages/translate.md` now. A translation note that's also `live` in the queue → go live with it in this run too. Otherwise → done.
