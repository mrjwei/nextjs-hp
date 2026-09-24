import fs from "fs"
import path from "path"
import { cache } from "react"
import { z } from "zod"
import { getContentBaseDir, type ContentLang } from "app/content/config"

export type Lang = ContentLang

export type WorkTrack = "ai-engineering" | "product-design" | "security" | "research"
export type WorkStatus = "production" | "pilot" | "research" | "shipped" | "archived"

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
  featured?: number
  track?: WorkTrack
  draft?: boolean
  // Case-study fields (all optional).
  result?: string
  role?: string
  client?: string
  industry?: string
  duration?: string
  stack?: string[]
  status?: WorkStatus
  confidential?: boolean
}

export type TContentMeta = {
  metadata: TMetadata
  slug: string
}

export type TContentItem = TContentMeta & {
  content: string
}

type ContentKind = "writing" | "gallery"

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
  gallery?: Array<{
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
const galleryBaseDirByLang: Record<Lang, string> = {
  en: getContentBaseDir("gallery", "en"),
  ja: getContentBaseDir("gallery", "ja"),
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
  "ai-engineering",
  "product-design",
  "security",
  "research",
])

const workStatusSchema = z.enum([
  "production",
  "pilot",
  "research",
  "shipped",
  "archived",
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
  featured: z.number().int().positive().optional(),
  track: workTrackSchema.optional(),
  draft: z.boolean().optional(),
  result: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  client: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  stack: z.array(z.string().min(1)).optional(),
  status: workStatusSchema.optional(),
  confidential: z.boolean().optional(),
})

const writingFrontmatterSchema = baseFrontmatterSchema.extend({
  tags: z.array(tagSchema).min(1),
})

const galleryFrontmatterSchema = baseFrontmatterSchema.extend({
  tags: z.array(tagSchema).default([]),
})

const frontmatterSchemaByKind: Record<ContentKind, z.ZodType<TMetadata>> = {
  writing: writingFrontmatterSchema,
  gallery: galleryFrontmatterSchema,
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
      parsed.data.seriesTitle = ParseSeriesDirName(parsed.data.series)
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

// Gallery content is a flat directory (no sub-collections).
const getAllGalleryFilePaths = cache((lang: Lang) => {
  const dirPath = galleryBaseDirByLang[lang]
  return getMdxFilesInDir(dirPath).map((file) => path.join(dirPath, file))
})

const getSlugToPathMap = cache((kind: ContentKind, lang: Lang) => {
  const map = new Map<string, string>()
  const files = kind === "writing" ? getAllWritingsFilePaths(lang) : getAllGalleryFilePaths(lang)

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
    ? `${prefix}/writings/${writing.metadata.series}/${writing.slug}`
    : `${prefix}/writings/${writing.slug}`
}

// Work (`/work`) is a *view* over writings content, not a separate content
// directory (see docs/publish.md). A writing appears there if it's tagged
// `casestudy` (a full case study) or carries a `track` (a lighter-weight
// proof piece re-tagged into the AI-engineering story). Only `casestudy`
// items get the canonical `/work/[slug]` URL — see `isCaseStudy`.
export function isWorkItem(metadata: Pick<TMetadata, "tags" | "track">) {
  return metadata.tags.includes("casestudy") || !!metadata.track
}

export function isCaseStudy(metadata: Pick<TMetadata, "tags">) {
  return metadata.tags.includes("casestudy")
}

// Home/Work order: lower `featured` first, then most recent; unfeatured
// items sort after all featured ones (see profile.ts §4).
export function sortWorkItems<T extends TContentMeta>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const featuredA = a.metadata.featured ?? Number.POSITIVE_INFINITY
    const featuredB = b.metadata.featured ?? Number.POSITIVE_INFINITY
    if (featuredA !== featuredB) return featuredA - featuredB
    return new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1
  })
}

