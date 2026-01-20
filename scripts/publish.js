#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") })
const { execSync } = require("child_process")

function usage() {
  return `\nPublish an Obsidian Markdown note into this Next.js HP as MDX.\n\nUsage:\n  npm run publish "My Post Title" -- [--series <folder>] [--file <path>]\n\nOptions:\n  --series <name>      Writes into app/writings/posts/<name>/\n  --file <path>        Path to the source .md file (preferred if not using a vault)\n  --vault <path>       Obsidian vault root to search (default: $OBSIDIAN_VAULT)\n  --assets <path>      Obsidian assets dir (default: $OBSIDIAN_ASSETS or <vault>/assets)\n  --toc                Force (re)generate a TOC (default: enabled)\n  --no-toc             Do not generate a TOC\n  --no-ai              Skip AI transform; do a safe, basic Markdown→MDX conversion\n  --overwrite          Overwrite the output file if it already exists\n  --resume             If output exists, update TOC/assets and run git steps\n  --dry-run            Print planned actions; do not write/commit/push\n  --no-push            Commit locally but do not git push\n  --no-commit          Write/update files but do not git commit/push\n  --help               Show help\n\nEnv vars (for AI):\n  OPENAI_API_KEY       If set, enables AI transform unless --no-ai\n  OPENAI_BASE_URL      Default: https://api.openai.com/v1\n  OPENAI_MODEL         Default: gpt-4o-mini\n\nEnv vars (for Obsidian):\n  OBSIDIAN_VAULT        Default vault root for --vault lookup\n  OBSIDIAN_ASSETS       Default assets folder (e.g. /path/to/vault/assets)\n\nExamples:\n  npm run publish "My Post Title" -- --file ~/Vault/My%20Post%20Title.md\n  npm run publish "My Post Title" -- --series LingoBun -- --file ~/Vault/LingoBun/My%20Post%20Title.md\n  npm run publish "My Post Title" -- --series ml -- --vault ~/Obsidian\n  npm run publish "My Post Title" -- --resume --series LingoBun -- --file ~/Vault/My%20Post%20Title.md\n`
}

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith("--")) {
      args._.push(token)
      continue
    }

    const key = token.replace(/^--/, "")
    if (key === "help") {
      args.help = true
      continue
    }
    if (key === "dry-run") {
      args.dryRun = true
      continue
    }
    if (key === "no-ai") {
      args.noAi = true
      continue
    }
    if (key === "no-push") {
      args.noPush = true
      continue
    }
    if (key === "no-commit") {
      args.noCommit = true
      continue
    }
    if (key === "overwrite") {
      args.overwrite = true
      continue
    }
    if (key === "resume") {
      args.resume = true
      continue
    }
    if (key === "toc") {
      args.toc = true
      continue
    }
    if (key === "no-toc") {
      args.noToc = true
      continue
    }

    const value = argv[i + 1]
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`)
    }
    args[key] = value
    i++
  }

  return args
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
}

function unwrapTopLevelCodeFence(text) {
  let t = String(text || "").trim()

  // Unwrap a single top-level fenced block like:
  // ```mdx
  // ...
  // ```
  // (Some LLMs wrap the entire document like this.)
  for (let i = 0; i < 2; i++) {
    const m1 = /^```[a-zA-Z0-9_-]*\s*\n([\s\S]*?)\n```\s*$/.exec(t)
    if (m1) {
      t = m1[1].trim()
      continue
    }
    const m2 = /^~~~[a-zA-Z0-9_-]*\s*\n([\s\S]*?)\n~~~\s*$/.exec(t)
    if (m2) {
      t = m2[1].trim()
      continue
    }
    break
  }

  return t + "\n"
}

