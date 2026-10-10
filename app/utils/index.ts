import fs from "fs"
import path from "path"
import { cache } from "react"
import { z } from "zod"
import { getContentBaseDir, type ContentLang } from "app/content/config"
import seriesTitles from "app/data/series.json"
import { getProjectSlug, getProjectHref, getProjectPostHref } from "app/utils/project-href"
import { trackOrder } from "app/content/profile"

export type Lang = ContentLang

export type WorkTrack =
  | "transformation"
  | "ai-engineering"
  | "product-design"
  | "design-systems"
  | "security"
  | "research"

export type TMetadata = {
  title: string
  publishedAt: string
  updatedAt?: string
  summary: string
  image?: string
  tags: string[]
  archived?: boolean
  shouldBreakWord?: boolean
  series?: string
  seriesTitle?: string
  seriesOrder?: number
  partOf?: string
  partOfTitle?: string
  partNumber?: number
  lang?: Lang
  // Positioning-as-data content knobs (see docs/roadmap/2026-09-ai-repositioning-brushup.md §4).
  // Marks the post that represents its project on cards (see groupProjects).
  lead?: boolean
  track?: WorkTrack
  draft?: boolean
  // Stand-in for a post that's announced but not written yet (e.g. a later part
  // of a series an overview already links to). Listed as usual, but badged
  // "Coming soon" on cards and the post page, and never a project's lead.
  placeholder?: boolean
  // Short one-word project ID (e.g. "LingoBun"). Its presence makes the post a
  // project: listed on /projects and badged on every card.
  project?: string
  // Case-study fields (all optional).
  result?: string
  role?: string
  client?: string
  industry?: string
  duration?: string
  stack?: string[]
  confidential?: boolean
}

export type TContentMeta = {
  metadata: TMetadata
  slug: string
}

export type TContentItem = TContentMeta & {
  content: string
}

type ContentKind = "writing"

type ContentIndexFile = {
  version: 1
  generatedAt: string
  writings?: Array<{
    slug: string
    filePath: string
    collection?: string
    metadata: TMetadata
    content?: string
  }>
}

export const CONTENT_INDEX_PATH = path.join(
  process.cwd(),
  "app",
  "data",
  "content-index.json"
)

const writingsBaseDirByLang: Record<Lang, string> = {
  en: getContentBaseDir("writings", "en"),
  ja: getContentBaseDir("writings", "ja"),
}

const tagSchema = z
  .string()
  .min(1)
  .refine((tag) => /^[a-z0-9-_]+$/i.test(tag), {
    message: "Tag must be alphanumeric/hyphen/underscore",
  })

const dateSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date string",
  })

const workTrackSchema = z.enum([
  "transformation",
  "ai-engineering",
  "product-design",
  "design-systems",
  "security",
  "research",
])

const baseFrontmatterSchema = z.object({
  title: z.string().min(1),
  publishedAt: dateSchema,
  updatedAt: dateSchema.optional(),
  summary: z.string().min(1),
  image: z.string().optional(),
  archived: z.boolean().optional(),
  shouldBreakWord: z.boolean().optional(),
  series: z.string().min(1).optional(),
  seriesTitle: z.string().min(1).optional(),
  seriesOrder: z.number().int().nonnegative().optional(),
  partOf: z.string().min(1).optional(),
  partOfTitle: z.string().min(1).optional(),
  partNumber: z.number().int().positive().optional(),
  lead: z.boolean().optional(),
  track: workTrackSchema.optional(),
  draft: z.boolean().optional(),
  placeholder: z.boolean().optional(),
  project: z
    .string()
    .regex(/^\S{1,12}$/, "project must be one word of at most 12 characters")
    .optional(),
  result: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  client: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  stack: z.array(z.string().min(1)).optional(),
  confidential: z.boolean().optional(),
})

const writingFrontmatterSchema = baseFrontmatterSchema.extend({
  tags: z.array(tagSchema).min(1),
})

