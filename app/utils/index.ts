import fs from 'fs'
import path from 'path'

type Metadata = {
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
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()

    if (key === "tags") {
      const match = value.match(/\[.*\]/)
      if (match) {
        metadata[key] = JSON.parse(match[0])
      } else {
        throw new Error(`Invalid format for "tags": ${value}`)
      }
    } else {
      value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
      metadata[key] = value
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(absDirPath) {
  return fs.readdirSync(absDirPath).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(absFilePath) {
  let rawContent = fs.readFileSync(absFilePath, 'utf-8')
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

export function getWritings() {
  return getMDXData(path.join(process.cwd(), 'app', 'writings', 'posts'))
}

export function getSeries() {
  const subdirs = fs.readdirSync(path.join(process.cwd(), 'app', 'series', 'posts'))
  return subdirs.reduce((MDXData: any, subdir: string) => {
    const absDirPath = path.join(process.cwd(), 'app', 'series', 'posts', subdir)
    MDXData.push(getMDXData(absDirPath))
    return MDXData
  }, [])
}

export function getWorks() {
  return getMDXData(path.join(process.cwd(), 'app', 'artworks', 'works'))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