function splitByFencedCodeBlocks(text) {
  const lines = String(text || "").split("\n")
  const blocks = []

  let buf = []
  let inFence = false
  let fenceMarker = null

  function flush(type) {
    if (buf.length === 0) return
    blocks.push({ type, content: buf.join("\n") })
    buf = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    const fence = /^(?:```|~~~)/.exec(trimmed)

    if (!inFence && fence) {
      flush("text")
      inFence = true
      fenceMarker = fence[0]
      buf.push(line)
      continue
    }

    if (inFence) {
      buf.push(line)
      if (fence && fence[0] === fenceMarker) {
        flush("code")
        inFence = false
        fenceMarker = null
      }
      continue
    }

    buf.push(line)
  }

  flush(inFence ? "code" : "text")
  return blocks
}

function renderImageFigure(src) {
  const safeSrc = String(src || "").trim().replace(/"/g, "&quot;")
  return [
    "<br/>",
    "<figure style={{ textAlign: \"center\" }}>",
    "  <img",
    `    src=\"${safeSrc}\"`,
    "    alt=\"\"",
    "    style={{ marginBottom: \"8px\" }}",
    "  />",
    "  <figcaption></figcaption>",
    "</figure>",
    "<br/>",
  ].join("\n")
}

function normalizeImageSrc(src, postSlug) {
  const s = String(src || "").trim()
  if (!s) return s
  if (/^(https?:)?\/\//i.test(s)) return s
  if (s.startsWith(`/`)) return s
  // relative -> assume it belongs to this post
  return `/${postSlug}/${s}`
}

function stripMarkdownTableArtifacts(text) {
  const lines = String(text || "").split("\n")

  const out = []
  for (const line of lines) {
    // Remove table separator rows like: | --- | --- |
    if (/^\s*\|?\s*:?-{3,}:?(\s*\|\s*:?-{3,}:?)+\s*\|?\s*$/.test(line)) {
      continue
    }

    // If a line looks like it's part of a table AND contains figure/html breaks, split cells.
    if (line.includes("|") && (line.includes("<figure") || line.includes("<br/>") || line.includes("<img"))) {
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c && c !== "-")
      for (const cell of cells) {
        out.push(cell)
      }
      continue
    }

    out.push(line)
  }

  // Collapse runs of empty lines a bit.
  return out
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n")
}

function convertImagesToFigureHtml(mdx, postSlug) {
  const parts = splitFrontmatterFromMdx(mdx)
  const blocks = splitByFencedCodeBlocks(parts.body)

  const rewritten = blocks
    .map((b) => {
      if (b.type !== "text") return b.content

      let t = b.content

      // Normalize any existing <figure>...</figure> that contains an <img src="...">.
      t = t.replace(
        /<figure[\s\S]*?<img[\s\S]*?\ssrc=("|')([^"']+)("|')[\s\S]*?<\/figure>/gi,
        (_, _q1, src) => renderImageFigure(normalizeImageSrc(src, postSlug))
      )

      // Normalize bare <img ... src="..."> tags.
      t = t.replace(/<img\b[^>]*\ssrc=("|')([^"']+)("|')[^>]*\/?>(?:\s*<\/img>)?/gi, (_, _q, src) => {
        return renderImageFigure(normalizeImageSrc(src, postSlug))
      })

      // Obsidian embeds: ![[image.png]] -> figure HTML pointing to /<slug>/image.png
      t = t.replace(/!\[\[([^\]]+)\]\]/g, (_, file) => {
        const filename = String(file).split("|")[0].trim()
        return renderImageFigure(`/${postSlug}/${filename}`)
      })

      // Markdown images: ![alt](src) -> figure HTML (keep src)
      t = t.replace(/!\[[^\]]*\]\(([^\)]+)\)/g, (_, inner) => {
        const raw = String(inner).trim()
        const src = raw.split(/\s+/)[0]
        return renderImageFigure(normalizeImageSrc(src, postSlug))
      })

      return stripMarkdownTableArtifacts(t)
    })
    .join("\n")

  return parts.frontmatter + rewritten
}

