# Stage: after-publish

Record a published post in its vault note. It runs after the publish stage has pushed, and alone for a `finish` line (a Published note missing pipeline properties). It writes frontmatter only: never the body, and never a rename. Every step checks first and skips what's already right, so running it twice is harmless.

1. Find the post. After a publish, it's the post just merged. For `finish`, use `sitePath` if set; otherwise find it in both locale trees by `title`, then by the slug derived from the note's name (without a `✅` prefix), then by `title:` in the posts' frontmatter. No match, or several equally likely → blocked; never republish to fill a gap.
2. A translation note: set `translated: true` on its original (follow `translationOf`).
3. Set on the note, in one edit, with `status` last:
   - `sitePath`: the post's repo path (a list if the note was published as several posts)
   - `publishedAt`: the post's `publishedAt` (the first post's, for a list)
   - `lang`: the post's locale
   - `series`: the post's folder, if it's in one
   - `project`: the post's `project`, if it has one
   - `status`: Published

   When `series` or `project` is now a property, remove the matching item (e.g. `project: Strobe`) from `note`, and remove `note` if nothing is left.
