// Pure helpers for tag identity/formatting. Kept free of node-only imports
// (fs/path) so client components can import this module directly.

const ACRONYMS = new Set(["ai", "ui", "ux", "uiux", "api", "seo", "css"])

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase()
}

export function formatTagLabel(tag: string): string {
  const trimmed = tag.trim()
  if (!trimmed) return trimmed

  return trimmed
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .map((word) => {
      if (!word) return word
      const lower = word.toLowerCase()
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(" ")
}
