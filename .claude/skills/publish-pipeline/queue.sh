#!/usr/bin/env bash
# List the publishing pipeline's vault notes (notes with a `status` property) and the next action for each.
# Reads frontmatter only, so it stays cheap as the vault grows.
#
# Output, one TSV line per note, in the order to work on them:
#   action  scheduledAt  path  detail
# action:   finish | publish-translation | publish | translate | review | invalid   (default)
#           scheduled | idle                                                         (--all only)
# detail:   the problem for `invalid`, otherwise the note's `note` property.
# A missing scheduledAt prints as "~" and sorts last within its action.
#
# Usage: queue.sh [--all] [vault]
set -u
ALL=0
if [ "${1:-}" = "--all" ]; then ALL=1; shift; fi
VAULT="${1:-$HOME/projects/Notes}"
TODAY="$(date +%F)"

# `command grep` bypasses the shell's grep wrapper, which honours the vault's .gitignore (`*`) and finds nothing.
command grep -rl --null --include='*.md' --exclude-dir=.trash --exclude-dir=.obsidian -E '^status:' "$VAULT" 2>/dev/null \
| xargs -0 awk -v today="$TODAY" -v all="$ALL" '
  function unq(s) { gsub(/^[ \t"\047]+|[ \t"\047]+$/, "", s); return s }
  function isdate(s) { return s ~ /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/ }
  function emit(action, detail,   pri, base) {
    pri = (action == "finish") ? 1 : (action == "publish-translation") ? 2 : (action == "publish") ? 3 : \
          (action == "translate") ? 4 : (action == "review") ? 5 : (action == "invalid") ? 6 : \
          (action == "scheduled") ? 7 : 8
    if (pri >= 7 && !all) return
    printf "%d\t%s\t%s\t%s\t%s\n", pri, action, (sched == "" ? "~" : sched), FILENAME, detail
  }
  function decide(   n, base) {
    n = split(st, parts, ",")
    if (st == "") { emit("idle", note); return }
    if (n != 1) { emit("invalid", "status must have exactly one value (has: " st ")"); return }
    if (sched != "" && !isdate(sched)) { emit("invalid", "scheduledAt is not YYYY-MM-DD: " sched); return }
    if (pub != "" && !isdate(pub)) { emit("invalid", "publishedAt is not YYYY-MM-DD: " pub); return }
    base = FILENAME; sub(/.*\//, "", base)
    if (st == "Drafting") { emit("idle", note); return }
    if (st == "Review") { emit("review", note); return }
    if (st == "Ready") {
      if (sched != "" && sched > today) { emit("scheduled", note); return }
      emit(tof != "" ? "publish-translation" : "publish", note); return
    }
    if (st == "Published") {
      if (base !~ /^✅/) { emit("finish", note); return }
      if (tof == "" && rt == "true" && tr != "true" && tlink == "") { emit("translate", note); return }
      emit("idle", note); return
    }
    emit("invalid", "unknown status: " st)
  }
  FNR == 1 {
    fm = ($0 == "---"); key = ""; st = ""; sched = ""; pub = ""; note = ""; rt = ""; tr = ""; tlink = ""; tof = ""
    if (!fm) nextfile
    next
  }
  $0 == "---" { decide(); nextfile }
  /^[ \t]*-[ \t]/ {
    if (key == "status") { v = $0; sub(/^[ \t]*-[ \t]*/, "", v); v = unq(v); if (v != "") st = (st == "" ? v : st "," v) }
    next
  }
  /^[^ \t#][^:]*:/ {
    key = $0; sub(/:.*/, "", key)
    val = $0; sub(/^[^:]*:[ \t]*/, "", val)
    if (key == "status") { gsub(/[][]/, "", val); gsub(/[ \t]*,[ \t]*/, ",", val); st = unq(val) }
    else if (key == "scheduledAt") sched = unq(val)
    else if (key == "publishedAt") pub = unq(val)
    else if (key == "note") note = unq(val)
    else if (key == "requireTranslate") rt = unq(val)
    else if (key == "translated") tr = unq(val)
    else if (key == "translation") tlink = unq(val)
    else if (key == "translationOf") tof = unq(val)
  }
' | LC_ALL=C sort -t "$(printf '\t')" -k1,1n -k3,3 -k4,4 | cut -f2-