function splitFrontmatterFromMdx(mdx) {
  const fm = /^---\s*[\s\S]*?\s*---\s*/.exec(mdx)
  if (!fm) return { frontmatter: "", body: mdx }
  return {
    frontmatter: fm[0].trimEnd() + "\n\n",
    body: mdx.slice(fm[0].length),
  }
}

function stripCodeFences(lines) {
  // Returns a boolean array indicating whether each line is inside a fenced code block.
  const inside = new Array(lines.length).fill(false)
  let inFence = false
  let fenceMarker = null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    const fence = /^(?:```|~~~)/.exec(trimmed)
    if (fence) {
      const marker = fence[0]
      if (!inFence) {
        inFence = true
        fenceMarker = marker
        inside[i] = true
        continue
      }

      if (marker === fenceMarker) {
        inside[i] = true
        inFence = false
        fenceMarker = null
        continue
      }
    }

    inside[i] = inFence
  }

  return inside
}

function plainTextFromHeading(raw) {
  let text = String(raw || "")
  // Remove trailing markdown heading closing hashes
  text = text.replace(/\s+#+\s*$/, "")
  // Remove markdown links [text](url)
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
  // Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, "$1")
  // Remove emphasis markers
  text = text.replace(/[\*_]/g, "")
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, "")
  return text.trim()
}

function generateTocFromBody(body) {
  const lines = String(body || "").split("\n")
  const inFence = stripCodeFences(lines)

  const headings = []
  for (let i = 0; i < lines.length; i++) {
    if (inFence[i]) continue
    const line = lines[i]
    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length
    if (level !== 2 && level !== 3) continue

    const text = plainTextFromHeading(match[2])
    if (!text) continue

    headings.push({ level, text })
  }

  if (headings.length === 0) return ""

  const tocLines = headings.map((h) => {
    const indent = h.level === 3 ? "  " : ""
    const slug = slugify(h.text)
    return `${indent}- [${h.text}](#${slug})`
  })

  return tocLines.join("\n") + "\n"
}

function upsertTocIntoBody(body, tocMarkdown) {
  if (!tocMarkdown) return body

  const original = String(body || "")
  const trimmed = original.replace(/^\s+/, "")

  // If the file already starts with a TOC-like list, replace that block.
  const lines = trimmed.split("\n")
  let end = 0
  let sawLinkLine = false
  for (; end < lines.length; end++) {
    const line = lines[end]
    if (line.trim() === "") break
    const isList = /^\s*-\s+\[/.test(line)
    if (!isList) {
      end = 0
      break
    }
    if (line.includes("](#")) sawLinkLine = true
  }

  if (end > 0 && sawLinkLine) {
    const rest = lines.slice(end + 1).join("\n")
    return tocMarkdown + "\n" + rest.trimStart() + (rest.endsWith("\n") ? "" : "\n")
  }

  return tocMarkdown + "\n" + trimmed
}

function safeJoin(baseDir, relPath) {
  const abs = path.join(baseDir, relPath)
  const normalizedBase = path.resolve(baseDir) + path.sep
  const normalizedAbs = path.resolve(abs)
  if (!normalizedAbs.startsWith(normalizedBase)) {
    throw new Error(`Unsafe path traversal: ${relPath}`)
  }
  return normalizedAbs
}

function extractReferencedPublicAssets(mdx, postSlug) {
  const results = new Set()
  const doc = String(mdx || "")

  // Markdown images: ![alt](/slug/file.png)
  const mdImg = new RegExp(`!\\[[^\\]]*\\]\\(\\/${postSlug}\\/([^\\)]+)\\)`, "g")
  let m
  while ((m = mdImg.exec(doc))) {
    results.add(m[1].split("?")[0].split("#")[0])
  }

  // HTML images: <img src="/slug/file.png" ...>
  const htmlImg = new RegExp(`src=\\"\\/${postSlug}\\/([^\\\"]+)\\"`, "g")
  while ((m = htmlImg.exec(doc))) {
    results.add(m[1].split("?")[0].split("#")[0])
  }
  const htmlImg2 = new RegExp(`src=\\'\\/${postSlug}\\/([^\\']+)\\'`, "g")
  while ((m = htmlImg2.exec(doc))) {
    results.add(m[1].split("?")[0].split("#")[0])
  }

  return Array.from(results)
}

function findAssetByBasename(assetsDir, requestedPath) {
  if (!assetsDir) return null
  const requested = String(requestedPath)
  const wantedBase = path.basename(requested).toLowerCase()
  const direct = path.join(assetsDir, requested)
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct

  // Search recursively for a matching basename.
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        const hit = walk(full)
        if (hit) return hit
      } else if (e.isFile()) {
        if (e.name.toLowerCase() === wantedBase) return full
      }
    }
    return null
  }

  return walk(assetsDir)
}

