import fs from "node:fs";
import path from "node:path";

const CWD = process.cwd();
const OUTPUT_PATH = path.join(CWD, "app", "data", "content-index.json");

const CONTENT = {
  writings: {
    kind: "writing",
    baseDir: path.join(CWD, "app", "writings", "posts"),
    requireTags: true,
  },
  portfolio: {
    kind: "portfolio",
    baseDir: path.join(CWD, "app", "portfolio", "posts"),
    requireTags: true,
  },
  artworks: {
    kind: "artwork",
    baseDir: path.join(CWD, "app", "artworks", "works"),
    requireTags: false,
  },
};

function isDirectory(absPath) {
  return fs.existsSync(absPath) && fs.statSync(absPath).isDirectory();
}

function isFile(absPath) {
  return fs.existsSync(absPath) && fs.statSync(absPath).isFile();
}

function scanMdxFilesRecursive(absDirPath) {
  if (!isDirectory(absDirPath)) return [];

  const results = [];
  const entries = fs.readdirSync(absDirPath, { withFileTypes: true });

  for (const entry of entries) {
    const abs = path.join(absDirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanMdxFilesRecursive(abs));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      results.push(abs);
    }
  }

  return results;
}

function parseFrontmatter(fileContent, absFilePath) {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    throw new Error(
      `Missing frontmatter (--- ... ---) in ${path.relative(CWD, absFilePath)}`
    );
  }

  const block = match[1];
  const lines = block
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const meta = {};
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if (key === "tags") {
      const bracketMatch = value.match(/\[.*\]/);
      if (!bracketMatch) {
        throw new Error(
          `Invalid format for "tags" in ${path.relative(CWD, absFilePath)}: ${value}`
        );
      }
      meta.tags = JSON.parse(bracketMatch[0]);
      continue;
    }

    if (value === "true") {
      meta[key] = true;
      continue;
    }
    if (value === "false") {
      meta[key] = false;
      continue;
    }

    value = value.replace(/^['\"](.*)['\"]$/, "$1");
    meta[key] = value;
  }

  return meta;
}

function assertString(value, field, absFilePath) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(CWD, absFilePath)}: ${field} must be a non-empty string`
    );
  }
}

function assertDateString(value, field, absFilePath) {
  assertString(value, field, absFilePath);
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(CWD, absFilePath)}: ${field} must be a valid date string`
    );
  }
}

function assertTags(value, absFilePath, requireTags) {
  if (value == null) {
    if (requireTags) {
      throw new Error(
        `Invalid frontmatter in ${path.relative(CWD, absFilePath)}: tags is required`
      );
    }
    return [];
  }

  if (!Array.isArray(value) || value.some((t) => typeof t !== "string" || t.length === 0)) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(CWD, absFilePath)}: tags must be an array of non-empty strings`
    );
  }

  for (const tag of value) {
    if (!/^[a-z0-9-_]+$/i.test(tag)) {
      throw new Error(
        `Invalid frontmatter in ${path.relative(CWD, absFilePath)}: invalid tag "${tag}" (use only letters, numbers, hyphen, underscore)`
      );
    }
  }

  return value;
}

function buildIndexSection(sectionKey, config) {
  if (!isDirectory(config.baseDir)) {
    return [];
  }

  const files = scanMdxFilesRecursive(config.baseDir);
  const seenSlugs = new Map();

  return files.map((absFilePath) => {
    const slug = path.basename(absFilePath, ".mdx");
    if (seenSlugs.has(slug)) {
      throw new Error(
        `Duplicate slug "${slug}" for ${config.kind}: ${path.relative(CWD, absFilePath)}`
      );
    }
    seenSlugs.set(slug, absFilePath);

    const raw = fs.readFileSync(absFilePath, "utf-8");
    const meta = parseFrontmatter(raw, absFilePath);

    assertString(meta.title, "title", absFilePath);
    assertDateString(meta.publishedAt, "publishedAt", absFilePath);
    assertString(meta.summary, "summary", absFilePath);

    const tags = assertTags(meta.tags, absFilePath, config.requireTags);

    if (meta.shouldBreakWord != null && typeof meta.shouldBreakWord !== "boolean") {
      throw new Error(
        `Invalid frontmatter in ${path.relative(CWD, absFilePath)}: shouldBreakWord must be a boolean`
      );
    }

    return {
      slug,
      filePath: path.relative(CWD, absFilePath),
      metadata: {
        title: meta.title,
        publishedAt: meta.publishedAt,
        summary: meta.summary,
        image: typeof meta.image === "string" ? meta.image : undefined,
        tags,
        shouldBreakWord: typeof meta.shouldBreakWord === "boolean" ? meta.shouldBreakWord : undefined,
      },
    };
  });
}

function main() {
  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    writings: buildIndexSection("writings", CONTENT.writings),
    portfolio: buildIndexSection("portfolio", CONTENT.portfolio),
    artworks: buildIndexSection("artworks", CONTENT.artworks),
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2) + "\n", "utf-8");

  console.log(
    `Generated content index at ${path.relative(CWD, OUTPUT_PATH)} (writings=${index.writings.length}, portfolio=${index.portfolio.length}, artworks=${index.artworks.length})`
  );
}

try {
  main();
} catch (error) {
  console.error(String(error?.stack || error));
  process.exitCode = 1;
}
