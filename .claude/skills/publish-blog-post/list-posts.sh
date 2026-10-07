#!/usr/bin/env bash
# List vault notes whose frontmatter `status` is $1 (default: Ready), oldest `scheduledAt` first.
# Reads frontmatter only, so it stays cheap as the vault grows.
# Output, one TSV line per note: scheduledAt  path  note  requireTranslate  translated
# (missing scheduledAt prints as "~" and sorts last).
#
# Usage: list-posts.sh [status] [vault]
set -u
STATUS="${1:-Ready}"
VAULT="${2:-$HOME/projects/Notes}"

# `command grep` bypasses the shell's grep wrapper, which honours the vault's .gitignore (`*`) and finds nothing.
command grep -rl --null --include='*.md' --exclude-dir=.trash --exclude-dir=.obsidian -E '^status:' "$VAULT" 2>/dev/null \
| xargs -0 awk -v want="$STATUS" '
  function unq(s) { gsub(/^[ \t"\047]+|[ \t"\047]+$/, "", s); return s }
  FNR == 1 {
    fm = ($0 == "---"); key = ""; st = ""; sched = ""; note = ""; rt = ""; tr = ""
    if (!fm) nextfile
    next
  }
  $0 == "---" {
    if (tolower(st) ~ ("(^|,)" tolower(want) "(,|$)"))
      printf "%s\t%s\t%s\t%s\t%s\n", (sched == "" ? "~" : sched), FILENAME, note, rt, tr
    nextfile
  }
  /^[ \t]+-/ {
    if (key == "status") { v = $0; sub(/^[ \t]+-[ \t]*/, "", v); st = st "," unq(v) }
    next
  }
  /^[^ \t#][^:]*:/ {
    key = $0; sub(/:.*/, "", key)
    val = $0; sub(/^[^:]*:[ \t]*/, "", val)
    if (key == "status") { gsub(/[][]/, "", val); gsub(/[ \t]*,[ \t]*/, ",", val); st = unq(val) }
    else if (key == "scheduledAt") sched = unq(val)
    else if (key == "note") note = unq(val)
    else if (key == "requireTranslate") rt = unq(val)
    else if (key == "translated") tr = unq(val)
  }
' | LC_ALL=C sort -t "$(printf '\t')" -k1,1
