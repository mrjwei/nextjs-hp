import fs from "fs"
import path from "path"

export type TMetadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  tags: string[]
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, "").trim()
  let frontMatterLines = frontMatterBlock.trim().split("\n")
  let metadata: Partial<TMetadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ")
    let value = valueArr.join(": ").trim()

    if (key === "tags") {
      const match = value.match(/\[.*\]/)
      if (match) {
        metadata[key] = JSON.parse(match[0])
      } else {
        throw new Error(`Invalid format for "tags": ${value}`)
      }
    } else {
      value = value.replace(/^['"](.*)['"]$/, "$1") // Remove quotes
      metadata[key] = value
    }
  })

  return { metadata: metadata as TMetadata, content }
}

function getMDXFiles(absDirPath) {
  return fs
    .readdirSync(absDirPath)
    .filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(absFilePath) {
  let rawContent = fs.readFileSync(absFilePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function getMDXData(absDirPath) {
  let mdxFiles = getMDXFiles(absDirPath)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(absDirPath, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getWritings(subdir = "") {
  return getMDXData(
    path.join(process.cwd(), "app", "writings", "posts", subdir)
  )
}

export function getSeries() {
  const parentPath = path.join(process.cwd(), "app", "writings", "posts")
  return fs.readdirSync(parentPath).filter((name) => {
    const fullPath = path.join(parentPath, name)
    return fs.statSync(fullPath).isDirectory()
  })
}

export function getAllSortedSeries() {
  const series: {
    subdir: string
    items: { metadata: TMetadata; slug: string; content: string }[]
  }[] = []
  const subdirs = getSeries()
  subdirs.forEach((subdir) => {
    let items = getWritings(subdir)
    items = items.sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    series.push({ subdir, items })
  })
  return series
}

export function getAllSortedSeriesItems() {
  const writings: { metadata: TMetadata; slug: string; content: string }[] = []
  const subdirs = getSeries()
  subdirs.forEach((subdir) => {
    writings.push(...getWritings(subdir))
  })
  return writings
}

export function getAllSortedWritings() {
  let writings = getWritings()
  let subdirs = getSeries()
  subdirs.forEach((subdir) => {
    writings.push(...getWritings(subdir))
  })
  writings = writings.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })
  return writings
}

export function getAllSortedWorks() {
  let works = getMDXData(path.join(process.cwd(), "app", "artworks", "works"))
  works = works.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })
  return works
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