const frontmatterSchemaByKind: Record<ContentKind, z.ZodType<TMetadata>> = {
  writing: writingFrontmatterSchema,
}

function parseFrontmatter(
  fileContent: string,
  {
    absFilePath,
    kind,
    lang,
    includeContent,
  }: { absFilePath: string; kind: ContentKind; lang: Lang; includeContent: boolean }
) {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/
  const match = frontmatterRegex.exec(fileContent)
  if (!match) {
    throw new Error(
      `Missing frontmatter (--- ... ---) in ${path.relative(
        process.cwd(),
        absFilePath
      )}`
    )
  }

  const frontMatterBlock = match[1]
  const frontMatterLines = frontMatterBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const rawMetadata: Record<string, unknown> = {}
  for (const line of frontMatterLines) {
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    if (key === "tags" || value.startsWith("[")) {
      const bracketMatch = value.match(/\[.*\]/)
      if (!bracketMatch) {
        throw new Error(
          `Invalid format for "${key}" in ${path.relative(
            process.cwd(),
            absFilePath
          )}: ${value}`
        )
      }
      rawMetadata[key] = JSON.parse(bracketMatch[0])
      continue
    }

    if (value === "true") {
      rawMetadata[key] = true
      continue
    }
    if (value === "false") {
      rawMetadata[key] = false
      continue
    }

    if (/^-?\d+$/.test(value)) {
      rawMetadata[key] = Number(value)
      continue
    }

    value = value.replace(/^['"](.*)['"]$/, "$1")
    rawMetadata[key] = value
  }

  const schema = frontmatterSchemaByKind[kind]
  const parsed = schema.safeParse(rawMetadata)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ")
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), absFilePath)}: ${details}`
    )
  }

  parsed.data.lang = lang

  if (kind === "writing") {
    // Option C: explicit series metadata.
    // Back-compat: infer a series slug from the immediate folder under the
    // language's writings base dir.
    if (!parsed.data.series) {
      const rel = path.relative(writingsBaseDirByLang[lang], absFilePath)
      const parts = rel.split(path.sep)
      const maybeDir = parts.length > 1 ? parts[0] : ""
      if (maybeDir) {
        parsed.data.series = maybeDir
      }
    }

    if (parsed.data.series && !parsed.data.seriesTitle) {
      parsed.data.seriesTitle = getSeriesTitle(parsed.data.series, lang)
    }

    // Use tags to power collection browsing/routes.
    if (parsed.data.series && Array.isArray(parsed.data.tags)) {
      if (!parsed.data.tags.includes(parsed.data.series)) {
        parsed.data.tags = [...parsed.data.tags, parsed.data.series]
      }
    }
  }

  if (!includeContent) {
    return { metadata: parsed.data }
  }

  const content = fileContent.replace(frontmatterRegex, "").trim()
  return { metadata: parsed.data, content }
}

const getMdxFilesInDir = cache((absDirPath: string) => {
  if (!fs.existsSync(absDirPath)) return [] as string[]
  return fs
    .readdirSync(absDirPath)
    .filter((file) => path.extname(file) === ".mdx")
})

const getChildDirs = cache((absDirPath: string) => {
  if (!fs.existsSync(absDirPath)) return [] as string[]
  return fs.readdirSync(absDirPath).filter((name) => {
    const fullPath = path.join(absDirPath, name)
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
  })
})

const readFrontmatterOnly = cache((absFilePath: string, kind: ContentKind, lang: Lang) => {
  const rawContent = fs.readFileSync(absFilePath, "utf-8")
  return parseFrontmatter(rawContent, {
    absFilePath,
    kind,
    lang,
    includeContent: false,
  })
})

const readMdxWithContent = cache((absFilePath: string, kind: ContentKind, lang: Lang) => {
  const rawContent = fs.readFileSync(absFilePath, "utf-8")
  return parseFrontmatter(rawContent, {
    absFilePath,
    kind,
    lang,
    includeContent: true,
  })
})

export const readContentIndex = cache((): ContentIndexFile | null => {
  if (!fs.existsSync(CONTENT_INDEX_PATH)) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing generated content index at ${path.relative(
          process.cwd(),
          CONTENT_INDEX_PATH
        )}. This should be created during build (e.g. via scripts/generate-content-index.mjs).`
      )
    }
    return null
  }
  const raw = fs.readFileSync(CONTENT_INDEX_PATH, "utf-8")
  const parsed = JSON.parse(raw)
  if (!parsed || parsed.version !== 1) {
    throw new Error(
      `Unsupported content index format in ${path.relative(
        process.cwd(),
        CONTENT_INDEX_PATH
      )}`
    )
  }
  return parsed as ContentIndexFile
})

