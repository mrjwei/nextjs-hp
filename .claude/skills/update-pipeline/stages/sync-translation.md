# Stage: sync-translation

Carry an updated original's edit into its translation note, so the translation goes through the same update flow. Runs right after the original's commit. It writes the vault only; the translation's post is changed when the translation itself is updated, later in the same run.

## 1. When

- The original has `translation` (follow each wikilink with `fm.sh`), and its `updateNote` doesn't say `no sync`.
- The translation's status is Published, Updated, Review or Ready. Drafting → skip.
- A translation that's Published and has no baseline (`baseline.sh diff`) → `bash $P/baseline.sh save <translation>` before editing it, so this sync is exactly what its diff will show.

## 2. Translate the changes

- Source: `git diff main -- <original's post>`, the edit as published (proofread, PII removed). Never translate from the original note.
- Skip changes with no counterpart in the other language (spelling, punctuation, a fix to the English idiom) and changes the translation already reflects (the author may have edited it too).
- For the rest: find the matching passage in the translation note (`command grep -n -F` a heading or a nearby phrase, then Read that window) and write the change in the note's style and terminology, as in `.claude/skills/publish-pipeline/stages/translate.md` steps 2–3 (Obsidian Markdown, image embeds with translated alt text). A changed `title` or `summary` → translate it into the note's property.
- A changed `project` → set the same on the translation note.

## 3. Review and status

- Self-review the changed passages as in translate.md step 4. Replace `reviewFocus` with the spots that need a human (remove the property if none).
- Set `updateNote` to the original's date instruction (`updatedAt: <the date the original's post got>`, or `minor`), keeping any other instruction the author wrote there.
- Status, from the original's `reviewTranslation`: a Published or Updated translation → `flagged`: Review if `reviewFocus` has anything, else Updated; `always` → Review; `never` → Updated. Review or Ready → unchanged (Ready will publish with the change).
- Updated → it's an `update-translation` in this run. Review → report it; the author sets it to Updated once checked, and the next run deploys it.
