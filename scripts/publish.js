#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

function usage() {
  return `\nPublish an Obsidian Markdown note into this Next.js HP as MDX.\n\nUsage:\n  npm run publish "My Post Title" -- [--series <folder>] [--file <path>]\n\nOptions:\n  --series <name>      Writes into app/writings/posts/<name>/\n  --file <path>        Path to the source .md file (preferred if not using a vault)\n  --vault <path>       Obsidian vault root to search (default: $OBSIDIAN_VAULT)\n  --no-ai              Skip AI transform; do a safe, basic Markdown→MDX conversion\n  --dry-run            Print planned actions; do not write/commit/push\n  --no-push            Commit locally but do not git push\n  --no-commit          Write file but do not git commit/push\n  --help               Show help\n\nEnv vars (for AI):\n  OPENAI_API_KEY       If set, enables AI transform unless --no-ai\n  OPENAI_BASE_URL      Default: https://api.openai.com/v1\n  OPENAI_MODEL         Default: gpt-4o-mini\n\nExamples:\n  npm run publish "My Post Title" -- --file ~/Vault/My%20Post%20Title.md\n  npm run publish "My Post Title" -- --series LingoBun --file ~/Vault/LingoBun/My%20Post%20Title.md\n  npm run publish "My Post Title" -- --series ml --vault ~/Obsidian\n`
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
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
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

  // Obsidian embeds: ![[image.png]] → ![](/<slug>/image.png)
  out = out.replace(/!\[\[([^\]]+)\]\]/g, (_, file) => {
    const filename = String(file).split("|")[0].trim()
    return `![](/${postSlug}/${filename})`
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

  const availableTags = [
    "productivity",
    "design",
    "dev",
    "ai",
    "datascience",
    "idea",
    "process",
    "uiux",
    "javascript",
    "reactjs",
    "nextjs",
    "python",
    "git",
    "tutorial",
    "web",
    "auth",
    "jwt",
    "qut",
    "cs",
    "security",
    "reflection",
    "tricks",
    "casestudy",
    "studentlife",
    "devops",
    "vibecoding",
    "lingobun",
    "languagelearning",
  ]

  const system = `You are converting an Obsidian Markdown note into MDX for a Next.js blog.\n\nRequirements:\n- Output MUST be a single valid MDX document.\n- Start with YAML frontmatter containing exactly: title, publishedAt (YYYY-MM-DD), summary, tags (as a JSON array).\n- Keep the content faithful; do not add sections that weren't present.\n- Convert Obsidian wikilinks [[Page]]/[[Page|Label]] to plain text (Label or Page).\n- Convert Obsidian embeds ![[file.png]] to Markdown images pointing to /${postSlug}/file.png (alt text can be empty).\n- Prefer standard Markdown; only use JSX when needed.\n- Tags must be chosen ONLY from this set: ${availableTags.join(", ")}. Use 3-7 tags.`

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

  return content.trim() + "\n"
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
      }
    }
    return null
  }

  return walk(vaultDir)
}

function run(cmd, opts = {}) {
  return execSync(cmd, {
    stdio: opts.stdio || "pipe",
    cwd: opts.cwd || process.cwd(),
    env: { ...process.env, ...(opts.env || {}) },
  })
    .toString("utf8")
    .trim()
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
  const postSlug = pickUniqueSlug(absPostsRoot, desiredSlug)

  const relOutDir = path.join("app", "writings", "posts", series)
  const absOutDir = path.join(process.cwd(), relOutDir)
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

  if (fs.existsSync(absOutFile)) {
    console.error(`\nRefusing to overwrite existing file: ${absOutFile}\n`)
    process.exit(1)
  }

  fs.writeFileSync(absOutFile, mdx, "utf8")
  console.log(`\nWrote: ${path.relative(process.cwd(), absOutFile)}`)

  if (args.noCommit) {
    console.log("\n--no-commit set; skipping git commit/push.\n")
    return
  }

  try {
    run(`git add "${absOutFile}"`, { stdio: "inherit" })
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
