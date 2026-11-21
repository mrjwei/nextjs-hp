#!/usr/bin/env bash
# List the publishing pipeline's vault notes (notes with a `status` property) and the next action for each.
# Reads frontmatter only, so it stays cheap as the vault grows.
#
# Output, one TSV line per note, in the order to work on them:
#   action  scheduledAt  path (relative to the vault)  detail
# action:   finalise                                                               (finalise-post-draft)
#           live | finish | publish-translation | publish | translate               (publish-pipeline)
#           update                                                                 (update-pipeline)
#           review | invalid                                                       (both)
#           scheduled | idle                                                       (--all only)
# detail:   the problem for `invalid`, otherwise the note's `note` property; `restage` (then `; note`) for a staged
#           Ready note edited since it was staged (its `stagedHash` no longer matches `sync.sh hash`).
# A Ready note is staged (its post is on main) whatever its date; it goes live on the site on its date by itself,
# and `live` then records that in the vault (after-publish).
# A missing scheduledAt prints as "~" and sorts last within its action.
#
# Usage: queue.sh [--all] [vault]
set -u
ALL=0
if [ "${1:-}" = "--all" ]; then ALL=1; shift; fi
VAULT="${1:-$HOME/projects/Notes}"
TODAY="$(TZ=Australia/Brisbane date +%F)"   # the site's day (scripts/site-date.mjs), wherever the Mac is
SYNC="$(cd "$(dirname "$0")" && pwd)/sync.sh"

# `command grep` bypasses the shell's grep wrapper, which honours the vault's .gitignore (`*`) and finds nothing.
command grep -rl --null --include='*.md' --exclude-dir=.trash --exclude-dir=.obsidian --exclude-dir=Templates -E '^status:' "$VAULT" 2>/dev/null \
| xargs -0 awk -v today="$TODAY" -v all="$ALL" -v vault="${VAULT%/}/" -v sync="$SYNC" '
  function unq(s) { gsub(/^[ \t"\047]+|[ \t"\047]+$/, "", s); return s }
  function isdate(s) { return s ~ /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/ }
  function q(s) { gsub(/\047/, "\047\\\047\047", s); return "\047" s "\047" }
  function hash(   cmd, line) {
    cmd = "bash " q(sync) " hash " q(FILENAME); line = ""
    cmd | getline line; close(cmd)
    sub(/\t.*/, "", line); return line
  }
  function emit(action, detail,   pri, rel) {
    pri = (action == "finalise") ? 0 : (action == "live" || action == "finish") ? 1 : (action == "publish-translation") ? 2 : (action == "publish") ? 3 : \
          (action == "translate") ? 4 : (action == "update") ? 5 : \
          (action == "review") ? 6 : (action == "invalid") ? 7 : (action == "scheduled") ? 8 : 9
    if (pri >= 8 && !all) return
    rel = FILENAME; if (index(rel, vault) == 1) rel = substr(rel, length(vault) + 1)
    printf "%d\t%s\t%s\t%s\t%s\n", pri, action, (sched == "" ? "~" : sched), rel, detail
  }
  function decide(   n) {
    n = split(st, parts, ",")
    if (st == "") { emit("idle", note); return }
    if (n != 1) { emit("invalid", "status must have exactly one value (has: " st ")"); return }
    if (sched != "" && !isdate(sched)) { emit("invalid", "scheduledAt is not YYYY-MM-DD: " sched); return }
    if (pub != "" && !isdate(pub)) { emit("invalid", "publishedAt is not YYYY-MM-DD: " pub); return }
    if (upd != "" && !isdate(upd)) { emit("invalid", "updatedAt is not YYYY-MM-DD: " upd); return }
    if (st == "Drafting") { emit("idle", note); return }
    if (st == "Stage") { emit("finalise", note); return }
    if (st == "Review") { emit("review", note); return }
    day = (pub != "" ? pub : sched)
    if (st == "Updated") {
      if (site == "") { emit("invalid", "status Updated but never published (no sitePath): set it to Ready"); return }
      if (day > today) { emit("invalid", "status Updated but its post isn\047t live until " day ": set it back to Ready (edits to a staged note are restaged)"); return }
      emit("update", note); return
    }
    if (st == "Ready") {
      pubaction = (tof != "" ? "publish-translation" : "publish")
      if (staged == "") { emit(pubaction, note); return }
      if (hash() != staged) { emit(pubaction, "restage" (note == "" ? "" : "; " note)); return }
      if (day == "" || day <= today) { emit("live", note); return }
      if (tof == "" && rt == "true" && tr != "true" && tlink == "") { emit("translate", note); return }
      emit("scheduled", note); return
    }
    if (st == "Published") {
      if (site == "" || lang == "" || pub == "") { emit("finish", note); return }
      if (tof == "" && rt == "true" && tr != "true" && tlink == "") { emit("translate", note); return }
      emit("idle", note); return
    }
    emit("invalid", "unknown status: " st)
  }
  FNR == 1 {
    fm = ($0 == "---"); key = ""; st = ""; sched = ""; pub = ""; upd = ""; note = ""; rt = ""; tr = ""; tlink = ""; tof = ""; site = ""; lang = ""; staged = ""
    if (!fm) nextfile
    next
  }
  $0 == "---" { decide(); nextfile }
  /^[ \t]*-[ \t]/ {
    v = $0; sub(/^[ \t]*-[ \t]*/, "", v); v = unq(v)
    if (key == "status" && v != "") st = (st == "" ? v : st "," v)
    if (key == "sitePath" && v != "" && site == "") site = v
    next
  }
  /^[^ \t#][^:]*:/ {
    key = $0; sub(/:.*/, "", key)
    val = $0; sub(/^[^:]*:[ \t]*/, "", val)
    if (key == "status") { gsub(/[][]/, "", val); gsub(/[ \t]*,[ \t]*/, ",", val); st = unq(val) }
    else if (key == "scheduledAt") sched = unq(val)
    else if (key == "publishedAt") pub = unq(val)
    else if (key == "updatedAt") upd = unq(val)
    else if (key == "note") note = unq(val)
    else if (key == "requireTranslate") rt = unq(val)
    else if (key == "translated") tr = unq(val)
    else if (key == "translation") tlink = unq(val)
    else if (key == "translationOf") tof = unq(val)
    else if (key == "sitePath") site = unq(val)
    else if (key == "lang") lang = unq(val)
    else if (key == "stagedHash") staged = unq(val)
  }
' | LC_ALL=C sort -t "$(printf '\t')" -k1,1n -k3,3 -k4,4 | cut -f2-