function fileSlug(absFilePath: string) {
  return path.basename(absFilePath, path.extname(absFilePath))
}

function itemLang(metadata: TMetadata): Lang {
  return metadata.lang === "ja" ? "ja" : "en"
}

const getWritingsCollections = cache((lang: Lang) => {
  return getChildDirs(writingsBaseDirByLang[lang])
})

const getWritingsFilePaths = cache((lang: Lang, collection: string = "") => {
  const dirPath = collection
    ? path.join(writingsBaseDirByLang[lang], collection)
    : writingsBaseDirByLang[lang]
  return getMdxFilesInDir(dirPath).map((file) => path.join(dirPath, file))
})

const getAllWritingsFilePaths = cache((lang: Lang) => {
  const result = [...getWritingsFilePaths(lang, "")]
  for (const collection of getWritingsCollections(lang)) {
    result.push(...getWritingsFilePaths(lang, collection))
  }
  return result
})

const getSlugToPathMap = cache((kind: ContentKind, lang: Lang) => {
  const map = new Map<string, string>()
  const files = getAllWritingsFilePaths(lang)

  for (const absFilePath of files) {
    const slug = fileSlug(absFilePath)
    if (map.has(slug)) {
      throw new Error(
        `Duplicate slug \"${slug}\" for ${kind} (${lang}): ${path.relative(
          process.cwd(),
          absFilePath
        )}`
      )
    }
    map.set(slug, absFilePath)
  }
  return map
})

export const getAllSortedWritings = cache((lang: Lang = "en") => {
  const index = readContentIndex()
  if (process.env.NODE_ENV === "production" && index?.writings?.length) {
    return index.writings
      .filter(
        (item) =>
          itemLang(item.metadata) === lang &&
          !item.metadata.archived &&
          !item.metadata.draft
      )
      .map((item) => ({ slug: item.slug, metadata: item.metadata }))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
  }

  let writings = getAllWritingsFilePaths(lang)
    .map((absFilePath) => {
      const { metadata } = readFrontmatterOnly(absFilePath, "writing", lang)
      return { metadata, slug: fileSlug(absFilePath) }
    })
    .filter((writing) => !writing.metadata.archived)
  writings = writings.sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1
  )
  return writings
})

export function getWritingHref(writing: TContentMeta, lang: Lang = "en") {
  const prefix = lang === "ja" ? "/ja" : ""
  return writing.metadata.series
    ? `${prefix}/posts/${writing.metadata.series}/${writing.slug}`
    : `${prefix}/posts/${writing.slug}`
}

// Projects (`/projects`) are a *view* over posts, not a separate content
// directory (see docs/publish.md): any post with a `project` ID is a project.
// Its canonical URL stays under /posts.
export function isProject(metadata: Pick<TMetadata, "project">) {
  return !!metadata.project
}

function byNewest(a: TContentMeta, b: TContentMeta) {
  return new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
    ? -1
    : 1
}

export { getProjectSlug, getProjectHref, getProjectPostHref }

