// List posts that are due to go live but aren't live yet: dated after the live build's day and up to today
// (in the site's time zone, see site-date.mjs). Staged posts (dated after the build's day) are served as
// "coming soon" placeholders until a build on or after their date, so a non-empty list means: rebuild now.
//
//   node scripts/due-posts.mjs --live <origin>    compare with the live deployment's /build-info.json
//   node scripts/due-posts.mjs --since YYYY-MM-DD compare with a given build day
//
// Prints one TSV line per due post (`<publishedAt>  <path>`) after a `since` line on stderr.
// Exit 0 when at least one post is due, 1 when none is, 2 on a usage error.
// If the live deployment can't be read, everything dated today counts as due (a rebuild is the safe side).
import fs from "node:fs";
import path from "node:path";
import { siteToday } from "./site-date.mjs";

const TREES = ["app/writings/posts", "app/writings/posts-ja"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".mdx") ? [p] : [];
  });
}

function field(fm, key) {
  const m = new RegExp(`^${key}:[ \\t]*["']?([^"'\\r\\n]*?)["']?[ \\t]*$`, "m").exec(fm);
  return m ? m[1] : undefined;
}

function dayBefore(day) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function liveSiteDate(origin) {
  try {
    const res = await fetch(new URL("/build-info.json", origin), { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { siteDate } = await res.json();
    if (typeof siteDate !== "string" || !DATE.test(siteDate)) throw new Error("no siteDate");
    return siteDate;
  } catch (error) {
    console.error(`could not read ${origin}/build-info.json (${error.message}): treating posts dated today as due`);
    return undefined;
  }
}

const args = process.argv.slice(2);
const today = siteToday();
let since;
if (args[0] === "--since" && DATE.test(args[1] ?? "")) since = args[1];
else if (args[0] === "--live" && args[1]) since = (await liveSiteDate(args[1])) ?? dayBefore(today);
else {
  console.error("usage: due-posts.mjs --live <origin> | --since YYYY-MM-DD");
  process.exit(2);
}
console.error(`since\t${since}\ttoday\t${today}`);

const due = [];
for (const file of TREES.flatMap(walk)) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(file, "utf-8"));
  if (!m) continue;
  const fm = m[1];
  if (["placeholder", "draft", "archived"].some((k) => field(fm, k) === "true")) continue;
  const date = field(fm, "publishedAt");
  if (date && DATE.test(date) && date > since && date <= today) due.push(`${date}\t${file}`);
}
due.sort();
for (const line of due) console.log(line);
process.exit(due.length ? 0 : 1);
