import path from "path"

export type ContentKind = "writing" | "portfolio"
export type ContentSectionKey = "writings" | "portfolio"
export type ContentLang = "en" | "ja"

export const contentConfig: Record<
  ContentSectionKey,
  {
    kind: ContentKind
    baseDirPartsByLang: Record<ContentLang, string[]>
    supportsCollections: boolean
  }
> = {
  writings: {
    kind: "writing",
    baseDirPartsByLang: {
      en: ["app", "writings", "posts"],
      // Japanese translations live in a mirrored tree, keyed by the same
      // slug — e.g. app/writings/posts-ja/foo.mdx translates posts/foo.mdx.
      ja: ["app", "writings", "posts-ja"],
    },
    supportsCollections: true,
  },
  portfolio: {
    kind: "portfolio",
    baseDirPartsByLang: {
      en: ["app", "portfolio", "posts"],
      ja: ["app", "portfolio", "posts-ja"],
    },
    supportsCollections: true,
  },
}

export function getContentBaseDir(
  section: ContentSectionKey,
  lang: ContentLang = "en"
) {
  return path.join(
    process.cwd(),
    ...contentConfig[section].baseDirPartsByLang[lang]
  )
}