export type TProject = {
  id: string
  slug: string
  // The post that represents the project on cards: the one marked `lead`
  // (typically its overview), else the most recent that isn't a placeholder.
  lead: TContentMeta
  // Every post sharing the project ID: the lead first, then newest first.
  items: TContentMeta[]
  track?: WorkTrack
}

// Groups project posts by their `project` ID, one entry per project, newest
// first by each project's most recent post (same order as /posts).
export function groupProjects(items: TContentMeta[]): TProject[] {
  const byId = new Map<string, TContentMeta[]>()
  for (const item of items.filter((i) => isProject(i.metadata)).sort(byNewest)) {
    const id = item.metadata.project!
    if (!byId.has(id)) byId.set(id, [])
    byId.get(id)!.push(item)
  }
  return Array.from(byId.entries()).map(([id, posts]) => {
    const lead =
      posts.find((p) => p.metadata.lead) ??
      posts.find((p) => !p.metadata.placeholder) ??
      posts[0]
    return {
      id,
      slug: getProjectSlug(id),
      lead,
      items: [lead, ...posts.filter((p) => p !== lead)],
      track: posts.find((p) => p.metadata.track)?.metadata.track,
    }
  })
}

// Whether a project's card links to its project page rather than straight to
// its only post. Counts both languages, so a project whose follow-up posts
// aren't translated yet still gets a project page in the other language.
export function hasProjectPage(project: TProject) {
  if (project.items.length > 1) return true
  return (["en", "ja"] as const).some(
    (lang) =>
      getAllSortedWritings(lang).filter((w) => w.metadata.project === project.id)
        .length > 1
  )
}

// Home highlights (see `highlights` in app/content/profile.ts): the pinned
// items first, in pin order, then the rest of `items` (already newest first)
// up to `limit`. Pins with no match, e.g. an untranslated post, are skipped.
export function pickHighlights<T extends object>(
  items: T[],
  { pinned, keyOf, limit }: { pinned: string[]; keyOf: (item: T) => string; limit: number }
): T[] {
  const byKey = new Map(items.map((item) => [keyOf(item), item]))
  const picked = pinned.flatMap((key) => byKey.get(key) ?? [])
  const pickedSet = new Set(picked)
  return [...picked, ...items.filter((item) => !pickedSet.has(item))].slice(0, limit)
}

export function getWorkTrackFacets(
  items: Array<{ track?: WorkTrack }>
): Array<{ value: WorkTrack; count: number }> {
  const counts = new Map<WorkTrack, number>()
  for (const item of items) {
    const track = item.track
    if (!track) continue
    counts.set(track, (counts.get(track) ?? 0) + 1)
  }
  return trackOrder.filter((track) => counts.has(track)).map((value) => ({
    value,
    count: counts.get(value)!,
  }))
}

export const getSeriesParts = cache((partOf: string, lang: Lang = "en") => {
  return getAllSortedWritings(lang)
    .filter((w) => w.metadata.partOf === partOf)
    .sort((a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0))
})

export type TWritingSeries = {
  slug: string
  title: string
  items: TContentMeta[]
}

// Folder-based collections (Option C's canonical `series`, inferred from the
// immediate subdirectory under app/writings/posts — see parseFrontmatter
// above). Distinct from getAllSortedWritingSeries, which groups by the
// explicit `partOf` field for narrower, multi-part reading sequences within
// a collection (e.g. "cnn"). This is what the /posts sidebar and /posts/series
// index show, since the directory tree is the canonical source of series.
export const getAllSortedWritingCollections = cache((lang: Lang = "en"): TWritingSeries[] => {
  const bySlug = new Map<string, TContentMeta[]>()

  for (const writing of getAllSortedWritings(lang)) {
    const slug = writing.metadata.series
    if (!slug) continue
    if (!bySlug.has(slug)) bySlug.set(slug, [])
    bySlug.get(slug)!.push(writing)
  }

  const result = Array.from(bySlug.entries()).map(([slug, items]) => {
    const title = items.find((i) => i.metadata.seriesTitle)?.metadata.seriesTitle ?? slug
    return { slug, title, items }
  })

  result.sort(
    (a, b) => b.items.length - a.items.length || a.title.localeCompare(b.title)
  )

  return result
})

