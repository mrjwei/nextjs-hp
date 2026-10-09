#!/usr/bin/env bash
# Baselines: a copy of each note's content (title, summary and body) as it was when its post was last deployed.
# Updates diff the note against it, so only what the author changed is applied to the post; the publish stage's
# edits to the post (proofreading, PII removal, note instructions) survive. Baselines live outside Obsidian's view,
# in the vault's .pipeline/baselines/, keyed by the note's (first) sitePath, so renaming a note doesn't lose its baseline.
#
# Usage (each <note> is a path or wikilink target, as for fm.sh; vault: $VAULT, default ~/projects/Notes):
#   baseline.sh save <note>...   write the note's current content as its baseline (the note must have sitePath)
#   baseline.sh diff <note>...   per note: "== <note>" then a unified diff, "(unchanged)" or "(no baseline)"
set -u
VAULT="${VAULT:-$HOME/projects/Notes}"
DIR="$VAULT/.pipeline/baselines"
cmd="${1:-}"; shift || true

resolve() {
  local name="${1#\[\[}"; name="${name%\]\]}"; name="${name%%|*}"; name="${name%%#*}"
  if [ -f "$name" ]; then printf '%s' "$name"; return; fi
  if [ -f "$VAULT/$name" ]; then printf '%s' "$VAULT/$name"; return; fi
  find "$VAULT" -path "$VAULT/.trash" -prune -o -path "$VAULT/.obsidian" -prune -o -path "$VAULT/.pipeline" -prune \
    -o -type f -name "$(basename "$name" .md).md" -print | head -n 2
}
# The note's content as baselined: its title and summary properties, then the body.
content() {
  awk 'NR == 1 && $0 == "---" { fm = 1; next }
       fm && $0 == "---" { fm = 0; print "---"; next }
       fm { if ($0 ~ /^(title|summary):/) print; next }
       { print }' "$1"
}
# Baseline path for a note: from its first sitePath, without app/writings/ and .mdx.
key() {
  local site
  site="$(awk 'NR == 1 { if ($0 != "---") exit; next } $0 == "---" { exit }
    /^sitePath:/ { v = $0; sub(/^sitePath:[ \t]*/, "", v); if (v != "") { print v; exit } list = 1; next }
    list && /^[ \t]*-[ \t]/ { v = $0; sub(/^[ \t]*-[ \t]*/, "", v); print v; exit }
    /^[^ \t]/ { list = 0 }' "$1" | tr -d "\"'")"
  [ -n "$site" ] || return 1
  site="${site#app/writings/}"; printf '%s/%s.md' "$DIR" "${site%.mdx}"
}

for arg in "$@"; do
  file="$(resolve "$arg")"
  if [ -z "$file" ] || [ "$(printf '%s\n' "$file" | wc -l)" -gt 1 ]; then echo "== $arg: not found or ambiguous"; continue; fi
  rel="${file#"$VAULT"/}"
  if ! base="$(key "$file")"; then echo "== $rel: no sitePath"; continue; fi
  case "$cmd" in
    save) mkdir -p "$(dirname "$base")"; content "$file" > "$base"; echo "== $rel: saved" ;;
    diff)
      echo "== $rel"
      if [ ! -f "$base" ]; then echo "(no baseline)"; continue; fi
      content "$file" | diff -U3 --label baseline --label current "$base" - || true
      content "$file" | cmp -s "$base" - && echo "(unchanged)" ;;
    *) echo "usage: baseline.sh save|diff <note>..." >&2; exit 2 ;;
  esac
done
