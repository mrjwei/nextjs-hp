---
name: translate
description: Translate one or more specified articles and/or portfolio entries.
---

# Translate

Translate one or more articles and/or portfolio entries to the specified language and move them into the appropriate location within the site's content structure.

**Usage:** `/translate [article ...] [target-language]`

`$ARGUMENTS` is zero or more articles and/or portfolio entries, given as a slug (filename without `.mdx`, e.g. `zod`), or a path relative to the repo root or an absolute path.

- **No arguments**: ask for clarification.
- **One or more arguments**: translate each named article or portfolio entry.
