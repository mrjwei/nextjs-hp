import fs from "fs"
import path from "path"
import { cache } from "react"
import type { Lang } from "app/i18n/config"

export type TPageContent = {
  metadata: { description: string }
  content: string
}

const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/

/**
 * Loads a one-off MDX page (About, Now, ...) that isn't part of the
 * writings/gallery content system — just frontmatter + body, no tags,
 * dates or index generation.
 */
export const getPageContent = cache(
  (section: string, lang: Lang): TPageContent => {
    const absFilePath = path.join(
      process.cwd(),
      "app",
      "pages-content",
      lang,
      `${section}.mdx`
    )
    const rawContent = fs.readFileSync(absFilePath, "utf-8")

    const match = frontmatterRegex.exec(rawContent)
    if (!match) {
      throw new Error(
        `Missing frontmatter (--- ... ---) in ${path.relative(
          process.cwd(),
          absFilePath
        )}`
      )
    }

    const metadata: Record<string, string> = {}
    for (const line of match[1].split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const colonIndex = trimmed.indexOf(":")
      if (colonIndex === -1) continue
      const key = trimmed.slice(0, colonIndex).trim()
      const value = trimmed
        .slice(colonIndex + 1)
        .trim()
        .replace(/^['"](.*)['"]$/, "$1")
      metadata[key] = value
    }

    if (!metadata.description) {
      throw new Error(
        `Missing "description" in frontmatter of ${path.relative(
          process.cwd(),
          absFilePath
        )}`
      )
    }

    return {
      metadata: { description: metadata.description },
      content: rawContent.replace(frontmatterRegex, "").trim(),
    }
  }
)
