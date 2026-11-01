#!/bin/sh
# Vercel "Ignored Build Step" (wired up in vercel.json as ignoreCommand).
# Exit 0 = skip the build (no deployment output is stored); exit 1 = build.
#
# Skips commits that change nothing the site is built from: Claude skills,
# GitHub workflows, docs/ plans and the repo's own Markdown files. Each
# skipped build saves a full copy of the site in Deployment Storage.

# Compare against the last deployed commit of this branch when Vercel gives
# us one we have locally, else against the previous commit.
base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$base" ] || ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  base="HEAD^"
fi
# No base to compare with (first commit, too-shallow clone): build.
git rev-parse -q --verify "${base}^{commit}" >/dev/null || exit 1

if git diff --quiet "$base" HEAD -- . \
  ':(exclude).claude' \
  ':(exclude).github' \
  ':(exclude)docs' \
  ':(exclude)README.md' \
  ':(exclude)CLAUDE.md'; then
  echo "Only non-site files changed since ${base}: skipping build."
  exit 0
fi

echo "Site files changed since ${base}: building."
exit 1
