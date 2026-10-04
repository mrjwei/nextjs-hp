# publish-blog-post skill (2026-10-04)

Replaces the repo-local `/publish-post` skill in ~/projects/nextjs-hp (to be removed by Jesse).

Decisions
- Drafts vault: ~/projects/Notes (Obsidian, attachments in /assets). Queue note: ~/projects/Notes/Publish Queue.md (checklist, top = next, `📅 YYYY-MM-DD` = not before, `## Log` section).
- Manual run: path argument(s); no args → pick from queue, else ask for a path.
- Scheduled run: publishes the first due, ready entry only (one per run); blocked entries get a ⚠️ reason on their line; nothing due → skip silently.
- Editing: proofread + light refine, UK/AU English, all non-trivial edits listed in report.
- End state: branch post/<slug> → content index + MDX compile + npm run build → merge --no-ff to main → push. Restore public/search-index.json (Vercel regenerates it).
- Treat text after the draft title in the queue note as notes/instructions for Claude that must be checked. These are separated by "|".
- Translation labels: ignore "require translation", "translated" and any other translation-related text in the notes/instructions of queue entries. They belong to the translate skill; they never affect readiness, ordering or blocking, and are left untouched when the queue note is written.
- Check and obfuscate any PII in the draft content (e.g., company names, real person names,email addresses, phone numbers, URLs, etc.) before publishing. If any PII is found, replace it with a placeholder or remove it. When unsure, ask for guidance. The goal is to avoid publishing any sensitive information that could identify individuals or organizations.
- Drafts are never modified; only the queue note is written.
- Schedule from Claude Code on the Mac (Cowork VM can't push via SSH and can't clear git lock files).
- Auto-rename published drafts with ✅ prefix and remove the "draft" tag (if present). Update docs/publish.md when old skill is removed.

Status: proposed for saving; evals skipped by request after iteration 1 (27/28 with skill vs 18/28 baseline).
