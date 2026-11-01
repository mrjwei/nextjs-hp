#!/usr/bin/env bash
# Keep a vault note's body in sync with its published post, through a working copy.
# The pipeline never edits a note directly while publishing or updating: it edits the working copy, converts the post
# from it, and only once its pull request is merged writes the copy's body back into the note.
#
#   copy <note>...    Make a fresh working copy of each note (and a snapshot of it as read).
#                     Prints: copy <working copy> <note>   (edit the working copy, never the note)
#   apply <note>...   Replace each note's body with its working copy's body, keeping the note's current frontmatter.
#                     Prints one line per note:
#                       synced <note>              body written back
#                       same <note>                nothing to write (the copy's body is the note's)
#                       none <note>                no working copy (e.g. an earlier run stopped after its PR was merged)
#                       conflict <note> <copy>     the note's body changed since `copy` (the author edited it): left as it is
#                     The working copy is removed after synced/same, and kept for a conflict.
#
# A note is a path (absolute, or relative to the vault) or a wikilink target, as for fm.sh.
# Usage: sync.sh copy|apply <note>... (vault: $VAULT, default ~/projects/Notes)
set -u
VAULT="${VAULT:-$HOME/projects/Notes}"
DIR="${PIPELINE_SYNC_DIR:-/tmp/publish-pipeline-notes}"
cmd="${1:-}"; shift || true
if [ "$cmd" != copy ] && [ "$cmd" != apply ] || [ $# -eq 0 ]; then
  echo "usage: sync.sh copy|apply <note>..." >&2; exit 2
fi
mkdir -p "$DIR"

resolve() {  # → absolute path of the note, or nothing
  local name="${1#\[\[}"; name="${name%\]\]}"; name="${name%%|*}"; name="${name%%#*}"
  if [ -f "$name" ]; then (cd "$(dirname "$name")" && printf '%s/%s\n' "$PWD" "$(basename "$name")"); return; fi
  if [ -f "$VAULT/$name" ]; then printf '%s\n' "$VAULT/$name"; return; fi
  local base matches
  base="$(basename "$name" .md).md"
  matches="$(find "$VAULT" -path "$VAULT/.trash" -prune -o -path "$VAULT/.obsidian" -prune -o -type f -name "$base" -print)"
  [ "$(printf '%s' "$matches" | command grep -c .)" -eq 1 ] && printf '%s\n' "$matches"
}
fmend() {    # line number of the frontmatter's closing ---, or 0 when there is none
  awk 'NR == 1 { if ($0 != "---") exit; next } $0 == "---" { print NR; exit }' "$1"
}
body() { local n; n="$(fmend "$1")"; tail -n +"$(( ${n:-0} + 1 ))" "$1"; }

for arg in "$@"; do
  note="$(resolve "$arg")"
  if [ -z "$note" ]; then echo "error	$arg: not found, or several notes with that name" >&2; continue; fi
  rel="${note#"$VAULT"/}"
  key="$(printf '%s' "$rel" | sed 's|/|__|g')"
  copy="$DIR/$key"; orig="$DIR/$key.orig"
  if [ "$cmd" = copy ]; then
    cp "$note" "$copy" && cp "$note" "$orig" && printf 'copy\t%s\t%s\n' "$copy" "$rel"
    continue
  fi
  if [ ! -f "$copy" ] || [ ! -f "$orig" ]; then printf 'none\t%s\n' "$rel"; continue; fi
  if ! cmp -s <(body "$note") <(body "$orig"); then printf 'conflict\t%s\t%s\n' "$rel" "$copy"; continue; fi
  if cmp -s <(body "$note") <(body "$copy"); then rm -f "$copy" "$orig"; printf 'same\t%s\n' "$rel"; continue; fi
  tmp="$DIR/$key.new"
  { n="$(fmend "$note")"; [ "${n:-0}" -gt 0 ] && head -n "$n" "$note"; body "$copy"; } > "$tmp"
  # cat > keeps the note's inode, so Obsidian sees an edit, not a new file.
  cat "$tmp" > "$note" && rm -f "$tmp" "$copy" "$orig" && printf 'synced\t%s\n' "$rel"
done