function copyAssetsToPublic({ mdx, postSlug, assetsDir }) {
  const assets = extractReferencedPublicAssets(mdx, postSlug)
  if (assets.length === 0) return []

  const copied = []
  const absPublicSlugDir = path.join(process.cwd(), "public", postSlug)
  ensureDirExists(absPublicSlugDir)

  for (const rel of assets) {
    const src = findAssetByBasename(assetsDir, rel)
    if (!src) {
      console.warn(
        `\nWarning: referenced asset not found in assets dir.\n` +
          `  referenced: /${postSlug}/${rel}\n` +
          `  assets dir:  ${assetsDir || "(not set)"}\n`
      )
      continue
    }

    const dest = safeJoin(absPublicSlugDir, rel)
    ensureDirExists(path.dirname(dest))
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest)
      copied.push(dest)
    }
  }

  return copied
}

function stripFrontmatter(md) {
  const frontmatterRegex = /^---\s*[\s\S]*?\s*---\s*/
  return md.replace(frontmatterRegex, "").trim()
}

function parseFrontmatterLoose(md) {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/m
  const match = frontmatterRegex.exec(md)
  if (!match) return { metadata: {}, content: md }

  const block = match[1]
  const content = md.replace(frontmatterRegex, "").trim()
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const metadata = {}
  for (const line of lines) {
    const [key, ...rest] = line.split(":")
    if (!key || rest.length === 0) continue
    let value = rest.join(":").trim()

    // Remove wrapping quotes
    value = value.replace(/^['\"](.*)['\"]$/, "$1")

    if (key === "tags") {
      // Support: [a, b] or ["a","b"]
      const bracketMatch = value.match(/\[.*\]/)
      if (bracketMatch) {
        try {
          // Convert bare words into JSON strings if needed.
          const raw = bracketMatch[0]
          let json = raw
          if (!raw.includes('"') && raw.includes(",")) {
            json =
              "[" +
              raw
                .slice(1, -1)
                .split(",")
                .map((t) => `\"${t.trim()}\"`)
                .join(",") +
              "]"
          }
          metadata.tags = JSON.parse(json)
        } catch {
          // ignore
        }
      }
    } else {
      metadata[key] = value
    }
  }

  return { metadata, content }
}

function basicObsidianToMdx(md, { postSlug }) {
  let out = stripFrontmatter(md)

  // Obsidian embeds: ![[image.png]] → centered figure HTML
  out = out.replace(/!\[\[([^\]]+)\]\]/g, (_, file) => {
    const filename = String(file).split("|")[0].trim()
    return renderImageFigure(`/${postSlug}/${filename}`)
  })

  // Obsidian wikilinks: [[Page]] or [[Page|Label]] → Label or Page
  out = out.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const [target, label] = String(inner).split("|")
    return (label || target).trim()
  })

  return out.trim() + "\n"
}

function buildFrontmatter({ title, publishedAt, summary, tags }) {
  const safeTitle = String(title || "").replace(/\"/g, "\\\"")
  const safeSummary = String(summary || "").replace(/\"/g, "\\\"")
  const safeTags = Array.isArray(tags) ? tags : []
  const normalizedTags = safeTags
    .map((t) => String(t).trim().toLowerCase())
    .filter(Boolean)

  return [
    "---",
    `title: \"${safeTitle}\"`,
    `publishedAt: \"${publishedAt}\"`,
    `summary: \"${safeSummary}\"`,
    `tags: ${JSON.stringify(normalizedTags)}`,
    "---",
    "",
  ].join("\n")
}

