import fs from "fs"
import path from "path"
import { cache } from "react"
import { z } from "zod"
import { getContentBaseDir, type ContentLang } from "app/content/config"

export type Lang = ContentLang

export type TMetadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  tags: string[]
  shouldBreakWord?: boolean
  series?: string
  seriesTitle?: string
  seriesOrder?: number
  partOf?: string
  partOfTitle?: string
  partNumber?: number
  lang?: Lang
}

export type TContentMeta = {
  metadata: TMetadata
  slug: string
}

export type TContentItem = TContentMeta & {
  content: string
}

type ContentKind = "writing" | "portfolio"

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
  portfolio?: Array<{
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
const portfolioBaseDirByLang: Record<Lang, string> = {
  en: getContentBaseDir("portfolio", "en"),
  ja: getContentBaseDir("portfolio", "ja"),
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

const baseFrontmatterSchema = z.object({
  title: z.string().min(1),
  publishedAt: dateSchema,
  summary: z.string().min(1),
  image: z.string().optional(),
  shouldBreakWord: z.boolean().optional(),
  series: z.string().min(1).optional(),
  seriesTitle: z.string().min(1).optional(),
  seriesOrder: z.number().int().nonnegative().optional(),
  partOf: z.string().min(1).optional(),
  partOfTitle: z.string().min(1).optional(),
  partNumber: z.number().int().positive().optional(),
})

const writingFrontmatterSchema = baseFrontmatterSchema.extend({
  tags: z.array(tagSchema).min(1),
})

const portfolioFrontmatterSchema = baseFrontmatterSchema.extend({
  tags: z.array(tagSchema).default([]),
})

const frontmatterSchemaByKind: Record<ContentKind, z.ZodType<TMetadata>> = {
  writing: writingFrontmatterSchema,
  portfolio: portfolioFrontmatterSchema,
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

    if (key === "tags") {
      const bracketMatch = value.match(/\[.*\]/)
      if (!bracketMatch) {
        throw new Error(
          `Invalid format for "tags" in ${path.relative(
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

const getPortfolioCollectionsCached = cache((lang: Lang) => {
  return getChildDirs(portfolioBaseDirByLang[lang])
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

const getPortfolioFilePaths = cache((lang: Lang, collection: string = "") => {
  const dirPath = collection
    ? path.join(portfolioBaseDirByLang[lang], collection)
    : portfolioBaseDirByLang[lang]
  return getMdxFilesInDir(dirPath).map((file) => path.join(dirPath, file))
})

const getAllPortfolioFilePaths = cache((lang: Lang) => {
  const result = [...getPortfolioFilePaths(lang, "")]
  for (const collection of getPortfolioCollectionsCached(lang)) {
    result.push(...getPortfolioFilePaths(lang, collection))
  }
  return result
})

const getSlugToPathMap = cache((kind: ContentKind, lang: Lang) => {
  const map = new Map<string, string>()
  const files = kind === "writing" ? getAllWritingsFilePaths(lang) : getAllPortfolioFilePaths(lang)

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
      .filter((item) => itemLang(item.metadata) === lang)
      .map((item) => ({ slug: item.slug, metadata: item.metadata }))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
  }

  let writings = getAllWritingsFilePaths(lang).map((absFilePath) => {
    const { metadata } = readFrontmatterOnly(absFilePath, "writing", lang)
    return { metadata, slug: fileSlug(absFilePath) }
  })
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

export function getWritingBySlug(slug: string, lang: Lang = "en"): TContentItem | null {
  const index = readContentIndex()
  const indexed = index?.writings?.find(
    (item) => item.slug === slug && itemLang(item.metadata) === lang
  )
  if (indexed) {
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
    return { slug, metadata, content }
  }

  const absFilePath = getSlugToPathMap("writing", lang).get(slug)
  if (!absFilePath) return null
  const { metadata, content } = readMdxWithContent(absFilePath, "writing", lang) as {
    metadata: TMetadata
    content: string
  }
  return { slug, metadata, content }
}

export function getPortfolioCollections(lang: Lang = "en") {
  return getPortfolioCollectionsCached(lang)
}

export const getAllSortedPortfolioCollections = cache((lang: Lang = "en") => {
  const index = readContentIndex()

  // In production (and often in CI/standalone output), the MDX files under
  // app/portfolio/posts may not be present at runtime due to output tracing.
  // Prefer the generated content index when available.
  const indexItems = index?.portfolio?.filter((item) => itemLang(item.metadata) === lang)

  if (process.env.NODE_ENV === "production" && indexItems?.length) {
    const baseRel = path
      .relative(process.cwd(), portfolioBaseDirByLang[lang])
      .replaceAll(path.sep, "/")

    const isProd = process.env.NODE_ENV === "production"

    const byCollection = new Map<string, TContentMeta[]>()

    for (const item of indexItems) {
      if (!isProd) {
        const absFilePath = path.join(process.cwd(), item.filePath)
        if (!fs.existsSync(absFilePath)) {
          continue
        }
      }

      const normalized = String(item.filePath).replaceAll("\\\\", "/")

      let collection =
        typeof item.collection === "string" && item.collection.trim().length
          ? item.collection.trim()
          : undefined

      if (!collection) {
        if (normalized.startsWith(baseRel + "/")) {
          const relUnderBase = normalized.slice(baseRel.length + 1)
          const parts = relUnderBase.split("/").filter(Boolean)
          collection = parts.length > 1 ? parts[0] : "general"
        } else {
          collection = "general"
        }
      }

      if (!byCollection.has(collection)) byCollection.set(collection, [])
      byCollection.get(collection)!.push({
        slug: item.slug,
        metadata: {
          ...item.metadata,
          series:
            typeof item.metadata.series === "string" && item.metadata.series.trim().length
              ? item.metadata.series
              : collection,
        },
      })
    }

    const result = Array.from(byCollection.entries()).map(([subdir, items]) => {
      const sorted = [...items].sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
      return { subdir, items: sorted }
    })

    result.sort((a, b) =>
      ParseSeriesDirName(a.subdir).localeCompare(ParseSeriesDirName(b.subdir))
    )

    return result
  }

  // Dev fallback: read directly from the filesystem.
  const collections: { subdir: string; items: TContentMeta[] }[] = []

  // Include base-level posts (if any) under a conventional collection.
  let rootItems = getPortfolioFilePaths(lang, "").map((absFilePath) => {
    const { metadata } = readFrontmatterOnly(absFilePath, "portfolio", lang)
    return { metadata: { ...metadata, series: metadata.series || "general" }, slug: fileSlug(absFilePath) }
  })
  rootItems = rootItems.sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
  )
  if (rootItems.length) {
    collections.push({ subdir: "general", items: rootItems })
  }

  const subdirs = getPortfolioCollections(lang)
  subdirs.forEach((subdir) => {
    let items = getPortfolioFilePaths(lang, subdir).map((absFilePath) => {
      const { metadata } = readFrontmatterOnly(absFilePath, "portfolio", lang)
      return { metadata: { ...metadata, series: metadata.series || subdir }, slug: fileSlug(absFilePath) }
    })
    items = items.sort((a, b) =>
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
        ? -1
        : 1
    )
    collections.push({ subdir, items })
  })

  return collections
})

export const getAllSortedPortfolio = cache((lang: Lang = "en") => {
  const index = readContentIndex()
  const indexItems = index?.portfolio?.filter((item) => itemLang(item.metadata) === lang)

  if (indexItems?.length) {
    const isProd = process.env.NODE_ENV === "production"
    const baseRel = path
      .relative(process.cwd(), portfolioBaseDirByLang[lang])
      .replaceAll(path.sep, "/")

    const items = (isProd
      ? indexItems
      : indexItems.filter((item) =>
          fs.existsSync(path.join(process.cwd(), item.filePath))
        )
    ).map((item) => {
      const normalized = String(item.filePath).replaceAll("\\\\", "/")
      const derivedCollection =
        typeof item.collection === "string" && item.collection.trim().length
          ? item.collection.trim()
          : normalized.startsWith(baseRel + "/")
            ? (normalized.slice(baseRel.length + 1).split("/").filter(Boolean)[0] || "general")
            : "general"

      return {
        ...item,
        metadata: {
          ...item.metadata,
          series:
            typeof item.metadata.series === "string" && item.metadata.series.trim().length
              ? item.metadata.series
              : derivedCollection,
        },
      }
    })

    return items
      .map((item) => ({ slug: item.slug, metadata: item.metadata }))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
  }

  let items = getAllPortfolioFilePaths(lang).map((absFilePath) => {
    const { metadata } = readFrontmatterOnly(absFilePath, "portfolio", lang)
    const relUnderBase = path
      .relative(portfolioBaseDirByLang[lang], absFilePath)
      .replaceAll(path.sep, "/")
    const derivedCollection = relUnderBase.includes("/")
      ? relUnderBase.split("/")[0]
      : "general"
    return {
      metadata: { ...metadata, series: metadata.series || derivedCollection },
      slug: fileSlug(absFilePath),
    }
  })
  items = items.sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1
  )
  return items
})

export function getPortfolioItemBySlug(slug: string, lang: Lang = "en"): TContentItem | null {
  const index = readContentIndex()
  const indexed = index?.portfolio?.find(
    (item) => item.slug === slug && itemLang(item.metadata) === lang
  )
  if (indexed) {
    if (process.env.NODE_ENV === "production") {
      if (typeof indexed.content !== "string") {
        throw new Error(
          `Content index entry for portfolio "${slug}" is missing embedded content. Re-run the content index generator.`
        )
      }
      const series =
        typeof indexed.metadata.series === "string" && indexed.metadata.series.trim().length
          ? indexed.metadata.series
          : typeof indexed.collection === "string" && indexed.collection.trim().length
            ? indexed.collection.trim()
            : "general"

      return {
        slug,
        metadata: { ...indexed.metadata, series },
        content: indexed.content,
      }
    }

    const absFilePath = path.join(process.cwd(), indexed.filePath)
    if (!fs.existsSync(absFilePath)) {
      return null
    }
    const { metadata, content } = readMdxWithContent(
      absFilePath,
      "portfolio",
      lang
    ) as { metadata: TMetadata; content: string }
    const series =
      typeof metadata.series === "string" && metadata.series.trim().length
        ? metadata.series
        : typeof indexed.collection === "string" && indexed.collection.trim().length
          ? indexed.collection.trim()
          : path
              .relative(portfolioBaseDirByLang[lang], absFilePath)
              .replaceAll(path.sep, "/")
              .includes("/")
            ? path
                .relative(portfolioBaseDirByLang[lang], absFilePath)
                .replaceAll(path.sep, "/")
                .split("/")[0]
            : "general"

    return { slug, metadata: { ...metadata, series }, content }
  }

  const absFilePath = getSlugToPathMap("portfolio", lang).get(slug)
  if (!absFilePath) return null
  const { metadata, content } = readMdxWithContent(absFilePath, "portfolio", lang) as {
    metadata: TMetadata
    content: string
  }
  const series =
    typeof metadata.series === "string" && metadata.series.trim().length
      ? metadata.series
      : path
          .relative(portfolioBaseDirByLang[lang], absFilePath)
          .replaceAll(path.sep, "/")
          .includes("/")
        ? path
            .relative(portfolioBaseDirByLang[lang], absFilePath)
            .replaceAll(path.sep, "/")
            .split("/")[0]
        : "general"

  return { slug, metadata: { ...metadata, series }, content }
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
