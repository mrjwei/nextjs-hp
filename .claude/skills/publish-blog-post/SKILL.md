---
name: publish-blog-post
description: Publish a finished Obsidian draft from ~/projects/Notes as a post on this site. No arguments → the Ready note with the oldest scheduledAt; or pass draft path(s).
---

# publish-blog-post

Decisions
- Drafts vault: ~/projects/Notes (Obsidian, attachments in /assets). The queue is the notes' own frontmatter (shown as a kanban in ~/projects/Notes/Posts.base; don't read the .base file).
- Frontmatter this skill reads; ignore every other property (`requireTranslate`, `translated` etc. belong to the translate skill and never affect publishing):
  - `status`: Drafting | Ready | Published. An Obsidian list property (`status:` then `  - Ready`).
  - `scheduledAt`: YYYY-MM-DD. Orders Ready notes, oldest first. A note without it goes last.
  - `note`: instructions/extra content for Claude that must be checked and applied when publishing (e.g. `project: Strobe; add placeholder pages for referenced pages that do not exist yet`). Several items are separated by ";".
- Finding the next draft: run `bash .claude/skills/publish-blog-post/list-posts.sh` (prints one TSV line per Ready note, oldest first: `scheduledAt  path  note  …`; reads frontmatter only). Read only the first note in full. Don't search or read other vault notes to find drafts. Plain `grep` finds nothing in the vault (its .gitignore is `*`); use the script or `command grep`.
- Manual run: path argument(s) → publish those; no args → the first Ready note; none Ready → ask for a path.
- Scheduled run: publish the first Ready note only (one per run). If it's blocked (unfinished, or PII you're unsure about), leave it untouched, report why, and move to the next line. Nothing Ready → end silently without changes.
- Editing: proofread + light refine, UK/AU English, all non-trivial edits listed in report.
- End state: branch post/<slug> → content index + MDX compile + npm run build → merge --no-ff to main → push. Restore public/search-index.json (Vercel regenerates it).
- Check and obfuscate any PII in the draft content (e.g., company names, real person names, email addresses, phone numbers, URLs, etc.) before publishing. If any PII is found, replace it with a placeholder or remove it. When unsure, ask for guidance. The goal is to avoid publishing any sensitive information that could identify individuals or organizations.
- The draft's body is never modified. After publishing, auto-rename the published draft with a `✅ ` prefix and change its `status` property to Published; change nothing else in the vault.
- Schedule from Claude Code on the Mac (Cowork VM can't push via SSH and can't clear git lock files).
