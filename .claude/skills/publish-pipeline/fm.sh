#!/usr/bin/env bash
# Print the frontmatter of vault notes, without their bodies.
# Each argument is a note path, or a wikilink target as written in a note (`Name`, `Name#Heading`, `Name|alias`, `[[Name]]`).
#
# Output per argument:
#   == <path relative to the vault>
#   <frontmatter lines, or "(no frontmatter)">
# or "== <name>: not found" / "== <name>: several notes: <paths>".
#
# Usage: fm.sh <note>... (vault: $VAULT, default ~/projects/Notes)
set -u
VAULT="${VAULT:-$HOME/projects/Notes}"
for arg in "$@"; do
  name="${arg#\[\[}"; name="${name%\]\]}"; name="${name%%|*}"; name="${name%%#*}"
  if [ -f "$name" ]; then file="$name"
  elif [ -f "$VAULT/$name" ]; then file="$VAULT/$name"
  else
    base="$(basename "$name" .md).md"
    matches="$(find "$VAULT" -path "$VAULT/.trash" -prune -o -path "$VAULT/.obsidian" -prune -o -type f -name "$base" -print)"
    count="$(printf '%s' "$matches" | command grep -c .)"
    if [ "$count" -eq 0 ]; then echo "== $name: not found"; continue; fi
    if [ "$count" -gt 1 ]; then echo "== $name: several notes: $(printf '%s' "$matches" | sed "s|^$VAULT/||" | paste -sd ';' -)"; continue; fi
    file="$matches"
  fi
  echo "== ${file#"$VAULT"/}"
  awk 'NR == 1 { if ($0 != "---") { print "(no frontmatter)"; exit } next } $0 == "---" { exit } { print }' "$file"
done
