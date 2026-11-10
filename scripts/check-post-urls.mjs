import fs from "node:fs";
import path from "node:path";

// Post-build guard (the `postbuild` script): a project post's canonical URL is
// /projects/<project>/<slug>, never /posts/<slug> (see getPostHref in
// lib/content/project-href.ts and docs/publish.md). Fails the build if the
// built sitemap or RSS feed advertises a project post under /posts, or doesn't
// list it under /projects, or if its built page canonicalises elsewhere.
// This reads the build output, so it catches any producer that builds a post
// URL by hand instead of through getPostHref.

const CWD = process.cwd();
const INDEX = path.join(CWD, "app", "data", "content-index.json");
const APP_OUT = path.join(CWD, ".next", "server", "app");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null);

const index = JSON.parse(read(INDEX) ?? "null");
const sitemap = read(path.join(APP_OUT, "sitemap.xml.body"));
const rss = read(path.join(APP_OUT, "rss.body"));
if (!index || sitemap === null || rss === null) {
  console.error("check-post-urls: missing content index or built sitemap/RSS (run `next build` first).");
  process.exit(1);
}

const urlsIn = (xml, tag) => [...xml.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, "g"))].map((m) => m[1]);
const sitemapUrls = urlsIn(sitemap, "loc");
const rssUrls = urlsIn(rss, "link");

const projectSlugs = new Set(
  (index.writings ?? [])
    .filter((w) => w.metadata?.project && !w.metadata?.placeholder && !w.metadata?.draft && !w.metadata?.archived)
    .map((w) => w.slug)
);

const problems = [];
for (const [name, urls] of [["sitemap", sitemapUrls], ["RSS feed", rssUrls]]) {
  for (const url of urls) {
    const m = /\/posts\/([^/]+)$/.exec(url);
    if (m && projectSlugs.has(m[1])) {
      problems.push(`${name} lists project post ${m[1]} at ${url}; expected /projects/<project>/${m[1]}`);
    }
  }
}
for (const slug of projectSlugs) {
  if (!sitemapUrls.some((u) => /\/projects\/[^/]+\/[^/]+$/.test(u) && u.endsWith(`/${slug}`))) {
    problems.push(`sitemap has no /projects/<project>/${slug} URL`);
  }
}

// The built project page must canonicalise to its own project URL.
for (const w of index.writings ?? []) {
  const project = w.metadata?.project;
  if (!project || w.metadata?.placeholder || w.filePath.includes("/posts-ja/")) continue;
  const slugOfProject = project.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const html = read(path.join(APP_OUT, "projects", slugOfProject, `${w.slug}.html`));
  if (html === null) {
    problems.push(`no built page for /projects/${slugOfProject}/${w.slug}`);
    continue;
  }
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!canonical || !canonical.endsWith(`/projects/${slugOfProject}/${w.slug}`)) {
    problems.push(`/projects/${slugOfProject}/${w.slug} canonicalises to ${canonical ?? "nothing"}`);
  }
}

if (problems.length) {
  console.error(`check-post-urls: ${problems.length} problem(s). Build every post URL with getPostHref/getWritingHref:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check-post-urls: ${projectSlugs.size} project post(s) are canonical under /projects.`);
