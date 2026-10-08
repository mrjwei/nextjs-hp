# Stage: after-publish

Update the vault once a note's post is on main and pushed. It also runs alone for a `finish` line. Every step checks first and skips what's already done, so running it twice is harmless. Leave the body alone.

1. Set on the published note:
   - `status`: Published
   - `publishedAt`: the date the post carries
   - `sitePath`: the post's repo path
   - `lang`: if it was missing
2. A translation note: set `translated: true` on its original (follow `translationOf`).
3. Rename the note with a `✅ ` prefix (skip if the name already starts with `✅`). Do this last: the prefix is how `queue.sh` knows this stage finished. Before renaming, point the counterpart's link at the new name: the original's `translation` for a translation note, or the translation note's `translationOf` for an original that already has one. Obsidian only rewrites links on renames made inside Obsidian.
4. Check for other notes linking to the old name (`command grep -rlF "[[<old name>" ~/projects/Notes`) and list them in the report. Don't edit them.