export const getAllSortedWritingSeries = cache((lang: Lang = "en"): TWritingSeries[] => {
  const bySlug = new Map<string, TContentMeta[]>()

  for (const writing of getAllSortedWritings(lang)) {
    const slug = writing.metadata.partOf
    if (!slug) continue
    if (!bySlug.has(slug)) bySlug.set(slug, [])
    bySlug.get(slug)!.push(writing)
  }

  const result = Array.from(bySlug.entries()).map(([slug, items]) => {
    const sorted = [...items].sort(
      (a, b) => (a.metadata.partNumber ?? 0) - (b.metadata.partNumber ?? 0)
    )
    const title =
      sorted.find((i) => i.metadata.partOfTitle)?.metadata.partOfTitle ?? slug

    return { slug, title, items: sorted }
  })

  result.sort(
    (a, b) => b.items.length - a.items.length || a.title.localeCompare(b.title)
  )

  return result
})

// Archived items and (in production) drafts are excluded from all reads of a
// single item, not just listings, so their URLs 404 outright rather than being
// reachable by anyone who guesses or bookmarks the slug. Drafts stay fully
// readable in dev.
function isHidden(metadata: Pick<TMetadata, "archived" | "draft">) {
  if (metadata.archived) return true
  return process.env.NODE_ENV === "production" && !!metadata.draft
}

export function getWritingBySlug(slug: string, lang: Lang = "en"): TContentItem | null {
  const index = readContentIndex()
  const indexed = index?.writings?.find(
    (item) => item.slug === slug && itemLang(item.metadata) === lang
  )
  if (indexed) {
    if (isHidden(indexed.metadata)) return null

    if (process.env.NODE_ENV === "production") {
      if (typeof indexed.content !== "string") {
        throw new Error(
          `Content index entry for writing "${slug}" is missing embedded content. Re-run the content index generator.`
        )
      }
      return { slug, metadata: indexed.metadata, content: indexed.content }
    }

    const absFilePath = path.join(process.cwd(), indexed.filePath)
    const { metadata, content } = readMdxWithContent(absFilePath, "writing", lang) as {
      metadata: TMetadata
      content: string
    }
    if (isHidden(metadata)) return null
    return { slug, metadata, content }
  }

  const absFilePath = getSlugToPathMap("writing", lang).get(slug)
  if (!absFilePath) return null
  const { metadata, content } = readMdxWithContent(absFilePath, "writing", lang) as {
    metadata: TMetadata
    content: string
  }
  if (isHidden(metadata)) return null
  return { slug, metadata, content }
}

// Japanese pages show dates as yyyy-mm-dd; English ones as dd/mm/yyyy (en-AU).
export function formatDate(date: string, includeRelative = false, lang: Lang = "en") {
  let currentDate = new Date()
  if (!date.includes("T")) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  if (lang === "ja") {
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(targetDate.getDate())}`
  }

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ""

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = "Today"
  }

  let fullDate = targetDate.toLocaleString("en-AU", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const ParseSeriesDirName = (dirName: string) => {
  return dirName
    .split("-")
    .map((word) => capitalize(word))
    .join(" ")
}

// Display title for a folder-based series: app/data/series.json (shared with
// scripts/generate-content-index.mjs) first, then the title-cased folder name.
export function getSeriesTitle(slug: string, lang: Lang = "en") {
  const entry = (seriesTitles as Record<string, Partial<Record<Lang, string>>>)[slug]
  return entry?.[lang] ?? entry?.en ?? ParseSeriesDirName(slug)
}
