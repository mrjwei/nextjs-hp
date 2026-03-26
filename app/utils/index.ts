import fs from "fs"
import path from "path"
import { cache } from "react"
import { z } from "zod"
import { getContentBaseDir } from "app/content/config"

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
  writings?: Array<{ slug: string; filePath: string; collection?: string; metadata: TMetadata }>
  portfolio?: Array<{ slug: string; filePath: string; collection?: string; metadata: TMetadata }>
}

const CONTENT_INDEX_PATH = path.join(
  process.cwd(),
  "app",
  "data",
  "content-index.json"
)

const writingsBaseDir = getContentBaseDir("writings")
const portfolioBaseDir = getContentBaseDir("portfolio")

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
    includeContent,
  }: { absFilePath: string; kind: ContentKind; includeContent: boolean }
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

  if (kind === "writing") {
    // Option C: explicit series metadata.
    // Back-compat: infer a series slug from the immediate folder under writingsBaseDir.
    if (!parsed.data.series) {
      const rel = path.relative(writingsBaseDir, absFilePath)
      const parts = rel.split(path.sep)
      const maybeDir = parts.length > 1 ? parts[0] : ""
      if (maybeDir) {
        parsed.data.series = maybeDir
      }
    }

    // If a writing lives directly under writingsBaseDir, treat it as "general".
    if (!parsed.data.series) {
      parsed.data.series = "general"
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

const readFrontmatterOnly = cache((absFilePath: string, kind: ContentKind) => {
  const rawContent = fs.readFileSync(absFilePath, "utf-8")
  return parseFrontmatter(rawContent, {
    absFilePath,
    kind,
    includeContent: false,
  })
})

const readMdxWithContent = cache((absFilePath: string, kind: ContentKind) => {
  const rawContent = fs.readFileSync(absFilePath, "utf-8")
  return parseFrontmatter(rawContent, {
    absFilePath,
    kind,
    includeContent: true,
  })
})

const readContentIndex = cache((): ContentIndexFile | null => {
  if (!fs.existsSync(CONTENT_INDEX_PATH)) return null
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

const getWritingsCollections = cache(() => {
  return getChildDirs(writingsBaseDir)
})

const getPortfolioCollectionsCached = cache(() => {
  return getChildDirs(portfolioBaseDir)
})

const getWritingsFilePaths = cache((collection: string = "") => {
  const dirPath = collection
    ? path.join(writingsBaseDir, collection)
    : writingsBaseDir
  return getMdxFilesInDir(dirPath).map((file) => path.join(dirPath, file))
})

const getAllWritingsFilePaths = cache(() => {
  const result = [...getWritingsFilePaths("")]
  for (const collection of getWritingsCollections()) {
    result.push(...getWritingsFilePaths(collection))
  }
  return result
})

const getPortfolioFilePaths = cache((collection: string = "") => {
  const dirPath = collection
    ? path.join(portfolioBaseDir, collection)
    : portfolioBaseDir
  return getMdxFilesInDir(dirPath).map((file) => path.join(dirPath, file))
})

const getAllPortfolioFilePaths = cache(() => {
  const result = [...getPortfolioFilePaths("")]
  for (const collection of getPortfolioCollectionsCached()) {
    result.push(...getPortfolioFilePaths(collection))
  }
  return result
})

const getSlugToPathMap = cache((kind: ContentKind) => {
  const map = new Map<string, string>()
  const files = kind === "writing" ? getAllWritingsFilePaths() : getAllPortfolioFilePaths()

  for (const absFilePath of files) {
    const slug = fileSlug(absFilePath)
    if (map.has(slug)) {
      throw new Error(
        `Duplicate slug \"${slug}\" for ${kind}: ${path.relative(
          process.cwd(),
          absFilePath
        )}`
      )
    }
    map.set(slug, absFilePath)
  }
  return map
})

export function getSeries() {
  return getAllSortedSeries().map((s) => s.subdir)
}

export const getAllSortedSeries = cache(() => {
  const all = getAllSortedWritings()
  const bySeries = new Map<string, TContentMeta[]>()

  for (const item of all) {
    const seriesSlug = item.metadata.series
    if (!seriesSlug) continue
    if (!bySeries.has(seriesSlug)) bySeries.set(seriesSlug, [])
    bySeries.get(seriesSlug)!.push(item)
  }

  const result = Array.from(bySeries.entries()).map(([subdir, items]) => {
    const hasOrder = items.some(
      (i) => typeof i.metadata.seriesOrder === "number"
    )

    const sorted = [...items].sort((a, b) => {
      if (hasOrder) {
        const ao = a.metadata.seriesOrder ?? Number.POSITIVE_INFINITY
        const bo = b.metadata.seriesOrder ?? Number.POSITIVE_INFINITY
        if (ao !== bo) return ao - bo
      }

      return new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
        ? -1
        : 1
    })

    return { subdir, items: sorted }
  })

  result.sort((a, b) =>
    ParseSeriesDirName(a.subdir).localeCompare(ParseSeriesDirName(b.subdir))
  )

  return result
})

export const getAllSortedSeriesItems = cache(() => {
  return getAllSortedSeries().flatMap((s) => s.items)
})

export const getAllSortedWritings = cache(() => {
  const index = readContentIndex()
  if (index?.writings?.length) {
    return index.writings
      .map((item) => ({ slug: item.slug, metadata: item.metadata }))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
  }

  let writings = getAllWritingsFilePaths().map((absFilePath) => {
    const { metadata } = readFrontmatterOnly(absFilePath, "writing")
    return { metadata, slug: fileSlug(absFilePath) }
  })
  writings = writings.sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1
  )
  return writings
})

export function getWritingBySlug(slug: string): TContentItem | null {
  const index = readContentIndex()
  const indexed = index?.writings?.find((item) => item.slug === slug)
  if (indexed) {
    const absFilePath = path.join(process.cwd(), indexed.filePath)
    const { metadata, content } = readMdxWithContent(absFilePath, "writing") as {
      metadata: TMetadata
      content: string
    }
    return { slug, metadata, content }
  }

  const absFilePath = getSlugToPathMap("writing").get(slug)
  if (!absFilePath) return null
  const { metadata, content } = readMdxWithContent(absFilePath, "writing") as {
    metadata: TMetadata
    content: string
  }
  return { slug, metadata, content }
}

export function getPortfolioCollections() {
  return getPortfolioCollectionsCached()
}

export const getAllSortedPortfolioCollections = cache(() => {
  const collections: {
    subdir: string
    items: TContentMeta[]
  }[] = []

  const subdirs = getPortfolioCollections()
  subdirs.forEach((subdir) => {
    let items = getPortfolioFilePaths(subdir).map((absFilePath) => {
      const { metadata } = readFrontmatterOnly(absFilePath, "portfolio")
      return { metadata, slug: fileSlug(absFilePath) }
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

export const getAllSortedPortfolio = cache(() => {
  const index = readContentIndex()
  if (index?.portfolio?.length) {
    return index.portfolio
      .map((item) => ({ slug: item.slug, metadata: item.metadata }))
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
  }

  let items = getAllPortfolioFilePaths().map((absFilePath) => {
    const { metadata } = readFrontmatterOnly(absFilePath, "portfolio")
    return { metadata, slug: fileSlug(absFilePath) }
  })
  items = items.sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ? -1
      : 1
  )
  return items
})

export function getPortfolioItemBySlug(slug: string): TContentItem | null {
  const index = readContentIndex()
  const indexed = index?.portfolio?.find((item) => item.slug === slug)
  if (indexed) {
    const absFilePath = path.join(process.cwd(), indexed.filePath)
    const { metadata, content } = readMdxWithContent(
      absFilePath,
      "portfolio"
    ) as { metadata: TMetadata; content: string }
    return { slug, metadata, content }
  }

  const absFilePath = getSlugToPathMap("portfolio").get(slug)
  if (!absFilePath) return null
  const { metadata, content } = readMdxWithContent(absFilePath, "portfolio") as {
    metadata: TMetadata
    content: string
  }
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
