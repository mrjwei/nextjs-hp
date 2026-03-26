import path from "path"

export type ContentKind = "writing" | "portfolio"
export type ContentSectionKey = "writings" | "portfolio"

export const contentConfig: Record<
  ContentSectionKey,
  {
    kind: ContentKind
    baseDirParts: string[]
    supportsCollections: boolean
  }
> = {
  writings: {
    kind: "writing",
    baseDirParts: ["app", "writings", "posts"],
    supportsCollections: true,
  },
  portfolio: {
    kind: "portfolio",
    baseDirParts: ["app", "portfolio", "posts"],
    supportsCollections: true,
  },
}

export function getContentBaseDir(section: ContentSectionKey) {
  return path.join(process.cwd(), ...contentConfig[section].baseDirParts)
}
