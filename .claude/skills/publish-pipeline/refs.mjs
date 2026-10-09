// Rewrite references to one post across both locale trees, so renames never need posts read.
// Links are Markdown `[text](url)` or `<a href="url" …>text</a>`; code blocks are left alone.
//
//   retitle <lang> <key> <old title> <new title>
//       In links to that locale's version of the post, replace the old title in the link text with the new one.
//   move <old key> <new key>
//       Point every link to either locale's version at the new key, keeping #anchors.
// key = the post's path under its tree without .mdx, e.g. "strobe-assistant/part-3"; lang = en | ja.
//
// Output, one TSV line per file: `changed <file>`, then `mention <vault note>` for each vault note that
// still contains the old title or old URL (the pipeline doesn't edit note bodies; report them).
//
// Usage: node .claude/skills/publish-pipeline/refs.mjs retitle|move … (vault: $VAULT, default ~/projects/Notes)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const VAULT = process.env.VAULT ?? path.join(os.homedir(), "projects", "Notes");
const TREES = ["app/writings/posts", "app/writings/posts-ja"];
const PREFIX = { en: "/posts/", ja: "/ja/posts/" };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const [cmd, ...args] = process.argv.slice(2);
let rewrite, needle;
if (cmd === "retitle" && args.length === 4 && PREFIX[args[0]]) {
  const [lang, key, oldTitle, newTitle] = args;
  const url = esc(PREFIX[lang] + key) + "/?(?:#[^)\"'\\s]*)?";
  const md = new RegExp(`\\[([^\\]]*)\\]\\((${url})\\)`, "g");
  const a = new RegExp(`(<a\\s[^>]*href=["']${url}["'][^>]*>)([^<]*)(</a>)`, "g");
  const swap = (text) => text.split(oldTitle).join(newTitle);
  rewrite = (s) => s.replace(md, (m, text, u) => `[${swap(text)}](${u})`).replace(a, (m, open, text, close) => open + swap(text) + close);
  needle = oldTitle;
} else if (cmd === "move" && args.length === 2) {
  const [oldKey, newKey] = args;
  const re = new RegExp(`(\\]\\(|href=["'])(/ja)?/posts/${esc(oldKey)}(?=[/#)"'\\s])`, "g");
  rewrite = (s) => s.replace(re, (m, lead, ja) => `${lead}${ja ?? ""}/posts/${newKey}`);
  needle = `/posts/${oldKey}`;
} else {
  console.error("usage: refs.mjs retitle <en|ja> <key> <old title> <new title> | move <old key> <new key>");
  process.exit(2);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".mdx") ? [p] : [];
  });
}

for (const file of TREES.flatMap(walk)) {
  const text = fs.readFileSync(file, "utf-8");
  // Odd parts are fenced code blocks.
  const next = text.split(/(```[\s\S]*?```)/).map((part, i) => (i % 2 ? part : rewrite(part))).join("");
  if (next !== text) {
    fs.writeFileSync(file, next);
    console.log(`changed\t${file}`);
  }
}

try {
  const hits = execFileSync("grep", ["-rlF", "--include=*.md", "--exclude-dir=.trash", "--exclude-dir=.obsidian", "--", needle, VAULT], { encoding: "utf-8" });
  for (const f of hits.split("\n").filter(Boolean)) console.log(`mention\t${path.relative(VAULT, f)}`);
} catch { /* no matches */ }