function getTodayISODate() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function firstNonEmptyParagraph(md) {
  const content = stripFrontmatter(md)
  const lines = content.split("\n")

  let buf = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (buf.length) break
      continue
    }

    // Skip headings, list markers, quotes
    if (/^#{1,6}\s+/.test(trimmed)) continue
    if (/^[-*+]\s+/.test(trimmed)) continue
    if (/^>\s+/.test(trimmed)) continue

    buf.push(trimmed)
  }

  const paragraph = buf.join(" ").trim()
  if (!paragraph) return ""
  return paragraph.length > 160 ? paragraph.slice(0, 157) + "..." : paragraph
}

async function aiTransformToMdx({ markdown, title, postSlug }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"

  const availableTags = loadAvailableTags()

  const system = `You are converting an Obsidian Markdown note into MDX for a Next.js blog.\n\nRequirements:\n- Output MUST be a single valid MDX document (do NOT wrap in triple-backtick fences).\n- Start with YAML frontmatter containing exactly: title, publishedAt (YYYY-MM-DD), summary, tags (as a JSON array).\n- Keep the content faithful; do not add sections that weren't present.\n- Convert Obsidian wikilinks [[Page]]/[[Page|Label]] to plain text (Label or Page).\n- Convert Obsidian embeds ![[file.png]] to images served from /${postSlug}/file.png.\n- For ALL images, use this HTML pattern (fill only src):\n  <br/>\n  <figure style={{ textAlign: \"center\" }}>\n    <img src=\"/path/to/image\" alt=\"\" style={{ marginBottom: \"8px\" }} />\n    <figcaption></figcaption>\n  </figure>\n  <br/>\n- Prefer standard Markdown; only use JSX when needed.\n- Tags must be chosen ONLY from this set: ${availableTags.join(", ")}. Use 3-7 tags.`

  const user = `Title: ${title}\n\nObsidian Markdown:\n\n${markdown}`

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`OpenAI request failed: ${res.status} ${res.statusText}\n${text}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content || typeof content !== "string") return null

  // Quick validation: must contain frontmatter and required keys.
  const fm = /^---[\s\S]*?---/m.exec(content)
  if (!fm) return null
  if (!/\btitle:\s*/.test(fm[0])) return null
  if (!/\bpublishedAt:\s*/.test(fm[0])) return null
  if (!/\bsummary:\s*/.test(fm[0])) return null
  if (!/\btags:\s*\[/.test(fm[0])) return null

  return unwrapTopLevelCodeFence(content)
}

function loadAvailableTags() {
  // Single source of truth is app/data/tags.json (also used by the Next app).
  const abs = path.join(process.cwd(), "app", "data", "tags.json")
  try {
    const raw = fs.readFileSync(abs, "utf8")
    const obj = JSON.parse(raw)
    const keys = Object.keys(obj || {})
    return keys
      .map((k) => String(k).trim().toLowerCase())
      .filter(Boolean)
      .sort()
  } catch (e) {
    console.warn(
      `\nWarning: failed to load available tags from ${abs}. Falling back to allowing any tags.\n${
        e?.message || e
      }\n`
    )
    return []
  }
}

function ensureDirExists(absDir) {
  fs.mkdirSync(absDir, { recursive: true })
}

function listAllMdxBasenames(absPostsRoot) {
  const results = []

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full)
      if (e.isFile() && full.endsWith(".mdx")) {
        results.push(path.basename(full, ".mdx"))
      }
    }
  }

  walk(absPostsRoot)
  return results
}

function pickUniqueSlug(absPostsRoot, desiredSlug) {
  const existing = new Set(listAllMdxBasenames(absPostsRoot))
  if (!existing.has(desiredSlug)) return desiredSlug

  let i = 2
  while (existing.has(`${desiredSlug}-${i}`)) i++
  return `${desiredSlug}-${i}`
}

function findMarkdownByTitle({ vaultDir, title }) {
  if (!vaultDir) return null
  const desired = slugify(title)

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        // Skip common large/system dirs in vaults
        if ([".obsidian", ".git", "node_modules"].includes(e.name)) continue
        const hit = walk(full)
        if (hit) return hit
      } else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) {
        const base = path.basename(e.name, ".md")
        const baseSlug = slugify(base)
        if (baseSlug === desired) return full
        if (baseSlug.includes(desired) || desired.includes(baseSlug)) return full
      }
    }
    return null
  }

  return walk(vaultDir)
}

function run(cmd, opts = {}) {
  const result = execSync(cmd, {
    stdio: opts.stdio || "pipe",
    cwd: opts.cwd || process.cwd(),
    env: { ...process.env, ...(opts.env || {}) },
  })

  // execSync returns null when stdio is "inherit".
  if (result == null) return ""
  return result.toString("utf8").trim()
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(usage())
    process.exit(0)
  }

  const title = args._[0]
  if (!title) {
    console.error(usage())
    process.exit(1)
  }

  const absPostsRoot = path.join(process.cwd(), "app", "writings", "posts")
  const series = args.series ? String(args.series) : ""

  const desiredSlug = slugify(title)

  const relOutDir = path.join("app", "writings", "posts", series)
  const absOutDir = path.join(process.cwd(), relOutDir)
  const absDesiredOutFile = path.join(absOutDir, `${desiredSlug}.mdx`)

  // If resuming, operate on the originally expected slug if it exists.
  const postSlug =
    (args.resume || args.overwrite) && fs.existsSync(absDesiredOutFile)
      ? desiredSlug
      : pickUniqueSlug(absPostsRoot, desiredSlug)

  const absOutFile = path.join(absOutDir, `${postSlug}.mdx`)

  let absSourceFile = args.file ? path.resolve(String(args.file)) : null
  if (!absSourceFile) {
    const vaultDir = args.vault
      ? path.resolve(String(args.vault))
      : process.env.OBSIDIAN_VAULT
      ? path.resolve(process.env.OBSIDIAN_VAULT)
      : null

    absSourceFile = findMarkdownByTitle({ vaultDir, title })
  }

  const vaultDirForDefaults = args.vault
    ? path.resolve(String(args.vault))
    : process.env.OBSIDIAN_VAULT
    ? path.resolve(process.env.OBSIDIAN_VAULT)
    : null

  const assetsDir = args.assets
    ? path.resolve(String(args.assets))
    : process.env.OBSIDIAN_ASSETS
    ? path.resolve(process.env.OBSIDIAN_ASSETS)
    : vaultDirForDefaults
    ? path.join(vaultDirForDefaults, "assets")
    : null

  if (!absSourceFile || !fs.existsSync(absSourceFile)) {
    console.error(`\nCould not find a source Markdown file for: ${title}`)
    console.error(
      `Provide one via --file, or set $OBSIDIAN_VAULT (or pass --vault) so the script can search by filename.\n`
    )
    process.exit(1)
  }

  const rawMarkdown = fs.readFileSync(absSourceFile, "utf8")
  const { metadata: srcMeta } = parseFrontmatterLoose(rawMarkdown)

  const publishedAt = srcMeta.publishedAt || getTodayISODate()
  const summary = srcMeta.summary || firstNonEmptyParagraph(rawMarkdown)
  const tags = Array.isArray(srcMeta.tags) ? srcMeta.tags : []

  const plan = {
    title,
    source: absSourceFile,
    series: series || null,
    slug: postSlug,
    outFile: absOutFile,
    aiEnabled: Boolean(process.env.OPENAI_API_KEY) && !args.noAi,
    tocEnabled: !args.noToc,
    assetsDir,
    commit: !args.noCommit,
    push: !args.noCommit && !args.noPush,
  }

  console.log("\nPublish plan:")
  console.log(JSON.stringify(plan, null, 2))

  if (args.dryRun) {
    console.log("\n--dry-run set; exiting without changes.\n")
    return
  }

  ensureDirExists(absOutDir)

  let mdx = null
  if (!args.noAi) {
    try {
      mdx = await aiTransformToMdx({ markdown: rawMarkdown, title, postSlug })
    } catch (e) {
      console.warn(`\nAI transform failed; falling back.\n${e.message || e}`)
    }
  }

  if (!mdx) {
    const frontmatter = buildFrontmatter({ title, publishedAt, summary, tags })
    const body = basicObsidianToMdx(rawMarkdown, { postSlug })
    mdx = frontmatter + body
  }

  // Normalize common LLM artifacts first.
  mdx = unwrapTopLevelCodeFence(mdx)

  // Convert any remaining image syntaxes to the required <figure><img/></figure> blocks.
  mdx = convertImagesToFigureHtml(mdx, postSlug)

  // Ensure TOC (extension-equivalent output) after frontmatter.
  if (!args.noToc) {
    const parts = splitFrontmatterFromMdx(mdx)
    const toc = generateTocFromBody(parts.body)
    const bodyWithToc = upsertTocIntoBody(parts.body, toc)
    mdx = parts.frontmatter + bodyWithToc.trimStart()
  }

  const outputExists = fs.existsSync(absOutFile)
  if (outputExists && !args.overwrite && !args.resume) {
    console.error(`\nRefusing to overwrite existing file: ${absOutFile}`)
    console.error(`Use --resume to update TOC/assets and run git steps, or --overwrite to regenerate.\n`)
    process.exit(1)
  }

  let finalMdx = mdx
  if (outputExists && args.resume) {
    // Update existing file with TOC regeneration if needed.
    const existing = fs.readFileSync(absOutFile, "utf8")
    let updated = unwrapTopLevelCodeFence(existing)
    updated = convertImagesToFigureHtml(updated, postSlug)
    if (!args.noToc) {
      const parts = splitFrontmatterFromMdx(updated)
      const toc = generateTocFromBody(parts.body)
      const bodyWithToc = upsertTocIntoBody(parts.body, toc)
      updated = parts.frontmatter + bodyWithToc.trimStart()
    }
    finalMdx = updated
  }

  fs.writeFileSync(absOutFile, finalMdx, "utf8")
  console.log(`\nWrote: ${path.relative(process.cwd(), absOutFile)}`)

  // Copy referenced assets into public/<slug>/
  const copiedAssets = copyAssetsToPublic({
    mdx: finalMdx,
    postSlug,
    assetsDir,
  })
  if (copiedAssets.length > 0) {
    console.log(`Copied ${copiedAssets.length} asset(s) into public/${postSlug}/`)
  }

  if (args.noCommit) {
    console.log("\n--no-commit set; skipping git commit/push.\n")
    return
  }

  try {
    const relMdx = path.relative(process.cwd(), absOutFile)
    run(`git add -- "${relMdx}"`, { stdio: "inherit" })
    const relPublicDir = path.join("public", postSlug)
    if (fs.existsSync(path.join(process.cwd(), relPublicDir))) {
      run(`git add -- "${relPublicDir}"`, { stdio: "inherit" })
    }
    const msg = series ? `publish: ${title} (${series})` : `publish: ${title}`
    run(`git commit -m "${msg.replace(/\"/g, "\\\"")}"`, {
      stdio: "inherit",
    })

    if (!args.noPush) {
      run("git push", { stdio: "inherit" })
    } else {
      console.log("\n--no-push set; commit created locally.\n")
    }
  } catch (e) {
    console.error(`\nGit step failed. Your MDX file is created at:`)
    console.error(path.relative(process.cwd(), absOutFile))
    console.error("\nError:")
    console.error(e.message || e)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
