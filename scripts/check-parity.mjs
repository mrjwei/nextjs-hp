import fs from "fs/promises";
import path from "path";

// Warns (never fails the build) when a Home pin in `highlights`
// (app/content/profile.ts) has no match in a language, so EN/JA gaps are
// visible at build time. Home skips such pins silently.

const CWD = process.cwd();
const CONTENT_INDEX_PATH = path.join(CWD, "app", "data", "content-index.json");
const PROFILE_PATH = path.join(CWD, "app", "content", "profile.ts");

// Reads the string array assigned to `key` inside the `highlights` object.
function readPins(source, key) {
  const block = source.match(/export const highlights[\s\S]*?\n}\n/);
  if (!block) return [];
  const list = block[0].match(new RegExp(`\\n\\s*${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!list) return [];
  return [...list[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

async function checkParity() {
  const [indexStr, profileSource] = await Promise.all([
    fs.readFile(CONTENT_INDEX_PATH, "utf-8").catch(() => null),
    fs.readFile(PROFILE_PATH, "utf-8"),
  ]);
  if (!indexStr) {
    console.warn("check-parity: no content-index.json; skipping.");
    return;
  }

  // Same visibility as Home: drafts, archived posts and placeholders don't count.
  const writings = (JSON.parse(indexStr).writings || []).filter(
    (w) => !w.metadata?.draft && !w.metadata?.archived && !w.metadata?.placeholder
  );
  const langOf = (w) => (w.filePath.includes("/posts-ja/") ? "ja" : "en");
  const has = { en: { projects: new Set(), posts: new Set() }, ja: { projects: new Set(), posts: new Set() } };
  for (const w of writings) {
    const lang = langOf(w);
    has[lang].posts.add(w.slug);
    if (w.metadata?.project) has[lang].projects.add(w.metadata.project);
  }

  const missing = [];
  for (const kind of ["projects", "posts"]) {
    for (const pin of readPins(profileSource, kind)) {
      for (const lang of ["en", "ja"]) {
        if (!has[lang][kind].has(pin)) missing.push(`${kind} "${pin}" — no ${lang.toUpperCase()} version`);
      }
    }
  }

  if (missing.length) {
    console.warn(`check-parity: ${missing.length} Home pin(s) skipped in a language:`);
    for (const line of missing) console.warn(`  - ${line}`);
  } else {
    console.log("check-parity: every Home pin exists in EN and JA.");
  }
}

checkParity().catch((err) => {
  console.warn(`check-parity: ${err.message}`);
});
