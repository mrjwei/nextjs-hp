export type Lang = "en" | "ja"

export const defaultLang: Lang = "en"

export const langs: Lang[] = ["en", "ja"]

export const ogLocale: Record<Lang, string> = {
  en: "en_US",
  ja: "ja_JP",
}

/**
 * Given any pathname in either tree, returns the mirrored pathname in the
 * other language (simple `/ja` prefix toggle). The target page may not
 * actually exist yet (e.g. an article with no translation) — callers that
 * render content pages are responsible for falling back gracefully.
 */
export function toggleLangPath(pathname: string, targetLang: Lang): string {
  const withoutJa = pathname.replace(/^\/ja(?=\/|$)/, "") || "/"

  if (targetLang === "ja") {
    return withoutJa === "/" ? "/ja" : `/ja${withoutJa}`
  }

  return withoutJa
}

export function getLangFromPathname(pathname: string): Lang {
  return pathname === "/ja" || pathname.startsWith("/ja/") ? "ja" : "en"
}
