// Check links between posts across both locale trees, so the pipeline never has to read posts to find gaps.
// Run from the repo root. Prints nothing when every link is fine; otherwise one TSV line per problem:
//   placeholder  <path to create>                      the post is referenced (or is a placeholder) and this locale's version is missing
//   relink       <file>  <url>  <url to use instead>   a link to the wrong locale's version, or to a version that doesn't exist
//   broken       <file>  <url>                         no version of the target exists in either locale
// A post is single-language when its vault note has `requireTranslate: false` (translation notes excepted):
// links to it from the other locale use its only version and it never gets a placeholder there.
// A published post whose note doesn't have `requireTranslate: true` counts as single-language too.
//
// Usage: node .claude/skills/publish-pipeline/links.mjs [vault]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const VAULT = process.argv[2] ?? path.join(os.homedir(), "projects", "Notes");
const TREES = { en: "app/writings/posts", ja: "app/writings/posts-ja" };
const PREFIX = { en: "/posts/", ja: "/ja/posts/" };
const other = (lang) => (lang === "en" ? "ja" : "en");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".mdx") ? [p] : [];
  });
}

function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  return m ? m[1] : "";
}

// posts[lang] = Map(key → { file, placeholder }), key = path under the tree without .mdx (e.g. "AWS/networking-and-vpc")
const posts = {};
for (const [lang, root] of Object.entries(TREES)) {
  posts[lang] = new Map();
  for (const file of walk(root)) {
    const key = path.relative(root, file).replace(/\.mdx$/, "");
    const text = fs.readFileSync(file, "utf-8");
    posts[lang].set(key, { file, text, placeholder: /^placeholder:\s*true\s*$/m.test(frontmatter(text)) });
  }
}
const exists = (lang, key) => posts[lang].has(key) || fs.existsSync(path.join(TREES[lang], key)); // a post or a series folder

// Vault notes linked to posts by `sitePath`: key → requireTranslate ("true" | "false" | ""), from the original's side.
const translateOf = new Map();
let vaultFiles = [];
try {
  vaultFiles = execFileSync("grep", ["-rlE", "--include=*.md", "--exclude-dir=.trash", "--exclude-dir=.obsidian", "^sitePath:", VAULT], { encoding: "utf-8" })
    .split("\n").filter(Boolean);
} catch { /* no matches, or no vault */ }
for (const file of vaultFiles) {
  const fm = frontmatter(fs.readFileSync(file, "utf-8"));
  const prop = (k) => (new RegExp(`^${k}:[ \\t]*(.*)$`, "m").exec(fm)?.[1] ?? "").replace(/^["']|["']$/g, "").trim();
  if (prop("translationOf")) continue; // a translation's own requireTranslate is always false; its original decides
  const rt = prop("requireTranslate");
  const sitePaths = [...fm.matchAll(/app\/writings\/posts(?:-ja)?\/[^"'\s]+\.mdx/g)].map((m) => m[0]);
  for (const sp of sitePaths) translateOf.set(sp.replace(/^app\/writings\/posts(-ja)?\//, "").replace(/\.mdx$/, ""), rt);
}

// Single-language: explicitly not translated, or a real (non-placeholder) post whose note doesn't ask for a translation.
function singleLanguage(key, lang) {
  const rt = translateOf.get(key) ?? "";
  if (rt === "false") return true;
  return !posts[lang].get(key)?.placeholder && rt !== "true";
}

const out = new Set();
const needPlaceholder = (lang, key) => out.add(`placeholder\t${TREES[lang]}/${key}.mdx`);

for (const lang of ["en", "ja"]) {
  for (const [key, post] of posts[lang]) {
    // Every placeholder has its counterpart, unless the post is single-language.
    if (post.placeholder && !exists(other(lang), key) && !singleLanguage(key, lang)) needPlaceholder(other(lang), key);

    const body = post.text.replace(/```[\s\S]*?```/g, "");
    for (const m of body.matchAll(/(?:\]\(|href=["'])((?:\/ja)?\/posts\/[^)"'#?\s]+)/g)) {
      const url = m[1].replace(/\/$/, "");
      const to = url.startsWith("/ja/") ? "ja" : "en";
      const key2 = url.slice(PREFIX[to].length);
      const here = exists(lang, key2), there = exists(other(lang), key2);
      const src = post.file;
      if (!here && !there) { out.add(`broken\t${src}\t${url}`); continue; }
      if (to !== lang && here) { out.add(`relink\t${src}\t${url}\t${PREFIX[lang]}${key2}`); continue; }
      if (here) continue; // same-locale link to an existing post or series
      // Only the other locale's version exists.
      const only = other(lang);
      if (singleLanguage(key2, only)) {
        if (to !== only) out.add(`relink\t${src}\t${url}\t${PREFIX[only]}${key2}`);
      } else {
        needPlaceholder(lang, key2);
        if (to !== lang) out.add(`relink\t${src}\t${url}\t${PREFIX[lang]}${key2}`);
      }
    }
  }
}

if (out.size) console.log([...out].sort().join("\n"));