// Home "Featured writing" (see docs/roadmap/2026-09-ai-repositioning-brushup.md
// §3): featured items first (lower `featured` wins), then the most recent
// remaining posts whose tags intersect the profile's `focusTags`. Items
// already surfaced elsewhere on Home (e.g. Selected work) are passed in
// `excludeSlugs` so the two sections don't repeat the same piece.
export function getFeaturedWritings<T extends TContentMeta>(
  items: T[],
  { focusTags, limit, excludeSlugs = [] }: { focusTags: string[]; limit: number; excludeSlugs?: string[] }
): T[] {
  const excluded = new Set(excludeSlugs)
  const pool = items.filter((item) => !excluded.has(item.slug))

  const featured = pool
    .filter((item) => item.metadata.featured != null)
    .sort((a, b) => a.metadata.featured! - b.metadata.featured!)

  const featuredSlugs = new Set(featured.map((item) => item.slug))
  const rest = pool
    .filter((item) => !featuredSlugs.has(item.slug))
    .filter((item) => item.metadata.tags.some((tag) => focusTags.includes(tag)))
    .sort((a, b) =>
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
    )

  return [...featured, ...rest].slice(0, limit)
}

const WORK_TRACK_ORDER: WorkTrack[] = [
  "ai-engineering",
  "product-design",
  "security",
  "research",
]

export function getWorkTrackFacets(
  items: TContentMeta[]
): Array<{ value: WorkTrack; count: number }> {
  const counts = new Map<WorkTrack, number>()
  for (const item of items) {
    const track = item.metadata.track
    if (!track) continue
    counts.set(track, (counts.get(track) ?? 0) + 1)
  }
  return WORK_TRACK_ORDER.filter((track) => counts.has(track)).map((value) => ({
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

// Gallery content is a flat list (illustrations, no sub-collections).
export const getAllSortedGallery = cache((lang: Lang = "en") => {
  const index = readContentIndex()
  const isProd = process.env.NODE_ENV === "production"
  const indexItems = index?.gallery?.filter(
    (item) =>
      itemLang(item.metadata) === lang &&
      !item.metadata.archived &&
      !(isProd && item.metadata.draft)
  )

  if (indexItems?.length) {
    const items = isProd
      ? indexItems
      : indexItems.filter((item) =>
          fs.existsSync(path.join(process.cwd(), item.filePath))
        )

    return items
      .map((item) => ({ slug: item.slug, metadata: item.metadata }))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
  }

  let items = getAllGalleryFilePaths(lang)
    .map((absFilePath) => {
      const { metadata } = readFrontmatterOnly(absFilePath, "gallery", lang)
      return { metadata, slug: fileSlug(absFilePath) }
    })
    .filter((item) => !item.metadata.archived)
  items = items.sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1
  )
  return items
})

export function getGalleryItemBySlug(slug: string, lang: Lang = "en"): TContentItem | null {
  const index = readContentIndex()
  const indexed = index?.gallery?.find(
    (item) => item.slug === slug && itemLang(item.metadata) === lang
  )
  if (indexed) {
    if (isHidden(indexed.metadata)) return null

    if (process.env.NODE_ENV === "production") {
      if (typeof indexed.content !== "string") {
        throw new Error(
          `Content index entry for gallery "${slug}" is missing embedded content. Re-run the content index generator.`
        )
      }
      return { slug, metadata: indexed.metadata, content: indexed.content }
    }

    const absFilePath = path.join(process.cwd(), indexed.filePath)
    if (!fs.existsSync(absFilePath)) {
      return null
    }
    const { metadata, content } = readMdxWithContent(
      absFilePath,
      "gallery",
      lang
    ) as { metadata: TMetadata; content: string }
    if (isHidden(metadata)) return null
    return { slug, metadata, content }
  }

  const absFilePath = getSlugToPathMap("gallery", lang).get(slug)
  if (!absFilePath) return null
  const { metadata, content } = readMdxWithContent(absFilePath, "gallery", lang) as {
    metadata: TMetadata
    content: string
  }
  if (isHidden(metadata)) return null
  return { slug, metadata, content }
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes("T")) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

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
